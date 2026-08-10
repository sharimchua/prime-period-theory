import { describe, it, expect } from 'vitest';
import { ApplicationLayoutComponent } from '../ApplicationLayoutComponent';

describe('ApplicationLayoutComponent', () => {
  it('should be defined', () => {
    expect(ApplicationLayoutComponent).toBeDefined();
  });

  it('should have correct componentDef', () => {
    expect(ApplicationLayoutComponent.componentDef.displayName).toBe('Application Layout');
  });

  it('should render and attach shadow root', () => {
    const el = document.createElement('ppt-application') as ApplicationLayoutComponent;
    document.body.appendChild(el);
    expect(el.shadowRoot).not.toBeNull();
    document.body.removeChild(el);
  });
});
