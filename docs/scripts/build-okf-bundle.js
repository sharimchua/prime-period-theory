import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..', '..');
const okfDir = path.join(rootDir, 'okf');
const publicDir = path.join(rootDir, 'docs', 'public');
const bundlePath = path.join(publicDir, 'okf-bundle.txt');

function getAllMdFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllMdFiles(filePath, fileList);
    } else if (filePath.endsWith('.md')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const mdFiles = getAllMdFiles(okfDir);

// ensure okf/index.md is absolutely first if it exists
const indexPos = mdFiles.findIndex(f => f === path.join(okfDir, 'index.md'));
if (indexPos > 0) {
  const indexFile = mdFiles.splice(indexPos, 1)[0];
  mdFiles.unshift(indexFile);
}

let bundleContent = '';

for (const file of mdFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  bundleContent += `\n\n================================================================================\n`;
  bundleContent += `FILE: ${path.relative(rootDir, file).replace(/\\/g, '/')}\n`;
  bundleContent += `================================================================================\n\n`;
  bundleContent += content;
}

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Remove leading newlines from first file block
bundleContent = bundleContent.trimStart();

fs.writeFileSync(bundlePath, bundleContent + '\n', 'utf-8');
console.log(`Successfully generated OKF bundle at ${bundlePath} containing ${mdFiles.length} files.`);
