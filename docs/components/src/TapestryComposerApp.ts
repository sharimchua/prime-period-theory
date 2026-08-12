/**
 * TapestryComposerApp.ts  (v2)
 *
 * Tapestry Composer — thread-centric graph composition application.
 *
 * KEY v2 CHANGES:
 *  - Threads ARE the relationships; no separate parents/children node lists.
 *  - Coil left port = inheritance input (accepts coil-inherit threads from other Coils)
 *  - Weave left slots = composition sequence (accepts weave-compose threads, ordered)
 *  - Weave default-coil port = bottom special port (one weave-default-coil thread)
 *  - Ghost thread line drawn while dragging from any output port
 *  - Snap + glow on compatible target ports
 *  - Coil detail panel uses ppt-coil / ppt-coil-layer / ppt-phrase-editor + MIDI
 *  - Weave detail: layout + knot only; composition shown in graph
 */

import { BasePPTComponent } from './BasePPTComponent.js';
import { EventBus } from './features/EventBus.js';
import { tokenizePhrase } from './solfegeUtils.js';
import type {
  TapestryDocument,
  TapestryNode,
  CoilNode,
  WeaveNode,
  Thread
} from './tapestry/TapestryModel.js';
import {
  createDocument,
  createCoilNode,
  createWeaveNode,
  createThread,
  getNode,
  isCoil,
  isWeave,
  resolvedCompositionSequence,
  resolvedDefaultCoil,
  resolvedParents,
  deleteThread as modelDeleteThread,
  deleteNode as modelDeleteNode
} from './tapestry/TapestryModel.js';
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  downloadDocument,
  loadDocumentFromFile,
  scheduleAutoSave,
  createWelcomeDocument
} from './tapestry/TapestrySerializer.js';
import { resolve, type ResolvedScore } from './tapestry/TapestryResolver.js';

// ── Colours ───────────────────────────────────────────────────────────────────

const C = {
  coil:   { bg: '#dbeafe', border: '#3b82f6', text: '#1d4ed8', pill: '#eff6ff' },
  weave:  { bg: '#fef3c7', border: '#f59e0b', text: '#92400e', pill: '#fffbeb' },
  thread: { line: '#94a3b8', sel: '#8b5cf6', ghost: '#60a5fa', valid: '#22c55e', invalid: '#ef4444' }
};

// ── Port geometry helpers ─────────────────────────────────────────────────────

interface PortInfo {
  nodeId: string;
  kind: 'out' | 'inherit-in' | 'compose-slot' | 'default-coil';
  slotIndex?: number; // for compose-slot
  /** Centre position in the node-layer coordinate space */
  x: number;
  y: number;
}

// ── App shell ─────────────────────────────────────────────────────────────────

export class TapestryComposerApp extends BasePPTComponent {
  static get componentDef() {
    return {
      displayName: 'TapestryComposerApp',
      familyColor: '#888888',
      acceptsChildren: ['*'],
      canNestIn: ['*']
    };
  }

  private _isRendered = false;
  private _doc: TapestryDocument = createWelcomeDocument();

  // selection
  private _selectedNodeId: string | null = null;
  private _selectedThreadId: string | null = null;

  // canvas navigation
  private _panX = 0; private _panY = 0; private _zoom = 1;

  // node drag
  private _dragging: { nodeId: string; startMX: number; startMY: number; startNX: number; startNY: number } | null = null;

  // canvas pan
  private _isPanning = false;
  private _panStart = { x: 0, y: 0 };

  // thread draw mode
  private _drawSrc: PortInfo | null = null;
  private _drawMouseX = 0; private _drawMouseY = 0; // canvas-space
  private _drawTargetPort: PortInfo | null = null;

  // coil editor state
  private _activeCoilId: string | null = null;
  private _activeLayerType: 'melody' | 'harmony' | 'rhythm' | null = null;

  private _isDirty = false;
  private _isDark = false;
  private _sidebarOpen = true;

  // cached DOM
  private _nodeLayer: HTMLElement | null = null;
  private _svgLayer: SVGSVGElement | null = null;
  private _ghostLayer: SVGSVGElement | null = null;
  private _detailInner: HTMLElement | null = null;
  private _libraryList: HTMLElement | null = null;

  override connectedCallback() {
    super.connectedCallback();
    this._isDark = localStorage.getItem('ppt-theme') === 'dark';
    const saved = loadFromLocalStorage();
    if (saved) this._doc = saved;

    if (!this._isRendered) {
      this.shadowRoot!.innerHTML = this.buildHTML();
      this._isRendered = true;
      this.cacheDOM();
      this.bindEvents();
    }
    this.renderAll();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    // Unsubscribe from coil editor EventBus channels
    this.unbindCoilEditorListeners();
  }

  // ── HTML ──────────────────────────────────────────────────────────────────

  private buildHTML(): string {
    // @ts-ignore
    const base = (typeof import.meta !== 'undefined' ? import.meta.env?.BASE_URL : '/') || '/';
    const baseUrl = base.replace(/\/$/, '') + '/';

    return `
      <style>${this.buildCSS()}</style>
      <div class="root ${this._isDark ? 'dark' : ''}">

        <header class="hdr">
          <div class="hdr-left">
            <button id="btn-toggle-sidebar" class="hbtn icon-only" title="Toggle Sidebar">☰</button>
            <a href="${baseUrl}" class="logo-lnk" title="PPT Home">
              <img src="${baseUrl}logo.svg" alt="PPT" class="logo" />
            </a>
            <span class="app-name">Tapestry Composer</span>
          </div>
          <div class="hdr-center">
            <span id="doc-title" class="doc-title" title="Click to rename" tabindex="0">Untitled Tapestry</span>
            <span id="dirty-dot" class="dirty-dot" style="display:none">●</span>
          </div>
          <div class="hdr-right">
            <ppt-midi-input-bridge id="global-midi-bridge" compact="true"></ppt-midi-input-bridge>
            <div class="vdiv"></div>
            <button id="btn-new"  class="hbtn">New</button>
            <button id="btn-open" class="hbtn">Open</button>
            <button id="btn-save" class="hbtn accent">Save</button>
            <div class="vdiv"></div>
            <button id="btn-theme"   class="hbtn icon-only" title="Toggle theme">☀</button>
          </div>
        </header>

        <div class="body">

          <!-- Library -->
          <aside class="lib ${this._sidebarOpen ? '' : 'collapsed'}" id="sidebar">
            <div class="lib-hdr">
              <span class="lib-title">Graph Nodes</span>
            </div>
            <div class="lib-list" id="lib-list"></div>
          </aside>

          <!-- Workspace -->
          <div class="workspace">

            <!-- Graph -->
            <div class="graph-area" id="graph-area">

              <div class="graph-toolbar">
                <button id="btn-add-coil"  class="lib-add coil">+ Coil</button>
                <button id="btn-add-weave" class="lib-add weave">+ Weave</button>
                <div class="gt-sep"></div>
                <button id="btn-zi"    class="gt-btn">+</button>
                <button id="btn-zo"    class="gt-btn">−</button>
                <button id="btn-zr"    class="gt-btn">⊙</button>
                <div class="gt-sep"></div>
                <span id="zoom-lbl"   class="gt-zoom">100%</span>
              </div>
              
              <div class="resolution-panel">
                <div class="knot-bar">
                  <span class="kb-label">Global Knot</span>
                  <input id="g-do" class="kb-input" type="text" value="C4" title="Do pitch" />
                  <input id="g-bpm" class="kb-input kb-bpm" type="number" value="120" min="20" max="400" title="BPM" />
                  <span class="kb-label">BPM</span>
                </div>
                <div class="res-opts">
                  <label class="res-lbl"><input type="radio" name="res-tgt" id="rtgt-prim" checked /> Primary</label>
                  <label class="res-lbl"><input type="radio" name="res-tgt" id="rtgt-sel" /> Selected</label>
                </div>
                <button id="btn-resolve" class="hbtn primary">View Composition ↗</button>
                <button class="hbtn" disabled title="Coming soon">▶ Preview Audio</button>
              </div>

              <div class="graph-vp" id="graph-vp">
                <svg class="thread-svg" id="thread-svg" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <marker id="arr"     markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                      <polygon points="0 0,8 3,0 6" fill="${C.thread.line}" />
                    </marker>
                    <marker id="arr-sel" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                      <polygon points="0 0,8 3,0 6" fill="${C.thread.sel}" />
                    </marker>
                    <marker id="arr-ghost" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                      <polygon points="0 0,8 3,0 6" fill="${C.thread.ghost}" />
                    </marker>
                    <marker id="arr-valid" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                      <polygon points="0 0,8 3,0 6" fill="${C.thread.valid}" />
                    </marker>
                  </defs>
                </svg>
                <div class="node-layer" id="node-layer"></div>
                <svg class="ghost-svg" id="ghost-svg" xmlns="http://www.w3.org/2000/svg">
                  <!-- Ghost line for thread drawing -->
                  <path id="ghost-line" class="ghost-line" style="display:none" />
                </svg>
              </div>

              <div class="empty-state" id="empty-state">
                <div class="empty-icon">🧵</div>
                <h3>Start your Tapestry</h3>
                <p>Add a <strong>Coil</strong> to capture a musical idea,<br>or a <strong>Weave</strong> to sequence multiple Coils.</p>
                <div class="empty-btns">
                  <button class="empty-add coil" id="btn-empty-coil">+ New Coil</button>
                  <button class="empty-add weave" id="btn-empty-weave">+ New Weave</button>
                </div>
              </div>
            </div>

            <!-- Detail panel -->
            <div class="detail" id="detail-panel">
              <div class="detail-inner" id="detail-inner">
                <div class="detail-ph">Select a node or thread to edit it.</div>
              </div>
            </div>

          </div>
        </div>

        <footer class="status">
          <span id="status-msg">Ready</span>
          <span class="ss">·</span>
          <span id="status-counts">0 nodes</span>
          <span class="ss">·</span>
          <span id="status-primary">No primary node</span>
        </footer>

        <!-- Resolved score overlay -->
        <div class="score-ov" id="score-ov" style="display:none">
          <div class="score-ov-inner">
            <div class="score-ov-hdr">
              <span id="score-ov-title">Resolved Score</span>
              <button id="btn-score-close">✕</button>
            </div>
            <div class="score-body" id="score-body"></div>
          </div>
        </div>

      </div>
    `;
  }

  // ── CSS ───────────────────────────────────────────────────────────────────

