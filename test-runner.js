#!/usr/bin/env node

import { spawn } from 'child_process';
import { readFileSync } from 'fs';
import path from 'path';

// ANSI color codes for better output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Test cases for the sum of two numbers program
const testCases = [
  // Basic positive numbers
  { input: '123\n456', expected: '579', description: 'Basic addition: 123 + 456' },
  { input: '0\n0', expected: '0', description: 'Zero addition: 0 + 0' },
  { input: '1\n1', expected: '2', description: 'Simple addition: 1 + 1' },
  
  // Negative numbers
  { input: '-123\n456', expected: '333', description: 'Negative + Positive: -123 + 456' },
  { input: '123\n-456', expected: '-333', description: 'Positive + Negative: 123 + (-456)' },
  { input: '-123\n-456', expected: '-579', description: 'Negative + Negative: -123 + (-456)' },
  { input: '-0\n0', expected: '0', description: 'Negative zero: -0 + 0' },
  
  // Large numbers (testing big integer capability)
  { input: '999999999999999999999\n1', expected: '1000000000000000000000', description: 'Large number: 999999999999999999999 + 1' },
  { input: '123456789012345678901234567890\n987654321098765432109876543210', expected: '1111111110111111111011111111100', description: 'Very large numbers addition' },
  { input: '999\n999', expected: '1998', description: 'Three digit addition with carry' },
  
  // Edge cases with leading zeros
  { input: '000123\n000456', expected: '579', description: 'Numbers with leading zeros' },
  { input: '0001\n0002', expected: '3', description: 'Leading zeros: 0001 + 0002' },
  
  // Single digit cases
  { input: '9\n9', expected: '18', description: 'Single digit with carry: 9 + 9' },
  { input: '5\n3', expected: '8', description: 'Simple single digit: 5 + 3' },
  
  // More complex negative cases
  { input: '-999\n1000', expected: '1', description: 'Large negative + positive: -999 + 1000' },
  { input: '1000\n-999', expected: '1', description: 'Large positive + negative: 1000 + (-999)' },
  
  // Very large numbers with different lengths
  { input: '12345\n987654321', expected: '987666666', description: 'Different length numbers' },
  { input: '-12345\n987654321', expected: '987641976', description: 'Different length with negative' }
];

// Invalid input test cases (should produce errors)
const invalidTestCases = [
  { input: 'abc\n123', description: 'Invalid input: abc + 123' },
  { input: '123\ndef', description: 'Invalid input: 123 + def' },
  { input: '12.5\n13.5', description: 'Decimal numbers (should be integers only)' },
  { input: '123\n', description: 'Missing second number' },
  { input: '\n456', description: 'Missing first number' },
  { input: '123 456\n789', description: 'Space in number' },
  { input: '++123\n456', description: 'Multiple signs' },
  { input: '--123\n456', description: 'Double negative sign' }
];

// Available packages to test
const packages = {
  'chatgpt': 'packages/chatgpt-gpt5-thinking',
  'gemini': 'packages/google-gemini-2.5-pro', 
  'grok': 'packages/grok-4',
  'cursor': 'packages/cursor-auto',
  'claude': 'packages/claude-sonnet-4',
  'deepseek': 'packages/deepseek'
};

class TestRunner {
  constructor() {
    this.results = {};
    this.timeout = 10000; // 10 seconds timeout per test
  }

  async runTest(packagePath, testCase, isInvalidTest = false) {
    return new Promise((resolve) => {
      const child = spawn('node', ['index.js'], {
        cwd: packagePath,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';
      let timedOut = false;

      // Set timeout
      const timer = setTimeout(() => {
        timedOut = true;
        child.kill('SIGTERM');
        resolve({
          success: false,
          error: 'Test timed out',
          output: stdout,
          stderr: stderr
        });
      }, this.timeout);

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        clearTimeout(timer);
        
        if (timedOut) return;

        const output = stdout.trim();
        
        if (isInvalidTest) {
          // For invalid tests, we expect either non-zero exit code or error message
          const hasError = code !== 0 || stderr.length > 0 || output.toLowerCase().includes('error') || output.toLowerCase().includes('invalid');
          resolve({
            success: hasError,
            output: output,
            stderr: stderr,
            exitCode: code,
            expectedError: true
          });
        } else {
          // For valid tests, check if output matches expected result
          const success = code === 0 && output === testCase.expected;
          resolve({
            success: success,
            output: output,
            expected: testCase.expected,
            stderr: stderr,
            exitCode: code
          });
        }
      });

      child.on('error', (error) => {
        clearTimeout(timer);
        resolve({
          success: false,
          error: error.message,
          output: stdout,
          stderr: stderr
        });
      });

      // Send input to the program
      child.stdin.write(testCase.input);
      child.stdin.end();
    });
  }

