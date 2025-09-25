import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

// Validate integer input
function isValidInteger(str) {
  str = str.trim();
  if (str.length === 0) return false;

  // Check for optional sign
  let startIdx = 0;
  if (str[0] === '+' || str[0] === '-') {
    startIdx = 1;
    if (str.length === 1) return false;
  }

  // Check all remaining characters are digits
  for (let i = startIdx; i < str.length; i++) {
    if (str[i] < '0' || str[i] > '9') return false;
  }

  return true;
}

// Normalize number: remove leading zeros, handle signs
function normalize(str) {
  str = str.trim();

  let negative = false;
  if (str[0] === '-') {
    negative = true;
    str = str.substring(1);
  } else if (str[0] === '+') {
    str = str.substring(1);
  }

  // Remove leading zeros
  while (str.length > 1 && str[0] === '0') {
    str = str.substring(1);
  }

  // If number is zero, remove negative sign
  if (str === '0') {
    return '0';
  }

  return negative ? '-' + str : str;
}

// Compare absolute values of two number strings
function compareAbs(a, b) {
  if (a.length !== b.length) {
    return a.length - b.length;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return a.charCodeAt(i) - b.charCodeAt(i);
    }
  }
  return 0;
}

// Add two positive number strings
function addPositive(a, b) {
  let result = '';
  let carry = 0;
  let i = a.length - 1;
  let j = b.length - 1;

  while (i >= 0 || j >= 0 || carry > 0) {
    let sum = carry;
    if (i >= 0) {
      sum += parseInt(a[i]);
      i--;
    }
    if (j >= 0) {
      sum += parseInt(b[j]);
      j--;
    }
    result = (sum % 10) + result;
    carry = Math.floor(sum / 10);
  }

  return result;
}

// Subtract two positive number strings (a >= b)
function subtractPositive(a, b) {
  let result = '';
  let borrow = 0;
  let i = a.length - 1;
  let j = b.length - 1;

  while (i >= 0) {
    let digit = parseInt(a[i]) - borrow;
    if (j >= 0) {
      digit -= parseInt(b[j]);
      j--;
    }

    if (digit < 0) {
      digit += 10;
      borrow = 1;
    } else {
      borrow = 0;
    }

    result = digit + result;
    i--;
  }

  // Remove leading zeros
  while (result.length > 1 && result[0] === '0') {
    result = result.substring(1);
  }

  return result;
}

// Add two arbitrary integers
function addBigIntegers(num1, num2) {
  // Parse signs and get absolute values
  let neg1 = num1[0] === '-';
  let neg2 = num2[0] === '-';
  let abs1 = neg1 ? num1.substring(1) : num1;
  let abs2 = neg2 ? num2.substring(1) : num2;

  // Both positive or both negative
  if (neg1 === neg2) {
    let sum = addPositive(abs1, abs2);
    return neg1 ? '-' + sum : sum;
  }

  // Different signs - subtract smaller from larger
  let cmp = compareAbs(abs1, abs2);
  if (cmp === 0) {
    return '0';
  } else if (cmp > 0) {
    // |num1| > |num2|
    let diff = subtractPositive(abs1, abs2);
    return neg1 ? '-' + diff : diff;
  } else {
    // |num2| > |num1|
    let diff = subtractPositive(abs2, abs1);
    return neg2 ? '-' + diff : diff;
  }
}

// Main program
let inputs = [];
let lineCount = 0;

rl.on('line', (line) => {
  if (!isValidInteger(line)) {
    console.error(`Invalid integer: "${line}". Please enter a valid integer.`);
    return;
  }

  inputs.push(normalize(line));
  lineCount++;

  if (lineCount === 2) {
    let result = addBigIntegers(inputs[0], inputs[1]);
    console.log(result);
    rl.close();
  }
});