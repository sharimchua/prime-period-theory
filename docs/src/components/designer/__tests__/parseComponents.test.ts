import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseSafeMetadata, getPPTComponents } from '../parseComponents';
import * as fs from 'node:fs';

vi.mock('node:fs', () => {
  return {
    default: {
      existsSync: vi.fn(),
      readdirSync: vi.fn(),
      readFileSync: vi.fn(),
    }
  };
});

describe('parseComponents', () => {
  describe('parseSafeMetadata', () => {
    it('should parse simple objects', () => {
      const objStr = `{ 'min-width': { type: 'number', default: 100 } }`;
      const result = parseSafeMetadata(objStr);
      expect(result).toEqual({ 'min-width': { type: 'number', default: 100 } });
    });

    it('should parse boolean, arrays and unary expressions', () => {
       const objStr = `{
          visible: { type: 'boolean', default: false },
          colors: ['red', 'blue', 'green'],
          offset: -10,
          undef: undefined
       }`;
       const result = parseSafeMetadata(objStr);
       expect(result).toEqual({
           visible: { type: 'boolean', default: false },
           colors: ['red', 'blue', 'green'],
           offset: -10,
           undef: undefined
       });
    });

    it('should throw error for unsupported types', () => {
        const objStr = `{ func: () => {} }`;
        expect(() => parseSafeMetadata(objStr)).toThrowError('Unsupported AST node type: ArrowFunctionExpression');
    });

    it('should throw error for unsupported identifier', () => {
        const objStr = `{ invalidId: someVar }`;
        expect(() => parseSafeMetadata(objStr)).toThrowError('Unsupported identifier: someVar');
    });

    it('should throw error for unsupported unary expression argument', () => {
        const objStr = `{ invalidUnary: -'string' }`;
        expect(() => parseSafeMetadata(objStr)).toThrowError('Unsupported unary expression');
    });

    it('should throw error for unsupported property type in object', () => {
        const objStr = `{ ...someSpread }`;
        expect(() => parseSafeMetadata(objStr)).toThrowError('Unsupported property type: SpreadElement');
    });
  });

  describe('getPPTComponents', () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });

    it('should return empty array if srcDir does not exist', () => {
      vi.mocked(fs.default.existsSync).mockReturnValue(false);

      const components = getPPTComponents();
      expect(components).toEqual([]);
    });

    it('should parse files and extract component metadata successfully', () => {
      vi.mocked(fs.default.existsSync).mockImplementation((pathStr) => {
         const p = pathStr.toString().replace(/\\/g, '/');
         if (p.includes('components/src')) return true;
         if (p.includes('features')) return true; // Mixins dir
         return false;
      });

      vi.mocked(fs.default.readdirSync).mockImplementation((pathStr) => {
         const p = pathStr.toString().replace(/\\/g, '/');
         if (p.endsWith('components/src')) {
            return ['BasePPTComponent.ts', 'TestComponent.ts', 'index.ts'] as any;
         }
         if (p.endsWith('features')) {
            return ['WithResizable.ts'] as any;
         }
         return [] as any;
      });

      vi.mocked(fs.default.readFileSync).mockImplementation((pathStr) => {
         const p = pathStr.toString();
         if (p.endsWith('BasePPTComponent.ts')) {
            return `
              export class BasePPTComponent {
                 static get pptMetadata() {
                    return { baseProp: { type: 'string', default: 'base' } };
                 }
                 static get observedAttributes() {
                    return ['base-attr'];
                 }
              }
            `;
         }
         if (p.endsWith('TestComponent.ts')) {
            return `
              import { BasePPTComponent } from './BasePPTComponent.ts';
              import { WithResizable } from './features/WithResizable.ts';

              export class TestComponent extends BasePPTComponent {
                 static get pptMetadata() {
                    return {
                       ...super.pptMetadata,
                       testProp: { type: 'number', default: 42 }
                    };
                 }
                 static get observedAttributes() {
                    return ['test-attr'];
                 }
                 static get componentDef() {
                    return { displayName: 'Test Component', familyColor: '#ff0000' } as any;
                 }
              }
              customElements.define('ppt-test', TestComponent);
            `;
         }
         if (p.endsWith('WithResizable.ts')) {
            return `
              export function WithResizable(Base) {
                 return class extends Base {
                    static get pptMetadata() {
                       return {
                          ...((Base as any).pptMetadata || {}),
                          resizable: { type: 'boolean', default: false }
                       };
                    }
                 }
              }
            `;
         }
         return '';
      });

      const components = getPPTComponents();

      expect(components).toHaveLength(1);

      const comp = components[0];
      expect(comp.tagName).toBe('ppt-test');
      expect(comp.className).toBe('TestComponent');
      expect(comp.attributes).toContain('base-attr');
      expect(comp.attributes).toContain('test-attr');
      expect(comp.attributes).toContain('resizable');

      expect(comp.metadata.baseProp).toEqual({ type: 'string', default: 'base' });
      expect(comp.metadata.testProp).toEqual({ type: 'number', default: 42 });
      expect(comp.metadata.resizable).toEqual({ type: 'boolean', default: false });

      expect(comp.componentDef.displayName).toBe('TestComponent');
      expect(comp.componentDef.familyColor).toBe('#888888');
    });

    it('should handle missing baseMetadata or mixinMetadata gracefully', () => {
      vi.mocked(fs.default.existsSync).mockImplementation((pathStr) => {
         const p = pathStr.toString().replace(/\\/g, '/');
         if (p.includes('components/src')) return true;
         return false; // Features dir doesn't exist
      });

      vi.mocked(fs.default.readdirSync).mockImplementation((pathStr) => {
         const p = pathStr.toString().replace(/\\/g, '/');
         if (p.endsWith('components/src')) {
            return ['TestComponent2.ts'] as any;
         }
         return [] as any;
      });

      vi.mocked(fs.default.readFileSync).mockImplementation((pathStr) => {
         const p = pathStr.toString();
         if (p.endsWith('TestComponent2.ts')) {
            return `
              export class TestComponent2 {
                 // No metadata, no observed attributes
              }
              customElements.define('ppt-test-2', TestComponent2);
            `;
         }
         return '';
      });

      const components = getPPTComponents();

      expect(components).toHaveLength(1);

      const comp = components[0];
      expect(comp.tagName).toBe('ppt-test-2');
      expect(comp.className).toBe('TestComponent2');
      expect(comp.attributes).toEqual([]);
      expect(comp.metadata).toEqual({});
      expect(comp.componentDef.displayName).toBe('TestComponent2');
      expect(comp.componentDef.familyColor).toBe('#888888');
    });

    it('should handle parent class metadata inheritance when parent is not BasePPTComponent', () => {
      vi.mocked(fs.default.existsSync).mockImplementation((pathStr) => {
         const p = pathStr.toString().replace(/\\/g, '/');
         if (p.includes('components/src')) return true;
         if (p.includes('ParentComponent.ts')) return true;
         return false;
      });

      vi.mocked(fs.default.readdirSync).mockImplementation((pathStr) => {
         const p = pathStr.toString().replace(/\\/g, '/');
         if (p.endsWith('components/src')) {
            return ['ChildComponent.ts'] as any;
         }
         return [] as any;
      });

      vi.mocked(fs.default.readFileSync).mockImplementation((pathStr) => {
         const p = pathStr.toString();
         if (p.endsWith('ParentComponent.ts')) {
             return `
              export class ParentComponent {
                 static get pptMetadata() {
                    return { parentProp: { type: 'string', default: 'parent' } };
                 }
                 static get observedAttributes() {
                    return ['parent-attr'];
                 }
              }
            `;
         }
         if (p.endsWith('ChildComponent.ts')) {
            return `
              import { ParentComponent } from './ParentComponent.ts';

              export class ChildComponent extends ParentComponent {
                 static get pptMetadata() {
                    return {
                       ...super.pptMetadata,
                       childProp: { type: 'number', default: 42 }
                    };
                 }
              }
              customElements.define('ppt-child', ChildComponent);
            `;
         }
         return '';
      });

      const components = getPPTComponents();

      expect(components).toHaveLength(1);

      const comp = components[0];
      expect(comp.tagName).toBe('ppt-child');
      expect(comp.className).toBe('ChildComponent');
      expect(comp.attributes).toContain('parent-attr');
      expect(comp.metadata.parentProp).toEqual({ type: 'string', default: 'parent' });
      expect(comp.metadata.childProp).toEqual({ type: 'number', default: 42 });
    });

  });
});
