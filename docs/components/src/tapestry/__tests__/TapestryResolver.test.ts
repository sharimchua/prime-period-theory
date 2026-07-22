import { describe, it, expect } from 'vitest';
import { resolve, resolveCoilPreview } from '../TapestryResolver';
import { createDocument, createCoilNode, createWeaveNode, createThread } from '../TapestryModel';

describe('TapestryResolver', () => {
  describe('Basic resolution', () => {
    it('should handle missing primary node', () => {
      const doc = createDocument('Empty Doc');
      const result = resolve(doc);
      expect(result.title).toBe('Empty Doc');
      expect(result.sections).toHaveLength(0);
      expect(result.primaryNodeLabel).toBe('(none)');
    });

    it('should resolve a single coil', () => {
      const doc = createDocument('Doc');
      const coil = createCoilNode('My Coil');
      coil.layers = { melody: 'do re mi', harmony: '', rhythm: '' };
      doc.nodes.push(coil);
      doc.primaryNodeId = coil.id;

      const result = resolve(doc);
      expect(result.sections).toHaveLength(1);
      expect(result.sections[0].sourceNodeLabel).toBe('My Coil');
      expect(result.sections[0].layers.melody).toBe('do re mi');
      expect(result.sections[0].resolvedBpm).toBe(120);
      expect(result.sections[0].resolvedDoPitch).toBe('C4');
      expect(result.sections[0].repeatCount).toBe(1);
    });
  });

  describe('Coil layer inheritance', () => {
    it('should resolve inherited layers by priority order', () => {
      const doc = createDocument();

      const p1 = createCoilNode('P1');
      p1.layers = { melody: 'P1-M', harmony: 'P1-H' };

      const p2 = createCoilNode('P2');
      p2.layers = { melody: 'P2-M', rhythm: 'P2-R' };

      const child = createCoilNode('Child');
      child.layers = { rhythm: 'C-R' }; // child overrides rhythm

      const thread1 = createThread('coil-inherit', p1.id, child.id);
      const thread2 = createThread('coil-inherit', p2.id, child.id);
      child.inheritanceOrder = [thread1.id, thread2.id]; // P1 takes priority for melody/harmony

      doc.nodes.push(p1, p2, child);
      doc.threads.push(thread1, thread2);
      doc.primaryNodeId = child.id;

      const result = resolve(doc);
      expect(result.sections).toHaveLength(1);
      const s = result.sections[0];
      expect(s.layers.melody).toBe('P1-M'); // from P1
      expect(s.layers.harmony).toBe('P1-H'); // from P1
      expect(s.layers.rhythm).toBe('C-R'); // directly on child
    });

    it('should break cycle in coil inheritance', () => {
      const doc = createDocument();
      const c1 = createCoilNode('C1');
      const c2 = createCoilNode('C2');

      c1.layers.melody = 'C1-M';
      c2.layers.harmony = 'C2-H';

      const t1 = createThread('coil-inherit', c1.id, c2.id);
      c2.inheritanceOrder = [t1.id];
      const t2 = createThread('coil-inherit', c2.id, c1.id);
      c1.inheritanceOrder = [t2.id];

      doc.nodes.push(c1, c2);
      doc.threads.push(t1, t2);
      doc.primaryNodeId = c2.id;

      const result = resolve(doc);
      expect(result.sections).toHaveLength(1);
      expect(result.sections[0].layers.melody).toBe('C1-M');
      expect(result.sections[0].layers.harmony).toBe('C2-H');
    });

    it('resolveCoilPreview should return resolved layers', () => {
      const doc = createDocument();
      const c1 = createCoilNode('C1');
      c1.layers.melody = 'do';
      doc.nodes.push(c1);

      const preview = resolveCoilPreview(doc, c1.id);
      expect(preview).toEqual({ melody: 'do', harmony: '', rhythm: '' });

      // Invalid node
      expect(resolveCoilPreview(doc, 'missing')).toEqual({ melody: '', harmony: '', rhythm: '' });
    });
  });

  describe('Weave composition', () => {
    it('should sequence nodes via weave-compose threads', () => {
      const doc = createDocument();
      const weave = createWeaveNode('Weave');
      const c1 = createCoilNode('C1');
      const c2 = createCoilNode('C2');

      const t1 = createThread('weave-compose', c1.id, weave.id);
      t1.repeatCount = 2; // test repeat
      const t2 = createThread('weave-compose', c2.id, weave.id);

      weave.compositionOrder = [t1.id, t2.id];
      doc.nodes.push(weave, c1, c2);
      doc.threads.push(t1, t2);
      doc.primaryNodeId = weave.id;

      const result = resolve(doc);
      // We expect 2 sections: resolving c1 with repeatCount=2, resolving c2 with repeatCount=1
      expect(result.sections).toHaveLength(2);
      expect(result.sections[0].sourceNodeId).toBe(c1.id);
      expect(result.sections[0].repeatCount).toBe(2);
      expect(result.sections[1].sourceNodeId).toBe(c2.id);
      expect(result.sections[1].repeatCount).toBe(1);
    });

    it('should apply weave knot overrides', () => {
      const doc = createDocument();
      const weave = createWeaveNode('Weave');
      weave.knot = { bpm: 150, doPitch: 'G4' };

      const c1 = createCoilNode('C1');
      const t1 = createThread('weave-compose', c1.id, weave.id);
      weave.compositionOrder = [t1.id];

      doc.nodes.push(weave, c1);
      doc.threads.push(t1);
      doc.primaryNodeId = weave.id;

      const result = resolve(doc);
      expect(result.sections[0].resolvedBpm).toBe(150);
      expect(result.sections[0].resolvedDoPitch).toBe('G4');
    });

    it('should compose thread modifications', () => {
      const doc = createDocument();
      const weave = createWeaveNode('Weave');
      const c1 = createCoilNode('C1');

      const t1 = createThread('weave-compose', c1.id, weave.id);
      t1.pitchModification = '3';
      t1.timeModification = '2/1';
      weave.compositionOrder = [t1.id];

      doc.nodes.push(weave, c1);
      doc.threads.push(t1);
      doc.primaryNodeId = weave.id;

      const result = resolve(doc);
      expect(result.sections[0].pitchOffset).toBe('3');
      expect(result.sections[0].timeScale).toBe('2/1');

      // Test multiple levels of modification (weave inside weave)
      const outerWeave = createWeaveNode('Outer');
      const t2 = createThread('weave-compose', weave.id, outerWeave.id);
      t2.pitchModification = '4';
      t2.timeModification = '3/2';
      outerWeave.compositionOrder = [t2.id];

      doc.nodes.push(outerWeave);
      doc.threads.push(t2);
      doc.primaryNodeId = outerWeave.id;

      const nestedResult = resolve(doc);
      expect(nestedResult.sections[0].pitchOffset).toBe('4+3');
      expect(nestedResult.sections[0].timeScale).toBe('3/2×2/1');
    });

    it('should apply default coil to empty layers', () => {
      const doc = createDocument();
      const weave = createWeaveNode('Weave');
      const targetCoil = createCoilNode('Target');
      targetCoil.layers.melody = 'Target-M'; // harmony and rhythm empty

      const defCoil = createCoilNode('Def');
      defCoil.layers = { melody: 'Def-M', harmony: 'Def-H', rhythm: 'Def-R' };

      const tcThread = createThread('weave-compose', targetCoil.id, weave.id);
      const defThread = createThread('weave-default-coil', defCoil.id, weave.id);

      weave.compositionOrder = [tcThread.id];
      weave.defaultCoilThreadId = defThread.id;

      doc.nodes.push(weave, targetCoil, defCoil);
      doc.threads.push(tcThread, defThread);
      doc.primaryNodeId = weave.id;

      const result = resolve(doc);
      expect(result.sections).toHaveLength(1);
      const s = result.sections[0];
      expect(s.layers.melody).toBe('Target-M'); // keeps its own
      expect(s.layers.harmony).toBe('Def-H'); // filled from default
      expect(s.layers.rhythm).toBe('Def-R'); // filled from default
    });

    it('should handle broken threads gracefully', () => {
      const doc = createDocument();
      const weave = createWeaveNode('Weave');
      const t1 = createThread('weave-compose', 'missing', weave.id);
      weave.compositionOrder = [t1.id, 'also-missing'];

      doc.nodes.push(weave);
      doc.threads.push(t1);
      doc.primaryNodeId = weave.id;

      const result = resolve(doc);
      expect(result.sections).toHaveLength(0); // Should skip missing source
    });
  });
});
