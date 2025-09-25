# Claude Code (Sonnet 4) Implementation

🤖 **AI Model**: Claude Sonnet 4 - Anthropic's coding-focused model

## 📋 Mô tả

Implementation của bài toán "tính tổng hai số nguyên lớn" được tạo ra bởi Claude Code (Sonnet 4) từ Anthropic. Model này được tối ưu hóa đặc biệt cho các tác vụ coding và programming.

## 🎯 Bài toán

Xem tại [README.md](../../README.md)

## 🚀 Cách chạy

```bash
# Từ root directory
pnpm run start:claude

# Hoặc từ package directory này
pnpm start
```

## 🧪 Chạy tests

```bash
# Từ root directory
pnpm run test:claude

# Hoặc từ package directory này
pnpm test
```

## 🔄 Development mode

```bash
# Chạy với auto-reload khi file thay đổi
pnpm dev
```

## 📁 Cấu trúc files

```
claude-sonnet-4/
├── README.md         # Documentation này
├── package.json      # Package configuration
├── index.js         # Main program implementation
└── test.js          # Test cases
```

## 🧩 Implementation Details

(Sẽ được cập nhật sau khi Claude tạo ra implementation)

### Approach:
- TBD

### Algorithm:
- TBD

### Key Features:
- TBD

## 📊 Performance Metrics

(Sẽ được đo và cập nhật sau khi implement)

- **Test Cases Passed**: TBD/TBD
- **Execution Time**: TBD ms (avg)
- **Memory Usage**: TBD MB
- **Code Quality Score**: TBD/10

## 🎯 Test Cases

```javascript
// Expected test cases được handle:
// Basic operations
sum("123", "456") // → "579"
sum("-123", "456") // → "333"
sum("-123", "-456") // → "-579"

// Large numbers
sum("999999999999999999999", "1") // → "1000000000000000000000"

// Edge cases
sum("0", "0") // → "0"
sum("-0", "0") // → "0"
sum("", "123") // → Error
sum("abc", "123") // → Error
```

## 🔍 Notes về Claude Sonnet 4

- **Strengths**: Coding-focused model với deep understanding of programming concepts
- **Approach**: Expected to create robust, well-tested code với comprehensive error handling
- **Expected Quality**: High attention to code safety, security và best practices

## 🤝 So sánh với các AI models khác

Xem [main README](../../README.md) để so sánh với các implementation khác.

---
*Implementation này được tạo ra hoàn toàn bởi Claude Code (Sonnet 4) để đánh giá khả năng coding của AI model.*