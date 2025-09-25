**Task:**
Write a console program that computes the sum of two arbitrarily large integers (each up to **1000 digits**) using Javascript (Node.js, ESM module).

**Requirements:**

1. Read **two** integers from the user (one per line).
2. Support both **positive and negative** numbers (leading “-” only).
3. **Validate input**: accept only properly formatted integers (optional leading “+” or “-”, followed by digits; no spaces inside the number, no decimal points).
4. If either input is invalid, print a clear error message and **prompt again** until two valid integers are entered.
5. Output exactly the **sum** of the two integers on a single line, with correct sign and no leading zeros (except “0” itself).
6. Do **not** rely on built-in big-integer types that exceed standard integer ranges; if the language lacks arbitrary precision, implement string-based addition/subtraction.
7. Handle edge cases: very long inputs (up to 1000 digits), different signs, carries/borrows across many digits, sums equal to zero, and leading zeros in input.

**I/O Specification:**

- **Input:**
  - Line 1: integer A
  - Line 2: integer B
- **Output:**
  - Line 1: A + B
- DO NOT output anything to the stdio other than the result (including the prompt to enter integer). Printing error is the only exception

**Examples:**
Input

```
12345678901234567890
98765432109876543210
```

Output

```
111111111011111111100
```

Input

```
-999
1000
```

Output

```
1
```

**Implementation Notes:**

- Normalize inputs by trimming whitespace and removing redundant leading zeros (preserve a single “0”).
- If signs differ, convert to subtraction of absolute values with correct sign handling.
- Keep the solution clear, well-structured, and include brief comments explaining the big-number addition/subtraction logic.
