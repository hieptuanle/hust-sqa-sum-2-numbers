#!/usr/bin/env node

import { spawn } from "child_process";
import { readFileSync } from "fs";
import path from "path";

// ANSI color codes for better output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

// Comprehensive test cases matching the exact prompt requirements
const testCases = [
  // Basic positive numbers
  {
    input: "123\n456",
    expected: "579",
    description: "Basic addition: 123 + 456",
  },
  { input: "0\n0", expected: "0", description: "Zero addition: 0 + 0" },
  { input: "1\n1", expected: "2", description: "Simple addition: 1 + 1" },
  { input: "5\n3", expected: "8", description: "Simple single digit: 5 + 3" },

  // Examples from the prompt
  {
    input: "12345678901234567890\n98765432109876543210",
    expected: "111111111011111111100",
    description: "Prompt example 1: large number addition",
  },
  {
    input: "-999\n1000",
    expected: "1",
    description: "Prompt example 2: negative + positive",
  },

  // Negative numbers (comprehensive)
  {
    input: "-123\n456",
    expected: "333",
    description: "Negative + Positive: -123 + 456",
  },
  {
    input: "123\n-456",
    expected: "-333",
    description: "Positive + Negative: 123 + (-456)",
  },
  {
    input: "-123\n-456",
    expected: "-579",
    description: "Negative + Negative: -123 + (-456)",
  },
  { input: "-0\n0", expected: "0", description: "Negative zero: -0 + 0" },
  {
    input: "0\n-0",
    expected: "0",
    description: "Zero + negative zero: 0 + (-0)",
  },
  {
    input: "-0\n-0",
    expected: "0",
    description: "Negative zero + negative zero: -0 + (-0)",
  },

  // Positive sign handling
  {
    input: "+123\n456",
    expected: "579",
    description: "Positive sign: +123 + 456",
  },
  {
    input: "123\n+456",
    expected: "579",
    description: "Positive sign: 123 + (+456)",
  },
  {
    input: "+123\n+456",
    expected: "579",
    description: "Both positive signs: +123 + (+456)",
  },
  {
    input: "+123\n-456",
    expected: "-333",
    description: "Positive + negative signs: +123 + (-456)",
  },

  // Single digit with carry
  {
    input: "9\n9",
    expected: "18",
    description: "Single digit with carry: 9 + 9",
  },
  { input: "9\n1", expected: "10", description: "Single digit carry: 9 + 1" },
  { input: "8\n7", expected: "15", description: "Single digit carry: 8 + 7" },

  // Leading zeros (should be normalized)
  {
    input: "000123\n000456",
    expected: "579",
    description: "Leading zeros: 000123 + 000456",
  },
  {
    input: "0001\n0002",
    expected: "3",
    description: "Leading zeros: 0001 + 0002",
  },
  {
    input: "00000\n00000",
    expected: "0",
    description: "Multiple leading zeros: 00000 + 00000",
  },
  {
    input: "000\n123",
    expected: "123",
    description: "Leading zeros with zero: 000 + 123",
  },
  {
    input: "-000123\n456",
    expected: "333",
    description: "Negative with leading zeros: -000123 + 456",
  },
  {
    input: "+000123\n456",
    expected: "579",
    description: "Positive with leading zeros: +000123 + 456",
  },

  // Very large numbers (up to 1000 digits capability)
  {
    input: "999999999999999999999\n1",
    expected: "1000000000000000000000",
    description: "Large number: 999999999999999999999 + 1",
  },
  {
    input: "123456789012345678901234567890\n987654321098765432109876543210",
    expected: "1111111110111111111011111111100",
    description: "Very large numbers addition",
  },
  {
    input: "999999999999999999999999999999\n999999999999999999999999999999",
    expected: "1999999999999999999999999999998",
    description: "Large numbers with carry propagation",
  },

  // Different length numbers
  {
    input: "12345\n987654321",
    expected: "987666666",
    description: "Different length: short + long",
  },
  {
    input: "987654321\n12345",
    expected: "987666666",
    description: "Different length: long + short",
  },
  {
    input: "-12345\n987654321",
    expected: "987641976",
    description: "Different length with negative",
  },
  {
    input: "12345\n-987654321",
    expected: "-987641976",
    description: "Different length: positive + negative",
  },

  // Subtraction-like cases (different signs)
  {
    input: "1000\n-999",
    expected: "1",
    description: "Subtraction case: 1000 + (-999)",
  },
  {
    input: "-1000\n999",
    expected: "-1",
    description: "Subtraction case: -1000 + 999",
  },
  {
    input: "999\n-999",
    expected: "0",
    description: "Subtraction resulting in zero: 999 + (-999)",
  },
  {
    input: "-999\n999",
    expected: "0",
    description: "Subtraction resulting in zero: -999 + 999",
  },

  // Borrowing/carrying across many digits
  {
    input: "999\n999",
    expected: "1998",
    description: "Multiple carries: 999 + 999",
  },
  {
    input: "9999\n9999",
    expected: "19998",
    description: "Multiple carries: 9999 + 9999",
  },
  {
    input: "99999999\n1",
    expected: "100000000",
    description: "Carry propagation: 99999999 + 1",
  },

  // Edge cases with zero
  { input: "0\n123", expected: "123", description: "Zero + positive: 0 + 123" },
  { input: "123\n0", expected: "123", description: "Positive + zero: 123 + 0" },
  {
    input: "0\n-123",
    expected: "-123",
    description: "Zero + negative: 0 + (-123)",
  },
  {
    input: "-123\n0",
    expected: "-123",
    description: "Negative + zero: -123 + 0",
  },

  // Complex mixed sign scenarios
  {
    input: "-12345\n12346",
    expected: "1",
    description: "Close values different signs: -12345 + 12346",
  },
  {
    input: "12345\n-12346",
    expected: "-1",
    description: "Close values different signs: 12345 + (-12346)",
  },
  {
    input: "-12345\n12345",
    expected: "0",
    description: "Equal magnitude opposite signs: -12345 + 12345",
  },

  // Very long number test (approaching 1000 digits)
  {
    input:
      "1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890\n9876543210987654321098765432109876543210987654321098765432109876543210987654321098765432109876543210",
    expected:
      "11111111101111111110111111111011111111101111111110111111111011111111101111111110111111111011111111100",
    description: "200-digit numbers addition",
  },
];

