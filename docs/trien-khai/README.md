# Hướng dẫn triển khai kế hoạch trí não

Đọc file này trước, rồi **chỉ đọc file của đợt đang làm**. Không cần đọc lại cả kế hoạch.

| File | Dùng khi |
|---|---|
| [../ke-hoach-tri-nao.md](../ke-hoach-tri-nao.md) | Muốn biết vì sao làm (không cần cho việc viết code) |
| [dot-0.md](dot-0.md) | Đợt 0 · sửa lỗi, dọn nền, đường ống công cụ chung |
| [dot-1.md](dot-1.md) | Đợt 1 · sổ vấn đề, giao đúng người, công cụ kiểm link và tải hình |
| [dot-2.md](dot-2.md) | Đợt 2 · bộ não `tri-thuc/` trong vault Obsidian riêng |
| [dot-3.md](dot-3.md) | Đợt 3 · tự học |
| [dot-4.md](dot-4.md) | Đợt 4 · tối ưu |
| [thu-tren-may.md](thu-tren-may.md) | Việc chủ dự án tự chạy trên máy Windows sau mỗi đợt |
| [fixtures/](fixtures/) | Dữ liệu mẫu cho kiểm thử, lấy từ dữ liệu thật |

## Thứ tự

Đợt 0 → 1 → 2 → 3 → 4. Không nhảy đợt.
Trong một đợt, làm đúng thứ tự mục: mục sau có thể dùng hàm của mục trước. **Mỗi mục là một commit.**
Hết một đợt thì dừng lại. Chủ dự án chạy phần của đợt đó trong `thu-tren-may.md` rồi mới sang đợt sau.

## Các quyết định đã chốt (không bàn lại)

1. **Vault riêng.** Thư mục `workspace/` được mở thành một vault Obsidian riêng tên "Yoga Lab". Bộ não nằm trong `workspace/tri-thuc/`.
2. **Câu hỏi cho chủ dự án vẫn làm dự án dừng chờ**, như hiện nay. Chỉ bớt hỏi trùng và gợi ý sẵn câu trả lời cũ.
3. **Dùng MCP nội bộ** để máy chủ cho agent gọi công cụ. Agent vẫn không có Bash.
4. **Dự án chạy thử là một chủ đề mới**, không phải bản tiếp theo của suy giáp.
5. **Máy chủ vẫn là người điều phối duy nhất.** Không agent nào gọi thẳng agent khác.

## Quy ước code (giữ đúng kiểu code hiện có)

1. Node 18 trở lên, CommonJS (`require`), **không thêm gói npm**. `package.json` không có `dependencies` và phải giữ như vậy.
2. Logic thuần (không đọc `config`, không đọc file, không gọi mạng) đặt trong `lib/<tên>.js`, xuất bằng `module.exports`.
   `server.js` `require` lại. Hàm trong `lib/` nhận mọi thứ qua tham số, để kiểm thử được.
3. Kiểm thử không được `require('../server.js')`: file này tự mở cổng và chạy `setInterval` ngay khi được nạp.
4. Chữ tiếng Việt đọc từ file: luôn `.normalize('NFC')` trước khi so khớp (giống `readWs`).
5. Chú thích ngắn bằng tiếng Việt, nói **vì sao**, giống code hiện có. Không viết chú thích dài, không chú thích điều code đã nói rõ.
6. Đường dẫn trong workspace luôn dạng `a/b/c` (gạch chéo xuôi), đi qua `insideWorkspace()` trước khi đọc hoặc ghi.
7. Tính năng nào đặc tả nói có công tắc thì thêm khoá vào `DEFAULT_CONFIG` (kèm chú thích một dòng) và một dòng vào bảng `config.json` trong README.md.
8. Đổi hành vi người dùng thấy được thì cập nhật README.md, tiếng Việt, cùng giọng văn.
9. Không đổi những thứ đặc tả không nhắc tới. Thấy lỗi khác thì ghi vào mục "Phát hiện thêm" ở cuối file đợt, không tự sửa.
10. Số dòng ghi trong đặc tả là số ở commit `066f825`, chỉ để tham khảo. Tìm theo **tên hàm**.
11. Câu chữ trong prompt (lời dặn agent) mà đặc tả ghi nguyên văn thì chép **nguyên văn**, kể cả dấu câu.
12. **Không dùng `\b` ngay sau chữ tiếng Việt có dấu.** `\b` của JavaScript chỉ hiểu chữ ASCII, nên `/Đã xử lý\b/u` không bao giờ khớp.
    Dùng `(?![\p{L}\p{N}])` với cờ `u`, ví dụ `/^##\s*Đã xử lý(?![\p{L}\p{N}])/iu`.

## Quy ước cho vault Obsidian

- Tên file note: chữ thường, không dấu, nối gạch ngang (dùng `slugFile` có sẵn trong `server.js`). Tiêu đề tiếng Việt có dấu nằm ở dòng `# …` trong note.
- Khoá frontmatter viết `snake_case` không dấu (`trang_thai`, `muc_bang_chung`), để lọc được bằng Bases hoặc Dataview.
- Danh sách trong frontmatter ghi dạng khối, giống cách Obsidian tự ghi:
  ```yaml
  nguon:
    - "[[nhs-levothyroxine]]"
  ```
- File do máy chủ sinh có dòng đầu sau tiêu đề: `> Máy chủ tự sinh file này. Đừng sửa tay: …` kèm chỗ sửa đúng.
- Máy chủ **không bao giờ ghi** vào `tri-thuc/quy-tac-cua-toi.md`, `tri-thuc/ghi-chu-chuyen-mon/`, và note nào có `khoa: true`.

## Kiểm thử

- `package.json` có `"scripts": { "start": "node server.js", "test": "node --test" }` (mục 0.1 thêm vào).
- File kiểm thử: `test/<tên>.test.js`, dùng `node:test` và `node:assert/strict`. Dữ liệu mẫu chép vào `test/fixtures/` (đặc tả ghi rõ chép file nào).
- Trước mỗi commit: `npm test` qua hết và `node --check server.js` không báo lỗi.
- Thử khởi động sau mỗi mục có sửa `server.js`:
  ```bash
  NO_OPEN=1 PORT=4399 node server.js > /tmp/yl.log 2>&1 &
  sleep 2
  curl -s -H 'Host: 127.0.0.1:4399' http://127.0.0.1:4399/api/state | head -c 200; echo
  kill %1
  ```
  Thấy JSON bắt đầu bằng `{"demo":false` là được.
- Việc cần Claude Code, Chrome hay Windows thật thì không thử được ở đây. Ghi vào `thu-tren-may.md` (mục của đợt đó đã có sẵn) nếu cần thêm bước.

## Commit

- Mỗi mục một commit. Tiêu đề tiếng Việt, bắt đầu bằng số mục, ví dụ: `0.3 parseQuestions: "Không (…)" không phải câu hỏi`.
- Không sửa dữ liệu trong `workspace/` trong commit code, trừ khi đặc tả nói.

## Khi đặc tả không rõ

Chọn cách đơn giản nhất và giữ hành vi cũ. Ghi lựa chọn đó vào mục "Phát hiện thêm" của file đợt, để chủ dự án xem lại.