  private buildCSS(): string {
    return `
      ${super.getBaseStyles()}

      :host { display:block; width:100%; height:100vh; }

      .root {
        --bg:#f8fafc; --sf:#fff; --sf2:#f1f5f9; --bd:#e2e8f0;
        --tx:#1e293b; --tm:#64748b; --br:#e13610; --br2:#e17013;
        --cc:${C.coil.border}; --wc:${C.weave.border};
        --ac:#8b5cf6; --pc:#ef4444;
        display:flex; flex-direction:column; height:100%;
        background:var(--bg); color:var(--tx);
        font-family:system-ui,-apple-system,'Segoe UI',sans-serif; font-size:14px;
      }
      .root.dark { --bg:#0f172a; --sf:#1e293b; --sf2:#0f172a; --bd:#334155; --tx:#f1f5f9; --tm:#94a3b8; }

      /* ── Header ── */
      .hdr {
        display:flex; align-items:center; justify-content:space-between;
        padding:0 1rem; height:52px; flex-shrink:0;
        background:var(--sf); border-bottom:2px solid var(--br2);
        box-shadow:0 1px 4px rgba(0,0,0,.06); z-index:10;
      }
      .hdr-left,.hdr-center,.hdr-right { display:flex; align-items:center; gap:.5rem; }
      .logo-lnk { display:flex; }
      .logo { height:28px; }
      .app-name { font-weight:700; font-size:1rem; color:var(--br); }
      .doc-title {
        font-weight:600; cursor:pointer; padding:2px 6px; border-radius:4px;
        border:1px solid transparent; transition:border-color .2s;
        max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
      }
      .doc-title:hover { border-color:var(--bd); }
      .dirty-dot { color:var(--br); font-size:1.2em; }
      .vdiv { width:1px; height:24px; background:var(--bd); margin:0 .25rem; }

      .knot-bar { display:flex; align-items:center; gap:.4rem; background:var(--sf2); border:1px solid var(--bd); border-radius:6px; padding:.25rem .6rem; }
      .kb-label { font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:var(--tm); }
      .kb-input { width:44px; padding:2px 4px; font-size:.8rem; font-family:monospace; background:var(--sf); border:1px solid var(--bd); border-radius:4px; color:var(--tx); text-align:center; outline:none; }
      .kb-bpm { width:50px; }
      .kb-input:focus { border-color:var(--br); }

      .hbtn { display:inline-flex; align-items:center; gap:.3rem; padding:.3rem .7rem; border-radius:6px; border:1px solid var(--bd); background:var(--sf); color:var(--tx); font-size:.8rem; font-weight:500; cursor:pointer; transition:background .15s; white-space:nowrap; }
      .hbtn:hover { background:var(--sf2); }
      .hbtn.accent { border-color:var(--cc); color:var(--cc); }
      .hbtn.accent:hover { background:#eff6ff; }
      .hbtn.primary { background:var(--pc); border-color:var(--pc); color:#fff; }
      .hbtn.primary:hover { background:#dc2626; }
      .hbtn.icon-only { padding:.3rem .45rem; }

      /* ── Body ── */
      .body { display:flex; flex:1; overflow:hidden; }

      /* ── Library ── */
      .lib { width:220px; flex-shrink:0; background:var(--sf); border-right:1px solid var(--bd); display:flex; flex-direction:column; overflow:hidden; }
      .lib-hdr { display:flex; align-items:center; gap:.3rem; padding:.55rem .75rem; border-bottom:1px solid var(--bd); flex-shrink:0; flex-wrap:wrap; }
      .lib-title { font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--tm); flex:1; }
      .lib-add { display:inline-flex; align-items:center; gap:.2rem; padding:.2rem .45rem; border-radius:4px; font-size:.72rem; font-weight:600; cursor:pointer; border:1px solid; transition:background .15s; }
      .lib-add.coil { border-color:var(--cc); color:var(--cc); background:transparent; }
      .lib-add.coil:hover { background:#dbeafe; }
      .lib-add.weave { border-color:var(--wc); color:#92400e; background:transparent; }
      .lib-add.weave:hover { background:#fef3c7; }
      .lib-list { flex:1; overflow-y:auto; padding:.3rem; }
      .lib-row { display:flex; align-items:center; gap:.5rem; padding:.35rem .5rem; border-radius:5px; cursor:pointer; border:1px solid transparent; margin-bottom:2px; transition:background .15s; }
      .lib-row:hover { background:var(--sf2); }
      .lib-row.sel { background:#ede9fe; border-color:var(--ac); }
      .lib-row.prim .lib-dot { box-shadow:0 0 0 2px var(--pc); }
      .lib-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
      .lib-dot.coil { background:var(--cc); }
      .lib-dot.weave { background:var(--wc); }
      .lib-lbl { flex:1; font-size:.8rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      .lib-tag { font-size:.65rem; color:var(--tm); text-transform:uppercase; font-weight:600; }
      .lib-empty { padding:1rem .5rem; font-size:.8rem; color:var(--tm); text-align:center; line-height:1.5; }

      /* ── Workspace ── */
      .workspace { flex:1; display:flex; flex-direction:column; overflow:hidden; }

      /* ── Graph ── */
      .graph-area { flex:1; position:relative; overflow:hidden; background:var(--sf2); }
      .graph-toolbar { position:absolute; top:12px; right:12px; z-index:5; display:flex; align-items:center; gap:4px; background:var(--sf); border:1px solid var(--bd); border-radius:8px; padding:4px 8px; box-shadow:0 2px 8px rgba(0,0,0,.08); }
      .gt-btn { width:28px; height:28px; border:none; background:transparent; border-radius:4px; cursor:pointer; font-size:1rem; color:var(--tx); display:flex; align-items:center; justify-content:center; transition:background .15s; }
      .gt-btn:hover { background:var(--sf2); }
      .gt-sep { width:1px; height:20px; background:var(--bd); }
      .gt-zoom { font-size:.72rem; color:var(--tm); min-width:36px; text-align:center; }

      .graph-vp { position:absolute; inset:0; cursor:grab; user-select:none; }
      .graph-vp.panning { cursor:grabbing; }
      .graph-vp.drawing { cursor:crosshair; }

      .thread-svg { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; overflow:visible; }
      .node-layer { position:absolute; inset:0; transform-origin:0 0; }
      .ghost-svg { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; overflow:visible; z-index:15; }

      /* Ghost thread */
      .ghost-line { stroke:${C.thread.ghost}; stroke-width:2; stroke-dasharray:6 4; fill:none; marker-end:url(#arr-ghost); pointer-events:none; }
      .ghost-line.valid { stroke:${C.thread.valid}; marker-end:url(#arr-valid); }

      /* Thread lines */
      .t-line { stroke:${C.thread.line}; stroke-width:1.5; fill:none; cursor:pointer; pointer-events:stroke; transition:stroke .15s; }
      .t-line:hover { stroke:${C.thread.ghost}; }
      .t-line.sel { stroke:${C.thread.sel}; stroke-width:2.5; stroke-dasharray:8 6; }
      .t-badge { font-size:10px; fill:var(--tm); cursor:pointer; }

      /* ── Node cards ── */
      .gnode { position:absolute; border-radius:8px; border:2px solid; background:var(--sf); cursor:pointer; box-shadow:0 2px 8px rgba(0,0,0,.1); transition:box-shadow .15s, border-color .15s; user-select:none; min-width:180px; }
      .gnode:hover { box-shadow:0 4px 16px rgba(0,0,0,.15); }
      .gnode.sel { border-style:dashed; border-color:var(--ac) !important; box-shadow:0 4px 16px rgba(0,0,0,.15); }
      .gnode.draw-target-valid { border-style:dashed; border-color:${C.thread.valid} !important; box-shadow:0 4px 16px rgba(0,0,0,.15); animation:pulse-valid .8s infinite; }
      .gnode.draw-target-invalid { opacity:.4; }
      @keyframes pulse-valid { 0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,.4);} 50%{box-shadow:0 0 0 6px rgba(34,197,94,0);} }

      .node-hdr { display:flex; align-items:center; gap:6px; padding:7px 10px 6px; border-radius:6px 6px 0 0; border-bottom:1px solid; }
      .n-pill { font-size:.6rem; font-weight:700; text-transform:uppercase; letter-spacing:.08em; padding:1px 5px; border-radius:3px; }
      .n-lbl { font-size:.8rem; font-weight:600; flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      .n-star { font-size:.75rem; color:var(--pc); flex-shrink:0; }

      /* Port handles — all nodes */
      .port { position:absolute; width:12px; height:12px; border-radius:50%; border:2px solid; background:var(--sf); cursor:crosshair; transition:transform .15s, box-shadow .15s; z-index:2; }
      .port:hover { transform:scale(1.4); }
      .port.port-out { right:-7px; top:50%; transform:translateY(-50%); }
      .port.port-out:hover { transform:translateY(-50%) scale(1.4); }
      .port.port-in { left:-7px; top:50%; transform:translateY(-50%); }
      .port.port-in:hover { transform:translateY(-50%) scale(1.4); }
      .port.glow { box-shadow:0 0 8px 3px ${C.thread.valid}; border-color:${C.thread.valid}; }

      /* Coil node body */
      .c-inherit-slots { display: flex; flex-direction: column; border-bottom: 1px dashed var(--bd); margin: -8px -10px 4px -10px; }
      .c-inherit-slot { display:flex; align-items:center; gap:6px; padding:4px 10px 4px 10px; border-bottom:1px solid var(--bd); position:relative; font-size:.75rem; min-height:28px; }
      .c-inherit-slot:last-child { border-bottom:none; }
      .c-inherit-slot:hover .wslot-del { opacity:1; }

      .resolution-panel { position:absolute; bottom:12px; right:12px; z-index:5; background:var(--sf); border:1px solid var(--bd); border-radius:8px; padding:10px 12px; box-shadow:0 4px 16px rgba(0,0,0,.1); display:flex; flex-direction:column; gap:10px; }
      .res-opts { display:flex; align-items:center; gap:8px; font-size:.75rem; color:var(--tm); }
      .res-lbl { cursor:pointer; display:flex; align-items:center; gap:4px; }

      .coil-body { padding:8px 10px; display:flex; flex-direction:column; gap:4px; }
      .layer-badge { display:inline-flex; align-items:center; justify-content:center; width:16px; font-size:.65rem; padding:1px; border-radius:3px; border:1px solid var(--bd); color:var(--tm); flex-shrink:0; }
      .layer-badge.has { color:var(--tx); border-color:currentColor; }
      .layer-row { display:flex; align-items:center; gap:6px; font-size:0.75rem; }
      .layer-content { flex:1; overflow:hidden; display:flex; align-items:center; }
      .layer-content.empty { color:var(--tm); font-style:italic; font-size:0.75rem; }
      .solfege-inline { display:flex; align-items:baseline; gap:2px; flex-wrap:wrap; font-size:0.85rem; }
      .parents-row { font-size:.7rem; color:var(--tm); margin-top:2px; padding-top:4px; border-top:1px dashed var(--bd); }

      /* Weave node body */
      .weave-body { padding:0; display:flex; flex-direction:column; }
      .weave-slots { display:flex; flex-direction:column; }
      .wslot { display:flex; align-items:center; gap:6px; padding:4px 10px 4px 10px; border-bottom:1px solid var(--bd); position:relative; font-size:.75rem; min-height:28px; }
      .wslot:last-child { border-bottom:none; }
      .wslot-num { font-size:.6rem; color:var(--tm); font-weight:700; min-width:14px; }
      .wslot-lbl { flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      .wslot-mod { font-size:.6rem; color:var(--tm); font-family:monospace; }
      .wslot-del { width:16px; height:16px; border:none; background:transparent; cursor:pointer; color:var(--tm); opacity:0; display:flex; align-items:center; justify-content:center; }
      .wslot:hover .wslot-del { opacity:1; }
      .wslot-del:hover { color:#ef4444; }
      
      .wslot-drop-zone, .dc-drop-zone, .coil-drop-zone {
        height: 0;
        overflow: hidden;
        transition: height 0.15s, margin 0.15s, border-color 0.15s, background 0.15s;
        border: 2px dashed transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        color: transparent;
        font-size: 0.7rem;
        background: transparent;
        box-sizing: border-box;
      }
      .gnode.draw-target-valid .wslot-drop-zone,
      .gnode.draw-target-valid .dc-drop-zone,
      .gnode.draw-target-valid .coil-drop-zone {
        height: 6px; margin: 2px;
        border-color: rgba(0,0,0,0.1); background: rgba(0,0,0,0.01);
      }
      .gnode.draw-target-valid.drag-proximity .wslot-drop-zone,
      .gnode.draw-target-valid.drag-proximity .dc-drop-zone,
      .gnode.draw-target-valid.drag-proximity .coil-drop-zone {
        height: 24px;
        margin: 4px;
        border-color: var(--bd);
        color: var(--tm);
        background: rgba(0,0,0,0.02);
      }
      .gnode.draw-target-valid.dark .wslot-drop-zone,
      .gnode.draw-target-valid.dark .dc-drop-zone,
      .gnode.draw-target-valid.dark .coil-drop-zone {
        background: rgba(255,255,255,0.02);
      }
      .gnode.draw-target-valid.drag-proximity.dark .wslot-drop-zone,
      .gnode.draw-target-valid.drag-proximity.dark .dc-drop-zone,
      .gnode.draw-target-valid.drag-proximity.dark .coil-drop-zone {
        background: rgba(255,255,255,0.05);
      }
      .wslot-drop-zone.snapped, .dc-drop-zone.snapped, .coil-drop-zone.snapped {
        border-color: #22c55e !important;
        color: #22c55e !important;
        background: rgba(34, 197, 94, 0.1) !important;
      }

      .weave-info { padding:5px 10px; display:flex; align-items:center; gap:6px; flex-wrap:wrap; border-top:1px solid var(--bd); }
      .weave-info-badge { font-size:.65rem; padding:1px 5px; border-radius:3px; background:var(--sf2); border:1px solid var(--bd); color:var(--tm); }
      .weave-knot-badge { background:#f0fdf4; border-color:#4ade80; color:#15803d; }

      .default-coil-row { display:flex; align-items:center; gap:6px; padding:4px 10px 5px 10px; border-top:1px solid var(--bd); position:relative; font-size:.7rem; color:var(--tm); flex-direction:column; align-items:stretch; }
      .default-coil-row.empty { padding:0; border:none; }
      .dc-row-content { display:flex; align-items:center; gap:6px; justify-content:space-between; }

      /* ── Empty state ── */
      .empty-state { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:.5rem; pointer-events:none; text-align:center; padding:2rem; }
      .empty-state.hidden { display:none; }
      .empty-icon { font-size:3rem; }
      .empty-state h3 { margin:0; font-size:1.1rem; }
      .empty-state p { margin:0; font-size:.85rem; color:var(--tm); line-height:1.6; }
      .empty-btns { display:flex; gap:.75rem; margin-top:.5rem; pointer-events:all; }
      .empty-add { padding:.4rem 1rem; border-radius:6px; font-size:.85rem; font-weight:600; cursor:pointer; border:1px solid; }
      .empty-add.coil { border-color:var(--cc); color:var(--cc); background:transparent; }
      .empty-add.coil:hover { background:#dbeafe; }
      .empty-add.weave { border-color:var(--wc); color:#92400e; background:transparent; }
      .empty-add.weave:hover { background:#fef3c7; }

      /* ── Detail panel ── */
      .detail { flex-shrink:0; max-height:60vh; overflow:hidden; border-top:2px solid var(--bd); background:var(--sf); display:flex; flex-direction:column; transition:max-height .2s ease; }
      .detail.collapsed { max-height:0; border-top-color:transparent; }
      .detail-inner { flex:1; overflow-y:auto; }
      .detail-ph { padding:1rem; font-size:.85rem; color:var(--tm); text-align:center; }

      /* Detail header */
      .d-hdr { display:flex; align-items:center; gap:.6rem; padding:.55rem 1rem .45rem; border-bottom:1px solid var(--bd); position:sticky; top:0; background:var(--sf); z-index:2; flex-shrink:0; }
      .d-badge { font-size:.65rem; font-weight:700; text-transform:uppercase; letter-spacing:.08em; padding:2px 8px; border-radius:4px; }
      .d-badge.coil  { background:#dbeafe; color:#1d4ed8; }
      .d-badge.weave { background:#fef3c7; color:#92400e; }
      .d-badge.thread{ background:#f3e8ff; color:#6d28d9; }
      .d-title { flex:1; font-size:.9rem; font-weight:600; border:1px solid transparent; background:transparent; color:var(--tx); border-radius:4px; padding:2px 6px; outline:none; transition:border-color .2s; }
      .d-title:hover { border-color:var(--bd); }
      .d-title:focus { border-color:var(--br); }
      .d-acts { display:flex; gap:.35rem; margin-left:auto; }
      .d-btn { padding:.22rem .55rem; border-radius:5px; font-size:.74rem; font-weight:600; border:1px solid var(--bd); background:transparent; color:var(--tx); cursor:pointer; transition:background .15s; }
      .d-btn:hover { background:var(--sf2); }
      .d-btn.dng { border-color:#ef4444; color:#ef4444; }
      .d-btn.dng:hover { background:#fef2f2; }
      .d-btn.prim-btn { border-color:var(--pc); color:var(--pc); }
      .d-btn.prim-btn.is-prim { background:var(--pc); color:#fff; }
      .d-btn.rsv { border-color:var(--ac); color:var(--ac); }
      .d-btn.rsv:hover { background:#ede9fe; }

      .d-body { padding:.7rem 1rem; display:flex; flex-direction:column; gap:.7rem; }
      .f-grp { display:flex; flex-direction:column; gap:.28rem; }
      .f-lbl { font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:var(--tm); }
      .f-inp,.f-sel { padding:.35rem .55rem; border-radius:5px; border:1px solid var(--bd); background:var(--sf); color:var(--tx); font-size:.85rem; outline:none; transition:border-color .2s; font-family:inherit; }
      .f-inp:focus,.f-sel:focus { border-color:var(--br); }
      .f-row { display:flex; gap:.6rem; }
      .f-row .f-grp { flex:1; }

      /* Knot field rows */
      .kfrow { display:flex; align-items:center; gap:.5rem; padding:5px 8px; background:var(--sf2); border-radius:5px; border:1px solid var(--bd); }
      .kf-lbl { flex:0 0 60px; font-size:.74rem; font-weight:600; color:var(--tm); }
      .kf-inp { width:70px; padding:2px 6px; border-radius:4px; font-family:monospace; font-size:.82rem; border:1px solid var(--bd); background:var(--sf); color:var(--tx); text-align:center; outline:none; }
      .kf-inp:focus { border-color:var(--br); }
      .kf-note { font-size:.7rem; color:var(--tm); font-style:italic; }

      /* Coil PPT editor embed */
      .coil-editor-wrap {
        display:flex; flex-direction:column; gap:.5rem;
        padding:0 1rem .75rem; min-height:0;
      }
      .coil-editor-wrap ppt-solfege-text-input { display:block; }
      .coil-editor-wrap ppt-coil-mixer { display:block; min-height:180px; }
      .coil-editor-wrap ppt-coil-transport { display:block; }
      .inheritance-note {
        font-size:.72rem; color:var(--tm); padding:4px 8px;
        background:var(--sf2); border-radius:4px; border:1px solid var(--bd);
      }

      /* Thread detail */
      .thread-endpoints { font-size:.82rem; color:var(--tm); }

      /* ── Score overlay ── */
      .score-ov { position:fixed; inset:0; z-index:100; background:rgba(15,23,42,.6); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; padding:2rem; }
      .score-ov-inner { background:var(--sf); border-radius:12px; border:1px solid var(--bd); width:100%; max-width:900px; max-height:80vh; display:flex; flex-direction:column; box-shadow:0 25px 80px rgba(0,0,0,.25); }
      .score-ov-hdr { display:flex; align-items:center; justify-content:space-between; padding:.9rem 1.2rem; border-bottom:1px solid var(--bd); font-weight:700; }
      .score-ov-hdr button { width:28px; height:28px; border:1px solid var(--bd); background:transparent; border-radius:6px; color:var(--tx); cursor:pointer; }
      .score-body { flex:1; overflow-y:auto; padding:1rem 1.2rem; }
      .score-secs { display:flex; flex-wrap:wrap; gap:.6rem; align-items:flex-start; }
      .ssec { border:1px solid var(--bd); border-radius:8px; overflow:hidden; min-width:180px; flex:0 0 auto; }
      .ssec-hdr { padding:5px 10px; font-size:.72rem; font-weight:700; background:var(--sf2); border-bottom:1px solid var(--bd); display:flex; align-items:center; gap:5px; }
      .ssec-lbl { flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      .ssec-knot { font-size:.65rem; color:var(--tm); font-family:monospace; }
      .ssec-rep { font-size:.65rem; background:var(--pc); color:#fff; padding:1px 5px; border-radius:3px; }
      .slayer { padding:4px 10px 5px; border-bottom:1px solid var(--bd); }
      .slayer:last-child { border-bottom:none; }
      .slayer-name { font-size:.6rem; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--tm); margin-bottom:2px; }
      .slayer-phrase { font-family:monospace; font-size:.85rem; word-break:break-all; line-height:1.5; }
      .slayer-phrase.empty { color:var(--tm); font-style:italic; }
      .score-empty { text-align:center; padding:2rem; color:var(--tm); }

      /* ── Status bar ── */
      .status { height:24px; display:flex; align-items:center; gap:.5rem; padding:0 1rem; background:var(--sf); border-top:1px solid var(--bd); font-size:.72rem; color:var(--tm); flex-shrink:0; }
      .ss { opacity:.4; }
    `;
  }

