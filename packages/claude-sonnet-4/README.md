# Claude Code (Sonnet 4) Implementation

🤖 **AI Model**: Claude Sonnet 4 - Anthropic's coding-focused model

## 📋 Mô tả

Implementation của bài toán "tính tổng hai số nguyên lớn" được tạo ra bởi Claude Code (Sonnet 4) từ Anthropic. Model này được tối ưu hóa đặc biệt cho các tác vụ coding và programming.

## 🎯 Bài toán

Xem tại [README.md](../../README.md)

## Đánh giá sơ bộ

- Tính chính xác: 96.2%
- Thời gian thực hiện: 3 phút 23 giây

```
  ✅ Basic addition: 123 + 456
  ✅ Zero addition: 0 + 0
  ✅ Simple addition: 1 + 1
  ✅ Negative + Positive: -123 + 456
  ✅ Positive + Negative: 123 + (-456)
  ✅ Negative + Negative: -123 + (-456)
  ✅ Negative zero: -0 + 0
  ✅ Large number: 999999999999999999999 + 1
  ✅ Very large numbers addition
  ✅ Three digit addition with carry
  ✅ Numbers with leading zeros
  ✅ Leading zeros: 0001 + 0002
  ✅ Single digit with carry: 9 + 9
  ✅ Simple single digit: 5 + 3
  ✅ Large negative + positive: -999 + 1000
  ✅ Large positive + negative: 1000 + (-999)
  ✅ Different length numbers
  ✅ Different length with negative
Invalid input test cases:
  ✅ Invalid input: abc + 123 (properly rejected)
  ✅ Invalid input: 123 + def (properly rejected)
  ✅ Decimal numbers (should be integers only) (properly rejected)
  ❌ Missing second number (should have been rejected)
      Output: ""
  ✅ Missing first number (properly rejected)
  ✅ Space in number (properly rejected)
  ✅ Multiple signs (properly rejected)
  ✅ Double negative sign (properly rejected)
📊 claude: 25/26 tests passed (96.2%)
```