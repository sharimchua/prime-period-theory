/**
 * TapestryModel.ts  (v2)
 *
 * Thread-centric model: threads ARE the relationships.
 * - CoilNode.inheritanceOrder: string[]  — Thread IDs (kind='coil-inherit') in priority order
 * - WeaveNode.compositionOrder: string[] — Thread IDs (kind='weave-compose') in sequence order
 * - WeaveNode.defaultCoilThreadId?       — Thread ID (kind='weave-default-coil')
 *
 * See: okf/structure/tapestry.md
 */

export type LayerType = 'melody' | 'harmony' | 'rhythm';
export type WeaveLayout = 'concatenate' | 'equal-period' | 'equal-beat';
export type ResolutionMode = 'stretch' | 'tile';
export type ThreadKind = 'coil-inherit' | 'weave-compose' | 'weave-default-coil';

// ── Knots ─────────────────────────────────────────────────────────────────────

export interface PartialKnot {
  doPitch?: string;
  bpm?: number;
}

export interface GlobalKnot {
  doPitch: string;
  bpm: number;
}

// ── Coil ──────────────────────────────────────────────────────────────────────

export interface CoilLayers {
  melody?: string;
  harmony?: string;
  rhythm?: string;
}

/**
 * A Coil is an atomic musical idea carrying up to three layers.
 * Its parent Coils are determined entirely by incoming 'coil-inherit' threads,
 * ordered by `inheritanceOrder` (Thread IDs, priority-first).
 */
export interface CoilNode {
  id: string;
  kind: 'coil';
  label: string;
  /**
   * Ordered list of Thread IDs (kind='coil-inherit') pointing to this Coil.
   * First thread's source = highest-priority parent; subsequent threads fill
   * remaining unclaimed layers.
   */
  inheritanceOrder: string[];
  /** Directly authored layer content on this Coil. */
  layers: CoilLayers;
  position: { x: number; y: number };
}

// ── Weave ─────────────────────────────────────────────────────────────────────

/**
 * A Weave is an ordered sequencing container.
 * Its composition sequence is determined entirely by incoming 'weave-compose' threads,
 * ordered by `compositionOrder` (Thread IDs). The same source node may appear multiple
 * times by having multiple threads (one per slot). Threads may carry pitch/time mods.
 */
export interface WeaveNode {
  id: string;
  kind: 'weave';
  label: string;
  /**
   * Ordered list of Thread IDs (kind='weave-compose') forming the composition sequence.
   * Each entry is one slot; the same source can appear multiple times.
   */
  compositionOrder: string[];
  /** Layout applied to the composition sequence. */
  layout: WeaveLayout;
  /** Thread ID (kind='weave-default-coil') for the fallback Coil, if any. */
  defaultCoilThreadId?: string;
  /** Partial Knot — only the fields this Weave explicitly anchors. */
  knot?: PartialKnot;
  position: { x: number; y: number };
}

export type TapestryNode = CoilNode | WeaveNode;

// ── Thread ────────────────────────────────────────────────────────────────────

/**
 * A Thread is the ONLY way relationships are expressed in a Tapestry.
 * The thread's kind determines its semantic role:
 *   'coil-inherit'       — source Coil feeds target Coil's layer inheritance
 *   'weave-compose'      — source node is one element in target Weave's composition sequence
 *   'weave-default-coil' — source Coil is target Weave's fallback layer provider
 */
export interface Thread {
  id: string;
  kind: ThreadKind;
  sourceId: string;
  targetId: string;
  resolutionMode: ResolutionMode;
  /** Uniform Solfège syllable shifting Do anchor as content crosses this Thread. */
  pitchModification?: string;
  /** n/p lattice ratio scaling time as content crosses this Thread. */
  timeModification?: string;
  /** How many times this slot repeats in the sequence (default 1). */
  repeatCount: number;
}

// ── Document ──────────────────────────────────────────────────────────────────

export interface TapestryDocument {
  id: string;
  title: string;
  nodes: TapestryNode[];
  threads: Thread[];
  globalKnot: GlobalKnot;
  primaryNodeId?: string;
  version: 2;
}

// ── Factories ─────────────────────────────────────────────────────────────────

let _nodeCounter = 0;

function nextPosition(base = 80, stride = 220): { x: number; y: number } {
  _nodeCounter++;
  return {
    x: base + ((_nodeCounter - 1) % 4) * stride,
    y: base + Math.floor((_nodeCounter - 1) / 4) * 180
  };
}

