import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TitleComponent } from '../TitleComponent.js';

describe('TitleComponent', () => {
  beforeEach(() => {
    // Component already registered when module loaded
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should define component properties', () => {
    expect(TitleComponent.componentDef.displayName).toBe('Title');
    expect(TitleComponent.pptMetadata.text).toBeDefined();
  });

  it('should render and update text', () => {
    const instance = document.createElement('ppt-title') as any;
    document.body.appendChild(instance);

    const titleEl = instance.shadowRoot.querySelector('.title');
    expect(titleEl.textContent).toBe('Title');

    instance.text = 'New Title';
    expect(titleEl.textContent).toBe('New Title');

    // Also test through setAttribute which triggers attributeChangedCallback
    instance.setAttribute('text', 'Another Title');
    expect(titleEl.textContent).toBe('Another Title');
  });
});
