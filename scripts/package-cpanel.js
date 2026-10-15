import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const parentDir = path.resolve(rootDir, '..');
const stagingDir = path.join(parentDir, 'cpanel-staging');
const zipFile = path.join(parentDir, 'friends-tours-cpanel-update.zip');

console.log('Preparing clean cPanel deployment package...');

if (fs.existsSync(stagingDir)) {
  fs.rmSync(stagingDir, { recursive: true, force: true });
}
fs.mkdirSync(stagingDir, { recursive: true });

// Copy dist/
console.log('Copying dist/...');
fs.cpSync(path.join(rootDir, 'dist'), path.join(stagingDir, 'dist'), { recursive: true });

// Copy server/ without node_modules
console.log('Copying server/...');
fs.cpSync(path.join(rootDir, 'server'), path.join(stagingDir, 'server'), {
  recursive: true,
  filter: (src) => !src.includes('node_modules'),
});

// Copy public/
console.log('Copying public/...');
fs.cpSync(path.join(rootDir, 'public'), path.join(stagingDir, 'public'), { recursive: true });

// Copy root files
console.log('Copying root configs...');
fs.copyFileSync(path.join(rootDir, 'app.js'), path.join(stagingDir, 'app.js'));
fs.copyFileSync(path.join(rootDir, 'package.json'), path.join(stagingDir, 'package.json'));
fs.copyFileSync(path.join(rootDir, '.env'), path.join(stagingDir, '.env'));
fs.copyFileSync(path.join(rootDir, 'dist', '.htaccess'), path.join(stagingDir, '.htaccess'));

// Create ZIP
console.log('Creating ZIP archive at:', zipFile);
if (fs.existsSync(zipFile)) {
  fs.unlinkSync(zipFile);
}

execSync(`tar -a -c -f "${zipFile}" -C "${stagingDir}" *`, { stdio: 'inherit' });

// Cleanup staging
fs.rmSync(stagingDir, { recursive: true, force: true });

const stats = fs.statSync(zipFile);
console.log(`✅ SUCCESS! Created ${path.basename(zipFile)} (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`);
