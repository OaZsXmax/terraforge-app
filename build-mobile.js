// build-mobile.js
// Temporarily swaps in the mobile config, builds, then restores the Vercel config.
const fs  = require('fs');
const { execSync } = require('child_process');

const VERCEL_CONFIG = fs.readFileSync('next.config.ts', 'utf8');
const MOBILE_CONFIG = fs.readFileSync('next.config.mobile.ts', 'utf8');

console.log('Switching to mobile config...');
fs.writeFileSync('next.config.ts', MOBILE_CONFIG);

try {
  console.log('Building static export...');
  execSync('npx next build', { stdio: 'inherit' });

  console.log('Running postbuild...');
  execSync('node postbuild.js', { stdio: 'inherit' });
} finally {
  console.log('Restoring Vercel config...');
  fs.writeFileSync('next.config.ts', VERCEL_CONFIG);
}
