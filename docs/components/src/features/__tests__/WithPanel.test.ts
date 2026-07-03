import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { WithPanel } from '../WithPanel.js';

describe('WithPanel', () => {
  class MockBaseElement extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  }

  const PanelElementClass = WithPanel(MockBaseElement);

  beforeEach(() => {
    if (!customElements.get('mock-panel-element')) {
      customElements.define('mock-panel-element', PanelElementClass);
    }
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should render panel content with shadow DOM', () => {
    const instance = document.createElement('mock-panel-element') as any;
    document.body.appendChild(instance);

    expect(instance.shadowRoot).not.toBeNull();
    const panelInner = instance.shadowRoot.querySelector('.panel-inner');
    expect(panelInner).not.toBeNull();

    const slot = instance.shadowRoot.querySelector('slot');
    expect(slot).not.toBeNull();
  });
});
