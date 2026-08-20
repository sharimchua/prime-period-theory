import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import '../index';

describe('CoilRowComponent', () => {
  beforeEach(() => {
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should render and initialize properly', async () => {
    const el = document.createElement('ppt-coil-row');
    document.body.appendChild(el);
    await new Promise(r => setTimeout(r, 0));

    expect(el.shadowRoot).not.toBeNull();
  });
});