// Invalid input test cases (should produce errors and prompt again per requirement)
const invalidTestCases = [
  // Non-numeric characters
  { input: "abc\n123", description: "Invalid first number: abc + 123" },
  { input: "123\ndef", description: "Invalid second number: 123 + def" },
  { input: "12a3\n456", description: "Mixed letters in number: 12a3 + 456" },
  {
    input: "123\n45b6",
    description: "Mixed letters in second number: 123 + 45b6",
  },

  // Decimal points (not allowed)
  { input: "12.5\n13", description: "Decimal in first number: 12.5 + 13" },
  { input: "123\n45.6", description: "Decimal in second number: 123 + 45.6" },
  { input: "12.5\n13.7", description: "Decimals in both numbers: 12.5 + 13.7" },

  // Empty or missing input
  { input: "\n123\n", description: "Empty first number" },
  { input: "123\n\n", description: "Empty second number" },
  { input: "\n\n", description: "Both numbers empty" },

  // Spaces inside numbers (not allowed)
  {
    input: "123 456\n789",
    description: "Space in first number: 123 456 + 789",
  },
  {
    input: "123\n456 789",
    description: "Space in second number: 123 + 456 789",
  },
  {
    input: "12 34\n56 78",
    description: "Spaces in both numbers: 12 34 + 56 78",
  },

  // Multiple signs (invalid format)
  { input: "++123\n456", description: "Double positive sign: ++123 + 456" },
  { input: "--123\n456", description: "Double negative sign: --123 + 456" },
  { input: "+-123\n456", description: "Mixed signs: +-123 + 456" },
  { input: "-+123\n456", description: "Mixed signs: -+123 + 456" },
  {
    input: "123\n++456",
    description: "Double positive in second: 123 + ++456",
  },
  {
    input: "123\n--456",
    description: "Double negative in second: 123 + --456",
  },

  // Signs in wrong position
  { input: "12-3\n456", description: "Sign in middle: 12-3 + 456" },
  { input: "123\n45+6", description: "Sign in middle: 123 + 45+6" },
  { input: "123+\n456", description: "Sign at end: 123+ + 456" },
  { input: "123\n456-", description: "Sign at end: 123 + 456-" },

  // Other special characters
  { input: "123#\n456", description: "Special character: 123# + 456" },
  { input: "123\n456@", description: "Special character: 123 + 456@" },
  { input: "(123)\n456", description: "Parentheses: (123) + 456" },
  { input: "123\n[456]", description: "Brackets: 123 + [456]" },
];

// Available packages to test
const packages = {
  chatgpt: "packages/chatgpt-gpt5-thinking",
  gemini: "packages/google-gemini-2.5-pro",
  grok: "packages/grok-4",
  cursor: "packages/cursor-auto",
  claude: "packages/claude-sonnet-4",
  deepseek: "packages/deepseek",
};

class TestRunner {
  constructor() {
    this.results = {};
    this.timeout = 10000; // 10 seconds timeout per test
  }

