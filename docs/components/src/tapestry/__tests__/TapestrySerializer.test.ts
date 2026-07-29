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
  downloadDocument,
  loadDocumentFromFile,
  encodePayload,
  decodePayload
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

      doc.threads.push({
          id: 'th1',
          kind: 'coil-inherit',
          sourceNodeId: 'n1',
          targetNodeId: 'n2'
      } as any);

      const json = serialiseDocument(doc);
      expect(typeof json).toBe('string');

      const parsed = deserialiseDocument(json);
      expect(parsed.title).toBe('Test Doc');
      expect(parsed.nodes).toHaveLength(1);
      expect(parsed.nodes[0].label).toBe('Test Coil');
      expect(parsed.version).toBe(2);
      expect(parsed.threads[0].repeatCount).toBe(1); // line 45-46 branch coverage
    });

    it('should assign default thread kind', () => {
        const v1Json = JSON.stringify({
            id: '123',
            title: 'V1 Doc',
            nodes: [],
            threads: [{ sourceNodeId: 'n1', targetNodeId: 'n2' }], // missing kind
            globalKnot: { doPitch: 'C4', bpm: 120 }
        });

        const parsed = deserialiseDocument(v1Json);
        expect(parsed.threads[0].kind).toBe('weave-compose');
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

    it('should return empty array if local storage for recent list has invalid JSON', () => {
      localStorage.setItem('ppt-tapestry-recent', 'invalid json');
      const loaded = loadRecentList();
      expect(loaded).toEqual([]); // line 84 coverage
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

    it('should catch error when localstorage is full/unavailable', () => {
       vi.stubGlobal('localStorage', {
         setItem: vi.fn(() => { throw new Error('Storage Full'); }),
         getItem: vi.fn(() => null)
       });

       const doc = createDocument('Save Test');
       expect(() => saveToLocalStorage(doc)).not.toThrow();
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

  describe('DOM downloads and file loading', () => {
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

    it('should reject file loading when no file is selected', async () => {
        const inputMock = {
            type: '',
            accept: '',
            click: vi.fn(),
            onchange: null as any,
            files: [] as any[]
        };
        vi.spyOn(document, 'createElement').mockReturnValue(inputMock as any);

        const promise = loadDocumentFromFile();

        expect(inputMock.click).toHaveBeenCalled();

        // Trigger onchange
        inputMock.onchange();

        await expect(promise).rejects.toThrow('No file selected');
    });

    it('should load a document from file', async () => {
        const inputMock = {
            type: '',
            accept: '',
            click: vi.fn(),
            onchange: null as any,
            files: [new Blob(['{"version":2,"id":"123","title":"Loaded Doc"}'])] as any[]
        };
        vi.spyOn(document, 'createElement').mockReturnValue(inputMock as any);

        // Mock FileReader as a class
        class MockFileReaderAuto {
            onload: any;
            onerror: any;
            result = '{"version":2,"id":"123","title":"Loaded Doc"}';
            readAsText() {
                setTimeout(() => {
                    if (this.onload) this.onload();
                }, 0);
            }
        }
        vi.stubGlobal('FileReader', MockFileReaderAuto);

        const promise2 = loadDocumentFromFile();
        inputMock.onchange();

        const doc = await promise2;
        expect(doc.title).toBe('Loaded Doc');
    });

    it('should reject file loading when JSON is invalid', async () => {
        const inputMock = {
            type: '',
            accept: '',
            click: vi.fn(),
            onchange: null as any,
            files: [new Blob(['invalid json'])] as any[]
        };
        vi.spyOn(document, 'createElement').mockReturnValue(inputMock as any);

        class MockFileReaderAutoInvalid {
            onload: any;
            onerror: any;
            result = 'invalid json';
            readAsText() {
                setTimeout(() => {
                    if (this.onload) this.onload();
                }, 0);
            }
        }
        vi.stubGlobal('FileReader', MockFileReaderAutoInvalid);

        const promise = loadDocumentFromFile();

        inputMock.onchange();

        await expect(promise).rejects.toThrow();
    });

    it('should reject file loading on file reader error', async () => {
        const inputMock = {
            type: '',
            accept: '',
            click: vi.fn(),
            onchange: null as any,
            files: [new Blob(['valid json but read fails'])] as any[]
        };
        vi.spyOn(document, 'createElement').mockReturnValue(inputMock as any);

        class MockFileReaderAutoError {
            onload: any;
            onerror: any;
            error = new Error('Read failed');
            readAsText() {
                setTimeout(() => {
                    if (this.onerror) this.onerror();
                }, 0);
            }
        }
        vi.stubGlobal('FileReader', MockFileReaderAutoError);

        const promise = loadDocumentFromFile();

        inputMock.onchange();

        await expect(promise).rejects.toThrow('Read failed');
    });
  });

  describe('encode/decode payload', () => {
      it('should encode and decode a document correctly', async () => {
          const doc = createDocument('Encoded Doc');

          class MockCompressionStream {
              readable = new ReadableStream({
                  start(controller) {
                      controller.enqueue(new Uint8Array([1, 2, 3]));
                      controller.close();
                  }
              });
              writable = new WritableStream();
          }

          class MockDecompressionStream {
              readable = new ReadableStream({
                  start(controller) {
                      controller.enqueue(new TextEncoder().encode(serialiseDocument(doc)));
                      controller.close();
                  }
              });
              writable = new WritableStream();
          }

          vi.stubGlobal('CompressionStream', MockCompressionStream);
          vi.stubGlobal('DecompressionStream', MockDecompressionStream);

          const payload = await encodePayload(doc);
          expect(payload).toBeTypeOf('string');

          const decoded = await decodePayload(payload);
          expect(decoded.title).toBe('Encoded Doc');
      });
  });
});