  // ── DOM cache + event binding ─────────────────────────────────────────────

  private cacheDOM() {
    const sr = this.shadowRoot!;
    this._nodeLayer = sr.getElementById('node-layer');
    this._svgLayer = sr.getElementById('thread-svg') as unknown as SVGSVGElement;
    this._ghostLayer = sr.getElementById('ghost-svg') as unknown as SVGSVGElement;
    this._detailInner = sr.getElementById('detail-inner');
    this._libraryList = sr.getElementById('lib-list');
  }

  private bindEvents() {
    const sr = this.shadowRoot!;
    sr.getElementById('btn-new')?.addEventListener('click', () => this.actionNew());
    sr.getElementById('btn-open')?.addEventListener('click', () => this.actionOpen());
    sr.getElementById('btn-save')?.addEventListener('click', () => this.actionSave());
    sr.getElementById('btn-resolve')?.addEventListener('click', () => {
      const tgt = this.shadowRoot?.getElementById('rtgt-sel') as HTMLInputElement;
      if (tgt && tgt.checked && this._selectedNodeId) {
        this.actionResolve(this._selectedNodeId);
      } else {
        this.actionResolve(this._doc.primaryNodeId);
      }
    });
    sr.getElementById('btn-theme')?.addEventListener('click', () => this.toggleTheme());
    sr.getElementById('btn-score-close')?.addEventListener('click', () => this.hideScore());
    sr.getElementById('btn-add-coil')?.addEventListener('click', () => this.addNode('coil'));
    sr.getElementById('btn-add-weave')?.addEventListener('click', () => this.addNode('weave'));
    sr.getElementById('btn-toggle-sidebar')?.addEventListener('click', () => this.toggleSidebar());
    sr.getElementById('btn-zi')?.addEventListener('click', () => this.zoom(.15));
    sr.getElementById('btn-zo')?.addEventListener('click', () => this.zoom(-.15));
    sr.getElementById('btn-zr')?.addEventListener('click', () => this.resetView());
    sr.getElementById('doc-title')?.addEventListener('click', () => this.renameDoc());
    sr.getElementById('g-do')?.addEventListener('change', e => { this._doc.globalKnot.doPitch = (e.target as HTMLInputElement).value; this.markDirty(); });
    sr.getElementById('g-bpm')?.addEventListener('change', e => { this._doc.globalKnot.bpm = parseInt((e.target as HTMLInputElement).value) || 120; this.markDirty(); });

    const vp = sr.getElementById('graph-vp')!;
    vp.addEventListener('mousedown', e => this.onVpMouseDown(e));
    vp.addEventListener('wheel', e => { e.preventDefault(); this.zoom(-e.deltaY * 0.001); }, { passive: false });

    window.addEventListener('mousemove', e => this.onVpMouseMove(e));
    window.addEventListener('mouseup', e => this.onWinMouseUp(e));
    window.addEventListener('keydown', e => { if (e.key === 'Escape') this.cancelDraw(); });
  }

  // ── Render orchestration ──────────────────────────────────────────────────

