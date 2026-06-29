import { describe, it, expect } from 'vitest';
import { BasePPTComponent } from '../BasePPTComponent';

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
});
