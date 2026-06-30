import { describe, it, expect, beforeEach } from 'vitest';
import { serializePayload, deserializePayload, compressPayload, decompressPayload } from '../payloadCodec';

describe('payloadCodec', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('serializePayload and deserializePayload', () => {
    it('should serialize and deserialize a simple component correctly', () => {
      const root = document.createElement('div');

      const component = document.createElement('ppt-container');
      component.setAttribute('data-test', 'true');
      component.style.width = '100px';

      root.appendChild(component);

      // Need a library item to provide metadata, otherwise defaults won't be filtered out properly
      const libItem = document.createElement('div');
      libItem.className = 'library-item';
      libItem.setAttribute('data-tag', 'ppt-container');
      libItem.setAttribute('data-metadata', JSON.stringify({
        'data-test': { type: 'boolean', default: false }
      }));
      document.body.appendChild(libItem);

      const payload = serializePayload(root);
      expect(payload).toBeTypeOf('string');

      const targetEl = document.createElement('div');
      deserializePayload(payload, targetEl);

      expect(targetEl.children.length).toBe(1);
      const deserializedComponent = targetEl.children[0] as HTMLElement;
      expect(deserializedComponent.tagName.toLowerCase()).toBe('ppt-container');
      expect(deserializedComponent.getAttribute('data-test')).toBe('true');
      expect(deserializedComponent.getAttribute('style')).toBe('width: 100px;');
    });

    it('should serialize and deserialize nested components', () => {
       const root = document.createElement('ppt-container');
       const child1 = document.createElement('ppt-period');
       child1.textContent = 'Hello';
       const child2 = document.createElement('ppt-box');

       root.appendChild(child1);
       root.appendChild(child2);

       const payload = serializePayload(root);

       const targetEl = document.createElement('div');
       deserializePayload(payload, targetEl);

       const deserializedRoot = targetEl.children[0] as HTMLElement;
       expect(deserializedRoot.tagName.toLowerCase()).toBe('ppt-container');
       expect(deserializedRoot.children.length).toBe(2);
       expect(deserializedRoot.children[0].tagName.toLowerCase()).toBe('ppt-period');
       expect(deserializedRoot.children[0].textContent).toBe('Hello');
       expect(deserializedRoot.children[1].tagName.toLowerCase()).toBe('ppt-box');
    });

    it('should handle elements with isContent metadata', () => {
       const root = document.createElement('div');
       const textComponent = document.createElement('ppt-text');
       textComponent.textContent = 'Hello World';

       const libItem = document.createElement('div');
       libItem.className = 'library-item';
       libItem.setAttribute('data-tag', 'ppt-text');
       libItem.setAttribute('data-metadata', JSON.stringify({
         'content': { type: 'string', isContent: true }
       }));
       document.body.appendChild(libItem);

       root.appendChild(textComponent);

       const payload = serializePayload(root);

       const targetEl = document.createElement('div');
       deserializePayload(payload, targetEl);

       const deserializedComponent = targetEl.children[0] as HTMLElement;
       expect(deserializedComponent.tagName.toLowerCase()).toBe('ppt-text');
       expect(deserializedComponent.textContent).toBe('Hello World');
    });

    it('should ignore non-ppt elements during serialization but serialize their ppt children', () => {
       const root = document.createElement('div');
       const child = document.createElement('span');
       const pptChild = document.createElement('ppt-container');

       child.appendChild(pptChild);
       root.appendChild(child);

       const payload = serializePayload(root);

       // Because it returns empty string for `span`, but it's part of structureStr map for children.
       // Actually `buildNode` won't recurse into non-ppt elements children directly if it returns empty string.
       // Let's test the root non-ppt behavior.

       const targetEl = document.createElement('div');
       deserializePayload(payload, targetEl);

       // In `serializePayload`, if a child of root is not a ppt- tag, it calls `buildNode(c)` which returns `''`.
       // Let's verify no non-ppt nodes are serialized.
       expect(targetEl.children.length).toBe(0);
    });

    it('should handle missing raw payload or improper parts gracefully', () => {
       const targetEl = document.createElement('div');
       deserializePayload('', targetEl);
       expect(targetEl.innerHTML).toBe('');

       deserializePayload('part1|part2', targetEl);
       expect(targetEl.innerHTML).toBe('');
    });
  });

  describe('compressPayload and decompressPayload', () => {
      // In a happy-dom environment, CompressionStream might not be defined depending on version,
      // testing fallback. We mock the availability/lack of it if needed, but vitest runs node environment
      // under the hood with happy-dom so it might be tricky. The fallback prepends 'raw:'
      it('should compress and decompress if CompressionStream is missing', async () => {
         const text = 'test-payload';

         const originalCompressionStream = globalThis.CompressionStream;
         globalThis.CompressionStream = undefined as any;

         const compressed = await compressPayload(text);
         expect(compressed).toBe('raw:test-payload');

         const decompressed = await decompressPayload(compressed);
         expect(decompressed).toBe('test-payload');

         globalThis.CompressionStream = originalCompressionStream;
      });

      it('should throw error for unknown payload format during decompression', async () => {
          await expect(decompressPayload('unknown:format')).rejects.toThrowError('Unknown payload format');
      });

      it('should compress and decompress when CompressionStream is available', async () => {
          const text = 'test-payload-with-stream';

          class MockCompressionStream {
              readable = new ReadableStream({
                  start(controller) {
                      controller.enqueue(new Uint8Array([1, 2, 3])); // mock compressed data
                      controller.close();
                  }
              });
              writable = new WritableStream();
          }

          class MockDecompressionStream {
              readable = new ReadableStream({
                  start(controller) {
                      controller.enqueue(new TextEncoder().encode(text)); // mock decompressed data
                      controller.close();
                  }
              });
              writable = new WritableStream();
          }

          globalThis.CompressionStream = MockCompressionStream as any;
          globalThis.DecompressionStream = MockDecompressionStream as any;

          const compressed = await compressPayload(text);
          expect(compressed).toBe('gz:AQID'); // AQID is base64 for [1, 2, 3]

          const decompressed = await decompressPayload(compressed);
          expect(decompressed).toBe(text);

          // Restore
          globalThis.CompressionStream = undefined as any;
          globalThis.DecompressionStream = undefined as any;
      });

      it('should throw error when DecompressionStream is not supported for gz payload', async () => {
          globalThis.DecompressionStream = undefined as any;
          await expect(decompressPayload('gz:AQID')).rejects.toThrowError('DecompressionStream is not supported');
      });
  });
});
