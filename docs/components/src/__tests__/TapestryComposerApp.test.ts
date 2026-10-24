import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../TapestryComposerApp';

describe('TapestryComposerApp', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should render correctly', () => {
    const el = document.createElement('ppt-tapestry-composer-app');
    document.body.appendChild(el);
    expect(el.shadowRoot).not.toBeNull();
  });
});