export function createDocument(title = 'Untitled Tapestry'): TapestryDocument {
  _nodeCounter = 0;
  return { id: crypto.randomUUID(), title, nodes: [], threads: [], globalKnot: { doPitch: 'C4', bpm: 120 }, version: 2 };
}

export function createCoilNode(label = 'New Coil'): CoilNode {
  return { id: crypto.randomUUID(), kind: 'coil', label, inheritanceOrder: [], layers: {}, position: nextPosition() };
}

export function createWeaveNode(label = 'New Weave'): WeaveNode {
  return { id: crypto.randomUUID(), kind: 'weave', label, compositionOrder: [], layout: 'concatenate', position: nextPosition() };
}

export function createThread(kind: ThreadKind, sourceId: string, targetId: string): Thread {
  return { id: crypto.randomUUID(), kind, sourceId, targetId, resolutionMode: 'stretch', repeatCount: 1 };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getNode(doc: TapestryDocument, id: string): TapestryNode | undefined {
  return doc.nodes.find(n => n.id === id);
}

export function getThread(doc: TapestryDocument, id: string): Thread | undefined {
  return doc.threads.find(t => t.id === id);
}

export function isCoil(node: TapestryNode): node is CoilNode {
  return node.kind === 'coil';
}

export function isWeave(node: TapestryNode): node is WeaveNode {
  return node.kind === 'weave';
}

/** All threads targeting the given node. */
export function incomingThreads(doc: TapestryDocument, nodeId: string): Thread[] {
  return doc.threads.filter(t => t.targetId === nodeId);
}

/** All threads originating from the given node. */
export function outgoingThreads(doc: TapestryDocument, nodeId: string): Thread[] {
  return doc.threads.filter(t => t.sourceId === nodeId);
}

/** Ordered parent Coil nodes for a CoilNode (resolved through inheritanceOrder). */
export function resolvedParents(doc: TapestryDocument, node: CoilNode): CoilNode[] {
  return node.inheritanceOrder
    .map(tid => getThread(doc, tid))
    .filter(Boolean)
    .map(t => getNode(doc, t!.sourceId))
    .filter((n): n is CoilNode => !!n && isCoil(n));
}

/** Ordered composition elements for a WeaveNode (resolved through compositionOrder). */
export function resolvedCompositionSequence(doc: TapestryDocument, node: WeaveNode): Array<{ thread: Thread; source: TapestryNode }> {
  return node.compositionOrder
    .map(tid => {
      const thread = getThread(doc, tid);
      if (!thread) return null;
      const source = getNode(doc, thread.sourceId);
      if (!source) return null;
      return { thread, source };
    })
    .filter(Boolean) as Array<{ thread: Thread; source: TapestryNode }>;
}

/** The default Coil node for a WeaveNode, if any. */
export function resolvedDefaultCoil(doc: TapestryDocument, node: WeaveNode): CoilNode | undefined {
  if (!node.defaultCoilThreadId) return undefined;
  const thread = getThread(doc, node.defaultCoilThreadId);
  if (!thread) return undefined;
  const n = getNode(doc, thread.sourceId);
  return n && isCoil(n) ? n : undefined;
}

/** Remove a thread from the document and from any node ordering arrays that reference it. */
export function deleteThread(doc: TapestryDocument, threadId: string): void {
  doc.threads = doc.threads.filter(t => t.id !== threadId);
  for (const node of doc.nodes) {
    if (isCoil(node)) {
      node.inheritanceOrder = node.inheritanceOrder.filter(id => id !== threadId);
    } else if (isWeave(node)) {
      node.compositionOrder = node.compositionOrder.filter(id => id !== threadId);
      if (node.defaultCoilThreadId === threadId) node.defaultCoilThreadId = undefined;
    }
  }
}

/** Remove a node and all threads referencing it. */
export function deleteNode(doc: TapestryDocument, nodeId: string): void {
  // Collect all thread IDs referencing this node
  const affected = doc.threads.filter(t => t.sourceId === nodeId || t.targetId === nodeId).map(t => t.id);
  for (const tid of affected) deleteThread(doc, tid);
  doc.nodes = doc.nodes.filter(n => n.id !== nodeId);
  if (doc.primaryNodeId === nodeId) doc.primaryNodeId = undefined;
}