  private renderAll() {
    this.syncDocTitleUI();
    this.syncKnotBarUI();
    this.renderLibrary();
    this.renderGraph();
    this.updateStatus();
  }

  private syncDocTitleUI() {
    const el = this.shadowRoot?.getElementById('doc-title');
    if (el) el.textContent = this._doc.title;
  }

  private syncKnotBarUI() {
    const sr = this.shadowRoot!;
    (sr.getElementById('g-do') as HTMLInputElement).value = this._doc.globalKnot.doPitch;
    (sr.getElementById('g-bpm') as HTMLInputElement).value = String(this._doc.globalKnot.bpm);
  }

  private updateStatus() {
    const sr = this.shadowRoot!;
    (sr.getElementById('status-counts') as HTMLElement).textContent =
      `${this._doc.nodes.length} nodes · ${this._doc.threads.length} threads`;
    const pn = this._doc.primaryNodeId ? getNode(this._doc, this._doc.primaryNodeId)?.label : null;
    (sr.getElementById('status-primary') as HTMLElement).textContent = pn ? `Primary: ${pn}` : 'No primary';
    (sr.getElementById('dirty-dot') as HTMLElement).style.display = this._isDirty ? 'inline' : 'none';
  }

  // ── Library ───────────────────────────────────────────────────────────────

  private renderLibrary() {
    if (!this._libraryList) return;
    if (!this._doc.nodes.length) {
      this._libraryList.innerHTML = `<div class="lib-empty">No nodes yet.</div>`;
      return;
    }
    this._libraryList.innerHTML = this._doc.nodes.map(n => `
      <div class="lib-row ${n.id === this._selectedNodeId ? 'sel' : ''} ${n.id === this._doc.primaryNodeId ? 'prim' : ''}" data-nid="${n.id}">
        <div class="lib-dot ${n.kind}"></div>
        <span class="lib-lbl">${this.esc(n.label)}</span>
        <span class="lib-tag">${n.kind}</span>
      </div>`).join('');
    this._libraryList.querySelectorAll('.lib-row').forEach(r => {
      r.addEventListener('click', () => { this.selectNode((r as HTMLElement).dataset.nid!); this.focusNode((r as HTMLElement).dataset.nid!); });
    });
  }

  // ── Graph canvas ──────────────────────────────────────────────────────────

  private renderGraph() {
    this.shadowRoot?.getElementById('empty-state')?.classList.toggle('hidden', this._doc.nodes.length > 0);
    this.renderNodeCards();
    this.renderThreads();
    this.applyTransform();
  }

  private renderNodeCards() {
    if (!this._nodeLayer) return;
    this._nodeLayer.innerHTML = '';
    for (const node of this._doc.nodes) this._nodeLayer.appendChild(this.buildCard(node));
  }

  private updateDrawHighlights() {
    if (!this._nodeLayer) return;
    const isDrawing = !!this._drawSrc;
    Array.from(this._nodeLayer.children).forEach(child => {
      const el = child as HTMLElement;
      const nid = el.dataset.nid;
      if (!nid) return;
      const node = getNode(this._doc, nid);
      if (!node) return;
      el.classList.remove('draw-target-valid', 'draw-target-invalid');
      if (isDrawing && this._drawSrc?.nodeId !== nid) {
        const valid = this.isValidTarget(node);
        el.classList.add(valid ? 'draw-target-valid' : 'draw-target-invalid');
      }
    });
  }

