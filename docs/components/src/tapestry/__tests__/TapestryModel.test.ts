import { describe, it, expect } from 'vitest';
import {
  createDocument,
  createCoilNode,
  createWeaveNode,
  createThread,
  getNode,
  getThread,
  isCoil,
  isWeave,
  incomingThreads,
  outgoingThreads,
  resolvedParents,
  resolvedCompositionSequence,
  resolvedDefaultCoil,
  deleteThread,
  deleteNode,
} from '../TapestryModel';

describe('TapestryModel', () => {
  describe('Factories', () => {
    it('should create a valid document', () => {
      const doc = createDocument('My Doc');
      expect(doc.title).toBe('My Doc');
      expect(doc.nodes).toEqual([]);
      expect(doc.threads).toEqual([]);
      expect(doc.globalKnot).toEqual({ doPitch: 'C4', bpm: 120 });
      expect(doc.version).toBe(2);
      expect(doc.id).toBeDefined();
    });

    it('should create a CoilNode', () => {
      const coil = createCoilNode('My Coil');
      expect(coil.kind).toBe('coil');
      expect(coil.label).toBe('My Coil');
      expect(coil.inheritanceOrder).toEqual([]);
      expect(coil.layers).toEqual({});
      expect(coil.position).toBeDefined();
      expect(coil.id).toBeDefined();
    });

    it('should create a WeaveNode', () => {
      const weave = createWeaveNode('My Weave');
      expect(weave.kind).toBe('weave');
      expect(weave.label).toBe('My Weave');
      expect(weave.compositionOrder).toEqual([]);
      expect(weave.layout).toBe('concatenate');
      expect(weave.position).toBeDefined();
      expect(weave.id).toBeDefined();
    });

    it('should create a Thread', () => {
      const thread = createThread('coil-inherit', 'src-1', 'tgt-1');
      expect(thread.kind).toBe('coil-inherit');
      expect(thread.sourceId).toBe('src-1');
      expect(thread.targetId).toBe('tgt-1');
      expect(thread.resolutionMode).toBe('stretch');
      expect(thread.repeatCount).toBe(1);
      expect(thread.id).toBeDefined();
    });
  });

  describe('Helpers', () => {
    it('should get node and thread by ID', () => {
      const doc = createDocument();
      const coil = createCoilNode();
      const thread = createThread('coil-inherit', coil.id, coil.id);
      doc.nodes.push(coil);
      doc.threads.push(thread);

      expect(getNode(doc, coil.id)).toBe(coil);
      expect(getNode(doc, 'missing')).toBeUndefined();

      expect(getThread(doc, thread.id)).toBe(thread);
      expect(getThread(doc, 'missing')).toBeUndefined();
    });

    it('should check node kinds', () => {
      const coil = createCoilNode();
      const weave = createWeaveNode();

      expect(isCoil(coil)).toBe(true);
      expect(isCoil(weave)).toBe(false);

      expect(isWeave(weave)).toBe(true);
      expect(isWeave(coil)).toBe(false);
    });

    it('should find incoming and outgoing threads', () => {
      const doc = createDocument();
      const thread1 = createThread('coil-inherit', 'A', 'B');
      const thread2 = createThread('weave-compose', 'B', 'C');
      doc.threads.push(thread1, thread2);

      expect(incomingThreads(doc, 'B')).toEqual([thread1]);
      expect(outgoingThreads(doc, 'B')).toEqual([thread2]);
      expect(incomingThreads(doc, 'A')).toEqual([]);
      expect(outgoingThreads(doc, 'C')).toEqual([]);
    });

    it('should resolve parents for CoilNode', () => {
      const doc = createDocument();
      const parent1 = createCoilNode('P1');
      const parent2 = createCoilNode('P2');
      const child = createCoilNode('C');

      const thread1 = createThread('coil-inherit', parent1.id, child.id);
      const thread2 = createThread('coil-inherit', parent2.id, child.id);

      child.inheritanceOrder = [thread1.id, thread2.id];
      doc.nodes.push(parent1, parent2, child);
      doc.threads.push(thread1, thread2);

      const parents = resolvedParents(doc, child);
      expect(parents).toHaveLength(2);
      expect(parents[0]).toBe(parent1);
      expect(parents[1]).toBe(parent2);
    });

    it('should resolve composition sequence for WeaveNode', () => {
      const doc = createDocument();
      const coil = createCoilNode('C1');
      const weave = createWeaveNode('W1');

      const thread = createThread('weave-compose', coil.id, weave.id);
      weave.compositionOrder = [thread.id];

      doc.nodes.push(coil, weave);
      doc.threads.push(thread);

      const seq = resolvedCompositionSequence(doc, weave);
      expect(seq).toHaveLength(1);
      expect(seq[0].thread).toBe(thread);
      expect(seq[0].source).toBe(coil);
    });

    it('should resolve default coil for WeaveNode', () => {
      const doc = createDocument();
      const coil = createCoilNode('Default');
      const weave = createWeaveNode('W');

      const thread = createThread('weave-default-coil', coil.id, weave.id);
      weave.defaultCoilThreadId = thread.id;

      doc.nodes.push(coil, weave);
      doc.threads.push(thread);

      const defaultCoil = resolvedDefaultCoil(doc, weave);
      expect(defaultCoil).toBe(coil);
    });

    it('should handle undefined gracefully in default coil resolution', () => {
      const doc = createDocument();
      const weave = createWeaveNode('W');
      doc.nodes.push(weave);
      expect(resolvedDefaultCoil(doc, weave)).toBeUndefined();

      weave.defaultCoilThreadId = 'missing';
      expect(resolvedDefaultCoil(doc, weave)).toBeUndefined();
    });

    it('should delete a thread and clean up node references', () => {
      const doc = createDocument();
      const coil = createCoilNode('C');
      const weave = createWeaveNode('W');
      const thread1 = createThread('coil-inherit', coil.id, coil.id);
      const thread2 = createThread('weave-compose', coil.id, weave.id);
      const thread3 = createThread('weave-default-coil', coil.id, weave.id);

      coil.inheritanceOrder = [thread1.id];
      weave.compositionOrder = [thread2.id];
      weave.defaultCoilThreadId = thread3.id;

      doc.nodes.push(coil, weave);
      doc.threads.push(thread1, thread2, thread3);

      deleteThread(doc, thread1.id);
      expect(doc.threads).toHaveLength(2);
      expect(coil.inheritanceOrder).toHaveLength(0);

      deleteThread(doc, thread2.id);
      expect(doc.threads).toHaveLength(1);
      expect(weave.compositionOrder).toHaveLength(0);

      deleteThread(doc, thread3.id);
      expect(doc.threads).toHaveLength(0);
      expect(weave.defaultCoilThreadId).toBeUndefined();
    });

    it('should delete a node and all associated threads', () => {
      const doc = createDocument();
      const coil1 = createCoilNode('C1');
      const coil2 = createCoilNode('C2');
      const thread = createThread('coil-inherit', coil1.id, coil2.id);

      doc.nodes.push(coil1, coil2);
      doc.threads.push(thread);
      doc.primaryNodeId = coil1.id;

      deleteNode(doc, coil1.id);
      expect(doc.nodes).toHaveLength(1);
      expect(doc.nodes[0]).toBe(coil2);
      expect(doc.threads).toHaveLength(0);
      expect(doc.primaryNodeId).toBeUndefined();
    });
  });
});
