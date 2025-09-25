import readline from "readline";

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Validates if a string represents a valid integer
 */
function isValidInteger(input) {
  const trimmed = input.trim();
  if (trimmed === "") {
    return false;
  }
  const integerRegex = /^[+-]?\d+$/;
  return integerRegex.test(trimmed);
}

/**
 * Normalizes an integer string by removing leading zeros and handling sign
 */
function normalizeNumber(num) {
  const trimmed = num.trim();
  if (trimmed === "") {
    return "0";
  }

  const isNegative = trimmed.startsWith("-");
  const isPositive = trimmed.startsWith("+");

  let digits = trimmed;
  if (isNegative || isPositive) {
    digits = trimmed.substring(1);
  }

  digits = digits.replace(/^0+/, "");
  if (digits === "") {
    return "0";
  }

  return isNegative ? "-" + digits : digits;
}

/**
 * Compares two positive number strings
 */
function compareNumbers(a, b) {
  if (a.length !== b.length) {
    return a.length > b.length ? 1 : -1;
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return a[i] > b[i] ? 1 : -1;
    }
  }

  return 0;
}

/**
 * Adds two positive number strings
 */
function addPositiveNumbers(a, b) {
  const maxLength = Math.max(a.length, b.length);
  const paddedA = a.padStart(maxLength, "0");
  const paddedB = b.padStart(maxLength, "0");

  let result = "";
  let carry = 0;

  for (let i = maxLength - 1; i >= 0; i--) {
    const digitA = parseInt(paddedA[i]);
    const digitB = parseInt(paddedB[i]);
    const sum = digitA + digitB + carry;

    result = (sum % 10) + result;
    carry = Math.floor(sum / 10);
  }

  if (carry > 0) {
    result = carry + result;
  }

  return result;
}

/**
 * Subtracts two positive number strings (a - b, where a >= b)
 */
function subtractPositiveNumbers(a, b) {
  const maxLength = Math.max(a.length, b.length);
  const paddedA = a.padStart(maxLength, "0");
  const paddedB = b.padStart(maxLength, "0");

  let result = "";
  let borrow = 0;

  for (let i = maxLength - 1; i >= 0; i--) {
    let digitA = parseInt(paddedA[i]) - borrow;
    const digitB = parseInt(paddedB[i]);

    if (digitA < digitB) {
      digitA += 10;
      borrow = 1;
    } else {
      borrow = 0;
    }

    result = digitA - digitB + result;
  }

  result = result.replace(/^0+/, "");
  return result === "" ? "0" : result;
}

/**
 * Computes the sum of two arbitrarily large integers
 */
function computeSum(a, b) {
  const normalizedA = normalizeNumber(a);
  const normalizedB = normalizeNumber(b);

  const isNegativeA = normalizedA.startsWith("-");
  const isNegativeB = normalizedB.startsWith("-");

  const absA = isNegativeA ? normalizedA.substring(1) : normalizedA;
  const absB = isNegativeB ? normalizedB.substring(1) : normalizedB;

  if (!isNegativeA && !isNegativeB) {
    return addPositiveNumbers(absA, absB);
  }

  if (isNegativeA && isNegativeB) {
    return "-" + addPositiveNumbers(absA, absB);
  }

  const comparison = compareNumbers(absA, absB);

  if (comparison === 0) {
    return "0";
  }

  if (comparison > 0) {
    if (isNegativeA) {
      return "-" + subtractPositiveNumbers(absA, absB);
    } else {
      return subtractPositiveNumbers(absA, absB);
    }
  } else {
    if (isNegativeB) {
      return "-" + subtractPositiveNumbers(absB, absA);
    } else {
      return subtractPositiveNumbers(absB, absA);
    }
  }
}

// Read input line by line
let lineCount = 0;
let firstNumber = "";
let secondNumber = "";

rl.on("line", (line) => {
  lineCount++;

  if (lineCount === 1) {
    firstNumber = line;
  } else if (lineCount === 2) {
    secondNumber = line;

    // Validate both inputs
    if (isValidInteger(firstNumber) && isValidInteger(secondNumber)) {
      const result = computeSum(firstNumber, secondNumber);
      console.log(result);
      rl.close();
    } else {
      console.log(
        "Error: Invalid integer format. Please enter a valid integer (up to 1000 digits)."
      );
      // Reset for new input
      lineCount = 0;
      firstNumber = "";
      secondNumber = "";
    }
  }
});

rl.on("close", () => {
  process.exit(0);
});

// Export functions for testing
export { computeSum, normalizeNumber, isValidInteger };
