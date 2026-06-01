// postbuild.js — runs after `next build`
// Copies dashboard/garden/index.html → out/index.html
// so Capacitor loads the app directly without a redirect.

const fs   = require('fs');
const path = require('path');

const src  = path.join(__dirname, 'out', 'dashboard', 'garden', 'index.html');
const dest = path.join(__dirname, 'out', 'index.html');

if (!fs.existsSync(src)) {
  console.error('postbuild: source not found:', src);
  process.exit(1);
}

fs.copyFileSync(src, dest);
console.log('postbuild: copied dashboard/garden/index.html → out/index.html');
