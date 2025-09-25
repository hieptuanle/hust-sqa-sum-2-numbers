import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let lineBuffer = [];
let lineResolvers = [];

rl.on("line", (line) => {
  if (lineResolvers.length > 0) {
    const resolver = lineResolvers.shift();
    resolver(line);
  } else {
    lineBuffer.push(line);
  }
});

function promptForInput() {
  return new Promise((resolve) => {
    if (lineBuffer.length > 0) {
      resolve(lineBuffer.shift());
    } else {
      lineResolvers.push(resolve);
    }
  });
}

function isValidInteger(str) {
  str = str.trim();
  if (str === "") return false;

  // Check for optional sign at the beginning
  let startIdx = 0;
  if (str[0] === "+" || str[0] === "-") {
    startIdx = 1;
  }

  // Must have at least one digit after the sign
  if (startIdx >= str.length) return false;

  // Check that all remaining characters are digits
  for (let i = startIdx; i < str.length; i++) {
    if (str[i] < "0" || str[i] > "9") {
      return false;
    }
  }

  return true;
}

function normalizeNumber(str) {
  str = str.trim();

  // Handle sign
  let isNegative = false;
  if (str[0] === "-") {
    isNegative = true;
    str = str.substring(1);
  } else if (str[0] === "+") {
    str = str.substring(1);
  }

  // Remove leading zeros
  while (str.length > 1 && str[0] === "0") {
    str = str.substring(1);
  }

  // Handle the case where the number is zero
  if (str === "0") {
    return "0";
  }

  return isNegative ? "-" + str : str;
}

function addPositiveNumbers(num1, num2) {
  // Make sure num1 is the longer number
  if (num1.length < num2.length) {
    [num1, num2] = [num2, num1];
  }

  let result = "";
  let carry = 0;
  let i = num1.length - 1;
  let j = num2.length - 1;

  // Add digits from right to left
  while (i >= 0 || j >= 0 || carry > 0) {
    let digit1 = i >= 0 ? parseInt(num1[i]) : 0;
    let digit2 = j >= 0 ? parseInt(num2[j]) : 0;

    let sum = digit1 + digit2 + carry;
    carry = Math.floor(sum / 10);
    result = (sum % 10) + result;

    i--;
    j--;
  }

  return result;
}

function subtractPositiveNumbers(num1, num2) {
  // Returns num1 - num2 for positive numbers
  // Assumes num1 >= num2

  let result = "";
  let borrow = 0;
  let i = num1.length - 1;
  let j = num2.length - 1;

  // Subtract digits from right to left
  while (i >= 0) {
    let digit1 = parseInt(num1[i]);
    let digit2 = j >= 0 ? parseInt(num2[j]) : 0;

    let diff = digit1 - digit2 - borrow;
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

  // Remove leading zeros
  while (result.length > 1 && result[0] === "0") {
    result = result.substring(1);
  }

  return result;
}

function comparePositiveNumbers(num1, num2) {
  // Returns 1 if num1 > num2, -1 if num1 < num2, 0 if equal
  if (num1.length > num2.length) return 1;
  if (num1.length < num2.length) return -1;

  for (let i = 0; i < num1.length; i++) {
    if (num1[i] > num2[i]) return 1;
    if (num1[i] < num2[i]) return -1;
  }

  return 0;
}

function addBigIntegers(a, b) {
  // Extract signs and absolute values
  let aIsNegative = a[0] === "-";
  let bIsNegative = b[0] === "-";
  let absA = aIsNegative ? a.substring(1) : a;
  let absB = bIsNegative ? b.substring(1) : b;

  if (aIsNegative === bIsNegative) {
    // Same sign: add absolute values and apply the common sign
    let sum = addPositiveNumbers(absA, absB);
    return aIsNegative ? "-" + sum : sum;
  } else {
    // Different signs: subtract smaller from larger
    let comparison = comparePositiveNumbers(absA, absB);

    if (comparison === 0) {
      return "0";
    } else if (comparison > 0) {
      // |a| > |b|
      let diff = subtractPositiveNumbers(absA, absB);
      return aIsNegative ? "-" + diff : diff;
    } else {
      // |b| > |a|
      let diff = subtractPositiveNumbers(absB, absA);
      return bIsNegative ? "-" + diff : diff;
    }
  }
}

async function main() {
  let num1, num2;

  // Get first valid integer
  while (true) {
    let input = await promptForInput();
    if (isValidInteger(input)) {
      num1 = normalizeNumber(input);
      break;
    } else {
      console.log("Invalid input. Please enter a valid integer.");
    }
  }

  // Get second valid integer
  while (true) {
    let input = await promptForInput();
    if (isValidInteger(input)) {
      num2 = normalizeNumber(input);
      break;
    } else {
      console.log("Invalid input. Please enter a valid integer.");
    }
  }

  // Calculate and output the sum
  let sum = addBigIntegers(num1, num2);
  console.log(sum);

  rl.close();
}

main();
