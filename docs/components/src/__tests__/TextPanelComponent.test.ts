import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TextPanelComponent } from '../TextPanelComponent.js';

describe('TextPanelComponent', () => {
  beforeEach(() => {
    // Component already registered when module loaded
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should define component properties', () => {
    expect(TextPanelComponent.componentDef.displayName).toBe('Text Panel');
    expect(TextPanelComponent.pptMetadata.content).toBeDefined();
  });

  it('should render and update content', () => {
    const instance = document.createElement('ppt-text-panel') as any;
    document.body.appendChild(instance);

    const contentEl = instance.shadowRoot.querySelector('.text-content');
    expect(contentEl.textContent).toBe('Text Content');

    instance.content = 'New Content';
    expect(contentEl.textContent).toBe('New Content');

    instance.setAttribute('content', 'Another Content');
    expect(contentEl.textContent).toBe('Another Content');
  });
});
