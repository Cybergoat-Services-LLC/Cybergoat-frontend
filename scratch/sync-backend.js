import fs from 'fs';
import path from 'path';

const srcDir = 'C:/Users/khati/.gemini/antigravity/scratch/cybergoat-lms-backend';
const destDir = 'C:/Users/khati/.gemini/antigravity/scratch/backend-reference/cybergoat-lms-backend';

function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules') continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDirSync(srcDir, destDir);
console.log('Successfully copied cybergoat-lms-backend to backend-reference!');
