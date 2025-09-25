#!/usr/bin/env node

import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = createInterface({
  input,
  output,
});

/**
 * Reads a valid integer from stdin interactively.
 * If invalid, prints an error message and prompts again.
 * @param {Object} rl - Readline interface
 * @returns {Promise<Object>} Normalized integer {sign: number, digits: string}
 */
async function readValidInteger(rl) {
  while (true) {
    const line = await rl.question("");
    const trimmed = line.trim();
    if (isValidInteger(trimmed)) {
      return normalizeInteger(trimmed);
    } else {
      console.error(
        "Error: Invalid integer format. Please enter a valid integer (optional +/- followed by digits, no spaces or decimals)."
      );
    }
  }
}

/**
 * Validates if the string is a properly formatted integer.
 * @param {string} str - Input string
 * @returns {boolean} True if valid
 */
function isValidInteger(str) {
  const trimmed = str.trim();
  if (trimmed === "") return false;
  let i = 0;
  if (trimmed[i] === "+" || trimmed[i] === "-") {
    i++;
  }
  if (i === trimmed.length) return false;
  for (; i < trimmed.length; i++) {
    if (!/[0-9]/.test(trimmed[i])) return false;
  }
  return true;
}

/**
 * Normalizes the integer string: extracts sign, removes leading zeros.
 * @param {string} str - Valid integer string
 * @returns {Object} {sign: 1 or -1, digits: string without leading zeros}
 */
function normalizeInteger(str) {
  let trimmed = str.trim();
  let sign = 1;
  if (trimmed[0] === "-") {
    sign = -1;
    trimmed = trimmed.slice(1);
  } else if (trimmed[0] === "+") {
    trimmed = trimmed.slice(1);
  }
  // Remove leading zeros
  let start = 0;
  while (start < trimmed.length - 1 && trimmed[start] === "0") {
    start++;
  }
  let digits = trimmed.slice(start);
  if (digits === "") {
    digits = "0";
  }
  if (digits === "0") {
    sign = 1;
  }
  return { sign, digits };
}

/**
 * Adds two positive digit strings (big integer addition).
 * @param {string} d1 - First digit string
 * @param {string} d2 - Second digit string
 * @returns {string} Sum digit string
 */
function addDigits(d1, d2) {
  if (d1.length < d2.length) [d1, d2] = [d2, d1];
  let result = "";
  let carry = 0;
  let i = d1.length - 1;
  let j = d2.length - 1;
  while (i >= 0 || j >= 0 || carry) {
    let sum = carry;
    if (i >= 0) sum += parseInt(d1[i--]);
    if (j >= 0) sum += parseInt(d2[j--]);
    carry = Math.floor(sum / 10);
    result = (sum % 10) + result;
  }
  return result;
}

/**
 * Subtracts two positive digit strings (d1 >= d2 numerically).
 * @param {string} d1 - Larger digit string
 * @param {string} d2 - Smaller digit string
 * @returns {string} Difference digit string
 */
function subtractDigits(d1, d2) {
  let result = "";
  let borrow = 0;
  let i = d1.length - 1;
  let j = d2.length - 1;
  while (i >= 0 || j >= 0) {
    let val1 = i >= 0 ? parseInt(d1[i]) : 0;
    let val2 = j >= 0 ? parseInt(d2[j]) : 0;
    let temp = val1 - val2 - borrow;
    if (temp < 0) {
      temp += 10;
      borrow = 1;
    } else {
      borrow = 0;
    }
    result = temp + result;
    if (i >= 0) i--;
    if (j >= 0) j--;
  }
  // Remove leading zeros
  let start = 0;
  while (start < result.length - 1 && result[start] === "0") {
    start++;
  }
  return result.slice(start);
}

/**
 * Compares two positive digit strings numerically.
 * @param {string} d1 - First digit string
 * @param {string} d2 - Second digit string
 * @returns {number} 1 if d1 > d2, -1 if d1 < d2, 0 if equal
 */
function compareAbs(d1, d2) {
  if (d1.length !== d2.length) {
    return d1.length > d2.length ? 1 : -1;
  }
  if (d1 > d2) return 1;
  if (d1 < d2) return -1;
  return 0;
}

/**
 * Computes the sum of two big integers.
 * Handles signs by addition or subtraction of absolutes.
 * @param {Object} a - First big int {sign, digits}
 * @param {Object} b - Second big int {sign, digits}
 * @returns {Object} Sum {sign, digits}
 */
function addBig(a, b) {
  if (a.sign === b.sign) {
    // Same sign: add absolutes
    const sumDigits = addDigits(a.digits, b.digits);
    return { sign: a.sign, digits: sumDigits };
  } else {
    // Different signs: subtract smaller absolute from larger
    const cmp = compareAbs(a.digits, b.digits);
    if (cmp === 0) {
      return { sign: 1, digits: "0" };
    }
    let larger, smaller, resultSign;
    if (cmp > 0) {
      larger = a.digits;
      smaller = b.digits;
      resultSign = a.sign;
    } else {
      larger = b.digits;
      smaller = a.digits;
      resultSign = b.sign;
    }
    const diffDigits = subtractDigits(larger, smaller);
    return { sign: resultSign, digits: diffDigits };
  }
}

/**
 * Converts big int object to string representation.
 * @param {Object} num - Big int {sign, digits}
 * @returns {string} String representation, no leading zeros
 */
function toString(num) {
  if (num.digits === "0") return "0";
  return (num.sign < 0 ? "-" : "") + num.digits;
}

/**
 * Main function: reads two integers and outputs their sum.
 */
async function main() {
  const numA = await readValidInteger(rl);
  const numB = await readValidInteger(rl);
  const sum = addBig(numA, numB);
  console.log(toString(sum));
  rl.close();
}

main().catch(console.error);
