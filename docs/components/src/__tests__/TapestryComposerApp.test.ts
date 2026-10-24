import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../TapestryComposerApp';

describe('TapestryComposerApp', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn()
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should render and initialize properly', () => {
    const el = document.createElement('ppt-tapestry-composer-app');
    document.body.appendChild(el);
    expect(el.shadowRoot).toBeTruthy();

    // Check main areas
    expect(el.shadowRoot!.querySelector('.workspace')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('.detail')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('.graph-toolbar')).toBeTruthy();
  });

  it('should add a coil node', () => {
    const el = document.createElement('ppt-tapestry-composer-app');
    document.body.appendChild(el);

    const addCoilBtn = el.shadowRoot!.querySelector('#btn-add-coil') as HTMLButtonElement;
    expect(addCoilBtn).toBeTruthy();

    addCoilBtn.click();

    const nodes = el.shadowRoot!.querySelectorAll('.gnode');
    expect(nodes.length).toBeGreaterThan(0);
    expect(nodes[nodes.length - 1].querySelector('.n-pill')?.textContent).toBe('coil');
  });

  it('should add a weave node', () => {
    const el = document.createElement('ppt-tapestry-composer-app');
    document.body.appendChild(el);

    const addWeaveBtn = el.shadowRoot!.querySelector('#btn-add-weave') as HTMLButtonElement;
    expect(addWeaveBtn).toBeTruthy();

    addWeaveBtn.click();

    const nodes = el.shadowRoot!.querySelectorAll('.gnode');
    expect(nodes.length).toBeGreaterThan(0);
    expect(nodes[nodes.length - 1].querySelector('.n-pill')?.textContent).toBe('weave');
  });

  it('should toggle sidebar', () => {
    const el = document.createElement('ppt-tapestry-composer-app');
    document.body.appendChild(el);

    const toggleBtn = el.shadowRoot!.querySelector('#btn-toggle-sidebar') as HTMLButtonElement;
    const sidebar = el.shadowRoot!.querySelector('#sidebar') as HTMLElement;

    expect(toggleBtn).toBeTruthy();
    expect(sidebar).toBeTruthy();
    expect(sidebar.classList.contains('collapsed')).toBe(false);

    toggleBtn.click();
    expect(sidebar.classList.contains('collapsed')).toBe(true);

    toggleBtn.click();
    expect(sidebar.classList.contains('collapsed')).toBe(false);
  });
});
