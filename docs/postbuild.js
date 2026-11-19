import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function processHtmlFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      processHtmlFiles(filePath);
    } else if (filePath.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf-8');
      let changed = false;

      // Regex to find <a> tags
      const regex = /<a\s+[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/g;
      
      content = content.replace(regex, (match, href, text) => {
        // Strip origin and query/hash
        let linkPath = href.split('#')[0].split('?')[0];
        // console.log("Matched link:", linkPath);
        
        if (linkPath.startsWith('/reference/') || linkPath.startsWith('/topics/')) {
          // Astro generates directory-based routing, so /reference/tuning/31-edo points to dist/reference/tuning/31-edo/index.html
          // Sometimes links might have a trailing slash or .html
          let cleanPath = linkPath.replace(/^\//, '');
          let targetPath;
          if (cleanPath.endsWith('.html')) {
            targetPath = path.join(__dirname, 'dist', cleanPath);
          } else {
            targetPath = path.join(__dirname, 'dist', cleanPath, 'index.html');
          }

          let exists = fs.existsSync(targetPath);
          if (!exists && !cleanPath.endsWith('.html')) {
            const altPath = path.join(__dirname, 'dist', cleanPath + '.html');
            if (fs.existsSync(altPath)) {
              exists = true;
              targetPath = altPath;
            }
          }

          if (!exists) {
            console.log("MISSING in", filePath, ":", linkPath, "->", targetPath);
            changed = true;
            return `<span class="disabled-link">${text}</span><span class="badge">Coming Soon</span>`;
          }
        }
        return match;
      });

      if (changed) {
        fs.writeFileSync(filePath, content, 'utf-8');
      }
    }
  }
}

function generateSitemap(dir, siteUrl = 'https://ppt.midlifemuso.com') {
  const urls = [];
  function walk(currentDir) {
    for (const entry of fs.readdirSync(currentDir)) {
      const fullPath = path.join(currentDir, entry);
      if (fs.statSync(fullPath).isDirectory()) {
        walk(fullPath);
      } else if (entry === 'index.html') {
        const relDir = path.relative(dir, currentDir).replace(/\\/g, '/');
        const urlPath = relDir ? `/${relDir}/` : '/';
        urls.push(`${siteUrl}${urlPath}`);
      }
    }
  }
  walk(dir);
  urls.sort();
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((u) => `  <url><loc>${u}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n');
  fs.writeFileSync(path.join(dir, 'sitemap.xml'), xml, 'utf-8');
  console.log(`Generated sitemap.xml with ${urls.length} URLs.`);
}

const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  processHtmlFiles(distDir);
  generateSitemap(distDir);
  console.log('Post-build link check completed.');
}
