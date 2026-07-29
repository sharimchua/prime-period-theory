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
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
  });

  it('should render correctly', async () => {
    const el = document.createElement('ppt-harmonic-profiler-app') as any;
    document.body.appendChild(el);
    await new Promise(r => setTimeout(r, 0));

    expect(el.shadowRoot).not.toBeNull();
    const title = el.shadowRoot.querySelector('h1');
    expect(title.textContent).toBe('Harmonic Profiles');
  });

  it('should open and close the add chord panel', async () => {
    const el = document.createElement('ppt-harmonic-profiler-app') as any;
    document.body.appendChild(el);
    await new Promise(r => setTimeout(r, 0));

    // Open add panel
    const toggleAddBtn = el.shadowRoot.querySelector('#toggle-add-chord-btn');
    toggleAddBtn.click();
    await new Promise(r => setTimeout(r, 0));

    expect(el._isAddChordOpen).toBe(true);

    // Add a chord
    const addBtn = el.shadowRoot.querySelector('#add-chord-btn');
    const input = el.shadowRoot.querySelector('#chord-input');
    input.value = 'Do Mi So';
    addBtn.click();

    await new Promise(r => setTimeout(r, 10));

    // A chord should be added to the list
    expect(el._chords.length).toBe(1);
    expect(el._chords[0].raw).toBe('Do Mi So');
  });

  it('should analyze chord on enter key', async () => {
      const el = document.createElement('ppt-harmonic-profiler-app') as any;
      document.body.appendChild(el);
      await new Promise(r => setTimeout(r, 0));

      const input = el.shadowRoot.querySelector('#chord-input');
      input.value = 'Do Me So';

      // Simulate enter key
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      input.dispatchEvent(event);

      await new Promise(r => setTimeout(r, 10));
      expect(el._chords.length).toBe(1);
      expect(el._chords[0].raw).toBe('Do Me So');
  });

  it('should change analysis parameters', async () => {
      const el = document.createElement('ppt-harmonic-profiler-app') as any;
      document.body.appendChild(el);
      await new Promise(r => setTimeout(r, 0));

      const toggleSettings = el.shadowRoot.querySelector('#toggle-settings-btn');
      toggleSettings.click();

      const jndInput = el.shadowRoot.querySelector('#jnd-input');
      jndInput.value = '20';
      jndInput.dispatchEvent(new Event('change'));

      const depthInput = el.shadowRoot.querySelector('#depth-input');
      depthInput.value = '3';
      depthInput.dispatchEvent(new Event('change'));

      const sigmaInput = el.shadowRoot.querySelector('#sigma-input');
      sigmaInput.value = '2';
      sigmaInput.dispatchEvent(new Event('change'));

      const filterSameTone = el.shadowRoot.querySelector('#filter-same-tone-input');
      filterSameTone.checked = true;
      filterSameTone.dispatchEvent(new Event('change'));

      expect(el._jndCents).toBe(20);
      expect(el._maxDepth).toBe(3);
      expect(el._sigmaMultiplier).toBe(2);
      expect(el._filterSameTone).toBe(true);
  });

  it('should delete a chord', async () => {
    const el = document.createElement('ppt-harmonic-profiler-app') as any;
    document.body.appendChild(el);
    await new Promise(r => setTimeout(r, 0));

    // Add a chord first
    const input = el.shadowRoot.querySelector('#chord-input');
    input.value = 'Do Mi So';
    const addBtn = el.shadowRoot.querySelector('#add-chord-btn');
    addBtn.click();
    await new Promise(r => setTimeout(r, 10));
    expect(el._chords.length).toBe(1);

    // Delete the chord
    const deleteBtn = el.shadowRoot.querySelector('.delete-col');
    if(deleteBtn) deleteBtn.click();

    await new Promise(r => setTimeout(r, 10));
    expect(el._chords.length).toBe(0);
  });
});
