import { BasePPTComponent } from "./BasePPTComponent";
import type { PitchTuningConfig, ParsedPitch } from "./pitchUtils";
import { mapPitchesToRatios, parsePitch, pitchToMidi } from "./pitchUtils";
import type { NoteDef } from "./lib/primeLatticeProfiler.js";
import { analyzeChord, Fraction } from "./lib/primeLatticeProfiler.js";

export class HarmonicProfilerApp extends BasePPTComponent {
  private _isRendered = false;
  private _chords: {
    raw: string;
    label: string;
    notes: NoteDef[];
    tuningConfig: PitchTuningConfig;
  }[] = [];
  private _jndCents = 15;
  private _maxDepth = 2;
  private _sigmaMultiplier = 3;
  private _filterSameTone = false;
  private _partialCount = 5;
  private _activeWalkthrough: { chordIndex: number; label: string } | null =
    null;
  private _isGraphicalAnalysisOpen = false;
  private _compareMode = false;
  private _selectedCompareCells: { chordIndex: number; label: string }[] = [];
  private _colors = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
  ];

  private _currentTablePage = 0;
  private _currentGraphPage = 0;
  private _currentWalkthroughPage = 0;
  private _isAddChordOpen = false;
  private _isTablePaginated = false;
  private _tableWindowSize = 1;
  private _isWalkthroughPaginated = false;
  private _resizeObserver: ResizeObserver | null = null;

  private _dom = {
    input: null as HTMLInputElement | null,
    tableContainer: null as HTMLElement | null,
    walkthroughPanel: null as HTMLElement | null,
    walkthroughContent: null as HTMLElement | null,
  };

  private renderRadarChart(chordResults: Map<string, any>[]) {
    const allChords = this._chords.map((c, i) => ({
      chord: c,
      res: chordResults[i],
      index: i,
    }));
    const plottedChords = allChords.filter((x) => (x.chord as any).isPlotted);

    const container = this.shadowRoot?.querySelector(
      "#graphical-analysis-section",
    ) as HTMLElement;
    const svgFamilies = this.shadowRoot?.querySelector(
      "#radar-chart-families",
    ) as SVGSVGElement;
    const svgSums = this.shadowRoot?.querySelector(
      "#radar-chart-sums",
    ) as SVGSVGElement;
    const legend = this.shadowRoot?.querySelector(
      "#radar-chart-legend",
    ) as HTMLElement;

    if (!container || !svgFamilies || !svgSums || !legend) return;

    if (allChords.length === 0 || !this._isGraphicalAnalysisOpen) {
      container.style.display = "none";
      return;
    }

    container.style.display = "block";

    const header = this.shadowRoot?.querySelector(
      ".walkthrough-header",
    ) as HTMLElement;
    if (header) {
      header.style.display = "flex";
      const title = header.querySelector("#walkthrough-title");
      if (title) title.innerHTML = "Prime Family Profiles";
    }
    if (this._dom.walkthroughContent)
      this._dom.walkthroughContent.style.display = "none";

    if (this._dom.walkthroughPanel) {
      this._dom.walkthroughPanel.classList.add("active");
    }
    const primes = [
      { name: "Du (2)", match: "Du" },
      { name: "Tri (3)", match: "Tri" },
      { name: "Qui (5)", match: "Qui" },
      { name: "Sep (7)", match: "Sep" },
      { name: "Undec (11)", match: "Und" },
    ];
    chordResults.forEach((res) => {
      primes.forEach((p) => {
        let sum = 0;
        for (const [key, data] of Array.from(res.entries())) {
          if (!key.startsWith("Sum:") && key.includes(p.match)) {
            sum += data.value;
          }
        }
        res.set(`Sum: ${p.name}`, { value: sum, pairs: new Set() });
      });
    });

    const familyLabels = new Set<string>();
    const sumLabels = new Set<string>();
    chordResults.forEach((res) => {
      for (const key of res.keys()) {
        if (!key.startsWith("Sum:")) familyLabels.add(key);
        else sumLabels.add(key);
      }
    });

    const sortLabels = (labels: Set<string>) =>
      Array.from(labels).sort((a, b) => {
        const matchA = a.match(/\((\d+)\)/);
        const matchB = b.match(/\((\d+)\)/);
        if (matchA && matchB) {
          return parseInt(matchA[1], 10) - parseInt(matchB[1], 10);
        }
        if (a.length !== b.length) return a.length - b.length;
        return a.localeCompare(b);
      });

    const drawSvg = (svg: SVGSVGElement, axes: string[], rMax: number) => {
      const cx = 0;
      const cy = 0;
      const n = axes.length;
      if (n === 0) {
        svg.innerHTML = "";
        return;
      }

      let html = "";
      const levels = 4;
      for (let l = 1; l <= levels; l++) {
        const r = (rMax / levels) * l;
        let points = "";
        for (let i = 0; i < n; i++) {
          const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
          points += `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)} `;
        }
        html += `<polygon points="${points.trim()}" fill="none" stroke="#e5e7eb" stroke-width="1"></polygon>`;
      }

      axes.forEach((label, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const x = cx + rMax * Math.cos(angle);
        const y = cy + rMax * Math.sin(angle);
        html += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#e5e7eb" stroke-width="1"></line>`;

        const lx = cx + (rMax + 20) * Math.cos(angle);
        const ly = cy + (rMax + 20) * Math.sin(angle);

        const isPure = !label.includes(" ");
        const weight = isPure ? "bold" : "normal";

        html += `<text x="${lx}" y="${ly}" font-size="10" font-family="sans-serif" font-weight="${weight}" fill="#6b7280" text-anchor="middle" dominant-baseline="middle">${label.replace("Sum: ", "")}</text>`;
      });

      let maxVal = 0.01;
      plottedChords.forEach((pc) => {
        axes.forEach((axis) => {
          maxVal = Math.max(maxVal, pc.res.get(axis)?.value || 0);
        });
      });

      plottedChords.forEach((pc) => {
        const color = this._colors[pc.index % this._colors.length];
        let purePoints = "";
        let compPoints = "";

        axes.forEach((axis, i) => {
          const val = pc.res.get(axis)?.value || 0;
          const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
          const isPure = !axis.includes(" ");

          const logScale = (v: number) => Math.log10(v + 1);
          const scaledMax = logScale(maxVal);

          const rComp = scaledMax > 0 ? (logScale(val) / scaledMax) * rMax : 0;
          compPoints += `${cx + rComp * Math.cos(angle)},${cy + rComp * Math.sin(angle)} `;

          if (isPure) {
            const rPure =
              scaledMax > 0 ? (logScale(val) / scaledMax) * rMax : 0;
            purePoints += `${cx + rPure * Math.cos(angle)},${cy + rPure * Math.sin(angle)} `;
          }
        });

        html += `<polygon points="${purePoints.trim()}" fill="${color}" fill-opacity="0.3" stroke="${color}" stroke-width="2"></polygon>`;
        html += `<polygon points="${compPoints.trim()}" fill="none" stroke="${color}" stroke-width="2" stroke-dasharray="4 2"></polygon>`;
      });

      svg.innerHTML = html;
    };

    drawSvg(svgFamilies, sortLabels(familyLabels), 100);
    drawSvg(svgSums, sortLabels(sumLabels), 100);

    const getTuningString = (config: PitchTuningConfig) => {
      const g = (val: string) => val[0];
      return `${g(config.m2)}${g(config.M2)}${g(config.m3)}${g(config.M3)} - ${g(config.P4)}${g(config.TT)}${g(config.P5)} - ${g(config.m6)}${g(config.M6)}${g(config.m7)}${g(config.M7)}`;
    };
    const rs = (phrase: string) =>
      phrase
        .split(" ")
        .map(
          (t) => `<ppt-uniform-solfege solfege="${t}"></ppt-uniform-solfege>`,
        )
        .join(" ");

    let legendHtml = "";
    allChords.forEach((pc) => {
      const color = this._colors[pc.index % this._colors.length];
      const isPlotted = (pc.chord as any).isPlotted;
      legendHtml += `<div class="legend-card" data-idx="${pc.index}" style="
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
        padding: 0.75rem 1rem;
        border: 1px solid var(--border-color);
        border-top: 4px solid ${isPlotted ? color : "transparent"};
        border-radius: 6px;
        background: var(--panel-bg);
        width: 100%;
        box-sizing: border-box;
        cursor: pointer;
        opacity: ${isPlotted ? "1" : "0.4"};
        transition: opacity 0.2s;
      ">
        <div style="font-weight: 600;">${rs(pc.chord.label)}</div>
        <div style="font-family: monospace; font-size: 0.85em; color: #64748b;">${getTuningString(pc.chord.tuningConfig)}</div>
      </div>`;
    });
    legend.innerHTML = legendHtml;

    legend.querySelectorAll(".legend-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        const idx = parseInt(
          (e.currentTarget as HTMLElement).getAttribute("data-idx") || "0",
          10,
        );
        const c = this._chords[idx] as any;
        c.isPlotted = !c.isPlotted;
        this.recalculateAll();
      });
    });

    const pager = this.shadowRoot?.querySelector("#graph-pager") as HTMLElement;
    if (pager) {
      pager.innerHTML = `
        <span class="pager-dot ${this._currentGraphPage === 0 ? "active" : ""}" data-page="0"></span>
        <span class="pager-dot ${this._currentGraphPage === 1 ? "active" : ""}" data-page="1"></span>
      `;
      pager.querySelectorAll(".pager-dot").forEach((el) =>
        el.addEventListener("click", (e) => {
          this._currentGraphPage = parseInt(
            (e.target as HTMLElement).getAttribute("data-page") || "0",
            10,
          );
          this.renderRadarChart(chordResults);
        }),
      );
    }

    const famContainer = this.shadowRoot?.querySelector(
      "#radar-families-container",
    ) as HTMLElement;
    const sumContainer = this.shadowRoot?.querySelector(
      "#radar-sums-container",
    ) as HTMLElement;
    if (famContainer)
      famContainer.style.display =
        this._currentGraphPage === 0 ? "block" : "none";
    if (sumContainer)
      sumContainer.style.display =
        this._currentGraphPage === 1 ? "block" : "none";

    const title = header?.querySelector("#walkthrough-title");
    if (title)
      title.innerHTML =
        this._currentGraphPage === 0
          ? "Prime Family Profiles"
          : "Summed Context";
  }

  constructor() {
    super();
  }

  static get componentDef() {
    return {
      displayName: "Prime Harmonic Profiler",
      familyColor: "#4f46e5",
      acceptsChildren: [],
      canNestIn: ["*"],
    };
  }

  connectedCallback() {
    if (!this._isRendered) {
      this.renderSkeleton();
      this._isRendered = true;
      this.attachListeners();

      this._resizeObserver = new ResizeObserver(() => {
        this.checkPagination();
      });
      this._resizeObserver.observe(this);

      const appContainer = this.shadowRoot?.querySelector(".app-container");
      if (appContainer) {
        this._resizeObserver.observe(appContainer);
      }
    }
  }

  disconnectedCallback() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
  }

  private checkPagination() {
    if (this._chords.length === 0) return;

    let needsRender = false;

    const appContainer = this.shadowRoot?.querySelector(
      ".app-container",
    ) as HTMLElement;
    if (appContainer) {
      const requiredTableWidth = 180 + this._chords.length * 140 + 40; // 40px buffer

      // Priority 1: Collapse Add Chord Drawer if container is too small for both
      const shouldCollapseDrawer =
        appContainer.clientWidth < requiredTableWidth + 320; // 280 (drawer) + 40 (gap)
      const wasDrawerCollapsed = this.classList.contains("drawer-collapsed");

      if (shouldCollapseDrawer !== wasDrawerCollapsed) {
        if (shouldCollapseDrawer) {
          this.classList.add("drawer-collapsed");
        } else {
          this.classList.remove("drawer-collapsed");
          this._isAddChordOpen = false;
          this.shadowRoot
            ?.querySelector("#add-column-panel")
            ?.classList.remove("open");
        }
      }

      // Priority 2: Paginate Table if it STILL doesn't fit even with drawer state applied
      const availableTableWidth = shouldCollapseDrawer
        ? appContainer.clientWidth - 40
        : appContainer.clientWidth - 320;

      let windowSize = Math.floor((availableTableWidth - 180 - 40) / 140);
      windowSize = Math.max(1, windowSize);
      const shouldPaginate =
        availableTableWidth > 0 && windowSize < this._chords.length;

      if (
        shouldPaginate !== this._isTablePaginated ||
        windowSize !== this._tableWindowSize
      ) {
        this._isTablePaginated = shouldPaginate;
        this._tableWindowSize = windowSize;
        needsRender = true;
      }

      const maxPage = Math.max(
        0,
        Math.ceil(this._chords.length / windowSize) - 1,
      );
      if (shouldPaginate && this._currentTablePage > maxPage) {
        this._currentTablePage = maxPage;
        needsRender = true;
      }
    }

    const wtContainer = this.shadowRoot?.querySelector(
      "#walkthrough-content",
    ) as HTMLElement;
    if (wtContainer && this._activeWalkthrough) {
      const isNarrow =
        wtContainer.clientWidth < 600 && wtContainer.clientWidth > 0;
      if (isNarrow !== this._isWalkthroughPaginated) {
        this._isWalkthroughPaginated = isNarrow;
        needsRender = true;
      }
    }

    if (needsRender) {
      this.renderTable();
      if (this._activeWalkthrough) {
        this.openWalkthrough(
          this._activeWalkthrough.chordIndex,
          this._activeWalkthrough.label,
        );
      }
    }
  }

  private renderSkeleton() {
    if (!this.shadowRoot) return;

    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: block;
        width: 100%;
        height: 100vh;
        overflow: hidden;
      }
      .app-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 1.5rem;
        gap: 2rem;
        box-sizing: border-box;
        flex: 1;
        min-width: 0;
      }
      .top-row {
        display: flex;
        flex-direction: row;
        gap: 2rem;
        min-width: 0;
        width: 100%;
        align-items: flex-start;
        justify-content: center;
        transition: all 0.3s ease-in-out;
      }
      .app-container.empty-state .top-row {
        gap: 2rem;
      }
      .analysis-panel {
        display: none; /* hidden by default */
        flex-direction: column;
        position: relative;
        transition: all 0.3s ease-in-out;
      }
      .preamble-panel {
        flex: 1;
        max-width: 500px;
        color: var(--text-color);
        font-size: 0.95rem;
        line-height: 1.5;
        transition: all 0.3s ease-in-out;
      }
      @media (max-width: 1000px) {
        .preamble-panel {
          display: none; /* simple fallback for mobile for now */
        }
        .walkthrough-panel.active {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 200;
          border-radius: 0;
          background: var(--panel-bg);
          box-sizing: border-box;
          overflow-y: auto;
        }
        :host(.walkthrough-active) #toggle-add-chord-btn,
        :host(.walkthrough-active) #toggle-settings-btn,
        :host(.walkthrough-active) #toggle-guide-btn {
          display: none !important;
        }
      }
      .add-column-panel {
        width: 280px;
        flex-shrink: 0;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 1.5rem;
        background: var(--panel-bg);
        display: flex;
        flex-direction: column;
        transition: transform 0.3s ease-in-out;
      }
      :host(.drawer-collapsed) .add-column-panel {
        position: fixed;
        top: 0;
        right: 0;
        height: 100vh;
        z-index: 100;
        transform: translateX(100%);
        border-radius: 0;
        box-shadow: -4px 0 15px rgba(0,0,0,0.1);
        margin-top: 0;
      }
      :host(.drawer-collapsed) .add-column-panel.open {
        transform: translateX(0);
      }

      #toggle-add-chord-btn {
        display: none;
        position: fixed;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        background: var(--brand-primary);
        color: white;
        border: none;
        padding: 1rem 0.5rem;
        border-radius: 8px 0 0 8px;
        cursor: pointer;
        z-index: 99;
        box-shadow: -2px 0 5px rgba(0,0,0,0.2);
        writing-mode: vertical-rl;
        text-orientation: mixed;
      }
      :host(.drawer-collapsed) #toggle-add-chord-btn {
        display: block;
      }

      #close-add-chord-btn {
        position: absolute;
        top: 1rem;
        right: 1rem;
        display: none;
      }
      :host(.drawer-collapsed) #close-add-chord-btn {
        display: block;
      }

      .pager-container {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
        flex-wrap: wrap;
      }
      .pager-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #cbd5e1;
        cursor: pointer;
        transition: background 0.2s;
      }
      .pager-dot:hover {
        background: #94a3b8;
      }
      .pager-dot.active {
        background: var(--brand-primary);
      }

      .paginated-pairs thead { display: none; }
      .paginated-pairs tbody { display: flex; flex-direction: column; gap: 1rem; }
      .paginated-pairs tr.pair-row { display: flex; flex-direction: column; border: 1px solid #cbd5e1; border-radius: 6px; padding: 0.5rem; background: #fff; }
      .paginated-pairs td { display: flex; justify-content: space-between; align-items: center; border: none !important; border-bottom: 1px solid #e5e7eb !important; padding: 8px 4px !important; text-align: right; width: auto !important; max-width: none !important; }
      .paginated-pairs td:last-child { border-bottom: none !important; }
      .paginated-pairs td::before { content: attr(data-label); font-weight: 600; text-align: left; margin-right: 1rem; color: #475569; }

      .app-container.empty-state .add-column-panel {
        border-radius: 8px;
        margin-top: 0;
      }
      .add-column-panel h2 {
        margin-top: 0;
        font-size: 1.25rem;
        margin-bottom: 1rem;
      }
      .tabs {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
        border-bottom: 1px solid var(--border-color);
      }
      .tab-btn {
        padding: 0.5rem 0.75rem;
        border: none;
        background: none;
        cursor: pointer;
        font-weight: 600;
        color: var(--text-color);
        border-bottom: 2px solid transparent;
        font-size: 0.875rem;
      }
      .tab-btn.active {
        color: var(--brand-primary);
        border-bottom: 2px solid var(--brand-primary);
      }
      .tab-content {
        display: none;
        flex: 1;
      }
      .tab-content.active {
        display: block;
      }
      .chord-btn {
        display: block;
        width: 100%;
        text-align: left;
        padding: 0.5rem;
        margin-bottom: 0.25rem;
        border: 1px solid var(--border-color);
        background: var(--panel-bg);
        color: var(--text-color);
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.875rem;
      }
      .chord-btn:hover {
        background: var(--button-hover);
      }
      .global-input-section {
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--border-color);
      }
      .modifiers-toolbar {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 0.75rem;
        padding: 0.5rem;
        background: var(--button-bg);
        border-radius: 4px;
        font-size: 0.8rem;
      }
      .modifier-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;
      }
      .mod-btn {
        padding: 0.25rem 0.5rem;
        border: 1px solid var(--border-color);
        background: var(--panel-bg);
        color: var(--text-color);
        border-radius: 4px;
        cursor: pointer;
      }
      .mod-btn:hover {
        background: var(--button-hover);
      }
      .tone-badge {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        background: var(--button-bg);
        color: var(--text-color);
        padding: 0.15rem 0.35rem;
        border-radius: 4px;
        font-weight: 500;
      }
      .tone-badge button {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        font-weight: bold;
        padding: 0 0.1rem;
      }
      .analysis-panel {
        flex: 0 1 auto;
        min-width: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        overflow-y: auto;
      }

      .preset-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      .preset-buttons button {
        background: var(--panel-bg);
        border: 1px solid var(--border-color);
        color: var(--text-color);
        padding: 0.5rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.8rem;
        flex: 1 1 45%;
      }
      .preset-buttons button:hover {
        background: var(--button-hover);
      }

      .controls {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
      }
      .control-group {
        display: flex;
        flex-direction: column;
        font-size: 0.875rem;
      }
      .control-group select {
        padding: 0.25rem;
        border-radius: 4px;
        border: 1px solid var(--border-color);
        background: var(--button-bg);
        color: var(--text-color);
        margin-top: 0.25rem;
      }

      .input-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
      }
      .input-row input {
        padding: 0.75rem;
        border: 1px solid var(--border-color);
        background: var(--button-bg);
        color: var(--text-color);
        border-radius: 4px;
        font-size: 1rem;
      }
      #add-chord-btn {
        padding: 0.75rem;
        background: var(--brand-primary);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
      }
      #add-chord-btn:hover {
        background: var(--brand-secondary);
      }

      .table-wrapper {
        flex: 1;
        overflow-x: auto;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        background: var(--panel-bg);
      }
      table {
        border-collapse: collapse;
        width: max-content;
        table-layout: fixed;
      }
      @keyframes cell-enter {
        from { opacity: 0; transform: translateY(5px); }
        to { opacity: 1; transform: translateY(0); }
      }
      th, td {
        box-sizing: border-box;
        border: 1px solid var(--border-color);
        padding: 1rem;
        text-align: center;
        vertical-align: top;
        width: 140px;
        min-width: 140px;
        max-width: 140px;
        word-wrap: break-word;
        overflow-wrap: break-word;
        animation: cell-enter 0.3s ease-out forwards;
      }
      th:first-child, td:first-child {
        width: 180px;
        min-width: 180px;
        max-width: 180px;
      }
      th {
        background: var(--button-bg);
        font-weight: 600;
      }
      .heatmap-cell {
        background-color: var(--cell-bg);
        transition: filter 0.2s;
        cursor: pointer;
      }
      .heatmap-cell:hover {
        filter: brightness(0.9);
      }
      .heatmap-cell.selected {
        outline: 2px solid currentColor;
        outline-offset: -2px;
        position: relative;
        z-index: 10;
        background-image: repeating-linear-gradient(45deg, rgba(255,255,255,0.2), rgba(255,255,255,0.2) 10px, transparent 10px, transparent 20px);
      }
      .heatmap-cell.compare-selected {
        outline: 3px dashed #10b981;
        outline-offset: -3px;
        position: relative;
        z-index: 10;
        background-image: repeating-linear-gradient(45deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.2) 10px, transparent 10px, transparent 20px);
      }
      .delete-col {
        color: #ef4444;
        cursor: pointer;
      }
      .delete-col:hover {
        text-decoration: underline;
      }

      .walkthrough-panel {
        display: none;
        border-right: 1px solid var(--border-color);
        background: var(--panel-bg);
        padding: 1.5rem;
        flex: 1;
        min-width: 380px;
        overflow-y: auto;
        height: 100%;
        box-sizing: border-box;
      }
      .walkthrough-panel.active {
        display: block;
      }
      .walkthrough-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e5e7eb;
        padding-bottom: 0.5rem;
        margin-bottom: 1rem;
      }
      .walkthrough-header h3 {
        margin: 0;
      }
      .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
      }
      .close-btn:hover {
        color: #ef4444;
      }
      .walkthrough-content code {
        background: var(--button-bg);
        color: var(--text-color);
        padding: 2px 4px;
        border-radius: 3px;
        font-size: 0.9em;
      }
      .walkthrough-content table {
        font-size: 0.9em;
      }
      .walkthrough-content th, .walkthrough-content td {
        width: auto;
        min-width: auto;
        max-width: none;
      }
      .walkthrough-content th {
        background: var(--button-bg);
      }

      .settings-drawer {
        position: fixed;
        top: 0;
        right: 0;
        height: 100vh;
        width: 450px;
        max-width: 100vw;
        background: var(--panel-bg);
        border-left: 1px solid var(--border-color);
        box-shadow: -4px 0 15px rgba(0,0,0,0.1);
        z-index: 100;
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
        padding: 2rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        color: var(--text-color);
      }
      .settings-drawer.open {
        transform: translateX(0);
      }
      #toggle-settings-btn {
        position: fixed;
        right: 0;
        bottom: 2rem;
        background: #64748b;
        color: white;
        border: none;
        padding: 1rem 0.5rem;
        border-radius: 8px 0 0 8px;
        cursor: pointer;
        z-index: 99;
        box-shadow: -2px 0 5px rgba(0,0,0,0.2);
        writing-mode: vertical-rl;
        text-orientation: mixed;
        transition: transform 0.2s;
      }
      #toggle-settings-btn:hover {
        background: #475569;
      }

      #toggle-guide-btn {
        position: fixed;
        right: 0;
        bottom: 9rem;
        background: var(--brand-secondary, #64748b);
        color: white;
        border: none;
        padding: 1rem 0.5rem;
        border-radius: 8px 0 0 8px;
        cursor: pointer;
        z-index: 99;
        box-shadow: -2px 0 5px rgba(0,0,0,0.2);
        writing-mode: vertical-rl;
        display: none;
        text-orientation: mixed;
        transition: transform 0.2s;
      }
      #toggle-guide-btn:hover {
        background: #475569;
      }

      .preamble {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        text-align: center;
        color: var(--text-color);
        opacity: 0.8;
        max-width: 600px;
        margin: 0 auto;
      }

      .app-container.empty-state .top-row {
        justify-content: center;
      }
      .app-container.empty-state .add-column-panel {
        border-left: none;
        padding-left: 0;
        border: 1px solid var(--border-color);
        padding: 1.5rem;
        border-radius: 8px;
        background: var(--panel-bg);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
      .app-container.empty-state .analysis-panel {
        display: none;
      }

      .col-controls {
        display: inline-flex;
        gap: 6px;
      }
      .col-control-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border: 1px solid var(--border-color);
        background: transparent;
        color: var(--text-muted);
        border-radius: 4px;
        cursor: pointer;
        padding: 0;
        transition: all 0.2s;
      }
      .col-control-btn:hover {
        background: var(--bg-hover, rgba(255,255,255,0.1));
        color: var(--text-color);
      }
      .col-control-btn svg {
        pointer-events: none;
      }
    `;

    const rs = (phrase: string) =>
      phrase
        .split(" ")
        .map(
          (t) => `<ppt-uniform-solfege solfege="${t}"></ppt-uniform-solfege>`,
        )
        .join(" ");

    const html = `

      <ppt-application app-title="Prime Harmonic Profiler">
        <button id="toggle-settings-btn">⚙️ Settings</button>
        <button id="toggle-guide-btn">ℹ️ Guide</button>
        <div class="settings-drawer" id="settings-drawer">
          <div style="display:flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h3 style="margin: 0;">Perceptual Settings</h3>
            <button id="close-settings-btn" class="close-btn" style="position: absolute; top: 1rem; right: 1rem;">&times;</button>
          </div>

          <p style="font-size: 0.8rem; color: var(--text-color); opacity: 0.8; margin-bottom: 1.25rem; line-height: 1.5;">
            These parameters shape how the algorithm models human auditory perception. They do not change the tuning of the chord — they control how strictly the profiler treats near-rational partial interactions as meaningful harmonic events.
          </p>

          <div class="control-group" style="display: flex; flex-direction: column; gap: 0.4rem; margin-top: 0.75rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
            <label style="font-weight: 600;">JND Tolerance <span style="font-weight: 400; font-size: 0.8em;">(cents)</span></label>
            <input type="number" id="jnd-input" value="15" min="0" max="50" style="padding: 0.5rem; max-width: 100px;">
            <span style="font-size: 0.78rem; color: var(--text-color); opacity: 0.75; line-height: 1.5;">
              The <em>Just Noticeable Difference</em> is the smallest pitch interval a listener can reliably perceive as "out of tune". When two partials fall within this window of a pure rational ratio, the profiler treats them as contributing to that relationship. A value of 15–20 cents is physiologically typical. Setting it to 0 means only perfectly pure ratios count — effectively disabling snapping for tempered tunings like 12TET.
            </span>
          </div>

          <div class="control-group" style="display: flex; flex-direction: column; gap: 0.4rem; margin-top: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
            <label style="font-weight: 600;">Perceptual Sharpness <span style="font-weight: 400; font-size: 0.8em;">(sigma &sigma;)</span></label>
            <input type="number" id="sigma-input" value="3" min="1" max="10" step="0.1" style="padding: 0.5rem; max-width: 100px;">
            <span style="font-size: 0.78rem; color: var(--text-color); opacity: 0.75; line-height: 1.5;">
              Controls the steepness of the Gaussian weight curve centred on each pure ratio. A <strong>higher sigma</strong> means energy drops off sharply — only near-perfect matches carry weight. A <strong>lower sigma</strong> produces a broader, more forgiving curve where slightly mistuned partials still contribute meaningfully. Think of it as controlling how "tolerant" the auditory system is to impurity.
            </span>
          </div>

          <div class="control-group" style="display: flex; flex-direction: column; gap: 0.4rem; margin-top: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
            <label style="font-weight: 600; display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
              <input type="checkbox" id="filter-same-tone-input">
              Filter out same-tone partial pairs
            </label>
            <span style="font-size: 0.78rem; color: var(--text-color); opacity: 0.75; line-height: 1.5;">
              When enabled, the profiler ignores interference between partials that originate exclusively from the same fundamental tone. This isolates harmonic interactions <em>between</em> different notes of the chord rather than internal resonances of a single string/pipe.
            </span>
          </div>

          <div class="control-group" style="display: flex; flex-direction: column; gap: 0.4rem; margin-top: 1rem;">
            <label style="font-weight: 600;">Partial Depth</label>
            <input type="number" id="depth-input" value="2" min="1" max="4" style="padding: 0.5rem; max-width: 100px;">
            <span style="font-size: 0.78rem; color: var(--text-color); opacity: 0.75; line-height: 1.5;">
              How many levels of the harmonic series are generated per tone. At <strong>Depth 1</strong>, only the direct overtones of each fundamental are considered (partials 1, 2, 3, …). At <strong>Depth 2</strong>, each of those partials also spawns its own sub-partials — modelling the real acoustic behaviour of instruments where upper harmonics are themselves resonant bodies. Deeper recursion surfaces more subtle prime relationships but decays rapidly in acoustic power (each additional level is weighted by 1/n²). Depth 3–4 may be slow for large chords.
            </span>
          </div>

          <div class="control-group" style="display: flex; flex-direction: column; gap: 0.4rem; margin-top: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
            <label style="font-weight: 600;">Partial Count</label>
            <input type="number" id="count-input" value="5" min="2" max="16" style="padding: 0.5rem; max-width: 100px;">
            <span style="font-size: 0.78rem; color: var(--text-color); opacity: 0.75; line-height: 1.5;">
              How many partials are generated at each depth level. Increasing this includes higher harmonics (e.g., 7th, 9th, 11th) but grows exponentially with depth.
            </span>
          </div>
        </div>

        <div class="settings-drawer" id="guide-drawer">
          <div style="display:flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h3 style="margin: 0;">Guide</h3>
            <button id="close-guide-btn" class="close-btn" style="position: absolute; top: 1rem; right: 1rem;">&times;</button>
          </div>
          <div id="guide-content-container" style="overflow-y: auto; max-height: calc(100vh - 80px); padding-right: 0.5rem; font-size: 0.95rem; line-height: 1.5;">
            <!-- content copied via JS -->
          </div>
        </div>

        <div class="layout-wrapper" style="display: flex; flex-direction: row; height: 100%; overflow: hidden;">
          <div class="sidebar-panel walkthrough-panel" id="walkthrough-panel">

            <div class="walkthrough-header">
              <div style="display: flex; align-items: center; gap: 1rem;">
                <h3 id="walkthrough-title" style="margin: 0;">Algorithm Walkthrough</h3>
                <button id="copy-json-btn" class="icon-btn" title="Copy JSON" style="display: none; padding: 4px; cursor: pointer; background: transparent; border: none; color: #64748b;">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M16 1H4C2.9 1 2 1.9 2 3v14h2V3h12V1zm3 4H8C6.9 5 6 5.9 6 7v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                </button>
              </div>
              <button class="close-btn" id="close-walkthrough">&times;</button>
            </div>

            <div id="graphical-analysis-section" style="margin-bottom: 2rem; display: none;">
              <div id="graph-pager" class="pager-container" style="margin-top: 1rem;"></div>
              <div id="radar-chart-legend" style="margin-top: 1.5rem; margin-bottom: 1.5rem; font-size: 0.85rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; width: 100%;"></div>
              <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
                <div id="radar-families-container" style="width: 100%; aspect-ratio: 1/1; margin: 0.5rem auto;">
                  <svg id="radar-chart-families" width="100%" height="100%" viewBox="-135 -135 270 270" style="overflow: visible;"></svg>
                </div>
                <div id="radar-sums-container" style="width: 100%; aspect-ratio: 1/1; margin: 0.5rem auto; display: none;">
                  <svg id="radar-chart-sums" width="100%" height="100%" viewBox="-135 -135 270 270" style="overflow: visible;"></svg>
                </div>
              </div>
            </div>

            <div class="walkthrough-content" id="walkthrough-content"></div>
          </div>

          <div class="app-container empty-state" id="main-app-container" style="flex: 1; max-width: 100%; overflow-y: auto; transition: max-width 0.3s ease;">
          <div class="top-row">
            <div class="preamble-panel" id="preamble-left">
              <h1 style="margin-top:0; font-size: 1.5rem; color: var(--brand-primary);">Harmonic Profiles</h1>

              <p style="line-height: 1.6;">Every sustained musical tone produces a <strong>harmonic series</strong> — a cascade of frequencies above the fundamental, each a whole-number multiple of it. The 2nd partial is an octave, the 3rd a perfect twelfth, the 5th a major third several octaves up, and so on. These relationships are not conventions; they are acoustic physics.</p>

              <p style="line-height: 1.6;">Prime Period Theory (PPT) observes that every meaningful interval ratio reduces to a product of prime numbers — and that each prime family (Du = 2-prime, Tri = 3-prime, Qui = 5-prime, etc.) describes a structurally distinct <em>type</em> of interval relationship. A perfect fifth (3/2) belongs to both Du and Tri families; a pure major third (5/4) to Du and Qui.</p>

              <p style="line-height: 1.6;">The <strong>Harmonic Profiler</strong> uses this lens to evaluate chords. Rather than scoring just the fundamentals, it models the complete set of partials each tone generates (recursively, to a configurable depth), then examines every pair of partials across all tones. For each pair, it determines which prime family their ratio belongs to and how strongly they interact — weighted by their acoustic amplitude. The result is a <strong>prime harmonic profile</strong>: a multi-dimensional fingerprint of the chord's structural character, broken down by prime family.</p>

              <p style="line-height: 1.6;">Because this process is sensitive to tuning, register, and voicing, a major chord does <em>not</em> always produce the same profile. A major triad in close root position sounds different from one spread across three octaves — the partials of each voicing interact at different distances, producing different prime-family weightings. Similarly, the same chord in pure 5-limit intonation and in 12-tone equal temperament will show measurably different profiles, because the partials no longer land at exactly rational intervals in 12TET.</p>

              <p style="line-height: 1.6; font-size: 0.9em; opacity: 0.8;">PPT is a <em>descriptive</em> framework, not a prescriptive one. A higher value in one prime family column is not inherently "better" — it means the chord structurally emphasises that prime relationship more heavily. Use the profiler to understand <em>what</em> a chord is doing, not to rank it.</p>
            </div>

            <div class="analysis-panel" id="analysis-panel">
              <div class="table-toolbar" style="display: flex; gap: 0.5rem; justify-content: center; width: 100%;">
                <button class="icon-btn" id="compare-mode-btn" title="Compare Cells" style="padding: 4px; cursor: pointer; background: transparent; border: none; color: #64748b; transition: color 0.2s;">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M9.01 14H2v2h7.01v3L13 15l-3.99-4v3zm5.98-1v-3H22V8h-7.01V5L11 9l3.99 4z"/></svg>
                </button>
                <button class="icon-btn" id="open-graph-btn" title="Graphical Analysis" style="padding: 4px; cursor: pointer; background: transparent; border: none; color: #64748b;">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
                </button>
                <button class="icon-btn" id="copy-table-json-btn" title="Copy JSON" style="padding: 4px; cursor: pointer; background: transparent; border: none; color: #64748b;">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M16 1H4C2.9 1 2 1.9 2 3v14h2V3h12V1zm3 4H8C6.9 5 6 5.9 6 7v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                </button>
              </div>
              <div id="table-pager" class="pager-container" style="display: none;"></div>
              <div class="table-wrapper" id="table-container"></div>
            </div>

            <button id="toggle-add-chord-btn">Add Chord</button>
            <div class="add-column-panel" id="add-column-panel">
              <div class="global-input-section" style="display:flex; flex-direction:column; gap: 0.75rem;">
                <button id="add-chord-btn" style="width: 100%; padding: 0.75rem; font-weight: 600; cursor: pointer;">Add Chord</button>

                <div class="input-row" style="display: flex; gap: 0.5rem; align-items: center;">
                  <button class="col-control-btn" id="mod-inv-down" title="Invert Down" style="width: 28px; height: 28px; flex-shrink: 0; visibility: hidden;">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><polygon points="12,20 4,8 20,8"></polygon></svg>
                  </button>

                  <input type="text" id="chord-input" style="flex:1; padding: 0.5rem; text-align: center; border: 1px solid var(--border-color); border-radius: 4px; background: transparent; color: var(--text-color);" placeholder="e.g. Do Mi So">

                  <button class="col-control-btn" id="mod-inv-up" title="Invert Up" style="width: 28px; height: 28px; flex-shrink: 0; visibility: hidden;">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><polygon points="12,4 4,16 20,16"></polygon></svg>
                  </button>
                </div>

                <div id="tone-badges" style="display:flex; justify-content:center; gap: 0.5rem; flex-wrap: wrap;">
                  <!-- Tone badges injected here -->
                </div>

                <div style="font-size: 0.75rem; font-family: monospace; color: var(--text-muted); letter-spacing: 0.5px; text-align: center;" id="active-tuning-display"></div>
              </div>

              <div class="tabs">
                <button class="tab-btn active" data-tab="chords">Chords</button>
                <button class="tab-btn" data-tab="tuning">Tuning</button>
              </div>

              <div class="tab-content active" id="tab-chords" style="text-align: center;">
                <h4 style="margin-top:0; margin-bottom: 0.5rem;">2-Tone Chords</h4>
                <button class="chord-btn" data-val="Do So">Perfect 5th (${rs("Do So")})</button>
                <button class="chord-btn" data-val="Do Mi">Major 3rd (${rs("Do Mi")})</button>
                <button class="chord-btn" data-val="Do Me">Minor 3rd (${rs("Do Me")})</button>
                <h4 style="margin-top:1rem; margin-bottom: 0.5rem;">3-Tone Chords</h4>
                <button class="chord-btn" data-val="Do Mi So">Major (${rs("Do Mi So")})</button>
                <button class="chord-btn" data-val="Do Me So">Minor (${rs("Do Me So")})</button>
                <button class="chord-btn" data-val="Do Me Fi">Diminished (${rs("Do Me Fi")})</button>
                <button class="chord-btn" data-val="Do Mi Si">Augmented (${rs("Do Mi Si")})</button>
                <button class="chord-btn" data-val="Do Re So">Sus2 (${rs("Do Re So")})</button>
                <button class="chord-btn" data-val="Do Fa So">Sus4 (${rs("Do Fa So")})</button>
                <h4 style="margin-top:1rem; margin-bottom: 0.5rem;">4-Tone Chords</h4>
                <button class="chord-btn" data-val="Do Mi So Te">Dominant 7th (${rs("Do Mi So Te")})</button>
                <button class="chord-btn" data-val="Do Mi So Ti">Major 7th (${rs("Do Mi So Ti")})</button>
                <button class="chord-btn" data-val="Do Me So Te">Minor 7th (${rs("Do Me So Te")})</button>
                <button class="chord-btn" data-val="Do Me Fi Te">Half-Diminished 7th (${rs("Do Me Fi Te")})</button>
                <button class="chord-btn" data-val="Do Me Fi La">Diminished 7th (${rs("Do Me Fi La")})</button>
              </div>

              <div class="tab-content" id="tab-tuning">
                <div class="preset-section">
                  <label style="font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem; display: block;">Presets</label>
                  <div class="preset-buttons">
                    <button id="preset-pythagorean">Pythagorean</button>
                    <button id="preset-ptolemaic">Ptolemaic</button>
                    <button id="preset-septimal">Septimal</button>
                    <button id="preset-12tet">12TET</button>
                  </div>
                </div>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 1rem 0;" />
                <div class="controls">
                  <div class="control-group"><label>m2</label><select id="tune-m2"><option value="Tri" selected>Tri (16/15)</option><option value="Du">Du (12TET)</option></select></div>
                  <div class="control-group"><label>M2</label><select id="tune-M2"><option value="Tri" selected>Tri (9/8)</option><option value="Du">Du (12TET)</option></select></div>
                  <div class="control-group"><label>m3</label><select id="tune-m3"><option value="Tri" selected>Tri (32/27)</option><option value="Qui">Qui (6/5)</option><option value="Sep">Sep (7/6)</option><option value="Du">Du (12TET)</option></select></div>
                  <div class="control-group"><label>M3</label><select id="tune-M3"><option value="Tri" selected>Tri (81/64)</option><option value="Qui">Qui (5/4)</option><option value="Du">Du (12TET)</option></select></div>
                  <div class="control-group"><label>P4</label><select id="tune-P4"><option value="Tri" selected>Tri (4/3)</option><option value="Du">Du (12TET)</option></select></div>
                  <div class="control-group"><label>TT (Fi)</label><select id="tune-TT"><option value="Tri" selected>Tri (729/512)</option><option value="Qui">Qui (45/32)</option><option value="Sep">Sep (7/5)</option><option value="Undec">Undec (11/8)</option><option value="Du">Du (12TET)</option></select></div>
                  <div class="control-group"><label>P5</label><select id="tune-P5"><option value="Tri" selected>Tri (3/2)</option><option value="Du">Du (12TET)</option></select></div>
                  <div class="control-group"><label>m6</label><select id="tune-m6"><option value="Tri" selected>Tri (128/81)</option><option value="Qui">Qui (8/5)</option><option value="Du">Du (12TET)</option></select></div>
                  <div class="control-group"><label>M6</label><select id="tune-M6"><option value="Tri" selected>Tri (27/16)</option><option value="Qui">Qui (5/3)</option><option value="Du">Du (12TET)</option></select></div>
                  <div class="control-group"><label>m7</label><select id="tune-m7"><option value="Tri" selected>Tri (16/9)</option><option value="Sep">Sep (7/4)</option><option value="Du">Du (12TET)</option></select></div>
                  <div class="control-group"><label>M7</label><select id="tune-M7"><option value="Tri" selected>Tri (243/128)</option><option value="Qui">Qui (15/8)</option><option value="Du">Du (12TET)</option></select></div>
                </div>
              </div>
            </div>

            <div class="preamble-panel" id="preamble-right">
              <h2 style="margin-top:0; font-size: 1.1rem; color: var(--brand-secondary);">How to Use</h2>

              <h3 style="font-size: 0.95rem; margin-top: 1rem; margin-bottom: 0.35rem;">Entering Chords</h3>
              <p style="line-height: 1.6;">Chords are entered using <strong>Uniform Solfège</strong> notation — the same pitch-naming system used throughout PPT. Each syllable names a pitch class relative to a tonic:
                <ppt-uniform-solfege solfege="Do"></ppt-uniform-solfege> (root),
                <ppt-uniform-solfege solfege="Re"></ppt-uniform-solfege> (major 2nd),
                <ppt-uniform-solfege solfege="Me"></ppt-uniform-solfege> (minor 3rd),
                <ppt-uniform-solfege solfege="Mi"></ppt-uniform-solfege> (major 3rd),
                <ppt-uniform-solfege solfege="So"></ppt-uniform-solfege> (perfect 5th), etc.
              </p>
              <p style="line-height: 1.6;">Type tokens space-separated into the input field, or use the preset buttons. A major triad is <strong>Do Mi So</strong>. A minor 7th chord is <strong>Do Me So Te</strong>.</p>

              <h3 style="font-size: 0.95rem; margin-top: 1rem; margin-bottom: 0.35rem;">Register, Voicing &amp; Inversions</h3>
              <p style="line-height: 1.6;">Register matters. Append a register number to any syllable to move it up or down an octave — <strong>Do Me2 So2</strong> places the third and fifth an octave higher, creating a spread voicing. The harmonic partial clouds of each tone overlap differently across registers, which directly changes which prime family interactions dominate.</p>
              <p style="line-height: 1.6;">Use the <strong>↑ / ↓ inversion arrows</strong> beside the input to cycle through inversions — rotating the lowest note to the top, or the highest note to the bottom. Compare first inversion (<strong>Mi So Do2</strong>) against root position (<strong>Do Mi So</strong>) to see how shifting the bass note redistributes harmonic gravity across prime families.</p>
              <p style="line-height: 1.6;">Spread voicings and open position chords will generally show weaker cross-partial interference (because distant partials overlap less), while close-position voicings tend to maximise interaction density.</p>

              <h3 style="font-size: 0.95rem; margin-top: 1rem; margin-bottom: 0.35rem;">Tuning</h3>
              <p style="line-height: 1.6;">Use the <strong>Tuning</strong> tab to set the intonation system for each interval class before adding a chord. The tuning determines the exact rational (or irrational, for 12TET) frequency ratio assigned to each scale degree. Switching between Ptolemaic (5-limit just intonation), Pythagorean (pure 3-limit), Septimal (7-limit), or 12TET will noticeably alter the profile, because the partial cascade changes with tuning. For example, a Pythagorean major third (81/64) lives in the Du-Tri family, while a Ptolemaic major third (5/4) is Du-Qui — a structurally different relationship.</p>

              <h3 style="font-size: 0.95rem; margin-top: 1rem; margin-bottom: 0.35rem;">Reading the Table</h3>
              <p style="line-height: 1.6;">Each column in the analysis table is a chord you have added. Each row is a prime family set (Du, Tri, Qui, Du Tri, Du Qui, etc.). The value in each cell is the total acoustic interaction power belonging to that prime family for that chord, given the current perceptual settings.</p>
              <p style="line-height: 1.6;"><strong>Click any cell</strong> to open the Algorithm Walkthrough — a full breakdown of every partial pair contributing to that family value, including their source tones, ratios, and individual weights. Use this to trace exactly <em>why</em> a chord scores the way it does.</p>
              <p style="line-height: 1.6;">Enable <strong>Compare Mode</strong> (the arrows icon) then click two cells to view a side-by-side diff of their contributing pairs — useful for understanding what structurally separates two chords or voicings in a given prime family.</p>
            </div>
            </div>
          </div>
        </div>
      </ppt-application>

    `;

    this.shadowRoot.appendChild(style);
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;

    while (wrapper.firstChild) {
      this.shadowRoot.appendChild(wrapper.firstChild);
    }

    this._dom.input = this.shadowRoot.querySelector("#chord-input");
    this._dom.tableContainer =
      this.shadowRoot.querySelector("#table-container");
    this._dom.walkthroughPanel =
      this.shadowRoot.querySelector("#walkthrough-panel");
    this._dom.walkthroughContent = this.shadowRoot.querySelector(
      "#walkthrough-content",
    );
  }

  private setPreset(config: Partial<PitchTuningConfig>) {
    for (const [key, val] of Object.entries(config)) {
      const select = this.shadowRoot?.querySelector(
        `#tune-${key}`,
      ) as HTMLSelectElement;
      if (select) {
        select.value = val;
      }
    }
    this.updateActiveTuningDisplay();
  }

  private updateActiveTuningDisplay() {
    if (!this.shadowRoot) return;
    const config: PitchTuningConfig = {
      m2: (this.shadowRoot?.querySelector("#tune-m2") as HTMLSelectElement)
        .value as any,
      M2: (this.shadowRoot?.querySelector("#tune-M2") as HTMLSelectElement)
        .value as any,
      m3: (this.shadowRoot?.querySelector("#tune-m3") as HTMLSelectElement)
        .value as any,
      M3: (this.shadowRoot?.querySelector("#tune-M3") as HTMLSelectElement)
        .value as any,
      P4: (this.shadowRoot?.querySelector("#tune-P4") as HTMLSelectElement)
        .value as any,
      TT: (this.shadowRoot?.querySelector("#tune-TT") as HTMLSelectElement)
        .value as any,
      P5: (this.shadowRoot?.querySelector("#tune-P5") as HTMLSelectElement)
        .value as any,
      m6: (this.shadowRoot?.querySelector("#tune-m6") as HTMLSelectElement)
        .value as any,
      M6: (this.shadowRoot?.querySelector("#tune-M6") as HTMLSelectElement)
        .value as any,
      m7: (this.shadowRoot?.querySelector("#tune-m7") as HTMLSelectElement)
        .value as any,
      M7: (this.shadowRoot?.querySelector("#tune-M7") as HTMLSelectElement)
        .value as any,
    };

    const c2 = config.m2.charAt(0) + config.M2.charAt(0);
    const c3 = config.m3.charAt(0) + config.M3.charAt(0);
    const c45 = config.P4.charAt(0) + config.TT.charAt(0) + config.P5.charAt(0);
    const c6 = config.m6.charAt(0) + config.M6.charAt(0);
    const c7 = config.m7.charAt(0) + config.M7.charAt(0);
    const ts = `${c2}${c3}-${c45}-${c6}${c7}`;

    const display = this.shadowRoot.querySelector("#active-tuning-display");
    if (display) {
      display.textContent = ts;
    }
    return config;
  }

  private attachListeners() {
    if (!this.shadowRoot) return;

    const tabBtns = this.shadowRoot.querySelectorAll(".tab-btn");
    const tabContents = this.shadowRoot.querySelectorAll(".tab-content");
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const target = (e.currentTarget as HTMLElement).getAttribute(
          "data-tab",
        );
        tabBtns.forEach((b) => b.classList.remove("active"));
        tabContents.forEach((c) => c.classList.remove("active"));
        btn.classList.add("active");
        this.shadowRoot
          ?.querySelector(`#tab-${target}`)
          ?.classList.add("active");
      });
    });

    const chordBtns = this.shadowRoot.querySelectorAll(".chord-btn");
    chordBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const val = (e.currentTarget as HTMLElement).getAttribute("data-val");
        if (val) {
          const input = this.shadowRoot?.querySelector(
            "#chord-input",
          ) as HTMLInputElement;
          if (input) {
            let tokens = val.trim().split(/\s+/);
            tokens = this.normalizeRegisters(tokens);
            input.value = tokens.join(" ");
            this.updateToneBadges(input.value);
          }
        }
      });
    });

    const tuningSelects = this.shadowRoot.querySelectorAll(".controls select");
    tuningSelects.forEach((sel) => {
      sel.addEventListener("change", () => this.updateActiveTuningDisplay());
    });

    const jndInput = this.shadowRoot.querySelector(
      "#jnd-input",
    ) as HTMLInputElement;
    const depthInput = this.shadowRoot.querySelector(
      "#depth-input",
    ) as HTMLInputElement;
    const sigmaInput = this.shadowRoot.querySelector(
      "#sigma-input",
    ) as HTMLInputElement;
    const filterInput = this.shadowRoot.querySelector(
      "#filter-same-tone-input",
    ) as HTMLInputElement;
    const countInput = this.shadowRoot.querySelector(
      "#count-input",
    ) as HTMLInputElement;

    if (jndInput) jndInput.value = this._jndCents.toString();
    if (depthInput) depthInput.value = this._maxDepth.toString();
    if (sigmaInput) sigmaInput.value = this._sigmaMultiplier.toString();
    if (filterInput) filterInput.checked = this._filterSameTone;
    if (countInput) countInput.value = this._partialCount.toString();

    jndInput?.addEventListener("change", (e) => {
      this._jndCents = parseFloat((e.target as HTMLInputElement).value);
      this.recalculateAll();
    });

    depthInput?.addEventListener("change", (e) => {
      this._maxDepth = parseInt((e.target as HTMLInputElement).value, 10);
      this.recalculateAll();
    });

    sigmaInput?.addEventListener("change", (e) => {
      this._sigmaMultiplier = parseFloat((e.target as HTMLInputElement).value);
      this.recalculateAll();
    });

    filterInput?.addEventListener("change", (e) => {
      this._filterSameTone = (e.target as HTMLInputElement).checked;
      this.recalculateAll();
    });

    countInput?.addEventListener("change", (e) => {
      this._partialCount = parseInt((e.target as HTMLInputElement).value, 10);
      this.recalculateAll();
    });

    this.shadowRoot
      .querySelector("#preset-pythagorean")
      ?.addEventListener("click", () => {
        this.setPreset({
          m2: "Tri",
          M2: "Tri",
          m3: "Tri",
          M3: "Tri",
          P4: "Tri",
          TT: "Tri",
          P5: "Tri",
          m6: "Tri",
          M6: "Tri",
          m7: "Tri",
          M7: "Tri",
        });
      });
    this.shadowRoot
      .querySelector("#preset-ptolemaic")
      ?.addEventListener("click", () => {
        this.setPreset({
          m2: "Tri",
          M2: "Tri",
          m3: "Qui",
          M3: "Qui",
          P4: "Tri",
          TT: "Qui",
          P5: "Tri",
          m6: "Qui",
          M6: "Qui",
          m7: "Tri",
          M7: "Qui",
        });
      });
    this.shadowRoot
      .querySelector("#preset-septimal")
      ?.addEventListener("click", () => {
        this.setPreset({
          m2: "Tri",
          M2: "Tri",
          m3: "Sep",
          M3: "Qui",
          P4: "Tri",
          TT: "Sep",
          P5: "Tri",
          m6: "Qui",
          M6: "Qui",
          m7: "Sep",
          M7: "Qui",
        });
      });
    this.shadowRoot
      .querySelector("#preset-12tet")
      ?.addEventListener("click", () => {
        this.setPreset({
          m2: "Du",
          M2: "Du",
          m3: "Du",
          M3: "Du",
          P4: "Du",
          TT: "Du",
          P5: "Du",
          m6: "Du",
          M6: "Du",
          m7: "Du",
          M7: "Du",
        });
      });

    const triggerAddChord = () => {
      const input = this.shadowRoot?.querySelector(
        "#chord-input",
      ) as HTMLInputElement;
      if (input && input.value) {
        let tokens = input.value.trim().split(/\s+/);
        tokens = this.normalizeRegisters(tokens);
        input.value = tokens.join(" ");
        this.updateToneBadges(input.value);

        const config = this.updateActiveTuningDisplay();
        this.addChord(input.value, config);

        // Auto-close overlay & set active pager
        if (this._isAddChordOpen) {
          this._isAddChordOpen = false;
          this.shadowRoot
            ?.querySelector("#add-column-panel")
            ?.classList.remove("open");
        }
        this._currentTablePage = this._chords.length - 1;
        this.recalculateAll();
      }
    };

    this.shadowRoot
      .querySelector("#add-chord-btn")
      ?.addEventListener("click", triggerAddChord);
    this.shadowRoot
      .querySelector("#chord-input")
      ?.addEventListener("input", (e) => {
        this.updateToneBadges((e.target as HTMLInputElement).value);
      });
    this.shadowRoot
      .querySelector("#chord-input")
      ?.addEventListener("blur", (e) => {
        const input = e.target as HTMLInputElement;
        if (input.value) {
          let tokens = input.value.trim().split(/\s+/);
          tokens = this.normalizeRegisters(tokens);
          input.value = tokens.join(" ");
          this.updateToneBadges(input.value);
        }
      });
    this.shadowRoot
      .querySelector("#chord-input")
      ?.addEventListener("keydown", (e: Event) => {
        if ((e as KeyboardEvent).key === "Enter") triggerAddChord();
      });

    const toggleBtn = this.shadowRoot.querySelector("#toggle-add-chord-btn");
    const drawer = this.shadowRoot.querySelector("#add-column-panel");

    if (toggleBtn && drawer) {
      toggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this._isAddChordOpen = !this._isAddChordOpen;
        if (this._isAddChordOpen) {
          drawer.classList.add("open");
        } else {
          drawer.classList.remove("open");
        }
      });

      // Click-away listener to dismiss drawer
      document.addEventListener("click", (e) => {
        if (
          this._isAddChordOpen &&
          this.classList.contains("drawer-collapsed")
        ) {
          const path = e.composedPath();
          if (!path.includes(drawer) && !path.includes(toggleBtn)) {
            this._isAddChordOpen = false;
            drawer.classList.remove("open");
          }
        }
      });
    }

    // Inversions
    this.shadowRoot
      .querySelector("#mod-inv-up")
      ?.addEventListener("click", () => this.applyInversion("up"));
    this.shadowRoot
      .querySelector("#mod-inv-down")
      ?.addEventListener("click", () => this.applyInversion("down"));

    this.shadowRoot
      .querySelector("#close-walkthrough")
      ?.addEventListener("click", () => this.closeWalkthrough());
    this.updateActiveTuningDisplay();
    this.shadowRoot
      .querySelector("#close-settings-btn")
      ?.addEventListener("click", () => this.closeSettings());
    this.shadowRoot
      .querySelector("#toggle-settings-btn")
      ?.addEventListener("click", () => this.toggleSettings());

    this.shadowRoot
      .querySelector("#close-guide-btn")
      ?.addEventListener("click", () => this.closeGuide());
    this.shadowRoot
      .querySelector("#toggle-guide-btn")
      ?.addEventListener("click", () => this.toggleGuide());

    // Populate guide drawer with preamble content
    const pLeft =
      this.shadowRoot.querySelector("#preamble-left")?.innerHTML || "";
    const pRight =
      this.shadowRoot.querySelector("#preamble-right")?.innerHTML || "";
    const guideContainer = this.shadowRoot.querySelector(
      "#guide-content-container",
    );
    if (guideContainer) {
      guideContainer.innerHTML =
        pLeft +
        '<hr style="border:none; border-top:1px solid var(--border-color); margin: 2rem 0;"/>' +
        pRight;
    }

    // Global toolbar
    this.shadowRoot
      .querySelector("#open-graph-btn")
      ?.addEventListener("click", () => {
        this._isGraphicalAnalysisOpen = true;
        this._activeWalkthrough = null;
        this._compareMode = false;
        this._selectedCompareCells = [];
        const compareBtn = this.shadowRoot?.querySelector(
          "#compare-mode-btn",
        ) as HTMLElement;
        if (compareBtn) {
          compareBtn.style.color = "#64748b";
          compareBtn.style.backgroundColor = "transparent";
        }
        this._chords.forEach((c: any) => (c.isPlotted = true));
        this.recalculateAll();
      });

    this.shadowRoot
      .querySelector("#compare-mode-btn")
      ?.addEventListener("click", (e) => {
        this._compareMode = !this._compareMode;
        const btn = e.currentTarget as HTMLElement;
        if (this._compareMode) {
          btn.style.color = "#4f46e5";
          btn.style.backgroundColor = "#e0e7ff";
          btn.style.borderRadius = "4px";
          this._isGraphicalAnalysisOpen = false;
          this._activeWalkthrough = null;
          this._chords.forEach((c: any) => (c.isPlotted = false));
          this.recalculateAll();
        } else {
          btn.style.color = "#64748b";
          btn.style.backgroundColor = "transparent";
          this.shadowRoot
            ?.querySelectorAll(".heatmap-cell.compare-selected")
            .forEach((el) => el.classList.remove("compare-selected"));
          this._selectedCompareCells = [];
          this.closeWalkthrough();
        }
      });

    this.shadowRoot
      .querySelector("#copy-table-json-btn")
      ?.addEventListener("click", () => {
        const snapshot = this._chords.map((c: any, index: number) => {
          const res = analyzeChord(
            c.notes,
            0.02,
            this._jndCents,
            this._maxDepth,
            this._sigmaMultiplier,
            this._filterSameTone,
            this._partialCount
          );
          const weights: Record<string, number> = {};
          for (const [label, data] of res.entries()) {
            weights[label] = Number(data.value.toFixed(4));
          }

          const getTuningString = (config: any) => {
            const g = (val: string) => val[0];
            return `${g(config.m2)}${g(config.M2)}${g(config.m3)}${g(config.M3)} - ${g(config.P4)}${g(config.TT)}${g(config.P5)} - ${g(config.m6)}${g(config.M6)}${g(config.m7)}${g(config.M7)}`;
          };

          return {
            chordIndex: index + 1,
            label: c.label,
            tuningString: getTuningString(c.tuningConfig),
            primeWeights: weights,
            tuningConfig: c.tuningConfig,
          };
        });
        navigator.clipboard.writeText(JSON.stringify(snapshot, null, 2));
        const btn = this.shadowRoot?.querySelector(
          "#copy-table-json-btn",
        ) as HTMLElement;
        if (btn) {
          const origIcon = btn.innerHTML;
          btn.innerHTML = `<span style="font-size: 0.85rem; font-weight: 600; color: #10b981;">Copied!</span>`;
          setTimeout(() => (btn.innerHTML = origIcon), 2000);
        }
      });
  }

  private applyInversion(dir: "up" | "down") {
    const input = this.shadowRoot?.querySelector(
      "#chord-input",
    ) as HTMLInputElement;
    if (!input || !input.value.trim()) return;
    let tokens = input.value.trim().split(/\s+/);
    if (tokens.length < 2) return;

    if (dir === "up") {
      tokens.push(tokens.shift()!);
    } else {
      tokens.unshift(tokens.pop()!);
    }

    tokens = this.normalizeRegisters(tokens);
    input.value = tokens.join(" ");
    this.updateToneBadges(input.value);
  }

  private normalizeRegisters(tokens: string[]): string[] {
    return tokens.filter((t) => parsePitch(t) !== null);
  }

  private updateToneBadges(text: string) {
    const container = this.shadowRoot?.querySelector("#tone-badges");
    const invUp = this.shadowRoot?.querySelector("#mod-inv-up") as HTMLElement;
    const invDown = this.shadowRoot?.querySelector(
      "#mod-inv-down",
    ) as HTMLElement;

    if (!container) return;
    const tokens = text
      .trim()
      .split(/\s+/)
      .filter((t) => t.length > 0);

    if (invUp)
      invUp.style.visibility = tokens.length > 0 ? "visible" : "hidden";
    if (invDown)
      invDown.style.visibility = tokens.length > 0 ? "visible" : "hidden";

    container.innerHTML = "";

    tokens.forEach((t, i) => {
      const badge = document.createElement("div");
      badge.className = "tone-badge";
      badge.style.display = "flex";
      badge.style.alignItems = "center";
      badge.style.gap = "4px";

      const btnMinus = document.createElement("button");
      btnMinus.className = "col-control-btn";
      btnMinus.innerHTML =
        '<svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor"><polygon points="12,20 4,8 20,8"></polygon></svg>';
      btnMinus.style.width = "18px";
      btnMinus.style.height = "18px";
      btnMinus.onclick = () => this.shiftRegister(i, -1);

      const label = document.createElement("span");
      label.style.fontWeight = "600";
      const solf = document.createElement("ppt-uniform-solfege");
      solf.setAttribute("solfege", t);
      label.appendChild(solf);

      const btnPlus = document.createElement("button");
      btnPlus.className = "col-control-btn";
      btnPlus.innerHTML =
        '<svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor"><polygon points="12,4 4,16 20,16"></polygon></svg>';
      btnPlus.style.width = "18px";
      btnPlus.style.height = "18px";
      btnPlus.onclick = () => this.shiftRegister(i, 1);

      badge.appendChild(btnMinus);
      badge.appendChild(label);
      badge.appendChild(btnPlus);
      container.appendChild(badge);
    });
  }

  private shiftRegister(index: number, delta: number) {
    const input = this.shadowRoot?.querySelector(
      "#chord-input",
    ) as HTMLInputElement;
    if (!input) return;
    let tokens = input.value.trim().split(/\s+/);
    if (index >= tokens.length) return;

    const match = tokens[index].match(/^([a-zA-Z]+)(-?\d+)?$/);
    if (match) {
      const base = match[1];
      const oct = (match[2] ? parseInt(match[2], 10) : 1) + delta;
      tokens[index] = `${base}${oct !== 1 ? oct : ""}`;
      tokens = this.normalizeRegisters(tokens);
      input.value = tokens.join(" ");
      this.updateToneBadges(input.value);
    }
  }

  private addChord(rawPitches: string, tuningConfig?: PitchTuningConfig) {
    if (!tuningConfig) {
      tuningConfig = this.updateActiveTuningDisplay() || {
        m2: "Tri",
        M2: "Tri",
        m3: "Tri",
        M3: "Tri",
        P4: "Tri",
        TT: "Tri" as any,
        P5: "Tri",
        m6: "Tri",
        M6: "Tri",
        m7: "Tri",
        M7: "Tri",
      };
    }
    this._chords.push({
      raw: rawPitches,
      label: rawPitches,
      notes: [],
      tuningConfig,
      isPlotted: true,
    } as any);
    if (this._isTablePaginated) {
      this._currentTablePage = this._chords.length; // Will be clamped to maxPage in recalculateAll
    }
    this.recalculateAll();
  }

  private removeChord(index: number) {
    this._chords.splice(index, 1);
    this.recalculateAll();
  }

  public toggleSettings() {
    this.shadowRoot
      ?.querySelector("#settings-drawer")
      ?.classList.toggle("open");
    this.shadowRoot?.querySelector("#guide-drawer")?.classList.remove("open");
  }

  public closeSettings() {
    this.shadowRoot
      ?.querySelector("#settings-drawer")
      ?.classList.remove("open");
  }

  public toggleGuide() {
    this.shadowRoot?.querySelector("#guide-drawer")?.classList.toggle("open");
    this.shadowRoot
      ?.querySelector("#settings-drawer")
      ?.classList.remove("open");
  }

  public closeGuide() {
    this.shadowRoot?.querySelector("#guide-drawer")?.classList.remove("open");
  }

  private moveChordLeft(index: number) {
    if (index > 0) {
      const temp = this._chords[index - 1];
      this._chords[index - 1] = this._chords[index];
      this._chords[index] = temp;
      this.recalculateAll();
    }
  }

  private moveChordRight(index: number) {
    if (index < this._chords.length - 1) {
      const temp = this._chords[index + 1];
      this._chords[index + 1] = this._chords[index];
      this._chords[index] = temp;
      this.recalculateAll();
    }
  }

  private recalculateAll() {
    for (const chord of this._chords) {
      const rawMap = mapPitchesToRatios(chord.raw, chord.tuningConfig);
      chord.notes = rawMap.map((r) => ({
        label: r.label,
        rmult: new Fraction(r.rmult.num, r.rmult.den),
      }));
    }

    // Check pagination logic without triggering double render
    const appContainer = this.shadowRoot?.querySelector(
      ".app-container",
    ) as HTMLElement;
    if (appContainer) {
      const requiredTableWidth = 180 + this._chords.length * 140 + 40;

      const shouldCollapseDrawer =
        appContainer.clientWidth < requiredTableWidth + 320;
      const wasDrawerCollapsed = this.classList.contains("drawer-collapsed");

      if (shouldCollapseDrawer !== wasDrawerCollapsed) {
        if (shouldCollapseDrawer) {
          this.classList.add("drawer-collapsed");
        } else {
          this.classList.remove("drawer-collapsed");
          this._isAddChordOpen = false;
          this.shadowRoot
            ?.querySelector("#add-column-panel")
            ?.classList.remove("open");
        }
      }

      const availableTableWidth = shouldCollapseDrawer
        ? appContainer.clientWidth - 40
        : appContainer.clientWidth - 320;

      let windowSize = Math.floor((availableTableWidth - 180 - 40) / 140);
      windowSize = Math.max(1, windowSize);
      this._isTablePaginated =
        availableTableWidth > 0 && windowSize < this._chords.length;
      this._tableWindowSize = windowSize;

      const maxPage = Math.max(
        0,
        Math.ceil(this._chords.length / windowSize) - 1,
      );
      if (this._isTablePaginated && this._currentTablePage > maxPage) {
        this._currentTablePage = maxPage;
      }
    }

    this.renderTable();
    if (this._activeWalkthrough) {
      this.openWalkthrough(
        this._activeWalkthrough.chordIndex,
        this._activeWalkthrough.label,
      );
    }
  }

  private renderTable() {
    if (!this._dom.tableContainer) return;

    // Park the toolbar so it isn't destroyed by innerHTML
    const toolbar = this.shadowRoot?.querySelector(".table-toolbar");
    if (toolbar && this.shadowRoot) {
      this.shadowRoot.appendChild(toolbar);
    }

    const appContainer = this.shadowRoot?.querySelector("#main-app-container");
    const preambleLeft = this.shadowRoot?.querySelector(
      "#preamble-left",
    ) as HTMLElement;
    const preambleRight = this.shadowRoot?.querySelector(
      "#preamble-right",
    ) as HTMLElement;
    const analysisPanel = this.shadowRoot?.querySelector(
      "#analysis-panel",
    ) as HTMLElement;

    if (this._chords.length === 0) {
      appContainer?.classList.add("empty-state");
      if (preambleLeft) preambleLeft.style.display = "block";
      if (preambleRight) preambleRight.style.display = "block";
      if (analysisPanel) analysisPanel.style.display = "none";

      const toggleGuideBtn = this.shadowRoot?.querySelector(
        "#toggle-guide-btn",
      ) as HTMLElement;
      if (toggleGuideBtn) toggleGuideBtn.style.display = "none";
      this.closeGuide();

      this._dom.tableContainer.innerHTML = "";
      this.closeWalkthrough();
      return;
    }

    appContainer?.classList.remove("empty-state");
    if (preambleLeft) preambleLeft.style.display = "none";
    if (preambleRight) preambleRight.style.display = "none";
    if (analysisPanel) analysisPanel.style.display = "flex";

    const toggleGuideBtn = this.shadowRoot?.querySelector(
      "#toggle-guide-btn",
    ) as HTMLElement;
    if (toggleGuideBtn) toggleGuideBtn.style.display = "block";

    const chordResults = this._chords.map((c) =>
      analyzeChord(
        c.notes,
        0.02,
        this._jndCents,
        this._maxDepth,
        this._sigmaMultiplier,
        this._filterSameTone,
        this._partialCount
      ),
    );
    const startIndex = Math.min(
      this._currentTablePage * this._tableWindowSize,
      Math.max(0, this._chords.length - this._tableWindowSize),
    );
    const chordsToRender = this._isTablePaginated
      ? this._chords.slice(startIndex, startIndex + this._tableWindowSize)
      : this._chords;

    // Update Pager UI
    const pager = this.shadowRoot?.querySelector("#table-pager") as HTMLElement;
    if (pager) {
      if (
        this._isTablePaginated &&
        this._chords.length > this._tableWindowSize
      ) {
        pager.style.display = "flex";
        const numPages = Math.ceil(this._chords.length / this._tableWindowSize);
        pager.innerHTML = Array.from({ length: numPages })
          .map((_, i) => {
            const sIdx = Math.min(
              i * this._tableWindowSize,
              Math.max(0, this._chords.length - this._tableWindowSize),
            );
            return `<div class="pager-dot ${i === this._currentTablePage ? "active" : ""}" data-page="${i}" title="View Chords ${sIdx + 1} - ${Math.min(this._chords.length, sIdx + this._tableWindowSize)}"></div>`;
          })
          .join("");
      } else {
        pager.style.display = "none";
      }
    }

    const allLabels = new Set<string>();
    chordResults.forEach((res) => {
      for (const key of res.keys()) {
        allLabels.add(key);
      }
    });

    const sortedLabels = Array.from(allLabels).sort((a, b) => {
      const matchA = a.match(/\((\d+)\)/);
      const matchB = b.match(/\((\d+)\)/);
      if (matchA && matchB) {
        return parseInt(matchA[1], 10) - parseInt(matchB[1], 10);
      }
      if (a.length !== b.length) return a.length - b.length;
      return a.localeCompare(b);
    });

    const getTuningString = (config: PitchTuningConfig) => {
      const g = (val: string) => val[0];
      return `${g(config.m2)}${g(config.M2)}${g(config.m3)}${g(config.M3)} - ${g(config.P4)}${g(config.TT)}${g(config.P5)} - ${g(config.m6)}${g(config.M6)}${g(config.m7)}${g(config.M7)}`;
    };

    const getFiguredBassRatios = (notes: NoteDef[]) => {
      if (notes.length === 0) return "";
      const bass = notes[0].rmult;
      return notes
        .map((n) => {
          const ratio = n.rmult.div(bass);
          return Number.isInteger(ratio.num) && Number.isInteger(ratio.den)
            ? `${ratio.num}/${ratio.den}`
            : (ratio.num / ratio.den).toFixed(3);
        })
        .join(" : ");
    };

    const rs = (phrase: string) =>
      phrase
        .split(" ")
        .map(
          (t) => `<ppt-uniform-solfege solfege="${t}"></ppt-uniform-solfege>`,
        )
        .join(" ");

    let html = `<table><thead><tr><th id="toolbar-th-container" style="vertical-align: middle; padding: 0.5rem;"></th>`;

    html += chordsToRender
      .map((c, i) => {
        const globalIdx = this._isTablePaginated ? startIndex + i : i;
        const barColor = (c as any).isPlotted
          ? this._colors[globalIdx % this._colors.length]
          : "transparent";
        return `<th style="border-top: 4px solid ${barColor};">
      <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
        <span class="col-controls" style="display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; width: 100%; gap: 0.25rem;">
          <div style="justify-self: end;">
            ${globalIdx > 0 ? `<button class="col-control-btn move-left-col" data-idx="${globalIdx}" title="Move Left"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><polygon points="18,4 6,12 18,20"></polygon></svg></button>` : ""}
          </div>
          <button class="col-control-btn delete-col" data-idx="${globalIdx}" title="Remove Column" style="border-color: #ef4444; color: #ef4444; background: rgba(239, 68, 68, 0.05);"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
          <div style="justify-self: start;">
            ${globalIdx < this._chords.length - 1 ? `<button class="col-control-btn move-right-col" data-idx="${globalIdx}" title="Move Right"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><polygon points="6,4 18,12 6,20"></polygon></svg></button>` : ""}
          </div>
        </span>
        <div style="text-align: center; margin-top: 0.25rem;">${rs(c.label)}</div>
      </div>
      <div style="font-size: 0.75em; font-family: monospace; color: #64748b; margin-top: 0.5rem;">${getTuningString(c.tuningConfig)}</div>
      <div style="font-size: 0.75em; font-family: monospace; color: #4f46e5; margin-top: 0.25rem;">${getFiguredBassRatios(c.notes)}</div>
    </th>`;
      })
      .join("");

    html += `</tr></thead><tbody>`;

    for (const label of sortedLabels) {
      const vals = chordResults.map((res) => res.get(label)?.value || 0);
      const maxVal = Math.max(...vals);
      html += `<tr><td><strong>${label}</strong></td>`;
      const resultsToIterate = this._isTablePaginated
        ? vals.slice(startIndex, startIndex + this._tableWindowSize)
        : vals;

      for (let i = 0; i < resultsToIterate.length; i++) {
        const globalIdx = this._isTablePaginated ? startIndex + i : i;
        const val = resultsToIterate[i];
        if (val === 0) html += `<td>-</td>`;
        else {
          const opacity = maxVal > 0 ? (val / maxVal) * 0.4 : 0;
          let selectedClass = "";
          if (this._compareMode) {
            if (
              this._selectedCompareCells.some(
                (c) => c.chordIndex === globalIdx && c.label === label,
              )
            ) {
              selectedClass = " compare-selected";
            }
          } else {
            if (
              this._activeWalkthrough &&
              this._activeWalkthrough.chordIndex === globalIdx &&
              this._activeWalkthrough.label === label
            ) {
              selectedClass = " selected";
            }
          }
          html += `<td class="heatmap-cell${selectedClass}" style="background-color: rgba(79, 70, 229, ${opacity.toFixed(2)}); ${val === maxVal ? "font-weight: bold;" : ""}" data-chord="${globalIdx}" data-label="${label}">${val.toFixed(3)}</td>`;
        }
      }
      html += `</tr>`;
    }

    const primes = [
      { name: "Du (2)", match: "Du" },
      { name: "Tri (3)", match: "Tri" },
      { name: "Qui (5)", match: "Qui" },
      { name: "Sep (7)", match: "Sep" },
      { name: "Undec (11)", match: "Und" },
    ];
    html += `</tbody><tbody style="border-top: 2px solid #000;">`;
    for (const p of primes) {
      const sumVals = chordResults.map((res) => {
        let sum = 0;
        for (const [key, data] of res.entries())
          if (key.includes(p.match)) sum += data.value;
        return sum;
      });
      const maxSum = Math.max(...sumVals);

      // Hide summary row if no chords have any power for this prime family
      if (maxSum === 0) continue;

      html += `<tr><td>Sum: ${p.name} context</td>`;
      const sumsToIterate = this._isTablePaginated
        ? sumVals.slice(startIndex, startIndex + this._tableWindowSize)
        : sumVals;

      for (let i = 0; i < sumsToIterate.length; i++) {
        html += `<td style="${sumsToIterate[i] === maxSum && sumsToIterate[i] > 0 ? "font-weight: bold;" : ""}">${sumsToIterate[i] === 0 ? "-" : sumsToIterate[i].toFixed(3)}</td>`;
      }
      html += `</tr>`;
    }
    html += `</tbody></table>`;
    this._dom.tableContainer.innerHTML = html;

    const thContainer = this.shadowRoot?.querySelector("#toolbar-th-container");
    if (thContainer && toolbar) {
      thContainer.appendChild(toolbar);
    }

    this.renderRadarChart(chordResults);
    this.attachTableListeners();
  }

  private attachTableListeners() {
    this.shadowRoot?.querySelectorAll(".pager-dot").forEach((el) =>
      el.addEventListener("click", (e) => {
        const page = parseInt(
          (e.target as HTMLElement).getAttribute("data-page") || "0",
          10,
        );
        this._currentTablePage = page;
        this.renderTable();
      }),
    );

    this.shadowRoot
      ?.querySelectorAll(".delete-col")
      .forEach((el) =>
        el.addEventListener("click", (e) =>
          this.removeChord(
            parseInt(
              (e.target as HTMLElement).getAttribute("data-idx") || "0",
              10,
            ),
          ),
        ),
      );
    this.shadowRoot
      ?.querySelectorAll(".move-left-col")
      .forEach((el) =>
        el.addEventListener("click", (e) =>
          this.moveChordLeft(
            parseInt(
              (e.target as HTMLElement).getAttribute("data-idx") || "0",
              10,
            ),
          ),
        ),
      );
    this.shadowRoot
      ?.querySelectorAll(".move-right-col")
      .forEach((el) =>
        el.addEventListener("click", (e) =>
          this.moveChordRight(
            parseInt(
              (e.target as HTMLElement).getAttribute("data-idx") || "0",
              10,
            ),
          ),
        ),
      );

    this.shadowRoot?.querySelectorAll(".heatmap-cell").forEach((cell) =>
      cell.addEventListener("click", () => {
        const chordIndex = parseInt(cell.getAttribute("data-chord") || "0", 10);
        const label = cell.getAttribute("data-label") || "";

        if (this._compareMode) {
          const existingIdx = this._selectedCompareCells.findIndex(
            (c) => c.chordIndex === chordIndex && c.label === label,
          );
          if (existingIdx >= 0) {
            this._selectedCompareCells.splice(existingIdx, 1);
            cell.classList.remove("compare-selected");
          } else {
            if (this._selectedCompareCells.length < 2) {
              this._selectedCompareCells.push({ chordIndex, label });
              cell.classList.add("compare-selected");
            }
          }

          if (this._selectedCompareCells.length === 2) {
            this.openCompareWalkthrough(
              this._selectedCompareCells[0],
              this._selectedCompareCells[1],
            );
          } else {
            if (this._dom.walkthroughPanel)
              this._dom.walkthroughPanel.classList.remove("active");
          }
          return;
        }

        this.shadowRoot
          ?.querySelectorAll(".heatmap-cell")
          .forEach((c) => c.classList.remove("selected"));
        cell.classList.add("selected");

        let changed = false;
        this._chords.forEach((c) => {
          if ((c as any).isPlotted) {
            (c as any).isPlotted = false;
            changed = true;
          }
        });

        if (changed) {
          this._activeWalkthrough = { chordIndex, label };
          this.recalculateAll();
          return;
        }

        this.openWalkthrough(chordIndex, label);
      }),
    );
  }

  private openCompareWalkthrough(
    cell1: { chordIndex: number; label: string },
    cell2: { chordIndex: number; label: string },
  ) {
    const chord1 = this._chords[cell1.chordIndex];
    const chord2 = this._chords[cell2.chordIndex];
    if (!chord1 || !chord2) return;

    const radarContainer = this.shadowRoot?.querySelector(
      "#graphical-analysis-section",
    ) as HTMLElement;
    if (radarContainer) radarContainer.style.display = "none";

    const header = this.shadowRoot?.querySelector(
      ".walkthrough-header",
    ) as HTMLElement;
    if (header) {
      header.style.display = "flex";
      const title = header.querySelector("#walkthrough-title");
      if (title) title.innerHTML = "Cell Comparison";
    }

    if (this._dom.walkthroughContent)
      this._dom.walkthroughContent.style.display = "block";

    const res1 = analyzeChord(
      chord1.notes,
      0.02,
      this._jndCents,
      this._maxDepth,
      this._sigmaMultiplier,
      this._filterSameTone,
      this._partialCount
    );
    const res2 = analyzeChord(
      chord2.notes,
      0.02,
      this._jndCents,
      this._maxDepth,
      this._sigmaMultiplier,
      this._filterSameTone,
      this._partialCount
    );

    const data1 = res1.get(cell1.label);
    const data2 = res2.get(cell2.label);

    if (this._dom.walkthroughContent) {
      if (!data1 || !data2) {
        this._dom.walkthroughContent.innerHTML = `<p>Missing data for one of the cells.</p>`;
        return;
      }

      const formatProvPath = (prov: { noteIndex: number; path: number[] }) => {
        const paddedPath = [...prov.path];
        while (paddedPath.length < this._maxDepth) paddedPath.push(1);
        return `T${prov.noteIndex}.${paddedPath.map((p) => "P" + p).join(".")}`;
      };

      const getPairKey = (pair: any) => {
        const p1Str = pair.p1.provenance.map(formatProvPath).sort().join(", ");
        const p2Str = pair.p2.provenance.map(formatProvPath).sort().join(", ");
        return [p1Str, p2Str].sort().join(" ↔ ");
      };

      const formatRatio = (r: any) => {
        if (!r) return "-";
        const val = r.num / r.den;
        if (r.num < 10000 && r.den < 10000)
          return `${r.num}/${r.den} ≈ ${val.toFixed(3)}`;
        return val.toFixed(4);
      };

      const groupByRatio = (pairs: any[]) => {
        const map = new Map<string, { cw: number; keys: string[]; r: any }>();
        pairs.forEach((p) => {
          const rKey = formatRatio(p.ratio);
          const existing = map.get(rKey);
          const provKey = getPairKey(p);
          if (existing) {
            existing.cw += p.cw;
            existing.keys.push(provKey);
          } else {
            map.set(rKey, { cw: p.cw, keys: [provKey], r: p.ratio });
          }
        });
        return map;
      };

      const map1 = groupByRatio(data1.pairs);
      const map2 = groupByRatio(data2.pairs);

      const allRatioKeys = Array.from(
        new Set([...map1.keys(), ...map2.keys()]),
      );

      const rs = (phrase: string) =>
        phrase
          .split(" ")
          .map(
            (t) => `<ppt-uniform-solfege solfege="${t}"></ppt-uniform-solfege>`,
          )
          .join(" ");
      const getTuningString = (config: any) => {
        const g = (val: string) => val[0];
        return `${g(config.m2)}${g(config.M2)}${g(config.m3)}${g(config.M3)} - ${g(config.P4)}${g(config.TT)}${g(config.P5)} - ${g(config.m6)}${g(config.M6)}${g(config.m7)}${g(config.M7)}`;
      };

      let diffHtml = `
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid var(--border-color); padding-bottom: 0.75rem; margin-bottom: 0.5rem;">
            <div style="flex: 1; color: var(--prime-3);">
              <div style="font-weight: bold; margin-bottom: 0.25rem; color: var(--text-color);">Chord ${cell1.chordIndex + 1} (${cell1.label})</div>
              <div style="margin-bottom: 0.25rem; color: var(--text-color);">${rs(chord1.label)}</div>
              <div style="font-size: 0.8em; font-family: monospace; color: var(--text-muted, #64748b);">${getTuningString(chord1.tuningConfig)}</div>
            </div>
            <div style="flex: 1; color: var(--prime-5); text-align: right;">
              <div style="font-weight: bold; margin-bottom: 0.25rem; color: var(--text-color);">Chord ${cell2.chordIndex + 1} (${cell2.label})</div>
              <div style="margin-bottom: 0.25rem; color: var(--text-color);">${rs(chord2.label)}</div>
              <div style="font-size: 0.8em; font-family: monospace; color: var(--text-muted, #64748b);">${getTuningString(chord2.tuningConfig)}</div>
            </div>
          </div>
      `;

      let hasDiffs = false;
      const epsilon = 0.0001;

      const diffRows: {
        ratioKey: string;
        cw1: number;
        cw2: number;
        keys1: string[];
        keys2: string[];
      }[] = [];

      for (const rKey of allRatioKeys) {
        const d1 = map1.get(rKey);
        const d2 = map2.get(rKey);

        const cw1 = d1 ? d1.cw : 0;
        const cw2 = d2 ? d2.cw : 0;

        if (Math.abs(cw1 - cw2) > epsilon) {
          diffRows.push({
            ratioKey: rKey,
            cw1,
            cw2,
            keys1: d1 ? d1.keys : [],
            keys2: d2 ? d2.keys : [],
          });
        }
      }

      diffRows.sort((a, b) => Math.max(b.cw1, b.cw2) - Math.max(a.cw1, a.cw2));

      for (const row of diffRows) {
        hasDiffs = true;
        const { ratioKey, cw1, cw2, keys1, keys2 } = row;
        diffHtml += `
            <div style="display: flex; flex-direction: column; padding: 0.75rem; background: var(--button-bg); border-radius: 6px; border: 1px solid var(--border-color);">
              <div style="font-family: monospace; font-size: 0.85rem; color: var(--text-color); margin-bottom: 0.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.25rem;">Ratio: <strong>${ratioKey}</strong></div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem;">
                <div style="display: flex; flex-direction: column; flex: 1; text-align: left;">
                  <span style="color: ${cw1 > 0 ? "var(--prime-3)" : "#94a3b8"}; font-weight: ${cw1 > cw2 ? "bold" : "normal"}; font-size: 1.1em;">${cw1.toFixed(3)}</span>
                  <span style="font-size: 0.7rem; color: var(--text-muted, #64748b); font-family: monospace; margin-top: 4px; line-height: 1.3; max-width: 150px; word-wrap: break-word;">${keys1.join("<br>")}</span>
                </div>
                <span style="color: var(--border-color); padding-top: 0.25rem;">➔</span>
                <div style="display: flex; flex-direction: column; flex: 1; text-align: right;">
                  <span style="color: ${cw2 > 0 ? "var(--prime-5)" : "#94a3b8"}; font-weight: ${cw2 > cw1 ? "bold" : "normal"}; font-size: 1.1em;">${cw2.toFixed(3)}</span>
                  <span style="font-size: 0.7rem; color: var(--text-muted, #64748b); font-family: monospace; margin-top: 4px; line-height: 1.3; max-width: 150px; word-wrap: break-word; align-self: flex-end;">${keys2.join("<br>")}</span>
                </div>
              </div>
            </div>
          `;
      }

      if (!hasDiffs) {
        diffHtml += `<p style="color: #64748b; font-style: italic;">No differences found. All interactions are exactly duplicated.</p>`;
      }

      diffHtml += `</div>`;
      this._dom.walkthroughContent.innerHTML = diffHtml;

      const copyBtn = this.shadowRoot?.querySelector(
        "#copy-json-btn",
      ) as HTMLElement;
      if (copyBtn) {
        copyBtn.style.display = "inline-block";
        copyBtn.onclick = () => {
          const snapshot = {
            compareMode: true,
            cell1: {
              chord: chord1.label,
              tuning: chord1.tuningConfig,
              targetFamily: cell1.label,
              analysis: data1,
            },
            cell2: {
              chord: chord2.label,
              tuning: chord2.tuningConfig,
              targetFamily: cell2.label,
              analysis: data2,
            },
            diffRows: diffRows,
          };
          navigator.clipboard.writeText(JSON.stringify(snapshot, null, 2));
          const originalHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
          copyBtn.innerHTML =
            '<span style="font-size: 12px; font-weight: bold; color: #10b981;">Copied!</span>';
          setTimeout(() => (copyBtn.innerHTML = originalHTML), 2000);
        };
      }
    }

    if (this._dom.walkthroughPanel) {
      this._dom.walkthroughPanel.classList.add("active");
    }
  }

  private openWalkthrough(chordIndex: number, targetLabel: string) {
    this._activeWalkthrough = { chordIndex, label: targetLabel };
    const chord = this._chords[chordIndex];
    if (!chord) return;

    const radarContainer = this.shadowRoot?.querySelector(
      "#graphical-analysis-section",
    ) as HTMLElement;
    if (radarContainer) radarContainer.style.display = "none";

    const header = this.shadowRoot?.querySelector(
      ".walkthrough-header",
    ) as HTMLElement;
    if (header) header.style.display = "flex";
    if (this._dom.walkthroughContent)
      this._dom.walkthroughContent.style.display = "block";

    const res = analyzeChord(
      chord.notes,
      0.02,
      this._jndCents,
      this._maxDepth,
      this._sigmaMultiplier,
      this._filterSameTone,
      this._partialCount
    );
    const data = res.get(targetLabel);

    if (this._dom.walkthroughContent) {
      if (!data)
        this._dom.walkthroughContent.innerHTML = `<p>No data found for ${targetLabel}.</p>`;
      else {
        const bass = chord.notes[0]?.rmult;
        const getFiguredBass = (n: NoteDef) => {
          if (!bass) return "";
          const ratio = n.rmult.div(bass);
          if (Number.isInteger(ratio.num) && Number.isInteger(ratio.den)) {
            return `${ratio.num}/${ratio.den}`;
          }
          return (ratio.num / ratio.den).toFixed(3);
        };

        let htmlOutput = `
          <p><strong>Chord Legend:</strong> ${chord.notes.map((n, i) => `T${i + 1}: <ppt-uniform-solfege solfege="${n.label}"></ppt-uniform-solfege> (Grid: <code>${n.rmult.toKey()}</code> | Rel: <code>${getFiguredBass(n)}</code>)`).join(", ")}</p>
          <p><strong>Notation:</strong> <code>Tx${".Px".repeat(this._maxDepth)}</code> where T is the tone index, and P is the partial index (with depth padded as subpartials up to ${this._maxDepth} layer${this._maxDepth === 1 ? "" : "s"}).</p>
          <p><strong>Total ${targetLabel} Power:</strong> ${data.value.toFixed(3)}</p>
        `;

        const sortedPairs = [...data.pairs].sort((a, b) => b.cw - a.cw);

        const formatProvPath = (prov: {
          noteIndex: number;
          path: number[];
        }) => {
          const paddedPath = [...prov.path];
          while (paddedPath.length < this._maxDepth) paddedPath.push(1);
          return `T${prov.noteIndex}.${paddedPath.map((p) => "P" + p).join(".")}`;
        };

        const toneAttributions = new Map<
          number,
          { total: number; partials: Map<string, number> }
        >();
        for (const pair of sortedPairs) {
          const p1TotalW = pair.p1.provenance.reduce((s, p) => s + p.weight, 0);
          const p2TotalW = pair.p2.provenance.reduce((s, p) => s + p.weight, 0);

          for (const prov of pair.p1.provenance) {
            const share = (pair.cw / 2) * (prov.weight / p1TotalW);
            if (!toneAttributions.has(prov.noteIndex))
              toneAttributions.set(prov.noteIndex, {
                total: 0,
                partials: new Map(),
              });
            const toneData = toneAttributions.get(prov.noteIndex)!;
            toneData.total += share;
            const pathStr = formatProvPath(prov);
            toneData.partials.set(
              pathStr,
              (toneData.partials.get(pathStr) || 0) + share,
            );
          }

          for (const prov of pair.p2.provenance) {
            const share = (pair.cw / 2) * (prov.weight / p2TotalW);
            if (!toneAttributions.has(prov.noteIndex))
              toneAttributions.set(prov.noteIndex, {
                total: 0,
                partials: new Map(),
              });
            const toneData = toneAttributions.get(prov.noteIndex)!;
            toneData.total += share;
            const pathStr = formatProvPath(prov);
            toneData.partials.set(
              pathStr,
              (toneData.partials.get(pathStr) || 0) + share,
            );
          }
        }

        let breakdownHtml = `<div style="margin-top: 1rem; margin-bottom: 1rem; border: 1px solid var(--border-color); padding: 0.5rem; border-radius: 4px; background: var(--button-bg);">`;
        breakdownHtml += `<h4 style="margin-top: 0; margin-bottom: 0.5rem;">Tone Attribution Breakdown (Click partials to filter pairs)</h4>`;

        for (let i = 0; i < chord.notes.length; i++) {
          const noteIndex = i + 1;
          const label = chord.notes[i].label;
          const toneData = toneAttributions.get(noteIndex);
          if (toneData && toneData.total > 0) {
            breakdownHtml += `<details class="breakdown-details" style="margin-bottom: 0.25rem; cursor: pointer;">`;
            breakdownHtml += `<summary style="font-weight: 500;">T${noteIndex} (<ppt-uniform-solfege solfege="${label}"></ppt-uniform-solfege>): ${toneData.total.toFixed(3)}</summary>`;
            breakdownHtml += `<ul style="margin-top: 0.25rem; margin-bottom: 0.5rem; font-size: 0.9em; padding-left: 1.5rem;">`;
            const sortedPartials = Array.from(toneData.partials.entries()).sort(
              (a, b) => b[1] - a[1],
            );
            for (const [pathStr, pVal] of sortedPartials) {
              if (pVal > 0) {
                breakdownHtml += `<li class="partial-filter-item" data-partial="${pathStr}" style="cursor: pointer; padding: 2px 4px; border-radius: 4px; display: inline-block; margin-bottom: 2px;"><code>${pathStr}</code>: ${pVal.toFixed(3)}</li>`;
              }
            }
            breakdownHtml += `</ul></details>`;
          }
        }
        breakdownHtml += `</div>`;
        htmlOutput += breakdownHtml;

        let wtPagerHtml = "";
        let pairsToRender = sortedPairs;
        if (this._isWalkthroughPaginated && sortedPairs.length > 0) {
          if (this._currentWalkthroughPage >= sortedPairs.length)
            this._currentWalkthroughPage = 0;
          pairsToRender = [sortedPairs[this._currentWalkthroughPage]];
          wtPagerHtml = `
            <div class="wt-pager-controls" style="display:flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; background: var(--button-bg); padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border-color);">
              <button id="wt-prev-btn" style="padding: 4px 12px; cursor: pointer; border: 1px solid var(--border-color); border-radius: 4px; background: var(--panel-bg); color: var(--text-color);">&larr; Prev Pair</button>
              <span style="font-size: 0.9em; font-weight: 600;">Pair ${this._currentWalkthroughPage + 1} of ${sortedPairs.length}</span>
              <button id="wt-next-btn" style="padding: 4px 12px; cursor: pointer; border: 1px solid var(--border-color); border-radius: 4px; background: var(--panel-bg); color: var(--text-color);">Next Pair &rarr;</button>
            </div>
          `;
        }

        htmlOutput += `
          <p id="table-filter-indicator" style="font-weight: 600; color: var(--prime-3); margin-bottom: 0.5rem; display: none;">Currently filtering pairs involving: <code id="active-filter-code"></code></p>
          ${wtPagerHtml}
          <table style="width:100%; border-collapse:collapse; margin-top: 0.5rem;" class="${this._isWalkthroughPaginated ? "paginated-pairs" : ""}">
            <thead>
              <tr>
                <th style="border: 1px solid var(--border-color); padding: 4px 8px;">Pair Ratio</th>
                <th style="border: 1px solid var(--border-color); padding: 4px 8px;">Power</th>
                <th style="border: 1px solid var(--border-color); padding: 4px 8px;">P1 Ratio</th>
                <th style="border: 1px solid var(--border-color); padding: 4px 8px;">P1 Sources</th>
                <th style="border: 1px solid var(--border-color); padding: 4px 8px;">P2 Ratio</th>
                <th style="border: 1px solid var(--border-color); padding: 4px 8px;">P2 Sources</th>
              </tr>
            </thead>
            <tbody>
        `;

        const formatProv = (prov: {
          noteIndex: number;
          path: number[];
          weight: number;
        }) => {
          return `<code>${formatProvPath(prov)}</code> (${prov.weight.toFixed(3)})`;
        };

        for (const pair of pairsToRender) {
          const p1Sources = pair.p1.provenance.map(formatProv).join("<br>");
          const p2Sources = pair.p2.provenance.map(formatProv).join("<br>");

          const involvedPartials = new Set<string>();
          pair.p1.provenance.forEach((p) =>
            involvedPartials.add(formatProvPath(p)),
          );
          pair.p2.provenance.forEach((p) =>
            involvedPartials.add(formatProvPath(p)),
          );
          const partialsAttr = Array.from(involvedPartials).join(",");

          htmlOutput += `
            <tr class="pair-row" data-partials="${partialsAttr}">
              <td data-label="Pair Ratio" style="border: 1px solid var(--border-color); padding: 4px 8px;"><code>${pair.ratio.toKey()}</code></td>
              <td data-label="Power" style="border: 1px solid var(--border-color); padding: 4px 8px;">${pair.cw.toFixed(3)}</td>
              <td data-label="P1 Ratio" style="border: 1px solid var(--border-color); padding: 4px 8px;"><code>${pair.p1.ar.toKey()}</code></td>
              <td data-label="P1 Sources" style="border: 1px solid var(--border-color); padding: 4px 8px;">${p1Sources}</td>
              <td data-label="P2 Ratio" style="border: 1px solid var(--border-color); padding: 4px 8px;"><code>${pair.p2.ar.toKey()}</code></td>
              <td data-label="P2 Sources" style="border: 1px solid var(--border-color); padding: 4px 8px;">${p2Sources}</td>
            </tr>
          `;
        }

        htmlOutput += `</tbody></table>`;
        this._dom.walkthroughContent.innerHTML = htmlOutput;

        // Bind Walkthrough Pager events
        const wtPrevBtn =
          this._dom.walkthroughContent.querySelector("#wt-prev-btn");
        if (wtPrevBtn) {
          wtPrevBtn.addEventListener("click", () => {
            this._currentWalkthroughPage = Math.max(
              0,
              this._currentWalkthroughPage - 1,
            );
            this.openWalkthrough(chordIndex, targetLabel);
          });
        }

        const wtNextBtn =
          this._dom.walkthroughContent.querySelector("#wt-next-btn");
        if (wtNextBtn) {
          wtNextBtn.addEventListener("click", () => {
            this._currentWalkthroughPage = Math.min(
              sortedPairs.length - 1,
              this._currentWalkthroughPage + 1,
            );
            this.openWalkthrough(chordIndex, targetLabel);
          });
        }

        const filterItems = this._dom.walkthroughContent.querySelectorAll(
          ".partial-filter-item",
        );
        filterItems.forEach((item) => {
          item.addEventListener("click", (e) => {
            const el = e.currentTarget as HTMLElement;
            const wasActive = el.classList.contains("active");

            // Clear all active states first
            filterItems.forEach((i) => {
              i.classList.remove("active");
              (i as HTMLElement).style.background = "transparent";
              (i as HTMLElement).style.color = "inherit";
            });

            // If it wasn't active before, make it active now
            if (!wasActive) {
              el.classList.add("active");
              el.style.background = "#e0e7ff";
              el.style.color = "#3730a3";
            }

            const activePartial = wasActive
              ? null
              : el.getAttribute("data-partial");

            const indicatorEl = this._dom.walkthroughContent?.querySelector(
              "#table-filter-indicator",
            ) as HTMLElement;
            const indicatorCodeEl = this._dom.walkthroughContent?.querySelector(
              "#active-filter-code",
            ) as HTMLElement;
            if (indicatorEl && indicatorCodeEl) {
              if (activePartial) {
                indicatorCodeEl.textContent = activePartial;
                indicatorEl.style.display = "block";
              } else {
                indicatorEl.style.display = "none";
              }
            }

            this._dom.walkthroughContent
              ?.querySelectorAll(".pair-row")
              .forEach((row) => {
                if (!activePartial) {
                  (row as HTMLElement).style.display = ""; // Show all if none selected
                } else {
                  const rowPartials = (
                    row.getAttribute("data-partials") || ""
                  ).split(",");
                  const isVisible = rowPartials.includes(activePartial);
                  (row as HTMLElement).style.display = isVisible ? "" : "none";
                }
              });
          });
        });
      }
    }

    const titleEl = this.shadowRoot?.querySelector("#walkthrough-title");
    if (titleEl) titleEl.textContent = `Algorithm Walkthrough: ${targetLabel}`;

    const copyBtn = this.shadowRoot?.querySelector(
      "#copy-json-btn",
    ) as HTMLButtonElement;
    if (copyBtn) {
      if (data) {
        copyBtn.style.display = "inline-block";
        copyBtn.onclick = () => {
          const snapshot = {
            chord: chord.label,
            tuning: chord.tuningConfig,
            targetFamily: targetLabel,
            analysis: data,
          };
          navigator.clipboard.writeText(JSON.stringify(snapshot, null, 2));
          const originalHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
          copyBtn.innerHTML =
            '<span style="font-size: 12px; font-weight: bold; color: #10b981;">Copied!</span>';
          setTimeout(() => (copyBtn.innerHTML = originalHTML), 2000);
        };
      } else {
        copyBtn.style.display = "none";
      }
    }

    if (this._dom.walkthroughPanel) {
      this._dom.walkthroughPanel.classList.add("active");
    }
    this.classList.add("walkthrough-active");
  }

  private closeWalkthrough() {
    this._activeWalkthrough = null;
    this._isGraphicalAnalysisOpen = false;

    if (this._compareMode) {
      this._compareMode = false;
      this._selectedCompareCells = [];
      const compareBtn = this.shadowRoot?.querySelector(
        "#compare-mode-btn",
      ) as HTMLElement;
      if (compareBtn) {
        compareBtn.style.color = "#64748b";
        compareBtn.style.backgroundColor = "transparent";
      }
    }

    let changed = false;
    this._chords.forEach((c) => {
      if ((c as any).isPlotted) {
        (c as any).isPlotted = false;
        changed = true;
      }
    });

    this._dom.walkthroughPanel?.classList.remove("active");
    this.classList.remove("walkthrough-active");
    this.shadowRoot
      ?.querySelectorAll(".heatmap-cell.selected")
      .forEach((el) => el.classList.remove("selected"));
    this.shadowRoot
      ?.querySelectorAll(".heatmap-cell.compare-selected")
      .forEach((el) => el.classList.remove("compare-selected"));

    if (changed) {
      this.recalculateAll();
    }
  }
}

customElements.define("ppt-harmonic-profiler-app", HarmonicProfilerApp);
