import fs from 'node:fs';
import path from 'node:path';

export interface ComponentMetadata {
  type: 'string' | 'number' | 'boolean' | 'enum' | 'color';
  options?: string[];
  default?: any;
}

export interface ComponentMeta {
  tagName: string;
  className: string;
  attributes: string[];
  metadata: Record<string, ComponentMetadata>;
}

export function getPPTComponents(): ComponentMeta[] {
  const srcDir = path.resolve(process.cwd(), 'components/src');
  if (!fs.existsSync(srcDir)) {
    console.warn(`Could not find components directory at ${srcDir}`);
    return [];
  }

  const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');
  const components: ComponentMeta[] = [];

  // Parse BasePPTComponent first to inherit metadata
  let baseMetadata: Record<string, ComponentMetadata> = {};
  const baseContentPath = path.join(srcDir, 'BasePPTComponent.ts');
  if (fs.existsSync(baseContentPath)) {
    const baseContent = fs.readFileSync(baseContentPath, 'utf-8');
    const metaMatch = baseContent.match(/pptMetadata[^{]*{.*?return\s*({[\s\S]*?})\s*;\s*}/s);
    if (metaMatch) {
      try {
        baseMetadata = new Function(`return ${metaMatch[1]}`)();
      } catch (e) {}
    }
  }

  // Parse Mixins
  const mixinMetadata: Record<string, Record<string, ComponentMetadata>> = {};
  const featuresDir = path.join(srcDir, 'features');
  if (fs.existsSync(featuresDir)) {
    const mixinFiles = fs.readdirSync(featuresDir).filter(f => f.endsWith('.ts'));
    for (const f of mixinFiles) {
      const mixinContent = fs.readFileSync(path.join(featuresDir, f), 'utf-8');
      const metaMatch = mixinContent.match(/pptMetadata[^{]*{.*?return\s*({[\s\S]*?})\s*;\s*}/s);
      if (metaMatch) {
        try {
          let objStr = metaMatch[1].replace(/\.\.\.\(\(Base as any\)\.pptMetadata\s*\|\|\s*\{\}\),?/, '');
          mixinMetadata[f.replace('.ts', '')] = new Function(`return ${objStr}`)();
        } catch (e) {}
      }
    }
  }

  for (const file of files) {
    if (file === 'BasePPTComponent.ts') continue;
    const content = fs.readFileSync(path.join(srcDir, file), 'utf-8');
    
    // Match customElements.define
    const defineMatch = content.match(/customElements\.define\(\s*['"]([^'"]+)['"]\s*,\s*([A-Za-z0-9_]+)\s*\)/);
    if (!defineMatch) continue;

    const tagName = defineMatch[1];
    const className = defineMatch[2];

    // Extract attributes
    let attributes: string[] = ['interactive', 'resizable', 'min-width', 'min-height'];
    const attrMatch = content.match(/observedAttributes[^{]*{\s*return\s*\[(.*?)\];/s);
    if (attrMatch) {
      const attrStr = attrMatch[1];
      const extracted = [...attrStr.matchAll(/['"]([^'"]+)['"]/g)].map(m => m[1]);
      attributes = [...new Set([...attributes, ...extracted])];
    }

    // Extract pptMetadata
    let metadata: Record<string, ComponentMetadata> = { ...baseMetadata };
    
    // Merge mixins based on text presence
    for (const mixin in mixinMetadata) {
      if (content.includes(mixin)) {
        metadata = { ...metadata, ...mixinMetadata[mixin] };
      }
    }
    const metaMatch = content.match(/pptMetadata[^{]*{.*?return\s*({[\s\S]*?})\s*;\s*}/s);
    if (metaMatch) {
      let objStr = metaMatch[1];
      objStr = objStr.replace(/\.\.\.super\.pptMetadata\s*,?/, '');
      try {
        const parsed = new Function(`return ${objStr}`)();
        metadata = { ...metadata, ...parsed };
      } catch (e) {
        console.warn(`Failed to parse metadata for ${className}`);
      }
    }

    components.push({ tagName, className, attributes, metadata });
  }

  return components;
}
