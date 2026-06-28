import { describe, it, expect } from 'vitest';
import { BasePPTComponent } from '../BasePPTComponent';

describe('BasePPTComponent', () => {
    it('should have correct pptMetadata defined', () => {
        const metadata = BasePPTComponent.pptMetadata;
        expect(metadata['min-width']).toBeDefined();
        expect(metadata['min-width'].default).toBe(100);
        expect(metadata['min-width'].type).toBe('number');

        expect(metadata['min-height']).toBeDefined();
        expect(metadata['min-height'].default).toBe(100);
        expect(metadata['min-height'].type).toBe('number');
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
        expect(attributes).toContain('min-width');
        expect(attributes).toContain('min-height');
    });
});
