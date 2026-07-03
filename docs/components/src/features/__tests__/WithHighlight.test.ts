import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { WithHighlight } from '../WithHighlight.js';

describe('WithHighlight', () => {
  class MockBaseElement extends HTMLElement {
    constructor() {
      super();
    }
  }

  const HighlightElementClass = WithHighlight(MockBaseElement);

  beforeEach(() => {
    if (!customElements.get('mock-highlight-element')) {
      customElements.define('mock-highlight-element', HighlightElementClass);
    }
  });

  afterEach(() => {
    document.body.innerHTML = '';
    const style = document.getElementById('ppt-highlight-styles');
    if (style) {
      style.remove();
    }
  });

  it('should inject global styles on connect', () => {
    const instance = document.createElement('mock-highlight-element') as any;

    expect(document.getElementById('ppt-highlight-styles')).toBeNull();

    document.body.appendChild(instance);

    expect(document.getElementById('ppt-highlight-styles')).not.toBeNull();
  });

  it('should add and remove highlight class', () => {
    const instance = document.createElement('mock-highlight-element') as any;
    document.body.appendChild(instance);

    expect(instance.classList.contains('ppt-highlighted')).toBe(false);

    instance.highlight();
    expect(instance.classList.contains('ppt-highlighted')).toBe(true);

    instance.unhighlight();
    expect(instance.classList.contains('ppt-highlighted')).toBe(false);
  });
});
