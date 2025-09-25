# HUST SQA - Sum of 2 Numbers: AI Model Comparison

🎯 **Mục tiêu**: So sánh chất lượng và khả năng lập trình của các mô hình AI khác nhau thông qua cùng một bài toán cụ thể.

## 📋 Mô tả bài toán

**Viết một chương trình để tính tổng của hai số nguyên lớn (số có thể có đến 1000 chữ số).**

### Yêu cầu chi tiết:

1. **Input**: Chương trình nhận hai số nguyên từ người dùng
2. **Output**: In ra tổng của hai số đó
3. **Xử lý số âm**: Hỗ trợ cả số âm và số dương
4. **Validation**: Kiểm tra đầu vào để đảm bảo người dùng nhập đúng định dạng số nguyên
5. **Big Integer**: Xử lý được số có đến 1000 chữ số

### Prompt input cho mỗi mô hình

Xem tại [PROMPT.md](PROMPT.md)

## 🤖 AI Models được so sánh

Dự án này so sánh 6 mô hình AI/tool khác nhau:

| Package                 | AI Model/Tool                  | Mô tả                                            |
| ----------------------- | ------------------------------ | ------------------------------------------------ |
| `chatgpt-gpt5-thinking` | ChatGPT (GPT-5 Thinking)       | OpenAI's latest model with thinking capabilities |
| `google-gemini-2.5-pro` | Google Gemini (Gemini 2.5 Pro) | Google's advanced multimodal AI                  |
| `grok-4`                | Grok (Grok 4)                  | xAI's conversational AI model                    |
| `cursor-auto`           | Cursor (Auto model)            | AI-powered code editor                           |
| `claude-sonnet-4`       | Claude Code (Claude Sonnet 4)  | Anthropic's coding-focused model                 |
| `deepseek`              | Deepseek Chat                  | Deepseek's language model                        |

## 🛠️ Cấu trúc Workspace

```
hust-sqa-sum-2-numbers/
├── packages/                      # Các implementation từ từng AI model
│   ├── chatgpt-gpt5-thinking/    # ChatGPT implementation
│   ├── google-gemini-2.5-pro/    # Google Gemini implementation
│   ├── grok-4/                   # Grok implementation
│   ├── cursor-auto/              # Cursor implementation
│   ├── claude-sonnet-4/          # Claude implementation
│   └── deepseek/                 # Deepseek implementation
├── pnpm-workspace.yaml           # Workspace configuration
├── package.json                  # Root package với scripts
└── README.md                     # Documentation này
```

## 🚀 Commands

### Cài đặt dependencies

```bash
pnpm install
```

### Chạy từng model riêng lẻ:

```bash
pnpm run start:chatgpt    # Chạy ChatGPT implementation
pnpm run start:gemini     # Chạy Google Gemini implementation
pnpm run start:grok       # Chạy Grok implementation
pnpm run start:cursor     # Chạy Cursor implementation
pnpm run start:claude     # Chạy Claude implementation
pnpm run start:deepseek   # Chạy Deepseek implementation
```

### Chạy tất cả implementations:

```bash
pnpm run start:all        # Chạy tất cả implementations
pnpm run dev:all          # Development mode cho tất cả
```

### Testing:

```bash
pnpm test                 # Test tất cả implementations
pnpm run test:chatgpt     # Test riêng ChatGPT
pnpm run test:gemini      # Test riêng Gemini
# ... và tương tự cho các model khác
```

### Workspace management:

```bash
pnpm run clean           # Xóa tất cả node_modules
pnpm run list:packages   # Liệt kê tất cả packages
```

## 📊 Tiêu chí đánh giá

Các implementation sẽ được đánh giá dựa trên:

1. **✅ Tính đúng đắn**: Có xử lý đúng tất cả test cases không?
2. **🛡️ Error handling**: Có validate input và xử lý lỗi tốt không?
3. **⚡ Hiệu năng**: Tốc độ xử lý với số lớn như thế nào?
4. **📝 Code quality**: Code có clean, readable và maintainable không?
5. **🧪 Testing**: Có viết test cases comprehensive không?
6. **📖 Documentation**: Có comment và documentation tốt không?
7. **🎯 Edge cases**: Có xử lý được các trường hợp đặc biệt không? (số 0, số âm, số rất lớn, etc.)

## 🧪 Test Cases mẫu

```javascript
// Basic cases
sum("123", "456") → "579"
sum("-123", "456") → "333"
sum("-123", "-456") → "-579"

// Large numbers
sum("999999999999999999999", "1") → "1000000000000000000000"

// Edge cases
sum("0", "0") → "0"
sum("-0", "0") → "0"
sum("", "123") → Error: Invalid input
sum("abc", "123") → Error: Invalid input
```

## 📈 Kết quả so sánh

(Sẽ được cập nhật sau khi implement và test tất cả models)

| Model    | Correctness | Error Handling | Performance | Code Quality | Overall |
| -------- | ----------- | -------------- | ----------- | ------------ | ------- |
| ChatGPT  | TBD         | TBD            | TBD         | TBD          | TBD     |
| Gemini   | TBD         | TBD            | TBD         | TBD          | TBD     |
| Grok     | TBD         | TBD            | TBD         | TBD          | TBD     |
| Cursor   | TBD         | TBD            | TBD         | TBD          | TBD     |
| Claude   | TBD         | TBD            | TBD         | TBD          | TBD     |
| Deepseek | TBD         | TBD            | TBD         | TBD          | TBD     |

## 🤝 Contributing

1. Mỗi package chứa implementation từ một AI model cụ thể
2. Giữ nguyên cấu trúc file: `index.js` (main program), `test.js` (test cases)
3. Follow cùng coding standards across tất cả implementations để so sánh công bằng

## 📄 License

ISC - Dành cho mục đích học tập và nghiên cứu.