  private buildCard(node: TapestryNode): HTMLElement {
    const isCoilNode = isCoil(node);
    const isSel = node.id === this._selectedNodeId;
    const isPrim = node.id === this._doc.primaryNodeId;
    const cv = isCoilNode ? C.coil : C.weave;
    const isDrawing = !!this._drawSrc;

    // Determine draw-mode compatibility
    let drawClass = '';
    if (isDrawing && this._drawSrc?.nodeId !== node.id) {
      const valid = this.isValidTarget(node);
      drawClass = valid ? 'draw-target-valid' : 'draw-target-invalid';
    }

    const div = document.createElement('div');
    div.className = `gnode ${isSel ? 'sel' : ''} ${isPrim ? 'prim' : ''} ${drawClass}`;
    div.dataset.nid = node.id;
    div.style.cssText = `left:${node.position.x}px;top:${node.position.y}px;border-color:${cv.border};`;

    div.innerHTML = `
      <div class="node-hdr" style="background:${cv.bg};border-bottom-color:${cv.border};">
        <span class="n-pill" style="background:${cv.pill};color:${cv.text};">${node.kind}</span>
        <span class="n-lbl" style="color:${cv.text};">${this.esc(node.label)}</span>
        ${isPrim ? '<span class="n-star" title="Primary">★</span>' : ''}
      </div>
      ${isCoilNode ? `<div class="coil-drop-zone" data-port="in"><span>Drop to Inherit</span></div>` + this.buildCoilBody(node as CoilNode) : this.buildWeaveBody(node as WeaveNode)}
      <div class="port port-out" data-nid="${node.id}" data-port="out"
           style="border-color:${cv.border};" title="Output — drag to connect"></div>
    `;

    // Header drag to move node
    div.querySelector('.node-hdr')?.addEventListener('mousedown', e => {
      e.stopPropagation();
      const me = e as MouseEvent;
      this._dragging = { nodeId: node.id, startMX: me.clientX, startMY: me.clientY, startNX: node.position.x, startNY: node.position.y };
    });

    // Click body to select
    div.addEventListener('click', e => {
      if (this._dragging) return;
      e.stopPropagation();
      if (!this._drawSrc) this.selectNode(node.id);
    });

    // Output port: start draw
    div.querySelector('.port-out')?.addEventListener('mousedown', e => {
      e.stopPropagation();
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const vpRect = this.shadowRoot!.getElementById('graph-vp')!.getBoundingClientRect();
      const x = (rect.left + 6 - vpRect.left - this._panX) / this._zoom;
      const y = (rect.top + 6 - vpRect.top - this._panY) / this._zoom;
      this._drawSrc = { nodeId: node.id, kind: 'out', x, y };
      this.updateDrawHighlights(); // don't rebuild DOM, just update classes
    });


    // Add slot button (Weave)
    div.querySelector('.add-slot-btn')?.addEventListener('click', e => {
      e.stopPropagation();
      // No-op — user connects by dragging from a node's output to the new slot that appears
      // For now, clicking prompts: "drag from a node's output port to the weave to add a slot"
      this.setStatus('Drag from a node\'s output port (right ●) to this Weave to add a composition slot.');
    });

    // Slot delete buttons (Weave)
    div.querySelectorAll('.wslot-del').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const tid = (e.currentTarget as HTMLElement).dataset.tid!;
        modelDeleteThread(this._doc, tid);
        this.markDirty();
        this.renderGraph();
        this.renderLibrary();
      });
    });

    return div;
  }

  private buildCoilBody(node: CoilNode): string {
    const renderLayer = (lbl: string, text: string | undefined) => `
      <div class="layer-row">
        <span class="layer-badge ${text ? 'has' : ''}">${lbl}</span>
        <div class="layer-content" title="${text ? this.esc(text) : ''}">
          ${this.renderSolfège(text, '(empty)')}
        </div>
      </div>`;

    let layersHtml = '';
    // Show only populated layers, or all three if empty
    if (node.layers.melody || node.layers.harmony || node.layers.rhythm) {
      if (node.layers.melody) layersHtml += renderLayer('M', node.layers.melody);
      if (node.layers.harmony) layersHtml += renderLayer('H', node.layers.harmony);
      if (node.layers.rhythm) layersHtml += renderLayer('R', node.layers.rhythm);
    } else {
      layersHtml += renderLayer('M', node.layers.melody);
      layersHtml += renderLayer('H', node.layers.harmony);
      layersHtml += renderLayer('R', node.layers.rhythm);
    }

    let inheritHtml = '';
    node.inheritanceOrder.forEach((tid, i) => {
      const thread = this._doc.threads.find(t => t.id === tid);
      if (!thread) return;
      const source = getNode(this._doc, thread.sourceId);
      if (!source) return;
      const mods = [thread.pitchModification && `↑${thread.pitchModification}`,
        thread.timeModification && `⟳${thread.timeModification}`,
        thread.repeatCount > 1 && `×${thread.repeatCount}`].filter(Boolean).join(' ');
      
      inheritHtml += `
        <div class="c-inherit-slot wslot" ${thread ? `data-tid="${thread.id}" style="cursor:pointer;"` : `data-slot="${i}"`}>
          ${thread ? `<div class="port port-in" data-port="in" data-tid="${thread.id}" style="border-color:var(--cc);"></div>` : ''}
          <span class="wslot-num">${i + 1}.</span>
          <span class="wslot-lbl">${this.esc(source.label)}</span>
          ${mods ? `<span class="wslot-mod">${mods}</span>` : ''}
          <button class="wslot-del" data-tid="${thread.id}" title="Remove inheritance">✕</button>
        </div>`;
    });

    return `
      <div class="coil-body">
        ${inheritHtml ? `<div class="c-inherit-slots">${inheritHtml}</div>` : ''}
        ${layersHtml}
      </div>`;
  }

  private buildWeaveBody(node: WeaveNode): string {
    const seq = resolvedCompositionSequence(this._doc, node);
    const defCoil = resolvedDefaultCoil(this._doc, node);
    const layoutIcon = { concatenate: '→', 'equal-period': '⊜', 'equal-beat': '♩' }[node.layout] ?? '→';
    const knotLabel = node.knot ? `${node.knot.doPitch ?? '?'} · ${node.knot.bpm ?? '?'}BPM` : '';

    let slotsHtml = `<div class="wslot-drop-zone" data-drop-slot="0"><span>Drop to insert</span></div>`;
    seq.forEach(({ thread, source }, i) => {
      const mods = [thread.pitchModification && `↑${thread.pitchModification}`,
        thread.timeModification && `⟳${thread.timeModification}`,
        thread.repeatCount > 1 && `×${thread.repeatCount}`].filter(Boolean).join(' ');
      
      slotsHtml += `
        <div class="wslot" ${node.compositionOrder[i] ? `data-tid="${node.compositionOrder[i]}" style="cursor:pointer;"` : ''}>
          ${node.compositionOrder[i] ? `<div class="port port-in" data-port="in" data-tid="${node.compositionOrder[i]}" style="border-color:var(--wc);"></div>` : ''}
          <span class="wslot-num">${i + 1}.</span>
          <span class="wslot-lbl">${this.esc(source.label)}</span>
          ${mods ? `<span class="wslot-mod">${mods}</span>` : ''}
          <button class="wslot-del" data-tid="${thread.id}" title="Remove slot">✕</button>
        </div>`;
      slotsHtml += `<div class="wslot-drop-zone" data-drop-slot="${i + 1}"><span>Drop to insert</span></div>`;
    });

    return `
      <div class="weave-body">
        <div class="default-coil-row ${!node.defaultCoilThreadId ? 'empty' : ''}" ${node.defaultCoilThreadId ? `data-tid="${node.defaultCoilThreadId}" style="cursor:pointer;"` : ''}>
          ${node.defaultCoilThreadId ? `<div class="port port-in" data-port="in" data-tid="${node.defaultCoilThreadId}" style="border-color:var(--wc);"></div>` : ''}
          <div class="dc-drop-zone" data-drop-slot="dc"><span>Drop Default Coil</span></div>
          ${node.defaultCoilThreadId ? `
          <div class="dc-row-content">
            <span>Default Coil: <strong>${defCoil ? this.esc(defCoil.label) : '(none)'}</strong></span>
            <button class="wslot-del" data-tid="${node.defaultCoilThreadId}" title="Remove default coil" style="opacity:1;">✕</button>
          </div>
          ` : ''}
        </div>
        <div class="weave-slots">${slotsHtml}</div>
        <div class="weave-info">
          <span class="weave-info-badge">${layoutIcon} ${node.layout}</span>
          ${knotLabel ? `<span class="weave-info-badge weave-knot-badge">${knotLabel}</span>` : ''}
        </div>
      </div>`;
  }

  // ── Thread rendering ──────────────────────────────────────────────────────

  private getCoilInheritSlotPos(nodeId: string, slotIndex: number): { x: number; y: number } | null {
    const nodeEl = this._nodeLayer?.querySelector(`[data-nid="${nodeId}"]`);
    if (nodeEl) {
      const slots = nodeEl.querySelectorAll('.c-inherit-slot');
      if (slotIndex < slots.length) {
         const rect = slots[slotIndex].getBoundingClientRect();
         const vpRect = this.shadowRoot!.getElementById('graph-vp')!.getBoundingClientRect();
         return {
           x: (rect.left - vpRect.left - this._panX) / this._zoom - 6,
           y: (rect.top + rect.height / 2 - vpRect.top - this._panY) / this._zoom
         };
      }
    }
    return null;
  }

  private getNodePortPos(nodeId: string, side: 'out' | 'in'): { x: number; y: number } {
    const nodeEl = this._nodeLayer?.querySelector(`[data-nid="${nodeId}"]`);
    if (nodeEl) {
      if (side === 'in') {
        const dz = nodeEl.querySelector('.coil-drop-zone');
        if (dz) {
          const rect = dz.getBoundingClientRect();
          const vpRect = this.shadowRoot!.getElementById('graph-vp')!.getBoundingClientRect();
          return {
            x: (rect.left - vpRect.left - this._panX) / this._zoom - 6,
            y: (rect.top + rect.height / 2 - vpRect.top - this._panY) / this._zoom
          };
        }
      } else {
        const outPort = nodeEl.querySelector('.port-out');
        if (outPort) {
          const rect = outPort.getBoundingClientRect();
          const vpRect = this.shadowRoot!.getElementById('graph-vp')!.getBoundingClientRect();
          return {
            x: (rect.left + rect.width / 2 - vpRect.left - this._panX) / this._zoom,
            y: (rect.top + rect.height / 2 - vpRect.top - this._panY) / this._zoom
          };
        }
      }
    }
    const node = getNode(this._doc, nodeId);
    if (!node) return { x: 0, y: 0 };
    const w = nodeEl ? (nodeEl as HTMLElement).offsetWidth : 184;
    const h = 45;
    return {
      x: side === 'out' ? node.position.x + w : node.position.x - 6,
      y: node.position.y + h
    };
  }

  private getWeaveSlotPos(nodeId: string, slotIndex: number): { x: number; y: number } {
    const nodeEl = this._nodeLayer?.querySelector(`[data-nid="${nodeId}"]`);
    if (nodeEl) {
      const wslots = nodeEl.querySelectorAll('.wslot');
      if (slotIndex < wslots.length) {
         const rect = wslots[slotIndex].getBoundingClientRect();
         const vpRect = this.shadowRoot!.getElementById('graph-vp')!.getBoundingClientRect();
         return {
           x: (rect.left - vpRect.left - this._panX) / this._zoom - 6,
           y: (rect.top + rect.height / 2 - vpRect.top - this._panY) / this._zoom
         };
      }
    }
    const node = getNode(this._doc, nodeId);
    if (!node || !isWeave(node)) return { x: 0, y: 0 };
    return {
      x: node.position.x - 6,
      y: node.position.y + 45 + slotIndex * 28 + 14
    };
  }

  private getWeaveDefaultCoilPos(nodeId: string): { x: number; y: number } {
    const nodeEl = this._nodeLayer?.querySelector(`[data-nid="${nodeId}"]`);
    if (nodeEl) {
      const row = nodeEl.querySelector('.default-coil-row');
      if (row) {
         const rect = row.getBoundingClientRect();
         const vpRect = this.shadowRoot!.getElementById('graph-vp')!.getBoundingClientRect();
         return {
           x: (rect.left - vpRect.left - this._panX) / this._zoom - 6,
           y: (rect.top + rect.height / 2 - vpRect.top - this._panY) / this._zoom
         };
      }
    }
    const node = getNode(this._doc, nodeId);
    if (!node || !isWeave(node)) return { x: 0, y: 0 };
    return { x: node.position.x - 6, y: node.position.y + 120 };
  }

  private renderThreads() {
    if (!this._svgLayer) return;
    const defs = this._svgLayer.querySelector('defs');
    this._svgLayer.innerHTML = '';
    if (defs) this._svgLayer.appendChild(defs);

    for (const thread of this._doc.threads) {
      const src = getNode(this._doc, thread.sourceId);
      const tgt = getNode(this._doc, thread.targetId);
      if (!src || !tgt) continue;

      const isSel = thread.id === this._selectedThreadId;
      const sp = this.getNodePortPos(thread.sourceId, 'out');

      let tp: { x: number; y: number };
      if (thread.kind === 'weave-compose' && isWeave(tgt)) {
        const weaveNode = tgt as WeaveNode;
        const slotIdx = weaveNode.compositionOrder.indexOf(thread.id);
        tp = this.getWeaveSlotPos(thread.targetId, slotIdx);
      } else if (thread.kind === 'weave-default-coil' && isWeave(tgt)) {
        tp = this.getWeaveDefaultCoilPos(thread.targetId);
      } else {
        // Spread out multiple inheritance threads for Coils by targeting the explicit slot
        if (thread.kind === 'coil-inherit' && isCoil(tgt)) {
          const coilNode = tgt as CoilNode;
          const idx = coilNode.inheritanceOrder.indexOf(thread.id);
          if (idx !== -1) {
            const slotPos = this.getCoilInheritSlotPos(thread.targetId, idx);
            if (slotPos) {
              tp = slotPos;
            } else {
              tp = this.getNodePortPos(thread.targetId, 'in');
              tp.y += (idx - (coilNode.inheritanceOrder.length - 1) / 2) * 18;
            }
          } else {
            tp = this.getNodePortPos(thread.targetId, 'in');
          }
        } else {
          tp = this.getNodePortPos(thread.targetId, 'in');
        }
      }

      const dx = Math.abs(tp.x - sp.x);
      const cpx = dx * 0.5;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M ${sp.x} ${sp.y} C ${sp.x + Math.max(cpx, 50)} ${sp.y}, ${tp.x - Math.max(cpx, 50)} ${tp.y}, ${tp.x} ${tp.y}`);
      path.setAttribute('class', `t-line ${isSel ? 'sel' : ''}`);
      path.dataset.tid = thread.id;
      
      const onSelect = (e: Event) => { e.stopPropagation(); this.selectThread(thread.id); };
      path.addEventListener('click', onSelect);
      
      // Output anchor (origin)
      const outAnchor = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      outAnchor.setAttribute('cx', sp.x.toString());
      outAnchor.setAttribute('cy', sp.y.toString());
      outAnchor.setAttribute('r', '3');
      outAnchor.setAttribute('fill', isSel ? C.thread.sel : C.thread.coil);
      outAnchor.style.pointerEvents = 'none';

      this._svgLayer.appendChild(path);
      this._svgLayer.appendChild(outAnchor);

      // Attribute badges
      const badges = [
        thread.kind !== 'coil-inherit' && thread.kind !== 'weave-default-coil' && thread.resolutionMode !== 'stretch' && thread.resolutionMode,
        thread.pitchModification && `↑ ${thread.pitchModification}`,
        thread.timeModification && `⟳ ${thread.timeModification}`,
        thread.repeatCount > 1 && `×${thread.repeatCount}`
      ].filter(Boolean);

      if (badges.length) {
        const mid = { x: (sp.x + tp.x) / 2, y: (sp.y + tp.y) / 2 - 10 };
        const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        t.setAttribute('x', String(mid.x)); t.setAttribute('y', String(mid.y));
        t.setAttribute('class', 't-badge'); t.setAttribute('text-anchor', 'middle');
        t.textContent = badges.join(' · ');
        t.dataset.tid = thread.id;
        t.addEventListener('click', e => { e.stopPropagation(); this.selectThread(thread.id); });
        this._svgLayer.appendChild(t);
      }
    }

    // Ghost line
    this.updateGhostLine();
  }

  private updateGhostLine() {
    const ghost = this._ghostLayer?.querySelector('#ghost-line') as SVGPathElement | null;
    if (!ghost) return;
    if (!this._drawSrc) { ghost.style.display = 'none'; return; }

    const sx = this._drawSrc.x;
    const sy = this._drawSrc.y;
    const tx = this._drawMouseX;
    const ty = this._drawMouseY;
    const dx = Math.abs(tx - sx) * 0.5;

    ghost.setAttribute('d', `M ${sx} ${sy} C ${sx + Math.max(dx, 40)} ${sy}, ${tx - Math.max(dx, 40)} ${ty}, ${tx} ${ty}`);
    ghost.style.display = '';
    const isValid = !!this._drawTargetPort;
    ghost.className.baseVal = `ghost-line${isValid ? ' valid' : ''}`;
    ghost.setAttribute('marker-end', isValid ? 'url(#arr-valid)' : 'url(#arr-ghost)');
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  private toggleSidebar() {
    this._sidebarOpen = !this._sidebarOpen;
    const sb = this.shadowRoot?.getElementById('sidebar');
    if (sb) {
      if (this._sidebarOpen) sb.classList.remove('collapsed');
      else sb.classList.add('collapsed');
    }
  }

  private toggleTheme() {
    this._isDark = !this._isDark;
    localStorage.setItem('ppt-theme', this._isDark ? 'dark' : 'light');
    const root = this.shadowRoot?.querySelector('.root');
    this._isDark ? root?.classList.add('dark') : root?.classList.remove('dark');
    window.dispatchEvent(new CustomEvent('ppt-theme-changed', { detail: { isDark: this._isDark }, bubbles: true, composed: true }));
  }

  // ── Canvas transform ──────────────────────────────────────────────────────

  private applyTransform() {
    if (!this._nodeLayer || !this._svgLayer || !this._ghostLayer) return;
    const t = `translate(${this._panX}px,${this._panY}px) scale(${this._zoom})`;
    this._nodeLayer.style.transform = t;
    this._svgLayer.style.transform = t;
    this._ghostLayer.style.transform = t;
    const lbl = this.shadowRoot?.getElementById('zoom-lbl');
    if (lbl) lbl.textContent = `${Math.round(this._zoom * 100)}%`;
  }

  private zoom(delta: number) { this._zoom = Math.min(2, Math.max(.3, this._zoom + delta)); this.applyTransform(); }
  private resetView() { this._panX = 0; this._panY = 0; this._zoom = 1; this.applyTransform(); }

  // ── Mouse events ─────────────────────────────────────────────────────────

  private onVpMouseDown(e: MouseEvent) {
    const tgt = e.target as HTMLElement;

    // Check for port-in drag-to-disconnect
    const portIn = tgt.closest('.port-in, .wslot[data-tid], .default-coil-row[data-tid]') as HTMLElement;
    if (portIn && portIn.dataset.tid) {
      e.stopPropagation();
      this._pendingDragThread = portIn.dataset.tid;
      this._pendingDragStart = { x: e.clientX, y: e.clientY };
      return;
    }

    if (tgt.classList.contains('graph-vp') || tgt.id === 'graph-vp') {
      this.selectNode(null); this.selectThread(null);
      this._isPanning = true;
      this._panStart = { x: e.clientX - this._panX, y: e.clientY - this._panY };
      tgt.classList.add('panning');
    }
  }

  private onVpMouseMove(e: MouseEvent) {
    if (this._pendingDragThread && this._pendingDragStart) {
      const dx = e.clientX - this._pendingDragStart.x;
      const dy = e.clientY - this._pendingDragStart.y;
      if (Math.hypot(dx, dy) > 5) {
        const thread = this._doc.threads.find(t => t.id === this._pendingDragThread);
        if (thread) {
           const pt = this.getNodePortPos(thread.sourceId, 'out');
           this._drawSrc = { nodeId: thread.sourceId, kind: 'out', x: pt.x, y: pt.y };
           this._drawMouseX = pt.x; this._drawMouseY = pt.y;
           modelDeleteThread(this._doc, thread.id);
           this.markDirty();
           // Only render threads to avoid destroying the .port-in element during drag
           this.renderThreads();
        }
        this._pendingDragThread = null;
        this._pendingDragStart = null;
      }
      // fall through to allow draw line to update immediately
    }

    if (this._dragging) {
      const dx = (e.clientX - this._dragging.startMX) / this._zoom;
      const dy = (e.clientY - this._dragging.startMY) / this._zoom;
      const node = getNode(this._doc, this._dragging.nodeId);
      if (node) {
        node.position.x = this._dragging.startNX + dx;
        node.position.y = this._dragging.startNY + dy;
        const card = this._nodeLayer?.querySelector(`[data-nid="${this._dragging.nodeId}"]`) as HTMLElement;
        if (card) { card.style.left = `${node.position.x}px`; card.style.top = `${node.position.y}px`; }
        this.renderThreads();
      }
    } else if (this._isPanning) {
      this._panX = e.clientX - this._panStart.x;
      this._panY = e.clientY - this._panStart.y;
      this.applyTransform();
    } else if (this._drawSrc) {
      const vpRect = this.shadowRoot!.getElementById('graph-vp')!.getBoundingClientRect();
      this._drawMouseX = (e.clientX - vpRect.left - this._panX) / this._zoom;
      this._drawMouseY = (e.clientY - vpRect.top - this._panY) / this._zoom;
      // Check for snap target
      this._drawTargetPort = this.findNearestPort(this._drawMouseX, this._drawMouseY);
      this.updateGhostLine();
      this.highlightDrawTargets();
    }
  }

  private onWinMouseUp(_e: MouseEvent) {
    if (this._pendingDragThread) {
      this.selectThread(this._pendingDragThread);
      this._pendingDragThread = null;
      this._pendingDragStart = null;
    }

    if (this._dragging) { this.markDirty(); this._dragging = null; }
    if (this._isPanning) {
      this._isPanning = false;
      this.shadowRoot?.getElementById('graph-vp')?.classList.remove('panning');
    }
    // Draw mode
    if (this._drawSrc) {
      if (this._drawTargetPort) {
        const targetNode = getNode(this._doc, this._drawTargetPort.nodeId);
        if (targetNode) {
          this.completeThread(targetNode, this._drawTargetPort.kind as any, this._drawTargetPort.slotIndex);
        } else {
          this.cancelDraw();
        }
      } else {
        this.cancelDraw();
      }
    }
  }

  private cancelDraw() {
    this._drawSrc = null;
    this._drawTargetPort = null;
    this.updateGhostLine();
    this.updateDrawHighlights();
    this.renderAll();
  }

  private findNearestPort(mx: number, my: number): PortInfo | null {
    const SNAP_R = 30; // px in canvas space, increased slightly for drop zones
    let best: PortInfo | null = null;
    let bestD = SNAP_R;

    for (const node of this._doc.nodes) {
      if (isCoil(node)) {
        const nodeEl = this._nodeLayer?.querySelector(`[data-nid="${node.id}"]`);
        if (nodeEl) {
          const dz = nodeEl.querySelector('.coil-drop-zone');
          if (dz) {
            const rect = dz.getBoundingClientRect();
            const vpRect = this.shadowRoot!.getElementById('graph-vp')!.getBoundingClientRect();
            const y = (rect.top + rect.height / 2 - vpRect.top - this._panY) / this._zoom;
            const xLeft = (rect.left - vpRect.left - this._panX) / this._zoom;
            const xRight = (rect.right - vpRect.left - this._panX) / this._zoom;
            let ds = SNAP_R + 1;
            if (mx >= xLeft - 20 && mx <= xRight + 20) {
              ds = Math.abs(my - y);
            }
            const cx = (xLeft + xRight) / 2;
            if (ds < bestD) { bestD = ds; best = { nodeId: node.id, kind: 'inherit-in', x: cx, y }; }
          }
        } else {
          const ip = this.getNodePortPos(node.id, 'in');
          const d = Math.hypot(mx - ip.x, my - ip.y);
          if (d < bestD) { bestD = d; best = { nodeId: node.id, kind: 'inherit-in', x: ip.x, y: ip.y }; }
        }
      }

      if (isWeave(node)) {
        const nodeEl = this._nodeLayer?.querySelector(`[data-nid="${node.id}"]`);
        if (nodeEl) {
          nodeEl.querySelectorAll('.wslot-drop-zone').forEach((dz) => {
            const idxStr = (dz as HTMLElement).dataset.dropSlot;
            if (idxStr !== undefined) {
              const idx = parseInt(idxStr, 10);
              const rect = dz.getBoundingClientRect();
              const vpRect = this.shadowRoot!.getElementById('graph-vp')!.getBoundingClientRect();
              const y = (rect.top + rect.height / 2 - vpRect.top - this._panY) / this._zoom;
              const xLeft = (rect.left - vpRect.left - this._panX) / this._zoom;
              const xRight = (rect.right - vpRect.left - this._panX) / this._zoom;
              // Snap horizontally anywhere within the bounds (plus some padding), use vertical distance
              let ds = SNAP_R + 1;
              if (mx >= xLeft - 20 && mx <= xRight + 20) {
                ds = Math.abs(my - y);
              }
              const cx = (xLeft + xRight) / 2;
              if (ds < bestD) { bestD = ds; best = { nodeId: node.id, kind: 'compose-slot', slotIndex: idx, x: cx, y }; }
            }
          });
          const dcDz = nodeEl.querySelector('.dc-drop-zone');
          if (dcDz) {
            const rect = dcDz.getBoundingClientRect();
            const vpRect = this.shadowRoot!.getElementById('graph-vp')!.getBoundingClientRect();
            const y = (rect.top + rect.height / 2 - vpRect.top - this._panY) / this._zoom;
            const xLeft = (rect.left - vpRect.left - this._panX) / this._zoom;
            const xRight = (rect.right - vpRect.left - this._panX) / this._zoom;
            let ds = SNAP_R + 1;
            if (mx >= xLeft - 20 && mx <= xRight + 20) {
              ds = Math.abs(my - y);
            }
            const cx = (xLeft + xRight) / 2;
            if (ds < bestD) { bestD = ds; best = { nodeId: node.id, kind: 'default-coil', x: cx, y }; }
          }
        }
      }
    }

    // Validate: can't connect to own node
    if (best && best.nodeId === this._drawSrc?.nodeId) return null;
    return best;
  }

  private highlightDrawTargets() {
    this._nodeLayer?.querySelectorAll('.gnode').forEach(card => {
      const el = card as HTMLElement;
      const nid = el.dataset.nid!;
      el.classList.remove('draw-target-valid', 'draw-target-invalid', 'drag-proximity');
      el.querySelectorAll('.wslot-drop-zone, .dc-drop-zone, .coil-drop-zone').forEach(z => z.classList.remove('snapped'));

      if (nid === this._drawSrc?.nodeId) return;
      const node = getNode(this._doc, nid);
      if (!node) return;
      
      const valid = this.isValidTarget(node);
      if (valid) {
        el.classList.add('draw-target-valid');
        const rect = el.getBoundingClientRect();
        const vpRect = this.shadowRoot!.getElementById('graph-vp')!.getBoundingClientRect();
        const nx = (rect.left + rect.width / 2 - vpRect.left - this._panX) / this._zoom;
        const ny = (rect.top + rect.height / 2 - vpRect.top - this._panY) / this._zoom;
        const dist = Math.hypot(this._drawMouseX - nx, this._drawMouseY - ny);
        if (dist < 200) el.classList.add('drag-proximity');
      } else {
        el.classList.add('draw-target-invalid');
      }
      
      if (valid && this._drawTargetPort && this._drawTargetPort.nodeId === nid) {
        el.classList.add('drag-proximity'); // forcefully expand if actively snapped
        if (this._drawTargetPort.kind === 'compose-slot') {
          el.querySelector(`.wslot-drop-zone[data-drop-slot="${this._drawTargetPort.slotIndex}"]`)?.classList.add('snapped');
        } else if (this._drawTargetPort.kind === 'default-coil') {
          el.querySelector('.dc-drop-zone')?.classList.add('snapped');
        } else if (this._drawTargetPort.kind === 'inherit-in') {
          el.querySelector('.coil-drop-zone')?.classList.add('snapped');
        }
      }
    });
  }

  private isValidTarget(node: TapestryNode): boolean {
    if (!this._drawSrc) return false;
    const src = getNode(this._doc, this._drawSrc.nodeId);
    if (!src) return false;
    // Coil → Coil: valid (inheritance)
    // Coil or Weave → Weave: valid (composition or default)
    // Weave → Coil: not supported
    if (isWeave(node)) return true;
    if (isCoil(node) && isCoil(src)) return true;
    return false;
  }

  // ── Thread creation ───────────────────────────────────────────────────────

  private completeThread(targetNode: TapestryNode, portKind: 'inherit-in' | 'compose-slot' | 'default-coil', slotIdx: number | undefined) {
    if (!this._drawSrc) return;
    const srcNode = getNode(this._doc, this._drawSrc.nodeId);
    if (!srcNode || srcNode.id === targetNode.id) { this.cancelDraw(); return; }

    if (portKind === 'inherit-in') {
      // Coil → Coil: create coil-inherit thread
      if (!isCoil(targetNode) || !isCoil(srcNode)) { this.cancelDraw(); return; }
      const thread = createThread('coil-inherit', srcNode.id, targetNode.id);
      this._doc.threads.push(thread);
      (targetNode as CoilNode).inheritanceOrder.push(thread.id);
      this.afterThreadCreate(thread.id);

    } else if (portKind === 'compose-slot') {
      // Any node → Weave: create weave-compose thread
      if (!isWeave(targetNode)) { this.cancelDraw(); return; }
      const thread = createThread('weave-compose', srcNode.id, targetNode.id);
      this._doc.threads.push(thread);
      const wn = targetNode as WeaveNode;
      if (slotIdx === undefined || slotIdx === -1) {
        wn.compositionOrder.push(thread.id); // append
      } else {
        wn.compositionOrder.splice(slotIdx, 0, thread.id); // insert at slot
      }
      this.afterThreadCreate(thread.id);

    } else if (portKind === 'default-coil') {
      // Coil → Weave default-coil port
      if (!isWeave(targetNode) || !isCoil(srcNode)) { this.cancelDraw(); return; }
      const wn = targetNode as WeaveNode;
      // Remove existing default-coil thread if any
      if (wn.defaultCoilThreadId) modelDeleteThread(this._doc, wn.defaultCoilThreadId);
      const thread = createThread('weave-default-coil', srcNode.id, targetNode.id);
      this._doc.threads.push(thread);
      wn.defaultCoilThreadId = thread.id;
      this.afterThreadCreate(thread.id);
    }
  }

  private afterThreadCreate(threadId: string) {
    this._drawSrc = null;
    this._drawTargetPort = null;
    this.markDirty();
    this.renderAll();
    this.selectThread(threadId);
  }

  // ── Selection ─────────────────────────────────────────────────────────────

  private selectNode(id: string | null) {
    this._selectedNodeId = id;
    this._selectedThreadId = null;
    this.renderNodeCards();
    this.renderThreads();
    this.renderLibrary();
    this.renderDetailPanel();
  }

  private selectThread(id: string | null) {
    this._selectedThreadId = id;
    this._selectedNodeId = null;
    this.renderNodeCards();
    this.renderLibrary();
    this.renderThreads();
    this.renderDetailPanel();
  }

  private focusNode(nodeId: string) {
    const node = getNode(this._doc, nodeId);
    if (!node) return;
    const area = this.shadowRoot?.getElementById('graph-area')?.getBoundingClientRect();
    if (!area) return;
    this._panX = area.width / 2 - node.position.x * this._zoom - 90;
    this._panY = area.height / 2 - node.position.y * this._zoom - 45;
    this.applyTransform();
  }

  // ── Detail panel ──────────────────────────────────────────────────────────

  private renderDetailPanel() {
    const panel = this.shadowRoot?.getElementById('detail-panel');
    if (!panel) return;
    if (!this._selectedNodeId && !this._selectedThreadId) {
      panel.classList.add('collapsed');
      if (this._detailInner) this._detailInner.innerHTML = `<div class="detail-ph">Select a node or thread to edit it.</div>`;
      this.unbindCoilEditorListeners();
      return;
    }
    panel.classList.remove('collapsed');
    this.unbindCoilEditorListeners();

    if (this._selectedNodeId) {
      const node = getNode(this._doc, this._selectedNodeId);
      if (!node) return;
      if (isCoil(node)) this.renderCoilDetail(node as CoilNode);
      else if (isWeave(node)) this.renderWeaveDetail(node as WeaveNode);
    } else if (this._selectedThreadId) {
      const thread = this._doc.threads.find(t => t.id === this._selectedThreadId);
      if (thread) this.renderThreadDetail(thread);
    }
  }

  // ── Coil detail — uses PPT components ────────────────────────────────────

  private _coilEditorListenId = '';
  private _coilEditorSubs: (() => void)[] = [];

  private unbindCoilEditorListeners() {
    for (const unsub of this._coilEditorSubs) unsub();
    this._coilEditorSubs = [];
    this._activeCoilId = null;
    this._activeLayerType = null;
  }

  private renderCoilDetail(node: CoilNode) {
    if (!this._detailInner) return;
    const isPrim = node.id === this._doc.primaryNodeId;
    const parents = resolvedParents(this._doc, node);

    // Short ID for EventBus channel (avoid long UUID noise)
    const shortId = node.id.substring(0, 8);
    this._coilEditorListenId = `tc-coil-${shortId}`;
    this._activeCoilId = node.id;
    
    // Pass the active listen ID to the global MIDI bridge
    const globalMidi = this.shadowRoot?.getElementById('global-midi-bridge');
    if (globalMidi) {
      globalMidi.setAttribute('emit-id', this._coilEditorListenId);
    }

    this._detailInner.innerHTML = `
      <div class="d-hdr">
        <span class="d-badge coil">Coil</span>
        <input class="d-title" id="coil-lbl-inp" value="${this.esc(node.label)}" />
        <div class="d-acts">
          <button class="d-btn prim-btn ${isPrim ? 'is-prim' : ''}" id="btn-set-prim">
            ${isPrim ? '★ Primary' : '☆ Primary'}
          </button>
          <button class="d-btn rsv" id="btn-rsv-coil">Resolve ↗</button>
          <button class="d-btn dng" id="btn-del-node">Delete</button>
          <button class="d-btn icon-only" id="btn-close-detail" title="Close Panel">✕</button>
        </div>
      </div>

      ${parents.length ? `
      <div style="padding:.4rem 1rem 0;">
        <div class="inheritance-note">
          Inherits from: ${parents.map(p => `<strong>${this.esc(p.label)}</strong>`).join(', ')}
          (connect Coils via the left port to set inheritance order)
        </div>
      </div>` : ''}

      <div class="coil-editor-wrap">
        <ppt-solfege-text-input emit-id="${this._coilEditorListenId}"></ppt-solfege-text-input>

        <ppt-coil-mixer>
          <ppt-coil>
            <ppt-grid-coordinator column-width="4em"></ppt-grid-coordinator>
            <ppt-coil-layer layer="melody">
              <ppt-coil-row>
                <ppt-phrase-editor justify="grid" listen-id="${this._coilEditorListenId}"></ppt-phrase-editor>
              </ppt-coil-row>
            </ppt-coil-layer>
            <ppt-coil-layer layer="harmony">
              <ppt-coil-row>
                <ppt-phrase-editor justify="grid" listen-id="${this._coilEditorListenId}"></ppt-phrase-editor>
              </ppt-coil-row>
            </ppt-coil-layer>
            <ppt-coil-layer layer="rhythm">
              <ppt-coil-row>
                <ppt-phrase-editor justify="grid" listen-id="${this._coilEditorListenId}"></ppt-phrase-editor>
              </ppt-coil-row>
            </ppt-coil-layer>
            <ppt-playback-scheduler></ppt-playback-scheduler>
            <ppt-tone-voice voice-id="default"></ppt-tone-voice>
          </ppt-coil>
        </ppt-coil-mixer>

        <ppt-coil-transport></ppt-coil-transport>
      </div>
    `;

    // Pre-populate the phrase editors with existing layer content.
    // We publish to the listen-id channel after a tick so the components have mounted.
    // Only populate the layer that receives the "active-phrase-editor-changed" event.
    // We do this by publishing the initial content for each layer to the shared channel,
    // triggered by selecting each row programmatically.
    setTimeout(() => {
      this.prepopulateCoilLayers(node);
    }, 80);

    // Subscribe to EventBus to capture changes and sync back to document
    const listenId = this._coilEditorListenId;
    const cb1 = (payload: any) => {
      if (!payload || payload.type !== 'phrase') return;
      const n = getNode(this._doc, this._activeCoilId ?? '');
      if (!n || !isCoil(n)) return;
      const layer = this._activeLayerType;
      if (layer) {
        (n as CoilNode).layers[layer] = payload.text ?? '';
        this.markDirty();
        // Update node card if visible
        const card = this._nodeLayer?.querySelector(`[data-nid="${n.id}"]`);
        if (card) {
          card.outerHTML = this.buildCard(n).outerHTML;
        }
      }
    };
    EventBus.subscribe(listenId, cb1);

    const cb2 = (payload: any) => {
      if (payload?.layerType) this._activeLayerType = payload.layerType;
    };
    EventBus.subscribe('layer-focus-changed', cb2);

    // Track which node's layer is active
    const cb3 = (payload: any) => {
      if (payload?.editor) {
        // Editor gained focus — pre-populate with stored text for the active layer
        const n = getNode(this._doc, this._activeCoilId ?? '');
        if (!n || !isCoil(n) || !this._activeLayerType) return;
        const text = (n as CoilNode).layers[this._activeLayerType] ?? '';
        const tokens = tokenizePhrase(text);
        EventBus.publish(listenId, { type: 'phrase', text, tokens });
      }
    };
    EventBus.subscribe('active-phrase-editor-changed', cb3);

    this._coilEditorSubs.push(
      () => EventBus.unsubscribe(listenId, cb1),
      () => EventBus.unsubscribe('layer-focus-changed', cb2),
      () => EventBus.unsubscribe('active-phrase-editor-changed', cb3)
    );

    // Bind header actions
    this._detailInner.querySelector('#coil-lbl-inp')?.addEventListener('input', e => {
      node.label = (e.target as HTMLInputElement).value;
      this.markDirty(); this.renderNodeCards(); this.renderLibrary(); this.updateStatus();
    });
    this._detailInner.querySelector('#btn-set-prim')?.addEventListener('click', () => {
      this._doc.primaryNodeId = this._doc.primaryNodeId === node.id ? undefined : node.id;
      this.markDirty(); this.renderCoilDetail(node); this.renderNodeCards(); this.updateStatus();
    });
    this._detailInner.querySelector('#btn-rsv-coil')?.addEventListener('click', () => this.actionResolve(node.id));
    this._detailInner.querySelector('#btn-close-detail')?.addEventListener('click', () => this.selectNode(null));
    this._detailInner.querySelector('#btn-del-node')?.addEventListener('click', () => {
      modelDeleteNode(this._doc, node.id); this.markDirty(); this._selectedNodeId = null; this.renderAll(); this.renderDetailPanel();
    });
  }

  /** Pre-populate phrase editors: click each row to activate it, then publish stored text. */
  private prepopulateCoilLayers(node: CoilNode) {
    const inner = this._detailInner;
    if (!inner) return;
    const layers: Array<['melody' | 'harmony' | 'rhythm', string]> = [
      ['melody', node.layers.melody ?? ''],
      ['harmony', node.layers.harmony ?? ''],
      ['rhythm', node.layers.rhythm ?? '']
    ];
    const listenId = this._coilEditorListenId;

    // Sequence: click first row (melody) → publish, then harmony, then rhythm
    // We do this by simulating clicks on the phrase editor rows
    let i = 0;
    const doNext = () => {
      if (i >= layers.length) return;
      const [layer, text] = layers[i++];
      const phraseEditors = inner.querySelectorAll('ppt-phrase-editor');
      const idx = ['melody', 'harmony', 'rhythm'].indexOf(layer);
      const pe = phraseEditors[idx] as HTMLElement | undefined;
      if (pe) {
        // Click it to make it active
        pe.click();
        // Then publish the stored content
        if (text) {
          setTimeout(() => {
            const tokens = tokenizePhrase(text);
            EventBus.publish(listenId, { type: 'phrase', text, tokens });
            setTimeout(doNext, 30);
          }, 40);
        } else {
          setTimeout(doNext, 30);
        }
      } else {
        setTimeout(doNext, 30);
      }
    };
    doNext();
  }

  // ── Weave detail ──────────────────────────────────────────────────────────

  private renderWeaveDetail(node: WeaveNode) {
    if (!this._detailInner) return;
    const isPrim = node.id === this._doc.primaryNodeId;
    const inherited = this._doc.globalKnot;

    this._detailInner.innerHTML = `
      <div class="d-hdr">
        <span class="d-badge weave">Weave</span>
        <input class="d-title" id="weave-lbl-inp" value="${this.esc(node.label)}" />
        <div class="d-acts">
          <button class="d-btn prim-btn ${isPrim ? 'is-prim' : ''}" id="btn-set-prim">
            ${isPrim ? '★ Primary' : '☆ Primary'}
          </button>
          <button class="d-btn rsv" id="btn-rsv-weave">Resolve ↗</button>
          <button class="d-btn dng" id="btn-del-node">Delete</button>
          <button class="d-btn icon-only" id="btn-close-detail" title="Close Panel">✕</button>
        </div>
      </div>
      <div class="d-body">
        <div style="font-size:.78rem;color:var(--tm);background:var(--sf2);border:1px solid var(--bd);border-radius:4px;padding:6px 10px;">
          The composition sequence and Default Coil are defined by graph connections.<br>
          Drag from any node's output (right ●) onto this Weave to add it to the sequence.
        </div>

        <div class="f-grp">
          <div class="f-lbl">Layout Mode</div>
          <select class="f-sel" id="weave-layout">
            <option value="concatenate" ${node.layout === 'concatenate' ? 'selected' : ''}>→ Concatenate (sequential)</option>
            <option value="equal-period" ${node.layout === 'equal-period' ? 'selected' : ''}>⊜ Equal Period (weighted stretch)</option>
            <option value="equal-beat" ${node.layout === 'equal-beat' ? 'selected' : ''}>♩ Equal Beat (rhythmic align)</option>
          </select>
        </div>

        <div class="f-grp">
          <div class="f-lbl">Knot <span style="color:var(--tm);font-weight:400">(partial — leave blank to inherit)</span></div>
          <div style="display:flex;flex-direction:column;gap:4px;">
            <div class="kfrow">
              <span class="kf-lbl">Do Pitch</span>
              <input class="kf-inp" id="knot-do" type="text" value="${node.knot?.doPitch ?? ''}" placeholder="${inherited.doPitch}" />
              <span class="kf-note">${!node.knot?.doPitch ? `inherits: ${inherited.doPitch}` : ''}</span>
            </div>
            <div class="kfrow">
              <span class="kf-lbl">BPM</span>
              <input class="kf-inp" id="knot-bpm" type="number" value="${node.knot?.bpm ?? ''}" placeholder="${inherited.bpm}" min="20" max="400" />
              <span class="kf-note">${!node.knot?.bpm ? `inherits: ${inherited.bpm}` : ''}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    this._detailInner.querySelector('#weave-lbl-inp')?.addEventListener('input', e => {
      node.label = (e.target as HTMLInputElement).value;
      this.markDirty(); this.renderNodeCards(); this.renderLibrary();
    });
    this._detailInner.querySelector('#btn-set-prim')?.addEventListener('click', () => {
      this._doc.primaryNodeId = this._doc.primaryNodeId === node.id ? undefined : node.id;
      this.markDirty(); this.renderWeaveDetail(node); this.renderNodeCards(); this.updateStatus();
    });
    this._detailInner.querySelector('#btn-rsv-weave')?.addEventListener('click', () => this.actionResolve(node.id));
    this._detailInner.querySelector('#btn-close-detail')?.addEventListener('click', () => this.selectNode(null));
    this._detailInner.querySelector('#btn-del-node')?.addEventListener('click', () => {
      modelDeleteNode(this._doc, node.id); this.markDirty(); this._selectedNodeId = null; this.renderAll(); this.renderDetailPanel();
    });
    this._detailInner.querySelector('#weave-layout')?.addEventListener('change', e => {
      node.layout = (e.target as HTMLSelectElement).value as any; this.markDirty(); this.renderNodeCards();
    });
    this._detailInner.querySelector('#knot-do')?.addEventListener('change', e => {
      const v = (e.target as HTMLInputElement).value.trim();
      if (!node.knot) node.knot = {};
      node.knot.doPitch = v || undefined; this.markDirty(); this.renderWeaveDetail(node); this.renderNodeCards();
    });
    this._detailInner.querySelector('#knot-bpm')?.addEventListener('change', e => {
      const v = (e.target as HTMLInputElement).value.trim();
      if (!node.knot) node.knot = {};
      node.knot.bpm = v ? parseInt(v) : undefined; this.markDirty(); this.renderWeaveDetail(node); this.renderNodeCards();
    });
  }

  // ── Thread detail ─────────────────────────────────────────────────────────

  private renderThreadDetail(thread: Thread) {
    if (!this._detailInner) return;
    const src = getNode(this._doc, thread.sourceId);
    const tgt = getNode(this._doc, thread.targetId);
    const kindLabel = { 'coil-inherit': 'Coil → Parent', 'weave-compose': 'Composition Slot', 'weave-default-coil': 'Default Coil' }[thread.kind] ?? thread.kind;

    this._detailInner.innerHTML = `
      <div class="d-hdr">
        <span class="d-badge thread">Thread</span>
        <span class="thread-endpoints">${src ? this.esc(src.label) : '?'} → ${tgt ? this.esc(tgt.label) : '?'}</span>
        <div class="d-acts">
          <button class="d-btn dng" id="btn-del-thread">Delete</button>
        </div>
      </div>
      <div class="d-body">
        <div style="font-size:.78rem;color:var(--tm);background:var(--sf2);border:1px solid var(--bd);border-radius:4px;padding:6px 10px;">
          Kind: <strong>${kindLabel}</strong>
        </div>
        <div class="f-row">
          <div class="f-grp">
            <div class="f-lbl">Resolution Mode</div>
            <select class="f-sel" id="t-res">
              <option value="stretch" ${thread.resolutionMode === 'stretch' ? 'selected' : ''}>Stretch (default)</option>
              <option value="tile" ${thread.resolutionMode === 'tile' ? 'selected' : ''}>Tile</option>
            </select>
          </div>
          <div class="f-grp">
            <div class="f-lbl">Repeat Count</div>
            <input class="f-inp" id="t-repeat" type="number" value="${thread.repeatCount}" min="1" max="99" />
          </div>
        </div>
        <div class="f-row">
          <div class="f-grp">
            <div class="f-lbl">Pitch Modification</div>
            <input class="f-inp" id="t-pitch" type="text" value="${this.esc(thread.pitchModification ?? '')}" placeholder="e.g. Ra" />
          </div>
          <div class="f-grp">
            <div class="f-lbl">Time Modification</div>
            <input class="f-inp" id="t-time" type="text" value="${this.esc(thread.timeModification ?? '')}" placeholder="e.g. -1/2" />
          </div>
        </div>
      </div>
    `;

    this._detailInner.querySelector('#btn-del-thread')?.addEventListener('click', () => {
      modelDeleteThread(this._doc, thread.id); this.markDirty(); this.selectThread(null); this.renderGraph(); this.renderLibrary();
    });
    this._detailInner.querySelector('#t-res')?.addEventListener('change', e => { thread.resolutionMode = (e.target as HTMLSelectElement).value as any; this.markDirty(); });
    this._detailInner.querySelector('#t-repeat')?.addEventListener('change', e => { thread.repeatCount = parseInt((e.target as HTMLInputElement).value) || 1; this.markDirty(); this.renderThreads(); });
    this._detailInner.querySelector('#t-pitch')?.addEventListener('change', e => { const v = (e.target as HTMLInputElement).value.trim(); thread.pitchModification = v || undefined; this.markDirty(); this.renderThreads(); });
    this._detailInner.querySelector('#t-time')?.addEventListener('change', e => { const v = (e.target as HTMLInputElement).value.trim(); thread.timeModification = v || undefined; this.markDirty(); this.renderThreads(); });
  }

  // ── Score overlay ─────────────────────────────────────────────────────────

  private actionResolve(nodeId?: string) {
    const id = nodeId ?? this._doc.primaryNodeId;
    if (!id) { this.setStatus('Set a primary node first (select a node → ☆ Primary).'); return; }
    const score = resolve(this._doc, id);
    this.renderScore(score);
  }

  private renderScore(score: ResolvedScore) {
    const ov = this.shadowRoot?.getElementById('score-ov');
    const body = this.shadowRoot?.getElementById('score-body');
    const title = this.shadowRoot?.getElementById('score-ov-title');
    if (!ov || !body || !title) return;
    title.textContent = `Resolved Score — ${score.primaryNodeLabel}`;

    if (!score.sections.length) {
      body.innerHTML = `<div class="score-empty">No sections resolved. Add layer content and connect nodes.</div>`;
    } else {
      body.innerHTML = `
        <div style="font-size:.8rem;color:var(--tm);margin-bottom:.6rem;">${score.sections.length} section${score.sections.length !== 1 ? 's' : ''} · ${score.globalDoPitch} · ${score.globalBpm} BPM</div>
        <div class="score-secs">
          ${score.sections.map((s, i) => `
            <div class="ssec">
              <div class="ssec-hdr">
                <span class="ssec-lbl">${i + 1}. ${this.esc(s.sourceNodeLabel)}</span>
                <span class="ssec-knot">${s.resolvedDoPitch}·${s.resolvedBpm}BPM</span>
                ${s.repeatCount > 1 ? `<span class="ssec-rep">×${s.repeatCount}</span>` : ''}
              </div>
              ${['melody', 'harmony', 'rhythm'].map(layer => {
                const txt = s.layers[layer as keyof typeof s.layers];
                return `<div class="slayer">
                  <div class="slayer-name">${layer}</div>
                  <div class="slayer-phrase">${this.renderSolfège(txt, '(empty)')}</div>
                </div>`;
              }).join('')}
            </div>`).join('')}
        </div>`;
    }
    ov.style.display = 'flex';
  }

  private renderSolfège(text: string | undefined, emptyText: string): string {
    if (!text) return `<span class="layer-content empty">${emptyText}</span>`;
    const tokens = tokenizePhrase(text);
    if (!tokens.length) return `<span class="layer-content empty">${emptyText}</span>`;
    let html = `<div class="solfege-inline">`;
    for (const t of tokens) {
      if (t.type === 'padding') {
        html += `<span style="padding: 0 2px; color: var(--tm);">·</span>`.repeat(t.paddingLength || 1);
      } else if (t.type === 'hold') {
        html += `<span style="padding: 0 2px; color: var(--tm);">-</span>`;
      } else if (t.type === 'glyph') {
        const d = t.diacritic ? `diacritic="${t.diacritic}"` : '';
        html += `<ppt-uniform-solfege solfege="${t.raw || t.solfege}" ${d} size="1.2em"></ppt-uniform-solfege>`;
        if (t.modifiers) {
          for (const m of t.modifiers) {
            const md = m.diacritic ? `diacritic="${m.diacritic}"` : '';
            html += `<ppt-uniform-solfege solfege="${m.raw || m.solfege}" ${md} size="0.75em" style="opacity:0.8;"></ppt-uniform-solfege>`;
          }
        }
      }
    }
    html += `</div>`;
    return html;
  }

  private hideScore() {
    const ov = this.shadowRoot?.getElementById('score-ov');
    if (ov) ov.style.display = 'none';
  }

  // ── CRUD ─────────────────────────────────────────────────────────────────

  private addNode(kind: 'coil' | 'weave') {
    const node = kind === 'coil' ? createCoilNode() : createWeaveNode();
    if (this._doc.nodes.length) {
      const last = this._doc.nodes[this._doc.nodes.length - 1];
      node.position = { x: last.position.x + 30, y: last.position.y + 40 };
    }
    this._doc.nodes.push(node);
    if (!this._doc.primaryNodeId) this._doc.primaryNodeId = node.id;
    this.markDirty(); this.renderAll(); this.selectNode(node.id);
  }

  // ── Document actions ──────────────────────────────────────────────────────

  private actionNew() {
    if (this._isDirty && !confirm('Unsaved changes — create a new document anyway?')) return;
    this._doc = createDocument(); this._selectedNodeId = null; this._selectedThreadId = null;
    this._isDirty = false; this.resetView(); this.renderAll(); this.renderDetailPanel();
  }

  private async actionOpen() {
    try {
      this._doc = await loadDocumentFromFile();
      this._selectedNodeId = null; this._selectedThreadId = null; this._isDirty = false;
      this.resetView(); this.renderAll(); this.renderDetailPanel();
      this.setStatus(`Opened: ${this._doc.title}`);
    } catch (e) {
      if ((e as Error).message !== 'No file selected') this.setStatus('Could not open file.');
    }
  }

  private actionSave() {
    downloadDocument(this._doc); saveToLocalStorage(this._doc);
    this._isDirty = false; this.updateStatus();
    this.setStatus(`Saved: ${this._doc.title}`);
  }

  private async renameDoc() {
    const t = prompt('Rename document:', this._doc.title);
    if (t && t !== this._doc.title) { this._doc.title = t; this.markDirty(); this.syncDocTitleUI(); }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private markDirty() { this._isDirty = true; scheduleAutoSave(this._doc); this.updateStatus(); }

  private setStatus(msg: string) {
    const el = this.shadowRoot?.getElementById('status-msg');
    if (el) { el.textContent = msg; setTimeout(() => { if (el.textContent === msg) el.textContent = 'Ready'; }, 4000); }
  }

  private toggleTheme() {
    this._isDark = !this._isDark;
    localStorage.setItem('ppt-theme', this._isDark ? 'dark' : 'light');
    const root = this.shadowRoot?.querySelector('.root');
    this._isDark ? root?.classList.add('dark') : root?.classList.remove('dark');
    window.dispatchEvent(new CustomEvent('ppt-theme-changed', { detail: { isDark: this._isDark }, bubbles: true, composed: true }));
  }

  private esc(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}

if (!customElements.get('ppt-tapestry-composer-app')) {
  customElements.define('ppt-tapestry-composer-app', TapestryComposerApp);
}
