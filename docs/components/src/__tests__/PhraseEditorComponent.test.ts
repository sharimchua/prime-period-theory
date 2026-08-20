import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../index';

describe('PhraseEditorComponent', () => {
  beforeEach(() => {
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should render and initialize properly', async () => {
    const el = document.createElement('ppt-phrase-editor');
    document.body.appendChild(el);
    await new Promise(r => setTimeout(r, 0));

    expect(el.shadowRoot).not.toBeNull();
  });
});
