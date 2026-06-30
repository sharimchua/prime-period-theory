import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getSerializeTarget, 
  wrapInContainerIfNeeded, 
  generateComposerUrl, 
  loadPayloadIntoCanvas 
} from '../composerIntegration';

describe('composerIntegration', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('getSerializeTarget', () => {
    it('should return the element itself for generic target IDs', () => {
      const el = document.createElement('div');
      el.id = 'some-generic-id';
      document.body.appendChild(el);

      const target = getSerializeTarget(el, 'some-generic-id');
      expect(target).toBe(el);
    });

    it('should handle special showcase cases like demo-step-circle', () => {
      const parent = document.createElement('div');
      const child = document.createElement('div');
      child.id = 'demo-step-circle';
      parent.appendChild(child);
      document.body.appendChild(parent);

      const target = getSerializeTarget(child, 'demo-step-circle');
      expect(target).toBe(parent);
    });

    it('should handle special showcase cases like demo-clock', () => {
      const parent = document.createElement('div');
      const child = document.createElement('div');
      child.id = 'demo-clock';
      parent.appendChild(child);
      document.body.appendChild(parent);

      const target = getSerializeTarget(child, 'demo-clock');
      expect(target).toBe(child);
    });
  });

  describe('wrapInContainerIfNeeded', () => {
    it('should return the element itself if it is already a ppt-container', () => {
      const container = document.createElement('ppt-container');
      const result = wrapInContainerIfNeeded(container);
      expect(result).toBe(container);
    });

    it('should wrap other elements in a ppt-container wrapper', () => {
      const element = document.createElement('ppt-period');
      element.id = 'my-period';
      
      const result = wrapInContainerIfNeeded(element);
      expect(result.tagName.toLowerCase()).toBe('div');
      
      const container = result.children[0] as HTMLElement;
      expect(container.tagName.toLowerCase()).toBe('ppt-container');
      expect(container.getAttribute('resizable')).toBe('true');
      expect(container.style.width).toBe('400px');
      expect(container.style.height).toBe('400px');

      const period = container.children[0] as HTMLElement;
      expect(period.tagName.toLowerCase()).toBe('ppt-period');
      expect(period.id).toBe('my-period');
    });
  });

  describe('showcase to designer E2E integration flow', () => {
    it('should serialize a complex component into a URL and reconstruct it on a canvas', async () => {
      // 1. Build a mock Tonal Clock component structure
      const container = document.createElement('ppt-container');
      container.id = 'demo-clock-container';
      
      const period = document.createElement('ppt-period');
      period.id = 'demo-clock';
      period.setAttribute('shape', 'circle');
      period.setAttribute('starting-angle', '-90');
      
      const step1 = document.createElement('ppt-period-step-circle');
      step1.setAttribute('slot', 'step');
      step1.setAttribute('color', 'red');
      step1.textContent = 'Do';
      
      const step2 = document.createElement('ppt-period-step-circle');
      step2.setAttribute('slot', 'step');
      step2.setAttribute('color', 'blue');
      step2.textContent = 'So';
      
      period.appendChild(step1);
      period.appendChild(step2);
      container.appendChild(period);
      document.body.appendChild(container);

      // 2. Generate the Composer URL from this component
      const origin = 'http://localhost:4321';
      const pathname = '/components/showcase/tonal-clock';
      const composerUrlStr = await generateComposerUrl(container, 'demo-clock-container', origin, pathname);

      // Verify the generated URL structure
      expect(composerUrlStr).toContain('http://localhost:4321/components/designer?payload=');

      // 3. Extract the payload parameter from the URL
      const composerUrl = new URL(composerUrlStr);
      const payload = composerUrl.searchParams.get('payload');
      expect(payload).toBeTypeOf('string');
      expect(payload!.startsWith('gz:') || payload!.startsWith('raw:')).toBe(true);

      // 4. Create a mock canvas and load the payload into it
      const canvas = document.createElement('div');
      canvas.id = 'canvas';
      document.body.appendChild(canvas);

      await loadPayloadIntoCanvas(payload!, canvas);

      // 5. Verify the reconstructed DOM matches the original structure
      expect(canvas.children.length).toBe(1);
      
      const reconstructedContainer = canvas.children[0] as HTMLElement;
      expect(reconstructedContainer.tagName.toLowerCase()).toBe('ppt-container');
      
      const reconstructedPeriod = reconstructedContainer.children[0] as HTMLElement;
      expect(reconstructedPeriod.tagName.toLowerCase()).toBe('ppt-period');
      expect(reconstructedPeriod.getAttribute('shape')).toBe('circle');
      expect(reconstructedPeriod.getAttribute('starting-angle')).toBe('-90');
      
      expect(reconstructedPeriod.children.length).toBe(2);
      
      const reconstructedStep1 = reconstructedPeriod.children[0] as HTMLElement;
      expect(reconstructedStep1.tagName.toLowerCase()).toBe('ppt-period-step-circle');
      expect(reconstructedStep1.getAttribute('slot')).toBe('step');
      expect(reconstructedStep1.getAttribute('color')).toBe('red');
      expect(reconstructedStep1.textContent).toBe('Do');

      const reconstructedStep2 = reconstructedPeriod.children[1] as HTMLElement;
      expect(reconstructedStep2.tagName.toLowerCase()).toBe('ppt-period-step-circle');
      expect(reconstructedStep2.getAttribute('slot')).toBe('step');
      expect(reconstructedStep2.getAttribute('color')).toBe('blue');
      expect(reconstructedStep2.textContent).toBe('So');
    });
  });
});
