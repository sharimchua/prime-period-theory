/**
 * TapestryResolver.ts  (v2)
 *
 * Resolution engine using the thread-centric v2 model.
 * CoilNode parents are resolved through inheritanceOrder (Thread IDs).
 * WeaveNode composition is resolved through compositionOrder (Thread IDs).
 */

import type {
  TapestryDocument,
  CoilNode,
  WeaveNode,
  CoilLayers,
  WeaveLayout
} from './TapestryModel.js';
import {
  isCoil,
  isWeave,
  getNode,
  resolvedParents,
  resolvedCompositionSequence,
  resolvedDefaultCoil
} from './TapestryModel.js';

// ── Output types ──────────────────────────────────────────────────────────────

export interface ResolvedSection {
  sourceNodeId: string;
  sourceNodeLabel: string;
  layers: { melody: string; harmony: string; rhythm: string };
  resolvedDoPitch: string;
  resolvedBpm: number;
  pitchOffset: string;
  timeScale: string;
  repeatCount: number;
}

export interface ResolvedScore {
  sections: ResolvedSection[];
  title: string;
  primaryNodeLabel: string;
  globalBpm: number;
  globalDoPitch: string;
}

// ── Internal resolution context ───────────────────────────────────────────────

interface Ctx {
  doc: TapestryDocument;
  pitchOffset: string;
  timeScale: string;
  bpm: number;
  doPitch: string;
  defaultCoilId?: string;
  visited: Set<string>;
}

// ── Coil layer resolution ─────────────────────────────────────────────────────

function resolveCoilLayers(
  doc: TapestryDocument,
  node: CoilNode,
  visited: Set<string> = new Set()
): CoilLayers {
  if (visited.has(node.id)) return {};
  visited.add(node.id);

  const resolved: CoilLayers = {
    melody: node.layers.melody || undefined,
    harmony: node.layers.harmony || undefined,
    rhythm: node.layers.rhythm || undefined
  };

  const missing = (['melody', 'harmony', 'rhythm'] as (keyof CoilLayers)[])
    .filter(l => !resolved[l]);

  if (missing.length === 0) return resolved;

  // Walk parent chain in priority order (via inheritanceOrder threads)
  for (const parentNode of resolvedParents(doc, node)) {
    if (missing.length === 0) break;
    const parentLayers = resolveCoilLayers(doc, parentNode, new Set(visited));
    for (const layer of [...missing]) {
      if (parentLayers[layer]) {
        resolved[layer] = parentLayers[layer];
        missing.splice(missing.indexOf(layer), 1);
      }
    }
  }

  return resolved;
}

function applyDefaultCoil(
  layers: CoilLayers,
  doc: TapestryDocument,
  defaultCoilId: string | undefined
): CoilLayers {
  if (!defaultCoilId) return layers;
  const missing = (['melody', 'harmony', 'rhythm'] as (keyof CoilLayers)[]).filter(l => !layers[l]);
  if (missing.length === 0) return layers;
  const defaultNode = getNode(doc, defaultCoilId);
  if (!defaultNode || !isCoil(defaultNode)) return layers;
  const defaultLayers = resolveCoilLayers(doc, defaultNode);
  const result = { ...layers };
  for (const layer of missing) if (defaultLayers[layer]) result[layer] = defaultLayers[layer];
  return result;
}

// ── Pitch / time composition ──────────────────────────────────────────────────

function composePitch(existing: string, addition: string | undefined): string {
  if (!addition) return existing;
  return existing ? `${existing}+${addition}` : addition;
}

function composeTime(existing: string, addition: string | undefined): string {
  if (!addition) return existing;
  return existing ? `${existing}×${addition}` : addition;
}

// ── Node resolution ───────────────────────────────────────────────────────────

function resolveNode(nodeId: string, ctx: Ctx, repeatCount = 1): ResolvedSection[] {
  if (ctx.visited.has(nodeId)) return [];
  const node = getNode(ctx.doc, nodeId);
  if (!node) return [];
  if (isCoil(node)) return resolveCoil(node, ctx, repeatCount);
  if (isWeave(node)) return resolveWeave(node, ctx);
  return [];
}

function resolveCoil(node: CoilNode, ctx: Ctx, repeatCount: number): ResolvedSection[] {
  let layers = resolveCoilLayers(ctx.doc, node);
  layers = applyDefaultCoil(layers, ctx.doc, ctx.defaultCoilId);
  return [{
    sourceNodeId: node.id,
    sourceNodeLabel: node.label,
    layers: { melody: layers.melody ?? '', harmony: layers.harmony ?? '', rhythm: layers.rhythm ?? '' },
    resolvedDoPitch: ctx.doPitch,
    resolvedBpm: ctx.bpm,
    pitchOffset: ctx.pitchOffset,
    timeScale: ctx.timeScale,
    repeatCount
  }];
}

function resolveWeave(node: WeaveNode, ctx: Ctx): ResolvedSection[] {
  const bpm = node.knot?.bpm ?? ctx.bpm;
  const doPitch = node.knot?.doPitch ?? ctx.doPitch;
  const defaultCoil = resolvedDefaultCoil(ctx.doc, node);

  const innerCtx: Ctx = {
    ...ctx,
    bpm, doPitch,
    defaultCoilId: defaultCoil?.id ?? ctx.defaultCoilId,
    visited: new Set([...ctx.visited, node.id])
  };

  const sections: ResolvedSection[] = [];
  for (const { thread, source } of resolvedCompositionSequence(ctx.doc, node)) {
    const childCtx: Ctx = {
      ...innerCtx,
      pitchOffset: composePitch(innerCtx.pitchOffset, thread.pitchModification),
      timeScale: composeTime(innerCtx.timeScale, thread.timeModification)
    };
    sections.push(...resolveNode(source.id, childCtx, thread.repeatCount));
  }

  return applyLayout(sections, node.layout);
}

function applyLayout(sections: ResolvedSection[], _layout: WeaveLayout): ResolvedSection[] {
  // Layout is informational in v1 — sections returned in order
  return sections;
}

// ── Public API ────────────────────────────────────────────────────────────────

export function resolve(doc: TapestryDocument, primaryNodeId?: string): ResolvedScore {
  const nodeId = primaryNodeId ?? doc.primaryNodeId;
  const node = nodeId ? getNode(doc, nodeId) : undefined;
  if (!nodeId || !node) {
    return { sections: [], title: doc.title, primaryNodeLabel: '(none)', globalBpm: doc.globalKnot.bpm, globalDoPitch: doc.globalKnot.doPitch };
  }
  const ctx: Ctx = {
    doc, pitchOffset: '', timeScale: '',
    bpm: doc.globalKnot.bpm, doPitch: doc.globalKnot.doPitch,
    visited: new Set()
  };
  return {
    sections: resolveNode(nodeId, ctx),
    title: doc.title,
    primaryNodeLabel: node.label,
    globalBpm: doc.globalKnot.bpm,
    globalDoPitch: doc.globalKnot.doPitch
  };
}

export function resolveCoilPreview(
  doc: TapestryDocument,
  coilId: string
): { melody: string; harmony: string; rhythm: string } {
  const node = getNode(doc, coilId);
  if (!node || !isCoil(node)) return { melody: '', harmony: '', rhythm: '' };
  const layers = resolveCoilLayers(doc, node);
  return { melody: layers.melody ?? '', harmony: layers.harmony ?? '', rhythm: layers.rhythm ?? '' };
}
