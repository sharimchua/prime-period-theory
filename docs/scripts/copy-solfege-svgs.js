import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.resolve(__dirname, '../../resources/uniform-solfege/geometric-svg');
const targetDir = path.resolve(__dirname, '../src/assets/solfege-svgs');

// Ensure target directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Read all files from source directory
const files = fs.readdirSync(sourceDir);

// Copy each SVG file
files.forEach(file => {
  if (file.endsWith('.svg')) {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`Copied ${file} to src/assets/solfege-svgs/`);
  }
});

console.log('Successfully copied all solfege SVGs.');
