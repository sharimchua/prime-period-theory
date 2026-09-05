import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { getPPTComponents } from '../parseComponents.js';

vi.mock('node:fs', async (importOriginal) => {
  const actual = await importOriginal() as typeof fs;
  return {
    ...actual,
    existsSync: vi.fn(),
    readdirSync: vi.fn(),
    readFileSync: vi.fn(),
  };
});

describe('parseComponents.getPPTComponents', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return empty array if srcDir does not exist', () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);
    const res = getPPTComponents();
    expect(res).toEqual([]);
  });

  it('should parse a basic component with metadata', () => {
    const srcDir = path.resolve(process.cwd(), 'components/src');

    vi.mocked(fs.existsSync).mockImplementation((p: fs.PathLike) => {
        if (p.toString().includes('features')) return true;
        if (p.toString().includes('components/src')) return true;
        return false;
    });

    vi.mocked(fs.readdirSync).mockImplementation((p: fs.PathLike, options?: any) => {
        if (p.toString().includes('features')) return [] as unknown as any[];
        if (p.toString().includes('components/src')) return ['TestComponent.ts', 'BasePPTComponent.ts'] as unknown as any[];
        return [] as unknown as any[];
    });

    vi.mocked(fs.readFileSync).mockImplementation((p: fs.PathOrFileDescriptor, options?: any) => {
        const pStr = p.toString();
        if (pStr.includes('BasePPTComponent.ts')) {
            return `
            export class BasePPTComponent extends HTMLElement {
                static get observedAttributes() { return ['base-attr']; }
                static get pptMetadata() { return { base: 1 }; }
            }
            `;
        }
        if (pStr.includes('TestComponent.ts')) {
            return `
            export class TestComponent extends BasePPTComponent {
                static get observedAttributes() { return ['test-attr']; }
                static get pptMetadata() {
                    return {
                        ...super.pptMetadata,
                        test: 2
                    };
                }
                static get componentDef() {
                    return {
                        displayName: 'Test',
                        familyColor: '#123456',
                        acceptsChildren: ['*'],
                        canNestIn: ['*']
                    };
                }
            }
            customElements.define('ppt-test', TestComponent);
            `;
        }
        return '';
    });

    const res = getPPTComponents();
    expect(res).toHaveLength(1);
    expect(res[0].tagName).toBe('ppt-test');
    expect(res[0].className).toBe('TestComponent');
    expect(res[0].attributes).toContain('base-attr');
    expect(res[0].attributes).toContain('test-attr');
    expect(res[0].metadata).toEqual({ base: 1, test: 2 });
    expect(res[0].componentDef).toEqual({
        displayName: 'Test',
        familyColor: '#123456',
        acceptsChildren: ['*'],
        canNestIn: ['*']
    });
  });
});
