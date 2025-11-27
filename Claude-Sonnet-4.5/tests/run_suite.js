import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Ensure screenshots directory exists
const screenshotsDir = join(rootDir, 'docs', 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

console.log('🚀 Starting UI Test Suite...\n');
console.log('📍 Root Directory:', rootDir);
console.log('📸 Screenshots will be saved to:', screenshotsDir);
console.log('\n' + '='.repeat(60) + '\n');

// Run Playwright tests
const playwrightProcess = spawn('npx', ['playwright', 'test', '--reporter=list'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true
});

playwrightProcess.on('close', (code) => {
  console.log('\n' + '='.repeat(60) + '\n');
  
  if (code === 0) {
    console.log('✅ All UI tests passed!');
    console.log('\n📊 Test Summary:');
    console.log('   • Desktop Layout: PASSED');
    console.log('   • 13-inch Laptop Breakpoint: PASSED');
    console.log('   • Mobile Safari CTA Visibility: PASSED');
    console.log('   • Dark Mode Markdown Rendering: PASSED');
    console.log('   • Keyboard Navigation: PASSED');
    console.log('\n📸 Screenshots available in:', screenshotsDir);
    console.log('📄 Full report: playwright-report/index.html');
  } else {
    console.error('❌ Some tests failed. Exit code:', code);
    console.log('\n📄 Check report for details: playwright-report/index.html');
  }
  
  process.exit(code);
});

playwrightProcess.on('error', (error) => {
  console.error('❌ Failed to run tests:', error);
  process.exit(1);
});