  async runTest(packagePath, testCase, isInvalidTest = false) {
    return new Promise((resolve) => {
      const child = spawn("node", ["index.js"], {
        cwd: packagePath,
        stdio: ["pipe", "pipe", "pipe"],
      });

      let stdout = "";
      let stderr = "";
      let timedOut = false;

      // Set timeout
      const timer = setTimeout(() => {
        timedOut = true;
        child.kill("SIGTERM");
        resolve({
          success: false,
          error: "Test timed out",
          output: stdout,
          stderr: stderr,
        });
      }, this.timeout);

      child.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      child.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      child.on("close", (code) => {
        clearTimeout(timer);

        if (timedOut) return;

        const output = stdout.trim();

        if (isInvalidTest) {
          // For invalid tests, we expect either non-zero exit code or error message
          const hasError =
            code !== 0 ||
            stderr.length > 0 ||
            output.toLowerCase().includes("error") ||
            output.toLowerCase().includes("invalid");
          resolve({
            success: hasError,
            output: output,
            stderr: stderr,
            exitCode: code,
            expectedError: true,
          });
        } else {
          // For valid tests, check if output matches expected result
          const success = code === 0 && output === testCase.expected;
          resolve({
            success: success,
            output: output,
            expected: testCase.expected,
            stderr: stderr,
            exitCode: code,
          });
        }
      });

      child.on("error", (error) => {
        clearTimeout(timer);
        resolve({
          success: false,
          error: error.message,
          output: stdout,
          stderr: stderr,
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
      console.log(
        `${colors.red}❌ Unknown package: ${packageName}${colors.reset}`
      );
      return;
    }

    // Check if index.js exists
    try {
      readFileSync(path.join(packagePath, "index.js"));
    } catch (error) {
      console.log(
        `${colors.yellow}⚠️  ${packageName}: index.js not found - skipping${colors.reset}`
      );
      return;
    }

    console.log(`${colors.cyan}🧪 Testing ${packageName}...${colors.reset}`);

    const results = {
      passed: 0,
      failed: 0,
      total: testCases.length + invalidTestCases.length,
      details: [],
    };

    // Test valid cases
    console.log(`${colors.blue}  Valid test cases:${colors.reset}`);
    for (const testCase of testCases) {
      const result = await this.runTest(packagePath, testCase, false);

      if (result.success) {
        results.passed++;
        console.log(
          `    ${colors.green}✅ ${testCase.description}${colors.reset}`
        );
      } else {
        results.failed++;
        console.log(
          `    ${colors.red}❌ ${testCase.description}${colors.reset}`
        );
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
        error: result.stderr,
      });
    }

    // Test invalid cases
    console.log(`${colors.blue}  Invalid input test cases:${colors.reset}`);
    for (const testCase of invalidTestCases) {
      const result = await this.runTest(packagePath, testCase, true);

      if (result.success) {
        results.passed++;
        console.log(
          `    ${colors.green}✅ ${testCase.description} (properly rejected)${colors.reset}`
        );
      } else {
        results.failed++;
        console.log(
          `    ${colors.red}❌ ${testCase.description} (should have been rejected)${colors.reset}`
        );
        console.log(`       Output: "${result.output}"`);
      }

      results.details.push({
        testCase: testCase.description,
        success: result.success,
        expectedError: true,
        actual: result.output,
        error: result.stderr,
      });
    }

    this.results[packageName] = results;

    const percentage = ((results.passed / results.total) * 100).toFixed(1);
    const color =
      percentage >= 90
        ? colors.green
        : percentage >= 70
        ? colors.yellow
        : colors.red;

    console.log(
      `${color}📊 ${packageName}: ${results.passed}/${results.total} tests passed (${percentage}%)${colors.reset}\n`
    );
  }

  async testAll() {
    console.log(
      `${colors.bright}🚀 Running tests for all AI model implementations${colors.reset}\n`
    );

    for (const packageName of Object.keys(packages)) {
      await this.testPackage(packageName);
    }

    this.printSummary();
  }

  printSummary() {
    console.log(`${colors.bright}📈 SUMMARY REPORT${colors.reset}`);
    console.log("=".repeat(50));

    const sortedResults = Object.entries(this.results)
      .map(([name, results]) => ({
        name,
        percentage: ((results.passed / results.total) * 100).toFixed(1),
        passed: results.passed,
        total: results.total,
      }))
      .sort((a, b) => b.percentage - a.percentage);

    sortedResults.forEach((result, index) => {
      const medal =
        index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "  ";
      const color =
        result.percentage >= 90
          ? colors.green
          : result.percentage >= 70
          ? colors.yellow
          : colors.red;
      console.log(
        `${medal} ${color}${result.name.padEnd(15)} ${result.passed}/${
          result.total
        } (${result.percentage}%)${colors.reset}`
      );
    });

    console.log("\n" + "=".repeat(50));
    console.log(
      `${colors.bright}Total implementations tested: ${
        Object.keys(this.results).length
      }${colors.reset}`
    );
  }
}

// Command line interface
async function main() {
  const args = process.argv.slice(2);
  const runner = new TestRunner();

  if (args.length === 0) {
    // Test all packages
    await runner.testAll();
  } else if (args[0] === "--help" || args[0] === "-h") {
    console.log(`${colors.bright}🧪 AI Model Test Runner${colors.reset}

Usage:
  node test-runner.js                    # Test all implementations
  node test-runner.js <package-name>     # Test specific implementation
  node test-runner.js --help            # Show this help

Available packages:
  ${Object.keys(packages)
    .map((name) => `- ${name}`)
    .join("\n  ")}

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
