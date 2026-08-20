import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import '../index';

describe('CoilLayerComponent', () => {
  beforeEach(() => {
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should render and initialize properly', async () => {
    const el = document.createElement('ppt-coil-layer');
    document.body.appendChild(el);
    await new Promise(r => setTimeout(r, 0));

    expect(el.shadowRoot).not.toBeNull();
  });
});
