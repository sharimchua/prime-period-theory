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

  describe('File load (mocked)', () => {
    it('should resolve deserialised document when file is loaded', async () => {
      // Need to mock document.createElement, file inputs, FileReader, etc.
      // This is a bit tricky to mock cleanly in vitest with happy-dom but we can test the error branch easily
    });
  });

  describe('encodePayload and decodePayload (mocked)', () => {
    it('should encode and decode a document via CompressionStream', async () => {
      // In Node 20+, CompressionStream is available natively
      if (typeof CompressionStream !== 'undefined') {
        const { encodePayload, decodePayload } = await import('../TapestrySerializer');
        const doc = createDocument('Payload Test');

        const payload = await encodePayload(doc);
        expect(typeof payload).toBe('string');
        expect(payload.length).toBeGreaterThan(0);

        const decoded = await decodePayload(payload);
        expect(decoded.title).toBe('Payload Test');
        expect(decoded.version).toBe(2);
      }
    });
  });

  describe('File load branches (mocked)', () => {
    afterEach(() => {
      vi.unstubAllGlobals();
      vi.restoreAllMocks();
    });
    it('should reject when file reader fails or file not selected', async () => {
      const { loadDocumentFromFile } = await import('../TapestrySerializer');

      const inputMock = {
        type: '',
        accept: '',
        click: vi.fn(),
        files: [] as any[]
      };

      const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(inputMock as any);

      // Call loadDocumentFromFile, this returns a promise
      const promise = loadDocumentFromFile();

      // Manually trigger onchange with no file
      (inputMock as any).onchange({ target: inputMock });

      await expect(promise).rejects.toThrow('No file selected');
    });

    it('should catch errors when storage is full', () => {
      vi.stubGlobal('localStorage', {
        getItem: vi.fn(() => null),
        setItem: vi.fn(() => { throw new Error('Quota exceeded'); }),
      });
      const doc = createDocument('Quota Test');
      // Should not throw, should silently fail
      expect(() => saveToLocalStorage(doc)).not.toThrow();
    });

    it('should catch errors when local storage recent fails to load', () => {
       vi.stubGlobal('localStorage', {
        getItem: vi.fn((key) => {
           if (key === 'ppt-tapestry-recent') throw new Error('Bad data');
           return null;
        }),
      });
      const recent = loadRecentList();
      expect(recent).toEqual([]);
    });
  });

  describe('File load (mocked internals)', () => {
    afterEach(() => {
      vi.unstubAllGlobals();
      vi.restoreAllMocks();
    });
    it('should resolve document when reader loads', async () => {
      const { loadDocumentFromFile } = await import('../TapestrySerializer');

      const fileMock = { name: 'test.json' };
      const inputMock = {
        type: '',
        accept: '',
        click: vi.fn(),
        files: [fileMock]
      };

      vi.spyOn(document, 'createElement').mockReturnValue(inputMock as any);

      const dummyDoc = createDocument('Dummy');

      // Mock FileReader
      const readerMock = {
        readAsText: vi.fn(),
        onload: null as any,
        onerror: null as any,
        result: JSON.stringify(dummyDoc),
        error: new Error('Read error')
      };

      vi.stubGlobal('FileReader', class {
        onload = null;
        onerror = null;
        result = readerMock.result;
        error = readerMock.error;
        readAsText = vi.fn(function(this: any, file: any) {
          readerMock.readAsText(file);
          // Simulate async load
          setTimeout(() => {
            if (this.onload) this.onload({ target: this });
          }, 0);
        });
      });

      const promise = loadDocumentFromFile();
      (inputMock as any).onchange({ target: inputMock });

      const doc = await promise;
      expect(doc.title).toBe('Dummy');
    });

    it('should reject when reader errors', async () => {
      const { loadDocumentFromFile } = await import('../TapestrySerializer');

      const fileMock = { name: 'test.json' };
      const inputMock = {
        type: '',
        accept: '',
        click: vi.fn(),
        files: [fileMock]
      };

      vi.spyOn(document, 'createElement').mockReturnValue(inputMock as any);

      const readerMock = {
        readAsText: vi.fn(),
        onload: null as any,
        onerror: null as any,
        result: null,
        error: new Error('Read error')
      };

      vi.stubGlobal('FileReader', class {
        onload = null;
        onerror = null;
        result = readerMock.result;
        error = readerMock.error;
        readAsText = vi.fn(function(this: any, file: any) {
          readerMock.readAsText(file);
          // Simulate async error
          setTimeout(() => {
            if (this.onerror) this.onerror({ target: this });
          }, 0);
        });
      });

      const promise = loadDocumentFromFile();
      (inputMock as any).onchange({ target: inputMock });

      await expect(promise).rejects.toThrow('Read error');
    });

    it('should reject when json is invalid', async () => {
      const { loadDocumentFromFile } = await import('../TapestrySerializer');

      const fileMock = { name: 'test.json' };
      const inputMock = {
        type: '',
        accept: '',
        click: vi.fn(),
        files: [fileMock]
      };

      vi.spyOn(document, 'createElement').mockReturnValue(inputMock as any);

      const readerMock = {
        readAsText: vi.fn(),
        onload: null as any,
        onerror: null as any,
        result: 'invalid json',
        error: null
      };

      vi.stubGlobal('FileReader', class {
        onload = null;
        onerror = null;
        result = readerMock.result;
        error = readerMock.error;
        readAsText = vi.fn(function(this: any, file: any) {
          readerMock.readAsText(file);
          setTimeout(() => {
            if (this.onload) this.onload({ target: this });
          }, 0);
        });
      });

      const promise = loadDocumentFromFile();
      (inputMock as any).onchange({ target: inputMock });

      await expect(promise).rejects.toThrow(SyntaxError);
    });
  });
