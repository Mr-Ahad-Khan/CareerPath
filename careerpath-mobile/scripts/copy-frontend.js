const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../../frontend/dist');
const destDir = path.resolve(__dirname, '../dist');

if (!fs.existsSync(srcDir)) {
  console.error(`Error: Frontend dist directory does not exist at ${srcDir}`);
  console.error('Please build the frontend first using "npm run build" in the frontend directory.');
  process.exit(1);
}

// Clean and recreate destination directory
if (fs.existsSync(destDir)) {
  fs.rmSync(destDir, { recursive: true, force: true });
}
fs.mkdirSync(destDir, { recursive: true });

// Copy all assets
fs.cpSync(srcDir, destDir, { recursive: true });

console.log(`Successfully copied frontend assets from ${srcDir} to ${destDir}`);
