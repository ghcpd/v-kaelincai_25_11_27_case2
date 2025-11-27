#!/usr/bin/env node
import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const cwd = process.cwd();
const playwrightCli = join(cwd, 'node_modules', 'playwright', 'cli.js');

console.log('🧪 Running Playwright tests...\n');

try {
  execSync(`node ${playwrightCli} test --reporter=list`, { stdio: 'inherit', cwd });
  
  // Wait a moment for results to be written
  setTimeout(() => {
    const resultsPath = join(cwd, 'tests', 'results.json');
    if (existsSync(resultsPath)) {
      const results = JSON.parse(readFileSync(resultsPath, 'utf8'));
      const stats = results.stats;
      
      console.log('\n════════════════════════════════════════');
      console.log('📊 FINAL TEST RESULTS');
      console.log('════════════════════════════════════════');
      console.log(`✓ Passed: ${stats.expected}`);
      console.log(`⊘ Skipped: ${stats.skipped}`);
      console.log(`✗ Failed: ${stats.unexpected}`);
      console.log(`Duration: ${(stats.duration / 1000).toFixed(2)}s`);
      console.log('════════════════════════════════════════\n');
      
      if (stats.unexpected === 0) {
        console.log('🎉 ALL TESTS PASSED! ✓\n');
        process.exit(0);
      } else {
        console.log(`⚠️ ${stats.unexpected} test(s) failed\n`);
        process.exit(1);
      }
    } else {
      console.log('Results file not found');
      process.exit(1);
    }
  }, 2000);
} catch (error) {
  console.error('❌ Test execution failed:', error.message);
  process.exit(1);
}
