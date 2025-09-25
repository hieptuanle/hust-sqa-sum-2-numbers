// big-sum.mjs  (Node.js ESM)
// Console program that sums two arbitrarily large integers (up to 1000 digits).
// Reads lines until it has TWO valid integers. Prints only:
//  - "Invalid input" lines for bad input
//  - ONE final line with the exact sum (no leading zeros except "0").
//
// Usage: node big-sum.mjs

import { createInterface } from "node:readline";

// ---------- Parsing & normalization ----------
function parseInteger(raw) {
  if (typeof raw !== "string") return null;
  const s = raw.trim();
  // Strict format: optional +/-, then digits only; no internal spaces or dots
  if (!/^[+-]?\d+$/.test(s)) return null;

  // Extract sign and magnitude
  let sign = 1;
  let digits = s;

  if (s[0] === "+" || s[0] === "-") {
    if (s[0] === "-") sign = -1;
    digits = s.slice(1);
  }

  // Remove leading zeros, preserving a single "0"
  digits = digits.replace(/^0+/, "");
  if (digits.length === 0) {
    digits = "0";
    sign = 1; // "-0" and "+0" normalize to plain "0"
  }

  return { sign, mag: digits };
}

// ---------- Unsigned big integer helpers on strings ----------
function addMagnitudes(a, b) {
  // a, b are non-empty strings of digits, no sign
  let i = a.length - 1;
  let j = b.length - 1;
  let carry = 0;
  const out = [];

  while (i >= 0 || j >= 0 || carry) {
    const da = i >= 0 ? a.charCodeAt(i) - 48 : 0;
    const db = j >= 0 ? b.charCodeAt(j) - 48 : 0;
    const sum = da + db + carry;
    out.push(String.fromCharCode(48 + (sum % 10)));
    carry = Math.floor(sum / 10);
    i--;
    j--;
  }

  out.reverse();
  return out.join("");
}

function compareMagnitudes(a, b) {
  // Returns 1 if a>b, 0 if equal, -1 if a<b (unsigned comparison)
  if (a.length !== b.length) return a.length > b.length ? 1 : -1;
  if (a === b) return 0;
  return a > b ? 1 : -1; // lexicographic works when lengths equal and digits only
}

function subMagnitudes(a, b) {
  // Compute a - b assuming a >= b, both unsigned strings
  let i = a.length - 1;
  let j = b.length - 1;
  let borrow = 0;
  const out = [];

  while (i >= 0) {
    let da = a.charCodeAt(i) - 48 - borrow;
    const db = j >= 0 ? b.charCodeAt(j) - 48 : 0;
    if (da < db) {
      da += 10;
      borrow = 1;
    } else {
      borrow = 0;
    }
    const d = da - db;
    out.push(String.fromCharCode(48 + d));
    i--;
    j--;
  }

  // Remove leading zeros
  while (out.length > 1 && out[out.length - 1] === "0") out.pop();
  out.reverse();
  return out.join("");
}

// ---------- Signed addition ----------
function addSigned(x, y) {
  // x, y: {sign: ±1, mag: "digits"}
  if (x.sign === y.sign) {
    const mag = addMagnitudes(x.mag, y.mag);
    return { sign: x.sign, mag };
  } else {
    const cmp = compareMagnitudes(x.mag, y.mag);
    if (cmp === 0) return { sign: 1, mag: "0" };
    if (cmp > 0) {
      return { sign: x.sign, mag: subMagnitudes(x.mag, y.mag) };
    } else {
      return { sign: y.sign, mag: subMagnitudes(y.mag, x.mag) };
    }
  }
}

function formatSigned(n) {
  if (n.mag === "0") return "0";
  return (n.sign < 0 ? "-" : "") + n.mag;
}

// ---------- I/O loop ----------
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

const values = []; // will hold two valid parsed integers

rl.on("line", (line) => {
  if (values.length >= 2) return; // ignore extra input
  const parsed = parseInteger(line);
  if (!parsed) {
    console.error("Invalid input");
    return;
  }
  values.push(parsed);

  if (values.length === 2) {
    const sum = addSigned(values[0], values[1]);
    console.log(formatSigned(sum));
    rl.close();
  }
});

rl.on("close", () => {
  // If the stream ends before two valid inputs were provided, do nothing more.
  // (No extra output besides prior "Invalid input" lines or the final result.)
});
