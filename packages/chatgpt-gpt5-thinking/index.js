// sum_bigints.mjs (ESM)
// Compute A + B where A and B are integers up to 1000 digits (with optional leading +/-).
// Uses string-based addition/subtraction to avoid relying on arbitrary-precision types.

import { createInterface } from "node:readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

/** Prompt wrapper that returns a single line of input */
function ask(q) {
  return new Promise((resolve) => rl.question(q, (ans) => resolve(ans)));
}

/** Remove leading zeros from a non-signed digit string; return "0" if all zeros */
function stripLeadingZeros(digits) {
  const s = digits.replace(/^0+/, "");
  return s.length ? s : "0";
}

/** Validate and normalize an integer string.
 * Returns { ok: true, sign: '+'|'-'|'', abs: '0'..digits, text: normalizedCanonical }
 * or { ok: false, error: '...' } on failure.
 *
 * Rules:
 * - Optional leading '+' or '-' then digits only.
 * - Trim outer whitespace; no internal spaces allowed.
 * - Up to 1000 significant digits (after removing leading zeros).
 */
function parseInteger(inputRaw) {
  const raw = inputRaw.trim();
  if (!/^[+-]?\d+$/.test(raw)) {
    return {
      ok: false,
      error:
        "Invalid format. Use optional leading + or -, followed by digits only.",
    };
  }
  let sign = "";
  let digits = raw;
  if (raw[0] === "+" || raw[0] === "-") {
    sign = raw[0] === "-" ? "-" : "";
    digits = raw.slice(1);
  }
  // remove leading zeros from absolute part
  const abs = stripLeadingZeros(digits);
  if (abs.length > 1000) {
    return {
      ok: false,
      error: "Too many digits. Limit is 1000 significant digits.",
    };
  }
  // Zero has no sign
  if (abs === "0") sign = "";
  const text = (sign ? "-" : "") + abs;
  return { ok: true, sign, abs, text };
}

/** Compare absolute values of two non-negative digit strings.
 * Returns 1 if a>b, -1 if a<b, 0 if equal.
 */
function compareAbs(a, b) {
  if (a.length !== b.length) return a.length > b.length ? 1 : -1;
  return a === b ? 0 : a > b ? 1 : -1; // lex compare works for equal length numeric strings
}

/** Add two non-negative digit strings (no sign), return digit string */
function addAbs(a, b) {
  let i = a.length - 1;
  let j = b.length - 1;
  let carry = 0;
  let out = "";
  while (i >= 0 || j >= 0 || carry) {
    const da = i >= 0 ? a.charCodeAt(i) - 48 : 0;
    const db = j >= 0 ? b.charCodeAt(j) - 48 : 0;
    const sum = da + db + carry;
    out = String(sum % 10) + out;
    carry = Math.floor(sum / 10);
    i--;
    j--;
  }
  return stripLeadingZeros(out);
}

/** Subtract b from a for non-negative digit strings with a>=b, return digit string */
function subAbs(a, b) {
  let i = a.length - 1;
  let j = b.length - 1;
  let borrow = 0;
  let out = "";
  while (i >= 0) {
    let da = a.charCodeAt(i) - 48 - borrow;
    const db = j >= 0 ? b.charCodeAt(j) - 48 : 0;
    if (da < db) {
      da += 10;
      borrow = 1;
    } else {
      borrow = 0;
    }
    const diff = da - db;
    out = String(diff) + out;
    i--;
    j--;
  }
  return stripLeadingZeros(out);
}

/** Compute signed sum given normalized {sign, abs} pairs */
function addSigned(a, b) {
  if (a.sign === b.sign) {
    const abs = addAbs(a.abs, b.abs);
    const sign = abs === "0" ? "" : a.sign; // same sign
    return (sign ? "-" : "") + abs;
  } else {
    // different signs: larger abs minus smaller abs; sign of the larger
    const cmp = compareAbs(a.abs, b.abs);
    if (cmp === 0) return "0";
    if (cmp > 0) {
      const abs = subAbs(a.abs, b.abs);
      const sign = abs === "0" ? "" : a.sign;
      return (sign ? "-" : "") + abs;
    } else {
      const abs = subAbs(b.abs, a.abs);
      const sign = abs === "0" ? "" : b.sign;
      return (sign ? "-" : "") + abs;
    }
  }
}

/** Ask repeatedly until a valid integer is entered; returns normalized text */
async function askInteger(label) {
  while (true) {
    const line = await ask("");
    const parsed = parseInteger(line);
    if (parsed.ok) return parsed;
    console.log(`Error: ${parsed.error}\nPlease try again.`);
  }
}

async function main() {
  const A = await askInteger("A");
  const B = await askInteger("B");

  const sum = addSigned(A, B);
  console.log(sum);

  rl.close();
}

await main();
