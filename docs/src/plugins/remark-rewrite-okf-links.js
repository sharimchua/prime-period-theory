import { visit } from 'unist-util-visit';
import path from 'path';
import fs from 'fs';

export function remarkRewriteOkfLinks() {
  return function (tree, file) {
    visit(tree, 'link', (node, index, parent) => {
      if (node.url && /\.md(#.*)?$/.test(node.url) && !node.url.startsWith('http')) {
        let newUrl = node.url.replace(/\.md(#.*)?$/, '$1');

        const filePath = (file.path || file.history[0] || '').replace(/\\/g, '/');
        
        // Find the absolute path to the okf directory
        const docsDir = process.cwd();
        const rootDir = path.resolve(docsDir, '..');
        const okfDir = path.join(rootDir, 'okf').replace(/\\/g, '/');
        
        let physicalFileDir = path.dirname(filePath);
        
        // If Astro passes a virtual path for the reference collection
        if (!filePath.includes('/okf/') && filePath.includes('reference')) {
            const relPath = filePath.substring(filePath.indexOf('reference') + 10);
            physicalFileDir = path.dirname(path.join(okfDir, relPath));
        }
        
        if (filePath.includes('/okf/') || filePath.includes('reference') || filePath.includes('docs')) {
          const urlWithoutHash = node.url.split('#')[0];
          const targetPath = path.resolve(physicalFileDir, urlWithoutHash).replace(/\\/g, '/');
          const fileExists = fs.existsSync(targetPath);
          
          if (targetPath.toLowerCase().startsWith(okfDir.toLowerCase())) {
            let relativeToOkf = targetPath.substring(okfDir.length + 1);
            relativeToOkf = relativeToOkf.replace(/\.md(#.*)?$/, '$1');
            
            if (relativeToOkf === 'index') {
              node.url = '/reference';
            } else if (relativeToOkf.endsWith('/index')) {
              node.url = `/reference/${relativeToOkf.slice(0, -6)}`;
            } else {
              node.url = `/reference/${relativeToOkf}`;
            }
          } else {
            node.url = newUrl;
          }

          let isStub = false;
          if (fileExists) {
            try {
              const targetContent = fs.readFileSync(targetPath, 'utf8');
              if (targetContent.includes('status: stub')) {
                isStub = true;
              }
            } catch (e) {}
          }

          if (!fileExists || isStub) {
            let text = '';
            visit(node, 'text', (textNode) => { text += textNode.value; });
            
            if (!fileExists) {
              const htmlNode = {
                type: 'html',
                value: `<span class="disabled-link">${text}</span> <span class="badge" style="font-size: 0.75em; padding: 0.1em 0.4em; border-radius: 4px; background: #e2e8f0; color: #475569; vertical-align: super; margin-left: 0.25rem;">Coming Soon</span>`
              };
              parent.children[index] = htmlNode;
            } else {
              const htmlNode = {
                type: 'html',
                value: `<a href="${node.url}">${text}</a> <span class="badge" style="font-size: 0.75em; padding: 0.1em 0.4em; border-radius: 4px; background: #fef08a; color: #854d0e; vertical-align: super; margin-left: 0.25rem;">Stub</span>`
              };
              parent.children[index] = htmlNode;
            }
          }
        } else {
          node.url = newUrl;
        }
      }
    });
  };
}
