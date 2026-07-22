import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  serialiseDocument,
  deserialiseDocument,
  saveToLocalStorage,
  loadFromLocalStorage,
  loadRecentList,
  clearLocalStorage,
  createWelcomeDocument,
  scheduleAutoSave,
  downloadDocument
} from '../TapestrySerializer';
import { createDocument, createCoilNode } from '../TapestryModel';

describe('TapestrySerializer', () => {
  beforeEach(() => {
    // Mock localStorage
    const store: Record<string, string> = {};
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      })
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe('JSON serialization', () => {
    it('should serialize and deserialize a document correctly', () => {
      const doc = createDocument('Test Doc');
      const coil = createCoilNode('Test Coil');
      doc.nodes.push(coil);

      const json = serialiseDocument(doc);
      expect(typeof json).toBe('string');

      const parsed = deserialiseDocument(json);
      expect(parsed.title).toBe('Test Doc');
      expect(parsed.nodes).toHaveLength(1);
      expect(parsed.nodes[0].label).toBe('Test Coil');
      expect(parsed.version).toBe(2);
    });

    it('should migrate v1 to v2 format during deserialization', () => {
      const v1Json = JSON.stringify({
        id: '123',
        title: 'V1 Doc',
        nodes: [
          { kind: 'coil', label: 'C', parents: ['t1'], position: { x: 10, y: 10 } },
          { kind: 'weave', label: 'W', children: ['t2'], defaultCoilId: 't3', position: { x: 20, y: 20 } }
        ],
        threads: [],
        globalKnot: { doPitch: 'C4', bpm: 120 }
      });

      const parsed = deserialiseDocument(v1Json);
      expect(parsed.version).toBe(2);
      expect((parsed.nodes[0] as any).parents).toBeUndefined();
      expect((parsed.nodes[0] as any).inheritanceOrder).toEqual([]);
      expect((parsed.nodes[1] as any).children).toBeUndefined();
      expect((parsed.nodes[1] as any).compositionOrder).toEqual([]);
      expect((parsed.nodes[1] as any).defaultCoilId).toBeUndefined();
    });

    it('should add default positions if missing', () => {
      const v1Json = JSON.stringify({
        id: '123',
        title: 'V1 Doc',
        nodes: [
          { kind: 'coil', label: 'C', inheritanceOrder: [] }
        ],
        threads: [],
        globalKnot: { doPitch: 'C4', bpm: 120 },
        version: 2
      });

      const parsed = deserialiseDocument(v1Json);
      expect(parsed.nodes[0].position).toEqual({ x: 80, y: 80 });
    });
  });

  describe('LocalStorage', () => {
    it('should save and load from local storage', () => {
      const doc = createDocument('Save Test');
      saveToLocalStorage(doc);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'ppt-tapestry-document',
        expect.any(String)
      );

      const loaded = loadFromLocalStorage();
      expect(loaded).not.toBeNull();
      expect(loaded?.title).toBe('Save Test');
    });

    it('should update recent list when saving', () => {
      const doc = createDocument('Recent Test');
      saveToLocalStorage(doc);

      const recents = loadRecentList();
      expect(recents).toHaveLength(1);
      expect(recents[0].id).toBe(doc.id);
      expect(recents[0].title).toBe('Recent Test');
      expect(recents[0].savedAt).toBeDefined();

      // Test maximum recent limit by saving multiple
      for (let i = 0; i < 15; i++) {
        const d = createDocument(`Doc ${i}`);
        saveToLocalStorage(d);
      }

      const newRecents = loadRecentList();
      expect(newRecents).toHaveLength(10); // MAX_RECENT
    });

    it('should return null if local storage has invalid JSON', () => {
      localStorage.setItem('ppt-tapestry-document', 'invalid json');
      const loaded = loadFromLocalStorage();
      expect(loaded).toBeNull(); // it swallows the exception in try-catch
    });

    it('should clear local storage keys', () => {
      const doc = createDocument('Save Test');
      saveToLocalStorage(doc);
      expect(loadFromLocalStorage()).not.toBeNull();

      clearLocalStorage();
      expect(loadFromLocalStorage()).toBeNull();
    });
  });

  describe('Factory', () => {
    it('should create a welcome document', () => {
      const doc = createWelcomeDocument();
      expect(doc.title).toBe('My First Tapestry');
    });
  });

  describe('AutoSave', () => {
    it('should debounce auto save', () => {
      vi.useFakeTimers();

      const doc = createDocument('AutoSave');
      scheduleAutoSave(doc, 100);
      scheduleAutoSave(doc, 100);
      scheduleAutoSave(doc, 100);

      // Fast forward less than delay
      vi.advanceTimersByTime(50);
      expect(localStorage.setItem).not.toHaveBeenCalled();

      // Fast forward past delay
      vi.advanceTimersByTime(150);
      expect(localStorage.setItem).toHaveBeenCalledTimes(2); // Called for both ppt-tapestry-document and ppt-tapestry-recent

      vi.useRealTimers();
    });
  });

  describe('DOM downloads (mocked)', () => {
    it('should trigger a download using DOM API', () => {
      // Mock document and URL
      const aMock = {
        href: '',
        download: '',
        click: vi.fn(),
        remove: vi.fn()
      };

      const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(aMock as any);
      const createObjectURLSpy = vi.fn().mockReturnValue('blob:url');
      const revokeObjectURLSpy = vi.fn();

      vi.stubGlobal('URL', {
        createObjectURL: createObjectURLSpy,
        revokeObjectURL: revokeObjectURLSpy
      });
      vi.stubGlobal('Blob', class BlobMock {});

      const doc = createDocument('My Doc DL');
      downloadDocument(doc);

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(aMock.download).toBe('my-doc-dl.tapestry.json');
      // note: it doesn't do document.body.appendChild, it just calls .click() on detached element
      expect(aMock.click).toHaveBeenCalled();
      expect(revokeObjectURLSpy).toHaveBeenCalled();
    });
  });
});
