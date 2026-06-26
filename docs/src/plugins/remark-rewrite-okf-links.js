import { visit } from 'unist-util-visit';
import path from 'path';

export function remarkRewriteOkfLinks() {
  return function (tree, file) {
    visit(tree, 'link', (node) => {
      // Only process relative markdown links
      if (node.url && node.url.endsWith('.md') && !node.url.startsWith('http')) {
        // Strip the .md extension
        let newUrl = node.url.replace(/\.md(#.*)?$/, '$1');

        // Check if the current file is inside the 'okf' or 'docs' directory
        const filePath = file.history[0] || '';
        
        // If it's an OKF file, we can convert relative links to absolute site paths
        // because the browser will mess up relative paths due to trailing slashes
        if (filePath.includes('okf') || filePath.includes('docs')) {
          const fileDir = path.dirname(filePath);
          
          // Resolve the link target's absolute path on disk
          const targetPath = path.resolve(fileDir, node.url);
          
          // Find where 'okf' is in the path to determine the relative URL
          const okfIndex = targetPath.replace(/\\/g, '/').indexOf('/okf/');
          if (okfIndex !== -1) {
            // It's a link to another OKF file
            let relativeToOkf = targetPath.replace(/\\/g, '/').substring(okfIndex + 5);
            // Strip .md
            relativeToOkf = relativeToOkf.replace(/\.md(#.*)?$/, '$1');
            
            if (relativeToOkf === 'index') {
              node.url = '/reference';
            } else {
              node.url = `/reference/${relativeToOkf}`;
            }
          } else {
            // Just strip .md for other relative links
            node.url = newUrl;
          }
        } else {
          node.url = newUrl;
        }
      }
    });
  };
}
