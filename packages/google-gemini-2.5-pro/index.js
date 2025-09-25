import readline from "node:readline";

// --- Core Arithmetic Helper Functions ---

/**
 * Compares the absolute values of two numbers (as non-negative integer strings).
 * @param {string} a The first non-negative integer string.
 * @param {string} b The second non-negative integer string.
 * @returns {boolean} True if a is numerically greater than or equal to b.
 */
function isGreaterOrEqual(a, b) {
  if (a.length > b.length) return true;
  if (a.length < b.length) return false;
  // For same-length strings, lexicographical comparison is equivalent to numerical comparison.
  return a >= b;
}

/**
 * Adds two non-negative integer strings and returns their sum as a string.
 * This simulates grade-school addition from right to left.
 * @param {string} a The first non-negative integer string.
 * @param {string} b The second non-negative integer string.
 * @returns {string} The sum as a string.
 */
function add(a, b) {
  let result = "";
  let carry = 0;
  let i = a.length - 1;
  let j = b.length - 1;

  // Loop until both numbers are processed and there's no carry left.
  while (i >= 0 || j >= 0 || carry > 0) {
    const digitA = i >= 0 ? parseInt(a[i], 10) : 0;
    const digitB = j >= 0 ? parseInt(b[j], 10) : 0;
    const currentSum = digitA + digitB + carry;

    result = (currentSum % 10) + result;
    carry = Math.floor(currentSum / 10);

    i--;
    j--;
  }
  return result;
}

/**
 * Subtracts a smaller non-negative integer string from a larger one.
 * Assumes `bigger` >= `smaller`.
 * @param {string} bigger The larger non-negative integer string (minuend).
 * @param {string} smaller The smaller non-negative integer string (subtrahend).
 * @returns {string} The difference as a string.
 */
function subtract(bigger, smaller) {
  let result = "";
  let borrow = 0;
  let i = bigger.length - 1;
  let j = smaller.length - 1;

  // Loop from right to left, simulating grade-school subtraction with borrowing.
  while (i >= 0) {
    let digitBigger = parseInt(bigger[i], 10);
    const digitSmaller = j >= 0 ? parseInt(smaller[j], 10) : 0;

    digitBigger -= borrow;

    if (digitBigger < digitSmaller) {
      digitBigger += 10; // Borrow from the next digit.
      borrow = 1;
    } else {
      borrow = 0;
    }

    const diff = digitBigger - digitSmaller;
    result = diff + result;

    i--;
    j--;
  }

  // Remove leading zeros (e.g., "00123" -> "123").
  result = result.replace(/^0+/, "");

  return result === "" ? "0" : result;
}

// --- Main Calculation Logic ---

/**
 * Normalizes an integer string into a sign and an absolute value part.
 * This function strips the sign and removes redundant leading zeros.
 * @param {string} numStr The raw integer string from input.
 * @returns {{sign: '+'|'-', abs: string}} An object with the number's sign and absolute value.
 */
function normalize(numStr) {
  let sign = "+";
  let abs = numStr;

  if (numStr.startsWith("-")) {
    sign = "-";
    abs = numStr.substring(1);
  } else if (numStr.startsWith("+")) {
    abs = numStr.substring(1);
  }

  // Remove leading zeros, e.g., "007" -> "7".
  abs = abs.replace(/^0+/, "");

  // If the string becomes empty, the number was 0.
  if (abs === "") {
    abs = "0";
  }

  // By convention, zero is neither positive nor negative. We represent it as positive.
  if (abs === "0") {
    sign = "+";
  }

  return { sign, abs };
}

/**
 * Computes the sum of two arbitrarily large integers given as strings.
 * It handles positive and negative numbers by converting the problem
 * into either an addition or a subtraction of absolute values.
 * @param {string} strA The first integer string.
 * @param {string} strB The second integer string.
 * @returns {string} The final sum as a string, correctly formatted.
 */
function calculateSum(strA, strB) {
  const numA = normalize(strA);
  const numB = normalize(strB);

  let resultAbs;
  let resultSign;

  if (numA.sign === numB.sign) {
    // Case 1: Both numbers have the same sign (e.g., 5 + 3 or -5 + -3).
    // The result is the sum of their absolute values, keeping the common sign.
    resultAbs = add(numA.abs, numB.abs);
    resultSign = numA.sign;
  } else {
    // Case 2: Numbers have different signs (e.g., 5 + -3 or -5 + 3).
    // This is a subtraction. The sign of the result is the sign of the
    // number with the larger absolute value.
    if (isGreaterOrEqual(numA.abs, numB.abs)) {
      resultAbs = subtract(numA.abs, numB.abs);
      resultSign = numA.sign;
    } else {
      resultAbs = subtract(numB.abs, numA.abs);
      resultSign = numB.sign;
    }
  }

  // Final formatting: if the absolute value is "0", the result is simply "0".
  if (resultAbs === "0") {
    return "0";
  }

  // Attach the negative sign only if necessary.
  return resultSign === "-" ? `-${resultAbs}` : resultAbs;
}

// --- Input/Output Handling ---

const rl = readline.createInterface({
  input: process.stdin,
  output: null, // Do not echo input or write prompts to stdout.
  terminal: false,
});

// Regex to validate an integer with an optional sign and up to 1000 digits.
const INTEGER_REGEX = /^[+-]?\d{1,1000}$/;
const numbers = [];

rl.on("line", (line) => {
  const trimmedInput = line.trim();

  // Check if the input is a properly formatted integer and within the digit limit.
  // We check the length of the digit part only.
  const digitsPart = trimmedInput.replace(/^[+-]/, "");
  if (
    /^\d+$/.test(digitsPart) &&
    digitsPart.length > 0 &&
    digitsPart.length <= 1000
  ) {
    numbers.push(trimmedInput);

    if (numbers.length === 2) {
      const result = calculateSum(numbers[0], numbers[1]);
      // Print the final result to stdout as required.
      console.log(result);
      rl.close();
    }
  } else {
    // If an input is invalid, discard any previously entered number and start over.
    numbers.length = 0;
    // Print an error message to stderr.
    console.error(
      "Invalid integer format or digit count exceeds 1000. Please enter two valid integers again."
    );
  }
});
