import readline from "readline";

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Validates if a string represents a properly formatted integer
 * @param {string} num - The input string to validate
 * @returns {boolean} - True if valid integer format
 */
function isValidInteger(num) {
  // Optional leading + or -, followed by digits, no leading zeros except for single 0
  return (
    /^[-+]?\d+$/.test(num) &&
    !/^[-+]?0\d/.test(num) && // No leading zeros except "0"
    num !== "-" &&
    num !== "+" &&
    num !== ""
  ); // Not just signs
}

/**
 * Normalizes a number string by removing redundant leading zeros
 * @param {string} num - The number string to normalize
 * @returns {string} - Normalized number string
 */
function normalizeNumber(num) {
  if (num === "0") return "0";

  let sign = "";
  let digits = num;

  // Extract sign
  if (num.startsWith("-") || num.startsWith("+")) {
    sign = num[0];
    digits = num.slice(1);
  }

  // Remove leading zeros
  let i = 0;
  while (i < digits.length - 1 && digits[i] === "0") {
    i++;
  }
  digits = digits.slice(i);

  // Handle -0 case
  if (digits === "0") return "0";

  return sign + digits;
}

/**
 * Compares two positive number strings
 * @param {string} a - First number (positive, no sign)
 * @param {string} b - Second number (positive, no sign)
 * @returns {number} - 1 if a > b, -1 if a < b, 0 if equal
 */
function compareAbsoluteValues(a, b) {
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
 * @param {string} a - First number (positive, no sign)
 * @param {string} b - Second number (positive, no sign)
 * @returns {string} - Sum of a and b
 */
function addPositiveStrings(a, b) {
  let result = "";
  let carry = 0;
  let i = a.length - 1;
  let j = b.length - 1;

  // Add digit by digit from right to left
  while (i >= 0 || j >= 0 || carry > 0) {
    const digitA = i >= 0 ? parseInt(a[i]) : 0;
    const digitB = j >= 0 ? parseInt(b[j]) : 0;
    const sum = digitA + digitB + carry;

    result = (sum % 10) + result;
    carry = Math.floor(sum / 10);

    i--;
    j--;
  }

  return result;
}

/**
 * Subtracts two positive number strings (a >= b)
 * @param {string} a - First number (positive, no sign, >= b)
 * @param {string} b - Second number (positive, no sign)
 * @returns {string} - Difference a - b
 */
function subtractPositiveStrings(a, b) {
  let result = "";
  let borrow = 0;
  let i = a.length - 1;
  let j = b.length - 1;

  // Subtract digit by digit from right to left
  while (i >= 0) {
    const digitA = parseInt(a[i]);
    const digitB = j >= 0 ? parseInt(b[j]) : 0;
    let diff = digitA - digitB - borrow;

    if (diff < 0) {
      diff += 10;
      borrow = 1;
    } else {
      borrow = 0;
    }

    result = diff + result;
    i--;
    j--;
  }

  // Remove leading zeros from result
  let k = 0;
  while (k < result.length - 1 && result[k] === "0") {
    k++;
  }

  return result.slice(k);
}

/**
 * Main function to compute sum of two large integers
 * @param {string} num1 - First number string
 * @param {string} num2 - Second number string
 * @returns {string} - Sum of num1 and num2
 */
function computeSum(num1, num2) {
  // Normalize inputs
  const norm1 = normalizeNumber(num1);
  const norm2 = normalizeNumber(num2);

  // Extract signs and absolute values
  const isNegative1 = norm1.startsWith("-");
  const isNegative2 = norm2.startsWith("-");
  const abs1 = isNegative1 ? norm1.slice(1) : norm1;
  const abs2 = isNegative2 ? norm2.slice(1) : norm2;

  // Handle different sign cases
  if (isNegative1 === isNegative2) {
    // Same signs: add absolute values
    const sumAbs = addPositiveStrings(abs1, abs2);
    return isNegative1 ? "-" + sumAbs : sumAbs;
  } else {
    // Different signs: subtract smaller from larger
    const comparison = compareAbsoluteValues(abs1, abs2);

    if (comparison === 0) {
      return "0"; // Numbers are equal but opposite signs
    }

    const largerAbs = comparison > 0 ? abs1 : abs2;
    const smallerAbs = comparison > 0 ? abs2 : abs1;
    const largerIsNegative = comparison > 0 ? isNegative1 : isNegative2;

    const diffAbs = subtractPositiveStrings(largerAbs, smallerAbs);

    return largerIsNegative ? "-" + diffAbs : diffAbs;
  }
}

/**
 * Prompts user for input and validates it
 * @param {string} promptMessage - Message to display to user
 * @returns {Promise<string>} - Validated number string
 */
function getValidInteger(promptMessage) {
  return new Promise((resolve) => {
    const ask = () => {
      rl.question(promptMessage, (input) => {
        const trimmed = input.trim();

        if (!isValidInteger(trimmed)) {
          console.error(
            "Error: Invalid input. Please enter a valid integer (optional sign followed by digits, no leading zeros except for 0 itself)."
          );
          ask();
        } else {
          resolve(trimmed);
        }
      });
    };

    ask();
  });
}

/**
 * Main function
 */
async function main() {
  try {
    console.log("Large Integer Calculator (up to 1000 digits)");
    console.log("============================================");

    // Get two valid integers from user
    const num1 = await getValidInteger("Enter first integer: ");
    const num2 = await getValidInteger("Enter second integer: ");

    // Check length constraints (up to 1000 digits)
    const digits1 = num1.replace(/^[-+]/, "").length;
    const digits2 = num2.replace(/^[-+]/, "").length;

    if (digits1 > 1000 || digits2 > 1000) {
      console.error("Error: Numbers cannot exceed 1000 digits.");
      process.exit(1);
    }

    // Compute and display result
    const result = computeSum(num1, num2);
    console.log(result);
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  } finally {
    rl.close();
  }
}

// Start the program
main();
