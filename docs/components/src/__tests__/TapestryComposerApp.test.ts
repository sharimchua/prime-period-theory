import { describe, it, expect } from 'vitest';
import { TapestryComposerApp } from '../TapestryComposerApp';

describe('TapestryComposerApp', () => {
  it('should be defined', () => {
    expect(TapestryComposerApp).toBeDefined();
  });

  it('should create an element', () => {
    const el = document.createElement('ppt-tapestry-composer-app');
    expect(el).not.toBeNull();
  });

  it('should render and attach shadow root', () => {
    const el = document.createElement('ppt-tapestry-composer-app') as TapestryComposerApp;
    document.body.appendChild(el);
    expect(el.shadowRoot).not.toBeNull();
    document.body.removeChild(el);
  });
});
