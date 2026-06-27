import fs from 'node:fs';
import path from 'node:path';

export interface ComponentMeta {
  tagName: string;
  className: string;
  attributes: string[];
}

export function getPPTComponents(): ComponentMeta[] {
  // We resolve from the current working directory of the astro project
  const srcDir = path.resolve(process.cwd(), 'components/src');
  if (!fs.existsSync(srcDir)) {
    console.warn(`Could not find components directory at ${srcDir}`);
    return [];
  }

  const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');
  const components: ComponentMeta[] = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(srcDir, file), 'utf-8');
    
    // Match customElements.define('ppt-period', PeriodComponent)
    const defineMatch = content.match(/customElements\.define\(\s*['"]([^'"]+)['"]\s*,\s*([A-Za-z0-9_]+)\s*\)/);
    if (!defineMatch) continue;

    const tagName = defineMatch[1];
    const className = defineMatch[2];

    // Match observedAttributes array
    let attributes: string[] = ['interactive', 'resizable', 'min-width', 'min-height']; // Base attributes
    
    // simplistic parse for string arrays in observedAttributes
    const attrMatch = content.match(/observedAttributes[^{]*{\s*return\s*\[(.*?)\];/s);
    if (attrMatch) {
      const attrStr = attrMatch[1];
      const extracted = [...attrStr.matchAll(/['"]([^'"]+)['"]/g)].map(m => m[1]);
      attributes = [...new Set([...attributes, ...extracted])];
    }

    components.push({ tagName, className, attributes });
  }

  return components;
}
