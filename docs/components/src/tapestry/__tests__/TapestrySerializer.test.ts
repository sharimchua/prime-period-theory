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

    it('should handle missing threads and globalKnot and initialize defaults', () => {
      const rawJson = JSON.stringify({
        id: '123',
        title: 'Test',
        version: 2
      });

      const parsed = deserialiseDocument(rawJson);
      expect(parsed.threads).toEqual([]);
      expect(parsed.globalKnot).toEqual({ doPitch: 'C4', bpm: 120 });
    });

    it('should add defaults for threads without repeatCount and kind', () => {
      const rawJson = JSON.stringify({
        id: '123',
        title: 'Test',
        threads: [
          { sourceId: 'A', targetId: 'B' } // missing repeatCount and kind
        ],
        version: 2
      });

      const parsed = deserialiseDocument(rawJson);
      expect(parsed.threads[0].repeatCount).toBe(1);
      expect(parsed.threads[0].kind).toBe('weave-compose');
    });

    it('should handle nodes missing defaults for weave kind', () => {
      const rawJson = JSON.stringify({
        id: '123',
        title: 'Test',
        nodes: [
          { kind: 'weave', label: 'W' } // missing compositionOrder
        ],
        version: 2
      });

      const parsed = deserialiseDocument(rawJson);
      expect((parsed.nodes[0] as any).compositionOrder).toEqual([]);
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

    it('should handle saveToLocalStorage errors silently', () => {
      const doc = createDocument('Save Test Error');
      vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      expect(() => saveToLocalStorage(doc)).not.toThrow();
    });

    it('should handle loadRecentList errors by returning empty array', () => {
      vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
        throw new Error('SecurityError');
      });
      const recents = loadRecentList();
      expect(recents).toEqual([]);
    });

    it('should return empty array if local storage has invalid recent JSON', () => {
      localStorage.setItem('ppt-tapestry-recent', 'invalid json');
      const recents = loadRecentList();
      expect(recents).toEqual([]);
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

  describe('Payload compression', () => {
    it('should encode and decode a document payload correctly', async () => {
      // Mock CompressionStream and DecompressionStream which might not be in happy-dom natively yet
      if (typeof globalThis.CompressionStream === 'undefined') {
        vi.stubGlobal('CompressionStream', class {
          readable = new ReadableStream();
          writable = new WritableStream();
          constructor() {
            let controller: any;
            this.readable = new ReadableStream({
              start(c) { controller = c; }
            });
            this.writable = new WritableStream({
              write(chunk) { controller.enqueue(chunk); },
              close() { controller.close(); }
            });
          }
        });
        vi.stubGlobal('DecompressionStream', class {
          readable = new ReadableStream();
          writable = new WritableStream();
          constructor() {
            let controller: any;
            this.readable = new ReadableStream({
              start(c) { controller = c; }
            });
            this.writable = new WritableStream({
              write(chunk) { controller.enqueue(chunk); },
              close() { controller.close(); }
            });
          }
        });
        // We also need Response to accept the stream and resolve arrayBuffer properly.
        // We'll mock the module to avoid happy-dom complexities if needed, but vitest Node 18+ has them.
      }

      const { encodePayload, decodePayload } = await import('../TapestrySerializer');

      const doc = createDocument('Payload Test');
      const coil = createCoilNode('Payload Coil');
      doc.nodes.push(coil);

      const payload = await encodePayload(doc);
      expect(typeof payload).toBe('string');
      expect(payload.length).toBeGreaterThan(0);

      const decoded = await decodePayload(payload);
      expect(decoded.title).toBe('Payload Test');
      expect(decoded.nodes).toHaveLength(1);
      expect(decoded.nodes[0].label).toBe('Payload Coil');
    });
  });

  describe('File load (mocked)', () => {
    it('should load a document from a File input', async () => {
      const { loadDocumentFromFile } = await import('../TapestrySerializer');
      const doc = createDocument('File Load Test');
      const json = serialiseDocument(doc);

      const fileMock = {
        name: 'test.tapestry.json'
      };

      const inputMock = {
        type: '',
        accept: '',
        click: vi.fn(),
        files: [fileMock],
        onchange: null as any
      };

      const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(inputMock as any);

      const readAsTextSpy = vi.fn(function(this: any) {
        this.result = json;
        if (this.onload) this.onload();
      });

      vi.stubGlobal('FileReader', class {
        readAsText = readAsTextSpy;
      });

      const promise = loadDocumentFromFile();

      expect(createElementSpy).toHaveBeenCalledWith('input');
      expect(inputMock.type).toBe('file');
      expect(inputMock.accept).toBe('.json,.tapestry.json');
      expect(inputMock.click).toHaveBeenCalled();

      // Simulate user selecting a file
      if (inputMock.onchange) {
        inputMock.onchange(new Event('change') as any);
      }

      const loaded = await promise;
      expect(loaded.title).toBe('File Load Test');
    });

    it('should handle rejection if no file selected', async () => {
      const { loadDocumentFromFile } = await import('../TapestrySerializer');

      const inputMock = {
        type: '',
        accept: '',
        click: vi.fn(),
        files: [], // Empty files array
        onchange: null as any
      };

      vi.spyOn(document, 'createElement').mockReturnValue(inputMock as any);

      const promise = loadDocumentFromFile();

      if (inputMock.onchange) {
        inputMock.onchange(new Event('change') as any);
      }

      await expect(promise).rejects.toThrow('No file selected');
    });

    it('should handle FileReader error', async () => {
      const { loadDocumentFromFile } = await import('../TapestrySerializer');

      const fileMock = { name: 'test.json' };
      const inputMock = {
        type: '',
        accept: '',
        click: vi.fn(),
        files: [fileMock],
        onchange: null as any
      };

      vi.spyOn(document, 'createElement').mockReturnValue(inputMock as any);

      const readAsTextSpy = vi.fn(function(this: any) {
        this.error = new Error('Read failed');
        if (this.onerror) this.onerror();
      });

      vi.stubGlobal('FileReader', class {
        readAsText = readAsTextSpy;
      });

      const promise = loadDocumentFromFile();

      if (inputMock.onchange) {
        inputMock.onchange(new Event('change') as any);
      }

      await expect(promise).rejects.toThrow('Read failed');
    });

    it('should handle JSON parse error', async () => {
      const { loadDocumentFromFile } = await import('../TapestrySerializer');

      const fileMock = { name: 'test.json' };
      const inputMock = {
        type: '',
        accept: '',
        click: vi.fn(),
        files: [fileMock],
        onchange: null as any
      };

      vi.spyOn(document, 'createElement').mockReturnValue(inputMock as any);

      const readAsTextSpy = vi.fn(function(this: any) {
        this.result = 'invalid json data';
        if (this.onload) this.onload();
      });

      vi.stubGlobal('FileReader', class {
        readAsText = readAsTextSpy;
      });

      const promise = loadDocumentFromFile();

      if (inputMock.onchange) {
        inputMock.onchange(new Event('change') as any);
      }

      await expect(promise).rejects.toThrow(SyntaxError);
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
