# Cursor (Auto Model) Implementation

🤖 **AI Tool**: Cursor with Auto model - AI-powered code editor

## 📋 Mô tả

Implementation của bài toán "tính tổng hai số nguyên lớn" được tạo ra bởi Cursor (Auto model). Cursor là một AI-powered code editor với khả năng code generation và completion tiên tiến.

## 🎯 Bài toán

Xem tại [README.md](../../README.md)

## 🚀 Cách chạy

```bash
# Từ root directory
pnpm run start:cursor

# Hoặc từ package directory này
pnpm start
```

## 🧪 Chạy tests

```bash
# Từ root directory
pnpm run test:cursor

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
cursor-auto/
├── README.md         # Documentation này
├── package.json      # Package configuration
├── index.js         # Main program implementation
└── test.js          # Test cases
```

## 🧩 Implementation Details

(Sẽ được cập nhật sau khi Cursor tạo ra implementation)

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
sum("123", "456"); // → "579"
sum("-123", "456"); // → "333"
sum("-123", "-456"); // → "-579"

// Large numbers
sum("999999999999999999999", "1"); // → "1000000000000000000000"

// Edge cases
sum("0", "0"); // → "0"
sum("-0", "0"); // → "0"
sum("", "123"); // → Error
sum("abc", "123"); // → Error
```

## 🔍 Notes về Cursor Auto Model

- **Strengths**: AI-powered code editor với real-time suggestions
- **Approach**: Expected to create clean, well-structured code với modern practices
- **Expected Quality**: Developer-friendly code với good IDE integration

## 🤝 So sánh với các AI models khác

Xem [main README](../../README.md) để so sánh với các implementation khác.

---

_Implementation này được tạo ra hoàn toàn bởi Cursor (Auto model) để đánh giá khả năng coding của AI tool._
