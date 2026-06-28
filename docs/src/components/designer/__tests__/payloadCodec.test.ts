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
  });
});