  async testPackage(packageName) {
    const packagePath = packages[packageName];
    
    if (!packagePath) {
      console.log(`${colors.red}❌ Unknown package: ${packageName}${colors.reset}`);
      return;
    }

    // Check if index.js exists
    try {
      readFileSync(path.join(packagePath, 'index.js'));
    } catch (error) {
      console.log(`${colors.yellow}⚠️  ${packageName}: index.js not found - skipping${colors.reset}`);
      return;
    }

    console.log(`${colors.cyan}🧪 Testing ${packageName}...${colors.reset}`);
    
    const results = {
      passed: 0,
      failed: 0,
      total: testCases.length + invalidTestCases.length,
      details: []
    };

    // Test valid cases
    console.log(`${colors.blue}  Valid test cases:${colors.reset}`);
    for (const testCase of testCases) {
      const result = await this.runTest(packagePath, testCase, false);
      
      if (result.success) {
        results.passed++;
        console.log(`    ${colors.green}✅ ${testCase.description}${colors.reset}`);
      } else {
        results.failed++;
        console.log(`    ${colors.red}❌ ${testCase.description}${colors.reset}`);
        console.log(`       Expected: "${result.expected}"`);
        console.log(`       Got:      "${result.output}"`);
        if (result.stderr) {
          console.log(`       Error:    ${result.stderr.trim()}`);
        }
      }
      
      results.details.push({
        testCase: testCase.description,
        success: result.success,
        expected: result.expected,
        actual: result.output,
        error: result.stderr
      });
    }

    // Test invalid cases
    console.log(`${colors.blue}  Invalid input test cases:${colors.reset}`);
    for (const testCase of invalidTestCases) {
      const result = await this.runTest(packagePath, testCase, true);
      
      if (result.success) {
        results.passed++;
        console.log(`    ${colors.green}✅ ${testCase.description} (properly rejected)${colors.reset}`);
      } else {
        results.failed++;
        console.log(`    ${colors.red}❌ ${testCase.description} (should have been rejected)${colors.reset}`);
        console.log(`       Output: "${result.output}"`);
      }
      
      results.details.push({
        testCase: testCase.description,
        success: result.success,
        expectedError: true,
        actual: result.output,
        error: result.stderr
      });
    }

    this.results[packageName] = results;
    
    const percentage = ((results.passed / results.total) * 100).toFixed(1);
    const color = percentage >= 90 ? colors.green : percentage >= 70 ? colors.yellow : colors.red;
    
    console.log(`${color}📊 ${packageName}: ${results.passed}/${results.total} tests passed (${percentage}%)${colors.reset}\n`);
  }

  async testAll() {
    console.log(`${colors.bright}🚀 Running tests for all AI model implementations${colors.reset}\n`);
    
    for (const packageName of Object.keys(packages)) {
      await this.testPackage(packageName);
    }
    
    this.printSummary();
  }

  printSummary() {
    console.log(`${colors.bright}📈 SUMMARY REPORT${colors.reset}`);
    console.log('='.repeat(50));
    
    const sortedResults = Object.entries(this.results)
      .map(([name, results]) => ({
        name,
        percentage: ((results.passed / results.total) * 100).toFixed(1),
        passed: results.passed,
        total: results.total
      }))
      .sort((a, b) => b.percentage - a.percentage);

    sortedResults.forEach((result, index) => {
      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  ';
      const color = result.percentage >= 90 ? colors.green : result.percentage >= 70 ? colors.yellow : colors.red;
      console.log(`${medal} ${color}${result.name.padEnd(15)} ${result.passed}/${result.total} (${result.percentage}%)${colors.reset}`);
    });
    
    console.log('\n' + '='.repeat(50));
    console.log(`${colors.bright}Total implementations tested: ${Object.keys(this.results).length}${colors.reset}`);
  }
}

// Command line interface
async function main() {
  const args = process.argv.slice(2);
  const runner = new TestRunner();

  if (args.length === 0) {
    // Test all packages
    await runner.testAll();
  } else if (args[0] === '--help' || args[0] === '-h') {
    console.log(`${colors.bright}🧪 AI Model Test Runner${colors.reset}

Usage:
  node test-runner.js                    # Test all implementations
  node test-runner.js <package-name>     # Test specific implementation
  node test-runner.js --help            # Show this help

Available packages:
  ${Object.keys(packages).map(name => `- ${name}`).join('\n  ')}

Examples:
  node test-runner.js chatgpt           # Test only ChatGPT implementation
  node test-runner.js gemini claude     # Test Gemini and Claude implementations
`);
  } else {
    // Test specific packages
    for (const packageName of args) {
      await runner.testPackage(packageName);
    }
    
    if (Object.keys(runner.results).length > 1) {
      runner.printSummary();
    }
  }
}

main().catch(console.error);