import fs from 'node:fs';
import path from 'node:path';
import * as acorn from 'acorn';

function parseSafeMetadata(objStr: string): any {
  const ast = acorn.parse(`(${objStr})`, { ecmaVersion: 2020 });

  function evaluate(node: any): any {
    if (node.type === 'ObjectExpression') {
      const obj: any = {};
      for (const prop of node.properties) {
        if (prop.type !== 'Property') throw new Error('Unsupported property type: ' + prop.type);
        const key = prop.key.type === 'Identifier' ? prop.key.name : prop.key.value;
        obj[key] = evaluate(prop.value);
      }
      return obj;
    } else if (node.type === 'ArrayExpression') {
      return node.elements.map(evaluate);
    } else if (node.type === 'Literal') {
      return node.value;
    } else if (node.type === 'Identifier') {
      if (node.name === 'undefined') return undefined;
      throw new Error(`Unsupported identifier: ${node.name}`);
    } else if (node.type === 'UnaryExpression' && node.operator === '-') {
      const arg = evaluate(node.argument);
      if (typeof arg === 'number') return -arg;
      throw new Error(`Unsupported unary expression`);
    }
    throw new Error(`Unsupported AST node type: ${node.type}`);
  }

  return evaluate((ast as any).body[0].expression);
}

export interface ComponentMetadata {
  type: 'string' | 'number' | 'boolean' | 'enum' | 'color';
  options?: string[];
  default?: any;
}

export interface ComponentDef {
  displayName: string;
  familyColor: string;
  acceptsChildren: string[];
  canNestIn: string[];
}

export interface ComponentMeta {
  tagName: string;
  className: string;
  attributes: string[];
  metadata: Record<string, ComponentMetadata>;
  componentDef: ComponentDef;
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
  let baseContent = '';
  const baseContentPath = path.join(srcDir, 'BasePPTComponent.ts');
  if (fs.existsSync(baseContentPath)) {
    baseContent = fs.readFileSync(baseContentPath, 'utf-8');
    const metaMatch = baseContent.match(/pptMetadata[^{]*{.*?return\s*({[\s\S]*?})\s*;\s*}/s);
    if (metaMatch) {
      try {
        baseMetadata = parseSafeMetadata(metaMatch[1]);
      } catch (e) {
        console.warn('Failed to parse baseMetadata:', e);
      }
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
          mixinMetadata[f.replace('.ts', '')] = parseSafeMetadata(objStr);
        } catch (e) {
          console.warn(`Failed to parse mixinMetadata for ${f}:`, e);
        }
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

    // Merge base attributes
    let attributes: string[] = [];
    if (baseContent && !file.includes('BasePPTComponent')) {
        const baseAttrMatch = baseContent.match(/observedAttributes[^{]*{\s*return\s*\[(.*?)\];/s);
        if (baseAttrMatch) {
            const attrStr = baseAttrMatch[1];
            const extracted = [...attrStr.matchAll(/['"]([^'"]+)['"]/g)].map(m => m[1]);
            attributes = [...new Set([...attributes, ...extracted])];
        }
    }

    // Merge parent class if it's not BasePPTComponent
    const extendMatch = content.match(/export class \w+ extends (\w+)/);
    let parentMetadataStr = '';
    if (extendMatch) {
      const parentClass = extendMatch[1];
      if (parentClass !== 'BasePPTComponent' && !parentClass.includes('With')) {
        const parentFile = path.join(srcDir, `${parentClass}.ts`);
        if (fs.existsSync(parentFile)) {
          const pContent = fs.readFileSync(parentFile, 'utf-8');
          const pAttrMatch = pContent.match(/observedAttributes[^{]*{\s*return\s*\[(.*?)\];/s);
          if (pAttrMatch) {
            const extracted = [...pAttrMatch[1].matchAll(/['"]([^'"]+)['"]/g)].map(m => m[1]);
            attributes = [...new Set([...attributes, ...extracted])];
          }
          const pMetaMatch = pContent.match(/pptMetadata[^{]*{.*?return\s*({[\s\S]*?})\s*;\s*}/s);
          if (pMetaMatch) {
             parentMetadataStr = pMetaMatch[1].replace(/\.\.\.super\.pptMetadata\s*,?/, '');
          }
        }
      }
    }

    const attrMatch = content.match(/observedAttributes[^{]*{\s*return\s*\[(.*?)\];/s);
    if (attrMatch) {
      const attrStr = attrMatch[1];
      const extracted = [...attrStr.matchAll(/['"]([^'"]+)['"]/g)].map(m => m[1]);
      attributes = [...new Set([...attributes, ...extracted])];
    }
    
    // Merge mixin attributes
    for (const mixin in mixinMetadata) {
      if (content.includes(mixin)) {
         const mixinKeys = Object.keys(mixinMetadata[mixin]);
         attributes = [...new Set([...attributes, ...mixinKeys])];
      }
    }

    // Extract pptMetadata
    let metadata: Record<string, ComponentMetadata> = { ...baseMetadata };
    
    if (parentMetadataStr) {
      try {
        metadata = { ...metadata, ...parseSafeMetadata(parentMetadataStr) };
      } catch(e) {}
    }
    
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
        const parsed = parseSafeMetadata(objStr);
        metadata = { ...metadata, ...parsed };
      } catch (e) {
        console.warn(`Failed to parse metadata for ${className}:`, e);
      }
    }

    let componentDef: ComponentDef = {
      displayName: className,
      familyColor: '#888888',
      acceptsChildren: ['*'],
      canNestIn: ['*']
    };
    const defMatch = content.match(/componentDef[^{]*{.*?return\s*({[\s\S]*?})\s*;\s*}/s);
    if (defMatch) {
      try {
        let objStr = defMatch[1];
        objStr = objStr.replace(/\s+as\s+[a-zA-Z0-9_\[\]]+/g, '');
        componentDef = { ...componentDef, ...parseSafeMetadata(objStr) };
      } catch (e) {
        console.warn(`Failed to parse componentDef for ${className}:`, e);
      }
    }

    components.push({ tagName, className, attributes, metadata, componentDef });
  }

  return components;
}
