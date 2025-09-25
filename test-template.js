#!/usr/bin/env node

// Template test.js file for individual packages
// Copy this to each package and customize as needed

import { spawn } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Basic test cases - customize these for each implementation
const testCases = [
  { input: '123\n456', expected: '579', description: 'Basic addition' },
  { input: '0\n0', expected: '0', description: 'Zero addition' },
  { input: '-123\n456', expected: '333', description: 'Negative + Positive' },
  { input: '999999999999999999999\n1', expected: '1000000000000000000000', description: 'Large number test' }
];

// Invalid input tests
const invalidTests = [
  { input: 'abc\n123', description: 'Invalid first number' },
  { input: '123\ndef', description: 'Invalid second number' }
];

// Colors for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m',
  bright: '\x1b[1m'
};

async function runTest(testCase, expectError = false) {
  return new Promise((resolve) => {
    const child = spawn('node', ['index.js'], {
      cwd: __dirname,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      const output = stdout.trim();
      
      if (expectError) {
        const hasError = code !== 0 || stderr.length > 0 || output.toLowerCase().includes('error');
        resolve({
          success: hasError,
          output,
          stderr,
          exitCode: code
        });
      } else {
        resolve({
          success: code === 0 && output === testCase.expected,
          output,
          expected: testCase.expected,
          stderr,
          exitCode: code
        });
      }
    });

    child.stdin.write(testCase.input);
    child.stdin.end();
  });
}

async function main() {
  console.log(`${colors.bright}🧪 Running package-specific tests${colors.reset}\n`);
  
  let passed = 0;
  let total = 0;

  // Test valid cases
  console.log(`${colors.bright}Valid test cases:${colors.reset}`);
  for (const testCase of testCases) {
    total++;
    const result = await runTest(testCase);
    
    if (result.success) {
      passed++;
      console.log(`${colors.green}✅ ${testCase.description}${colors.reset}`);
    } else {
      console.log(`${colors.red}❌ ${testCase.description}${colors.reset}`);
      console.log(`   Expected: "${result.expected}"`);
      console.log(`   Got:      "${result.output}"`);
      if (result.stderr) {
        console.log(`   Error:    ${result.stderr}`);
      }
    }
  }

  // Test invalid cases
  console.log(`\n${colors.bright}Invalid input test cases:${colors.reset}`);
  for (const testCase of invalidTests) {
    total++;
    const result = await runTest(testCase, true);
    
    if (result.success) {
      passed++;
      console.log(`${colors.green}✅ ${testCase.description} (properly rejected)${colors.reset}`);
    } else {
      console.log(`${colors.red}❌ ${testCase.description} (should have been rejected)${colors.reset}`);
      console.log(`   Output: "${result.output}"`);
    }
  }

  // Summary
  const percentage = ((passed / total) * 100).toFixed(1);
  const summaryColor = percentage >= 90 ? colors.green : percentage >= 70 ? colors.yellow : colors.red;
  
  console.log(`\n${summaryColor}📊 Result: ${passed}/${total} tests passed (${percentage}%)${colors.reset}`);
  
  if (passed === total) {
    console.log(`${colors.green}🎉 All tests passed!${colors.reset}`);
    process.exit(0);
  } else {
    console.log(`${colors.red}❌ Some tests failed${colors.reset}`);
    process.exit(1);
  }
}

main().catch(console.error);