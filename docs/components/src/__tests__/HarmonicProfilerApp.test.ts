import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../HarmonicProfilerApp';

describe('HarmonicProfilerApp', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    // Mock ResizeObserver
    vi.stubGlobal('ResizeObserver', class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should render and initialize properly', () => {
    const el = document.createElement('ppt-harmonic-profiler-app');
    document.body.appendChild(el);
    expect(el.shadowRoot).toBeTruthy();

    // Check if main app container exists
    const appContainer = el.shadowRoot!.querySelector('.app-container');
    expect(appContainer).toBeTruthy();

    // Should start in empty state
    expect(appContainer?.classList.contains('empty-state')).toBe(true);

    // Check preamble panels
    const preambleLeft = el.shadowRoot!.querySelector('#preamble-left');
    const preambleRight = el.shadowRoot!.querySelector('#preamble-right');
    expect(preambleLeft).toBeTruthy();
    expect(preambleRight).toBeTruthy();
  });

  it('should add a chord and remove empty state', () => {
    const el = document.createElement('ppt-harmonic-profiler-app');
    document.body.appendChild(el);

    const solfegeInput = el.shadowRoot!.querySelector('#chord-input') as HTMLInputElement;
    const addBtn = el.shadowRoot!.querySelector('#add-chord-btn') as HTMLButtonElement;

    expect(solfegeInput).toBeTruthy();
    expect(addBtn).toBeTruthy();

    solfegeInput.value = 'Do Mi So';
    addBtn.click();

    const appContainer = el.shadowRoot!.querySelector('.app-container');
    expect(appContainer?.classList.contains('empty-state')).toBe(false);

    // Verify chord was added
    const tableContainer = el.shadowRoot!.querySelector('#table-container');
    expect(tableContainer).toBeTruthy();
    expect(tableContainer!.innerHTML).toContain('ppt-uniform-solfege');
  });

  it('should toggle walkthrough panel', () => {
    const el = document.createElement('ppt-harmonic-profiler-app');
    document.body.appendChild(el);

    const solfegeInput = el.shadowRoot!.querySelector('#chord-input') as HTMLInputElement;
    const addBtn = el.shadowRoot!.querySelector('#add-chord-btn') as HTMLButtonElement;

    solfegeInput.value = 'Do Mi So';
    addBtn.click();

    // The walkthrough panel should be hidden initially
    const walkthroughPanel = el.shadowRoot!.querySelector('#walkthrough-panel') as HTMLElement;
    expect(walkthroughPanel.classList.contains('active')).toBe(false);

    // Find and click a heatmap cell
    const cell = el.shadowRoot!.querySelector('.heatmap-cell') as HTMLElement;
    if (cell) {
        cell.click();
        expect(walkthroughPanel.classList.contains('active')).toBe(true);
    }
  });

  it('should toggle add chord button visibility', () => {
    const el = document.createElement('ppt-harmonic-profiler-app');
    document.body.appendChild(el);

    const solfegeInput = el.shadowRoot!.querySelector('#chord-input') as HTMLInputElement;
    const addBtn = el.shadowRoot!.querySelector('#add-chord-btn') as HTMLButtonElement;

    solfegeInput.value = 'Do Mi So';
    addBtn.click();

    const toggleBtn = el.shadowRoot!.querySelector('#toggle-add-chord-btn') as HTMLButtonElement;
    expect(toggleBtn).toBeTruthy();
  });
});
