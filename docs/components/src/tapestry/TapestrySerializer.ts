/**
 * TapestrySerializer.ts
 * 
 * JSON serialise/deserialise for TapestryDocument, with localStorage
 * persistence and base64-gzip payload encoding (matching the Designer
 * compressed-payload pattern).
 */

import type { TapestryDocument } from './TapestryModel.js';
import { createDocument } from './TapestryModel.js';

const STORAGE_KEY = 'ppt-tapestry-document';
const STORAGE_RECENT_KEY = 'ppt-tapestry-recent';
const MAX_RECENT = 10;

// ── JSON ─────────────────────────────────────────────────────────────────────

export function serialiseDocument(doc: TapestryDocument): string {
  return JSON.stringify(doc, null, 2);
}

export function deserialiseDocument(json: string): TapestryDocument {
  const raw = JSON.parse(json);
  // v1 → v2 migration: replace parents/children arrays with thread-based ordering
  if (!raw.version || raw.version < 2) {
    for (const node of raw.nodes ?? []) {
      if (node.kind === 'coil') {
        node.inheritanceOrder = node.inheritanceOrder ?? [];
        delete node.parents;
      } else if (node.kind === 'weave') {
        node.compositionOrder = node.compositionOrder ?? [];
        delete node.children;
        delete node.defaultCoilId;
      }
    }
    raw.version = 2;
  }
  if (!raw.version) raw.version = 2;
  for (const node of raw.nodes ?? []) {
    if (!node.position) node.position = { x: 80, y: 80 };
    if (node.kind === 'coil' && !node.inheritanceOrder) node.inheritanceOrder = [];
    if (node.kind === 'weave' && !node.compositionOrder) node.compositionOrder = [];
  }
  for (const thread of raw.threads ?? []) {
    if (thread.repeatCount === undefined) thread.repeatCount = 1;
    if (!thread.kind) thread.kind = 'weave-compose';
  }
  if (!raw.globalKnot) raw.globalKnot = { doPitch: 'C4', bpm: 120 };
  return raw as TapestryDocument;
}

// ── localStorage ──────────────────────────────────────────────────────────────

export function saveToLocalStorage(doc: TapestryDocument): void {
  try {
    localStorage.setItem(STORAGE_KEY, serialiseDocument(doc));
    // Update recent list
    const recent: { id: string; title: string; savedAt: string }[] = loadRecentList();
    const idx = recent.findIndex(r => r.id === doc.id);
    const entry = { id: doc.id, title: doc.title, savedAt: new Date().toISOString() };
    if (idx >= 0) recent[idx] = entry;
    else recent.unshift(entry);
    localStorage.setItem(STORAGE_RECENT_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
  } catch {
    // Storage full or unavailable — fail silently
  }
}

export function loadFromLocalStorage(): TapestryDocument | null {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) return null;
    return deserialiseDocument(json);
  } catch {
    return null;
  }
}

export function loadRecentList(): { id: string; title: string; savedAt: string }[] {
  try {
    const raw = localStorage.getItem(STORAGE_RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearLocalStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// ── File download / upload ────────────────────────────────────────────────────

export function downloadDocument(doc: TapestryDocument): void {
  const json = serialiseDocument(doc);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${doc.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.tapestry.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function loadDocumentFromFile(): Promise<TapestryDocument> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.tapestry.json';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return reject(new Error('No file selected'));
      const reader = new FileReader();
      reader.onload = () => {
        try {
          resolve(deserialiseDocument(reader.result as string));
        } catch (e) {
          reject(e);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    };
    input.click();
  });
}

// ── Base64-gzip payload (for shareable URL fragments) ─────────────────────────

export async function encodePayload(doc: TapestryDocument): Promise<string> {
  const json = serialiseDocument(doc);
  const bytes = new TextEncoder().encode(json);
  const cs = new CompressionStream('gzip');
  const writer = cs.writable.getWriter();
  writer.write(bytes);
  writer.close();
  const compressed = await new Response(cs.readable).arrayBuffer();
  return btoa(String.fromCharCode(...new Uint8Array(compressed)));
}

export async function decodePayload(payload: string): Promise<TapestryDocument> {
  const binary = atob(payload);
  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
  const ds = new DecompressionStream('gzip');
  const writer = ds.writable.getWriter();
  writer.write(bytes);
  writer.close();
  const decompressed = await new Response(ds.readable).arrayBuffer();
  const json = new TextDecoder().decode(decompressed);
  return deserialiseDocument(json);
}

// ── Auto-save with debounce ───────────────────────────────────────────────────

let _autoSaveTimer: ReturnType<typeof setTimeout> | null = null;

export function scheduleAutoSave(doc: TapestryDocument, delayMs = 1500): void {
  if (_autoSaveTimer) clearTimeout(_autoSaveTimer);
  _autoSaveTimer = setTimeout(() => {
    saveToLocalStorage(doc);
    _autoSaveTimer = null;
  }, delayMs);
}

// ── Default document ──────────────────────────────────────────────────────────

/**
 * Returns a document with a single illustrative Coil so the canvas isn't
 * completely empty on first launch.
 */
export function createWelcomeDocument(): TapestryDocument {
  const doc = createDocument('My First Tapestry');
  return doc;
}
