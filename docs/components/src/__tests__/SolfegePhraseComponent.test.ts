import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SolfegePhraseComponent } from '../SolfegePhraseComponent';
import { UniformSolfegeComponent } from '../UniformSolfegeComponent';
import '../SolfegePhraseComponent';
import '../UniformSolfegeComponent';

describe('SolfegePhraseComponent', () => {
  let element: SolfegePhraseComponent;
  let resizeObserverMock: any;

  beforeEach(() => {
    resizeObserverMock = class ResizeObserver {
      constructor(callback: any) {
        (this as any).callback = callback;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    };
    // Keep a spy on the constructor so we can track calls if needed
    const spy = vi.spyOn(global, 'ResizeObserver', 'get').mockReturnValue(resizeObserverMock);

    element = document.createElement('ppt-solfege-phrase') as SolfegePhraseComponent;
    document.body.appendChild(element);
  });

  afterEach(() => {
    if (element.parentElement) {
      element.parentElement.removeChild(element);
    }
    vi.restoreAllMocks();
  });

  it('should define component metadata correctly', () => {
    expect(SolfegePhraseComponent.componentDef.displayName).toBe('Solfege Phrase');
    expect(SolfegePhraseComponent.pptMetadata.phrase.type).toBe('string');
  });

  it('should initialize ResizeObserver', () => {
    // The spy or property might be checked differently, let's just check the property was set up
    // In actual creation, _resizeObserver is attached.
    expect((element as any)._resizeObserver).toBeDefined();
  });

  it('should render a simple phrase of solfege tokens', async () => {
    element.setAttribute('phrase', 'Do Re Mi');
    // For Custom Elements in happy-dom, force render sequence if needed
    (element as any).render();

    const shadow = element.shadowRoot;
    expect(shadow).toBeTruthy();

    const container = shadow!.querySelector('.phrase-container');
    expect(container).toBeTruthy();

    const cells = shadow!.querySelectorAll('.phrase-cell');
    expect(cells.length).toBe(3);

    // Each cell should contain one UniformSolfegeComponent
    const solfeges = shadow!.querySelectorAll('ppt-uniform-solfege');
    expect(solfeges.length).toBe(3);

    expect(solfeges[0].getAttribute('solfege')).toBe('Do');
    expect(solfeges[1].getAttribute('solfege')).toBe('Re');
    expect(solfeges[2].getAttribute('solfege')).toBe('Mi');
  });

  it('should render half-size tokens grouped in the same cell', async () => {
    element.setAttribute('phrase', '[Do] [Re] Mi');
    (element as any).render();

    const shadow = element.shadowRoot;
    const cells = shadow!.querySelectorAll('.phrase-cell');

    // [do] [re] in first cell, mi in second cell
    expect(cells.length).toBe(2);

    const firstCellSolfeges = cells[0].querySelectorAll('ppt-uniform-solfege');
    expect(firstCellSolfeges.length).toBe(2);
    expect(firstCellSolfeges[0].getAttribute('solfege')).toBe('Do');
    expect(firstCellSolfeges[0].getAttribute('size')).toBe('0.5em');
    expect(firstCellSolfeges[1].getAttribute('solfege')).toBe('Re');
    expect(firstCellSolfeges[1].getAttribute('size')).toBe('0.5em');

    const secondCellSolfeges = cells[1].querySelectorAll('ppt-uniform-solfege');
    expect(secondCellSolfeges.length).toBe(1);
    expect(secondCellSolfeges[0].getAttribute('solfege')).toBe('Mi');
  });

  it('should render invalid tokens as spans', async () => {
    element.setAttribute('phrase', 'Do invalid_xyz Mi');
    (element as any).render();

    const shadow = element.shadowRoot;
    const cells = shadow!.querySelectorAll('.phrase-cell');
    expect(cells.length).toBe(3);

    const solfeges = shadow!.querySelectorAll('ppt-uniform-solfege');
    expect(solfeges.length).toBe(2); // 'do' and 'mi'

    const invalidSpans = shadow!.querySelectorAll('.invalid-token');
    expect(invalidSpans.length).toBe(1);
    expect(invalidSpans[0].textContent).toBe('invalid_xyz');
  });

  it('should pass layout and color attributes to children', async () => {
    element.setAttribute('phrase', 'Do');
    element.setAttribute('color', '#ff0000');
    element.setAttribute('diacritic-color', '#00ff00');
    element.setAttribute('annotation-align', 'top');
    element.setAttribute('annotation-padding', '5px');

    (element as any).render();

    const solfege = element.shadowRoot!.querySelector('ppt-uniform-solfege');
    expect(solfege).toBeTruthy();
    expect(solfege!.getAttribute('color')).toBe('#ff0000');
    expect(solfege!.getAttribute('diacritic-color')).toBe('#00ff00');
    expect(solfege!.getAttribute('annotation-align')).toBe('top');
    expect(solfege!.getAttribute('annotation-padding')).toBe('5px');
  });

  it('should trigger re-render on resize (ResizeObserver callback)', async () => {
    element.setAttribute('phrase', 'Do');
    (element as any).render();

    // Call the resize observer callback to simulate resize
    const observer = (element as any)._resizeObserver;
    if (observer && typeof observer.callback === 'function') {
      observer.callback([{
        contentRect: { width: 500, height: 100 }
      }]);
    }

    const container = element.shadowRoot!.querySelector('.phrase-container') as HTMLElement;
    expect(container.style.getPropertyValue('--cq-width')).toBe('500px');
    expect(container.style.getPropertyValue('--cq-height')).toBe('100px');
  });
});
