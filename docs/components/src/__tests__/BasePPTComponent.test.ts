import { describe, it, expect } from 'vitest';
import { BasePPTComponent } from '../BasePPTComponent';

class TestPPTComponent extends BasePPTComponent {
  // Test implementation
}
customElements.define('test-ppt-component', TestPPTComponent);

describe('BasePPTComponent', () => {
    it('should have correct pptMetadata defined', () => {
        const metadata = BasePPTComponent.pptMetadata;
        expect(metadata).toEqual({});
    });

    it('should have correct componentDef defined', () => {
        const componentDef = BasePPTComponent.componentDef;
        expect(componentDef.displayName).toBe('Base Component');
        expect(componentDef.familyColor).toBe('#888888');
        expect(componentDef.acceptsChildren).toContain('*');
        expect(componentDef.canNestIn).toContain('*');
    });

    it('should return observedAttributes correctly', () => {
        const attributes = BasePPTComponent.observedAttributes;
        expect(attributes).toEqual([]);
    });

    it('should attach shadow DOM on construction', () => {
        const instance = new TestPPTComponent();
        expect(instance.shadowRoot).not.toBeNull();
        expect(instance.shadowRoot?.mode).toBe('open');
    });

    it('should safely call fallback lifecycle methods without throwing', () => {
        const instance = new TestPPTComponent();
        expect(() => instance.attributeChangedCallback('test', 'old', 'new')).not.toThrow();
        expect(() => instance.connectedCallback()).not.toThrow();
        expect(() => instance.disconnectedCallback()).not.toThrow();
    });

    it('should expose getBaseStyles that includes host styling', () => {
        const instance = new TestPPTComponent();
        // Since getBaseStyles is protected, we need a small workaround or subclass
        class SubComponent extends BasePPTComponent {
            public getStyles() {
                return this.getBaseStyles();
            }
        }
        customElements.define('sub-ppt-component', SubComponent);
        const subInstance = new SubComponent();
        const styles = subInstance.getStyles();
        expect(styles).toContain(':host');
        expect(styles).toContain('display: block');
    });
});
