import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../TapestryComposerApp';

describe('TapestryComposerApp', () => {
  beforeEach(() => {
    //
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should have componentDef', () => {
    const el = document.createElement('ppt-tapestry-composer-app') as any;
    expect(el.constructor.componentDef).toBeDefined();
    expect(el.constructor.componentDef.displayName).toBe('TapestryComposerApp');
  });

  it('should render successfully', () => {
    const el = document.createElement('ppt-tapestry-composer-app') as any;
    document.body.appendChild(el);
    expect(el.shadowRoot).not.toBeNull();
  });
});
