export function serializePayload(rootEl: HTMLElement): string {
    let componentsUsed = new Set<string>();
    
    function gatherTags(node: Element) {
      if (node.tagName && node.tagName.toLowerCase().startsWith('ppt-')) {
        componentsUsed.add(node.tagName.toLowerCase());
      }
      for (let child of Array.from(node.children)) gatherTags(child);
    }
    gatherTags(rootEl);
    
    let tagToChar: Record<string, string> = {};
    let charToTag: Record<string, string> = {};
    let charCode = 65; // 'A'
    Array.from(componentsUsed).sort().forEach(tag => {
      let char = String.fromCharCode(charCode++);
      tagToChar[tag] = char;
      charToTag[char] = tag;
    });
    
    let headerStr = Object.entries(charToTag).map(([char, tag]) => `${char}:${tag}`).join(',');
    
    let attrMap: string[] = [];
    let instanceIndex = 0;
    
    function buildNode(node: Element): string {
      if (node.tagName && node.tagName.toLowerCase().startsWith('ppt-')) {
        let tag = node.tagName.toLowerCase();
        let char = tagToChar[tag];
        
        let overrides: Record<string, string> = {};
        const libItem = document.querySelector(`.library-item[data-tag="${tag}"]`);
        let meta: Record<string, any> = {};
        if (libItem) {
          meta = JSON.parse(libItem.getAttribute('data-metadata') || '{}');
        }
        
        Array.from(node.attributes).forEach(attr => {
           if (['id', 'class', 'draggable'].includes(attr.name)) return;
           if (attr.name === 'style') {
               let elStyle = (node as HTMLElement).style;
               let styleStr = '';
               if (elStyle.width) styleStr += `width: ${elStyle.width}; `;
               if (elStyle.height) styleStr += `height: ${elStyle.height}; `;
               if (elStyle.flex) styleStr += `flex: ${elStyle.flex}; `;
               if (styleStr.trim()) overrides['style'] = styleStr.trim();
               return;
           }
           const val = attr.value;
           const m = meta[attr.name];
           if (m && m.default !== undefined) {
              if (String(m.default) === val || (m.type === 'boolean' && val === 'true' && m.default === true)) return;
           }
           overrides[attr.name] = val;
        });
        
        if (node.textContent && node.textContent.trim() && node.children.length === 0) {
           overrides['textContent'] = node.textContent.trim();
        }
        
        if (Object.keys(overrides).length > 0) {
           let attrStr = Object.entries(overrides).map(([k,v]) => `${k}:${encodeURIComponent(v)}`).join(',');
           attrMap.push(`${instanceIndex}:{${attrStr}}`);
        }
        
        instanceIndex++;
        
        let childrenStr = '';
        if (node.children.length > 0) {
           let childParts: string[] = [];
           for (let child of Array.from(node.children)) {
              let childStr = buildNode(child);
              if (childStr) childParts.push(childStr);
           }
           if (childParts.length > 0) childrenStr = `[${childParts.join(',')}]`;
        }
        return `${char}${childrenStr}`;
      }
      return '';
    }
    
    // For single node vs container
    let structureStr = '';
    if (rootEl.tagName.toLowerCase().startsWith('ppt-')) {
        structureStr = buildNode(rootEl);
    } else {
        structureStr = Array.from(rootEl.children).map(c => buildNode(c)).filter(Boolean).join(',');
    }
    
    let attrStr = attrMap.join(',');
    
    return `${headerStr}|${attrStr}|${structureStr}`;
}

export function deserializePayload(rawPayload: string, targetEl: HTMLElement) {
    if (!rawPayload) return;
    const parts = rawPayload.split('|');
    if (parts.length !== 3) return;
    const [headerStr, attrStr, structureStr] = parts;
    
    const charToTag: Record<string, string> = {};
    headerStr.split(',').forEach(part => {
       const [char, tag] = part.split(':');
       if (char && tag) charToTag[char] = tag;
    });
    
    const attrOverrides: Record<string, Record<string, string>> = {};
    if (attrStr) {
        const regex = /(\d+):{([^}]+)}/g;
        let match;
        while ((match = regex.exec(attrStr)) !== null) {
            const idx = match[1];
            const propsStr = match[2];
            const props: Record<string, string> = {};
            propsStr.split(',').forEach(p => {
                const [k, v] = p.split(':');
                props[k] = decodeURIComponent(v);
            });
            attrOverrides[idx] = props;
        }
    }
    
    let currentIdx = 0;
    
    function parseStructure(str: string) {
       let currentContainer: any = { children: [] };
       let stack: any[] = [currentContainer];
       let i = 0;
       
       while (i < str.length) {
          const char = str[i];
          if (charToTag[char]) {
             let node = { tag: charToTag[char], idx: currentIdx++, children: [] };
             stack[stack.length - 1].children.push(node);
             if (i + 1 < str.length && str[i+1] === '[') {
                 stack.push(node);
                 i++;
             }
          } else if (char === ']') {
             stack.pop();
          }
          i++;
       }
       return currentContainer.children;
    }
    
    function buildDOM(nodes: any[]) {
       let frag = document.createDocumentFragment();
       nodes.forEach(n => {
           let el = document.createElement(n.tag);
           if (attrOverrides[n.idx]) {
               for (let [k, v] of Object.entries(attrOverrides[n.idx])) {
                   if (k === 'textContent') el.textContent = v as string;
                   else el.setAttribute(k, v as string);
               }
           }
           if (n.children.length > 0) {
               el.appendChild(buildDOM(n.children));
           }
           frag.appendChild(el);
       });
       return frag;
    }
    
    const nodes = parseStructure(structureStr);
    targetEl.innerHTML = '';
    targetEl.appendChild(buildDOM(nodes));
}

// Compression Utilities
export async function compressPayload(text: string): Promise<string> {
    if (typeof CompressionStream === 'undefined') return 'raw:' + text; // Fallback
    const stream = new Blob([text]).stream().pipeThrough(new CompressionStream('deflate'));
    const compressedResponse = await new Response(stream).arrayBuffer();
    const uint8Array = new Uint8Array(compressedResponse);
    // Convert to base64
    let binary = '';
    for (let i = 0; i < uint8Array.byteLength; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return 'gz:' + btoa(binary);
}

export async function decompressPayload(payload: string): Promise<string> {
    if (payload.startsWith('raw:')) return payload.substring(4);
    if (!payload.startsWith('gz:')) {
       // Auto-detect: if it has pipes, it's raw
       if (payload.includes('|')) return payload;
       return payload; // Unknown format
    }
    
    const base64 = payload.substring(3);
    const binaryStr = atob(base64);
    const uint8Array = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
       uint8Array[i] = binaryStr.charCodeAt(i);
    }
    
    if (typeof DecompressionStream === 'undefined') throw new Error("DecompressionStream not supported");
    const stream = new Blob([uint8Array]).stream().pipeThrough(new DecompressionStream('deflate'));
    return await new Response(stream).text();
}
