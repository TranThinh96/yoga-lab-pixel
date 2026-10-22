# 🪷 Yoga Lab · Văn phòng pixel

Một khu yoga pixel giữa vườn: Shala thiền, Thư viện, Phòng viết, Phòng trà, Lầu mây và hồ sen.
Mỗi agent là một người có thảm riêng ở Shala. Bạn chạm vào người nào thì giao việc cho người đó.

Khi nhận việc, agent vào Thư viện ngồi làm cho tới khi xong (dáng ngồi đổi theo việc đang làm: đọc, viết, tìm web);
xong việc mới rời phòng. Lúc rảnh ghé phòng nào thì làm việc của phòng đó: Phòng trà rót trà, nhấp trà, ôm chén trà ấm;
Thư viện đọc sách, ôm chồng sách, chống cằm suy nghĩ, vươn vai; Phòng viết cặm cụi viết; Lầu mây gõ máy, che mắt ngắm trời, chỉ trỏ;
ra mép hồ sen thì cho cá ăn (cá koi bơi tới đớp mồi); ngồi ghế đá thì ăn nhẹ: cầm bánh, cắn bánh, nhấp trà, rồi ngủ gật.
Xong việc họ ra hồ sen ăn mừng, gặp lỗi thì ra ghế đá ngồi. Lúc rảnh họ tập yoga trên thảm,
ghé Phòng trà, Thư viện, Lầu mây, đi dạo vườn hoặc sang nói chuyện với nhau, thỉnh thoảng buông vài câu
(bong bóng nghiêng màu xanh). Đây chỉ là hoạt cảnh trên trình duyệt, không gọi AI nên không tốn token. Phía sau, Claude Code hoặc Gemini CLI
chạy ngầm trên folder trong máy bạn, nên bạn không phải gõ lệnh hay nhìn terminal.
Giao diện chạy như một màn hình game: bản đồ luôn phủ kín cửa sổ, thanh trên cùng hiện số liệu, thanh dưới cùng có 5 nút **Đội ngũ, Bảng việc, Dự án, Sản phẩm, Lịch sử** (Lịch sử gồm cả Bàn giao và Nhật ký). Khi một việc xong, thông báo dưới màn hình có nút **Xem kết quả** để mở ngay file vừa làm. Chạm vào nhân vật để mở bảng giao việc bên phải. **Esc** hoặc **✕** đóng cửa sổ; nút **⛶** (phím **F**) ẩn luôn thanh trình duyệt. Trên điện thoại cửa sổ trượt lên từ dưới và vuốt ngang để xem hết bản đồ.

- Agent **chỉ thức dậy khi được giao việc**. Không có heartbeat, nên không tốn token khi rảnh.
- Mỗi việc là **một lượt ngắn**. Xong việc, agent để lại một **bàn giao** ngắn trong `handoff/`.
- Khi giao việc tiếp, bạn **đính kèm bàn giao**. Agent sau chỉ đọc đúng file đó, không đọc lại mọi thứ.
- Mặc định **không nạp MCP** (Notion, NotebookLM…) cho Claude, vì mỗi MCP tốn thêm token ở mọi lượt.
- Cảnh trong văn phòng đổi theo giờ thật: ngày, hoàng hôn, đêm có đèn lồng và đom đóm.

## Cần có (cài một lần)

1. **Node.js 18 trở lên**: tải ở https://nodejs.org (bản LTS).
2. **Claude Code**, đăng nhập bằng tài khoản Pro:
   `npm install -g @anthropic-ai/claude-code`, sau đó chạy `claude` một lần để đăng nhập.
3. **Antigravity CLI** (lệnh `agy`), đăng nhập bằng tài khoản Google. Từ 18/6/2026 Google đã ngừng cho Gemini CLI
   dùng với tài khoản Google cá nhân; Antigravity CLI là bản thay thế.
   Cài trên Windows (PowerShell): `irm https://antigravity.google/cli/install.ps1 | iex`, rồi chạy `agy` một lần để đăng nhập.
   Muốn agent mở đọc được trang web (không chỉ tìm kiếm), thêm quyền `read_url` vào `~/.gemini/antigravity-cli/settings.json`:
   `"permissions": { "allow": ["read_url(*)"] }`. Thiếu quyền này, agent vẫn tìm web được và Yoga Lab sẽ báo quyền nào bị từ chối. Quyền này áp dụng cho mọi lần dùng `agy` trên máy, không riêng Yoga Lab.
   Nên cho phép thêm lệnh liệt kê thư mục (chỉ xem tên file, không đọc nội dung, không nối lệnh), vì model của agy hay dùng terminal để xem folder:
   `"command(regex:(Get-ChildItem|gci|ls|dir|Test-Path)( [^;|&`$<>(){}\"]*)?)"` và bản bọc trong `powershell -Command "…"`.
   Khi agy chặn một quyền, nó dừng cả lượt; Yoga Lab tự nhắn tiếp vào cùng cuộc hội thoại (tối đa 3 lần) để agent làm cách khác,
   và ghi "Bị chặn … → nhắc làm cách khác" trong diễn biến.
   (Gemini CLI cũ vẫn chọn được, nhưng chỉ chạy với API key Gemini trả phí.)

Đây là lần duy nhất bạn cần gõ lệnh.

## Mở văn phòng

- **macOS**: nhấp đúp `start-mac.command`. Nếu máy chặn file, nhấp chuột phải → Open → Open.
- **Windows**: nhấp đúp `start-windows.bat`.

Trình duyệt tự mở `http://127.0.0.1:4321`. Cửa sổ đen nhỏ chính là "máy chủ" của văn phòng:
cứ thu nhỏ nó xuống, đóng nó là văn phòng tắt.

Văn phòng chỉ mở cho máy bạn (127.0.0.1), người khác trong mạng không vào được.

## Sơ đồ tổ chức

Mỗi agent có mục **Báo cáo cho** (bấm ✎ ở agent để sửa). Nút **Dự án → Sơ đồ tổ chức** vẽ cây tổ chức.
Người có cấp dưới hiện ★ trên bản đồ.

Mặc định, **Chef Yoga** (Claude Sonnet) là trưởng nhóm, và Mai, An, Lam, Hạ báo cáo cho Chef.
Bạn có thể xếp nhiều tầng, ví dụ Hạ báo cáo cho Lam, Lam báo cáo cho Chef.
Văn phòng không cho báo cáo vòng tròn. Xoá một agent thì cấp dưới của họ chuyển lên báo cáo cho cấp trên của họ.

## Giao cả dự án cho trưởng nhóm (nút Dự án)

Khi việc lớn cần nhiều người, bạn không phải tự chuyển tay từng bước:

1. Bấm **Dự án** ở thanh dưới (hoặc **Giao dự án cho cả nhóm** trong Bảng việc), hoặc vào **Sơ đồ tổ chức** bấm **Giao dự án** trên thẻ của Chef Yoga.
   Viết mục tiêu rồi bấm **Lập kế hoạch**.
2. Điều phối viên vào Phòng trà, đọc tài liệu mẫu trong `sources/` (nếu có) và viết **brief** `du-an/<mã>/brief.md`: sản phẩm cho ai, tài liệu mẫu cần phủ, **tiêu chí hoàn thành**, ràng buộc.
   Sau đó chia việc: ai làm gì, đọc bàn giao của bước nào, và **ai duyệt sản phẩm của ai** (bước duyệt).
   Họ **chỉ được giao việc cho người trực thuộc mình** (trực tiếp hoặc gián tiếp). Thiếu thông tin quan trọng thì họ hỏi bạn trước.
3. Kế hoạch hiện ra để bạn duyệt. Bạn có thể đổi người làm, sửa nội dung, đổi thứ tự, thêm hoặc xoá bước. Xong thì bấm **Chạy kế hoạch**.
4. Máy chủ tự chạy từng bước. Mỗi người nhận brief, **bảng dự án** `du-an/<mã>/bang.md` (tiến độ, kết luận duyệt, câu trả lời của bạn) và bàn giao cần đọc.
   Mỗi người tự kiểm sản phẩm theo tiêu chí trong brief trước khi bàn giao, và áp dụng những bài học máy chủ chọn sẵn cho bước đó (xem "Nhóm tự học thế nào").
5. **Vòng duyệt:** người duyệt kết thúc bàn giao bằng `KẾT LUẬN: ĐẠT` hoặc `KẾT LUẬN: CẦN SỬA`. Cần sửa thì máy chủ tự chèn bước sửa và duyệt lại (người duyệt), tối đa `maxReviewRounds` vòng.
   **Sổ vấn đề** (`issueLedger`): người duyệt ghi lỗi thành bảng "Danh sách vấn đề" (mã, file, vị trí, mức, loại, vấn đề, đề xuất). Máy chủ ghi vào `du-an/<mã>/van-de.md` và giao sửa cho **người phụ trách file có lỗi**, nên một vòng sửa có thể gồm nhiều người.
   Người sửa báo lại từng mã trong bảng "Đã xử lý". Báo "Đã sửa" mà file không đổi thì vấn đề vẫn mở. Bước duyệt lại chỉ kiểm các vấn đề còn mở.
   Hình máy chủ không tải được (link hỏng, tên file Commons không có thật) cũng thành vấn đề: máy chủ giao ngay người ghi link đó tìm link khác.
   Trước mỗi bước duyệt, **máy chủ tự soát lỗi máy móc** (không tốn token): dấu câu đôi, dấu cách trước dấu câu, lặp từ, từ cần tránh (`lintBanned`), cách gọi lẫn lộn (`lintVariants`), trang slide quá `lintMaxWords` chữ. Kết quả được đưa vào việc của người duyệt, nên họ không phải tự dò. Bước duyệt chỉ kiểm, không tự đi tìm nguồn mới. Bước duyệt lại và bước sửa chạy ở mức suy nghĩ thấp hơn (`stepEffort`).
6. **Hỏi chủ dự án:** bàn giao có mục "Câu hỏi cho chủ dự án" thì dự án dừng ở trạng thái **Chờ bạn trả lời**. Bạn trả lời từng câu hoặc bấm **Để nhóm tự quyết**; câu trả lời được ghi vào bảng dự án cho mọi người làm theo. Câu hỏi giống câu đã trả lời trong cùng dự án thì nhóm không hỏi lại. Câu giống câu bạn đã trả lời ở dự án trước thì ô trả lời được điền sẵn câu cũ. Mọi quyết định được ghi vào `workspace/tri-thuc/quyet-dinh.md`.
7. Nếu một bước lỗi, điều phối viên được gọi lại **một lần** để lập lại phần còn lại. Nếu vẫn lỗi, kế hoạch **tạm dừng** để bạn bấm **Chạy tiếp**.
8. **Nghiệm thu:** điều phối viên mở sản phẩm thật, chấm từng tiêu chí trong brief (điểm 0–100) vào `du-an/<mã>/nghiem-thu.md`, rồi **rút kinh nghiệm** từ số liệu máy chủ tổng hợp (xem "Nhóm tự học thế nào"). Máy chủ tự ghi kết quả; điều phối viên không sửa file bài học.
   Khi tắt bộ não (`brain: false`): bài học vào cuối `kinh-nghiem.md` như trước (bỏ bài trùng, giữ `maxLessons` bài gần nhất).
   Điểm dưới `passScore` (mặc định 85) thì giao thêm một vòng sửa (`maxFixRounds`) rồi nghiệm thu lại.
   Điểm đạt nhưng còn lỗi nhỏ thì giao **vòng sửa nhanh** (`polishAfterPass`): không nghiệm thu lại, máy chủ soát lỗi lần cuối và ghi phần còn lại vào bảng dự án.
   Câu hỏi của điều phối viên lúc nghiệm thu cũng được đưa lên cho bạn trả lời, trước khi vòng sửa chạy.
9. **Hình ảnh:** sau bước ghi `output/<chủ đề>/thiet-ke.md`, máy chủ tự tải các hình có giấy phép trong bảng "Danh sách hình" (link trang File: của Wikimedia Commons hoặc link thẳng tới file ảnh) vào `output/<chủ đề>/hinh/`. **Nhi** (agy) tạo ảnh AI theo prompt trong thiet-ke.md. agy lưu ảnh trong thư mục riêng của nó, máy chủ tự chép sang `hinh/` khi Nhi xong (tên `trang-NN-....jpg`). Hạ mở từng ảnh để duyệt, ảnh sai thì Nhi tạo lại.
   **Hình y khoa không dùng AI:** hình về cơ thể, cơ quan, giải phẫu, cơ chế bệnh, triệu chứng, thuốc, xét nghiệm phải lấy từ nguồn có giấy phép (loại C). AI chỉ dùng cho ảnh không khí, ảnh tư thế và đạo cụ. Máy chủ dò các trang y khoa đang để AI tạo trong thiet-ke.md: báo lỗi BẮT BUỘC cho người duyệt, dặn Nhi không tạo, và nếu Nhi lỡ tạo thì ảnh đó vào `hinh/cac-ban/...-ai-khong-dung`, không vào bộ hình chính.
10. **Ngân sách:** mỗi dự án có `planTokenBudget` token quy đổi (mặc định 4 triệu). Token đọc lại từ cache chỉ tính 1/10, vì giá chỉ khoảng 1/10. Chạm ngân sách thì dự án tạm dừng, bấm **Chạy tiếp** để cho thêm 50%. Thẻ dự án hiện tổng token, token quy đổi và chi phí tham khảo.

**Nhắn đồng đội:** bàn giao được thêm mục "Gửi đồng đội" (mỗi dòng `@<mã người>: …`) và "Cho cả nhóm biết". Máy chủ chuyển tin tới bước kế tiếp của người nhận và ghi cả hai vào bảng dự án.

**Tiếp nối:** làm lại một chủ đề đã có (vd suy giáp bản 8) thì ở ô tạo dự án chọn **Tiếp nối từ dự án…** (danh sách dự án đã xong).
Máy chủ chép sản phẩm của dự án cũ sang thư mục chủ đề mới (`<chủ đề>-v<số tiếp theo>`): các file `.md`, ảnh trong `hinh/` và `hinh-nguon/` (bỏ `cac-ban/`), cùng brief và câu trả lời của bạn.
Điều phối viên nhận "Phần còn thiếu" trong nghiệm thu cũ và các vấn đề còn mở, rồi chỉ lập kế hoạch cho phần chênh.

**Giao ban:** khi có tín hiệu (vấn đề không rõ ai sửa, hình tải hỏng, tin gửi điều phối viên), máy chủ gọi điều phối viên một lượt ngắn để chèn tối đa 2 bước. Tối đa `maxCheckins` lần mỗi dự án.

Mẹo: có slide hoặc tài liệu mẫu thì xuất ra PDF, bỏ vào `sources/` và nhắc tên file trong mục tiêu, nhóm sẽ lấy nó làm chuẩn.
Các agent không tự gọi nhau, mọi bước đều do máy chủ chạy. Mỗi lúc chỉ có một kế hoạch chạy.
Mọi bàn giao theo cùng một mẫu: Đã làm · File tạo ra · Tự kiểm theo brief · Quyết định & giả định · Vướng mắc · Câu hỏi cho chủ dự án · Gợi ý bước sau.

## Cách làm việc tiết kiệm

1. Bỏ tài liệu gốc vào `workspace/sources/`.
2. Giao việc cho **Mai** (chạy Gemini Deep Research trên gemini.google.com qua Claude in Chrome, dùng quota gói Gemini Pro của bạn). Trước khi giao: mở Chrome, bật extension Claude in Chrome, đăng nhập Gemini bằng tài khoản Pro. Mỗi lượt mất khoảng 10–30 phút. Agent nào cũng bật được kiểu này, xem mục "Chrome & Gemini" bên dưới.

### Chrome & Gemini (cho agent dùng bộ não Claude)

Chỉnh trong form **Sửa agent → Chrome & Gemini**, hoặc trong `config.json`:

```json
"chrome": true,
"geminiWeb": { "mode": "deep-research", "model": "Pro", "maxWaitMinutes": 25, "checkPlan": true, "saveRaw": true, "exportDocs": false, "language": "tiếng Việt" }
```

| Field | Ý nghĩa | Mặc định |
|---|---|---|
| `chrome` | Cho agent điều khiển Chrome thật của bạn (Claude in Chrome, các trang đã đăng nhập sẵn). Tự bật khi có `geminiWeb`. | tắt |
| `geminiWeb.mode` | `deep-research` (báo cáo nhiều nguồn), `chat` (hỏi đáp thường) hoặc `image` (tạo ảnh) trên gemini.google.com, tính vào quota gói Gemini của bạn. Bỏ field này để tắt. | — |
| `geminiWeb.retries` | Chế độ `image`: tạo lại tối đa mấy lần mỗi ảnh khi ảnh chưa đạt (0–5). | 2 |
| `geminiWeb.model` | Tên model chọn trong menu của Gemini, ví dụ `Pro`, `Thinking`. | mặc định của Gemini |
| `geminiWeb.maxWaitMinutes` | Chờ Gemini trả lời tối đa bao nhiêu phút (5–90). Thời gian chạy tối đa của agent = số này + 20. | 25 |
| `geminiWeb.checkPlan` | Deep Research: đối chiếu kế hoạch của Gemini với brief, sửa nếu thiếu rồi mới chạy. | bật |
| `geminiWeb.saveRaw` | Lưu nguyên văn câu trả lời vào `agents/<id>/<chu-de>-deep-research.md` (hoặc `-gemini.md`). | bật |
| `geminiWeb.exportDocs` | Xuất báo cáo sang Google Docs. | tắt |
| `geminiWeb.language` | Ngôn ngữ yêu cầu Gemini trả lời. | tiếng Việt |

Agent Deep Research không dùng WebSearch của Claude (trừ khi bạn tự đặt `tools`), và mặc định có 150 lượt (chat: 60, tạo ảnh: 150).

**Deep Research hai pha** (`deepResearchTwoPhase: true` trong `config.json`): ở bước làm của dự án, agent chỉ khởi chạy Deep Research, ghi link cuộc chat vào `agents/<id>/<chu-de>-deep-research.md` với dòng "Trạng thái: đang chạy" rồi kết thúc lượt. Máy chủ chờ (bằng nửa `maxWaitMinutes`, ít nhất 10 phút; không tốn token), rồi gọi agent một lượt nữa để lấy báo cáo. Gemini chưa xong thì máy chủ chờ thêm 10 phút, tối đa 3 lần kiểm. Trong lúc chờ, bảng dự án ghi "Chờ Gemini Deep Research tới <giờ>".

**Tạo ảnh (`image`)**: agent đọc "Danh sách hình" trong `output/<chủ đề>/thiet-ke.md`, tạo từng ảnh trong một cuộc chat Gemini, tự xem lại rồi bấm tải ảnh kích thước đầy đủ. Chrome lưu ảnh vào thư mục Downloads (đổi bằng `downloadsDir` trong `config.json`). Mỗi lần tải, agent ghi tên dự kiến vào `agents/<id>/anh-gemini.txt`. Xong lượt, máy chủ ghép các file `Gemini_*` tải về trong lượt đó (theo thứ tự thời gian) với danh sách tên này, rồi chép vào `output/<chủ đề>/hinh/`, giống ảnh của agy: bản cũ chuyển vào `cac-ban/`, ảnh AI cho hình y khoa bị để riêng, không dùng. Trước khi chạy: trong Chrome, tắt "Hỏi nơi lưu từng tệp" và cho gemini.google.com tải nhiều file.
3. Mai xong → ở "Lần gần nhất", chọn **An** → **Chuyển tiếp**. Bàn giao được đính kèm sẵn.
4. Cứ thế chuyển cho **Lam** (soạn bài), rồi **Hạ** (biên tập, duyệt chữ và trải nghiệm người học).
5. Sản phẩm cuối nằm trong `workspace/output/`, xem ngay ở tab **Sản phẩm**.

Một vài mẹo khác:
- Giao việc **cụ thể, nhỏ**, ví dụ "Tìm 5 nghiên cứu về X, ghi kèm nguồn" thay vì "Nghiên cứu về X".
- `workspace/index.md` do máy chủ tự cập nhật (dự án gần đây, sản phẩm mới nhất). Đừng sửa tay; bản cũ nằm ở `workspace/luu-tru/index-cu.md`.
- Giữ phần "Hướng dẫn riêng" của agent ngắn, vì nó bị đọc lại ở mỗi lượt.
- Xem số token mỗi lượt ở **Lịch sử** để biết ai đang "ăn" nhiều.
- **Hạn mức tài khoản** hiện trên thanh đầu trang. **CLAUDE**: % đã dùng của khung 5 giờ và khung tuần, lấy từ chính các lượt chạy Claude; rê chuột để xem giờ làm mới, bấm để làm mới (chạy một lượt haiku rất nhỏ). **AGY**: Antigravity không công bố % hạn mức, nên chip hiện token văn phòng đã dùng trong 5 giờ và 7 ngày qua, cùng các model đang hết hạn mức (đọc từ log của agy), ví dụ "⛔ ảnh tới 04:12".

## Làm slide workshop

Giao dự án cho Chef Yoga với mục tiêu kiểu *"Làm slide workshop 60 phút: Yoga phục hồi cho người suy giáp"*. Quy trình mặc định:

1. **Mai** tìm nguồn, ghi ghi chú kèm trích dẫn.
2. **An** kiểm chứng: mức bằng chứng, chỗ phóng đại, chống chỉ định.
3. **Lam** viết kịch bản `output/<chu-de>/slides.md` theo `templates/kich-ban-slide.md`: mỗi trang có loại, ý chính, câu chốt, hình, nguồn, lời giảng, lưu ý an toàn.
4. **Vy** (Thiết kế) viết `output/<chu-de>/thiet-ke.md` theo `templates/thiet-ke.md`: bảng màu, người mẫu cố định, bố cục và prompt ảnh hoặc link hình có giấy phép cho từng trang.
5. **Hạ** biên tập lần cuối `slides.md`: rút gọn, sửa chính tả, lỗi lặp từ.

Kết quả là kịch bản và bản thiết kế để dựng trong Canva; agent không tự dựng slide. Muốn đổi phong cách, sửa `workspace/templates/thiet-ke.md` (bảng màu, kiểu chữ, mô tả người mẫu). File mẫu gốc nằm trong `templates/` của Yoga Lab và chỉ được chép vào workspace khi workspace chưa có.

## Folder làm việc

```
workspace/
├── index.md          ← bản đồ ngắn do máy chủ viết, agent đọc đầu tiên
├── sources/          ← tài liệu gốc (agent chỉ đọc)
├── templates/        ← mẫu kịch bản slide, quy tắc thiết kế (agent chỉ đọc)
├── handoff/          ← bàn giao giữa các agent
├── agents/<tên>/     ← nháp riêng của từng người
├── output/           ← sản phẩm cuối
└── tri-thuc/         ← bộ não chung (xem mục dưới)
```

Muốn dùng folder khác (ví dụ vault Obsidian), sửa `"workspace"` trong `config.json`
thành đường dẫn đầy đủ, ví dụ `"/Users/ban/Obsidian/YogaLab"` hoặc `"D:\\YogaLab"`.

## Bộ não chung (Obsidian)

Những gì cả nhóm đã kiểm chứng (ý, nguồn, tư thế, hình) được giữ lại trong `workspace/tri-thuc/`, để dự án sau dùng lại thay vì tìm lại từ đầu.

**Cách mở**: trong Obsidian chọn **Open folder as vault** → chọn thư mục `workspace/`. Tên vault mặc định là tên thư mục
(ở đây là "workspace"); đổi tên vault thì đặt `obsidianVault` trong `config.json` cho khớp. Khi xem file trong văn phòng,
nút **🔗 Mở trong Obsidian** mở đúng note đó.

**Bên trong có gì**:
- `tri-thuc/00-ban-do.md`: bản đồ, gồm các chủ đề, ý cần bạn xem (quá hạn, thiếu câu trích), nguồn đang bị chặn;
- `chu-de/`: mỗi chủ đề một trang tổng hợp (ý đã kiểm chứng, ý nháp, tư thế, hình, nguồn, dự án đã dùng);
- `menh-de/`: ý đã kiểm chứng, mỗi ý một note (mức bằng chứng, nguồn, câu trích, hạn xem lại);
- `nguon/`: nguồn và tình trạng truy cập (máy chủ tự mở thử link);
- `tu-the/`: tư thế (đạo cụ, chống chỉ định, prompt ảnh đã đạt, lỗi AI hay vẽ sai), `hinh/`: hình có giấy phép đã tải;
- `quyet-dinh.md`: sổ quyết định; `thuat-ngu.md`: từ cần tránh và cách gọi thống nhất, máy soát lỗi đọc hai bảng này;
- `bai-hoc/`: bài học của nhóm, mỗi bài một note `BH-…`; `mau-tot/`: đoạn sản phẩm đạt chuẩn làm ví dụ;
- `he-thong/lo-hong.md`: lỗi không phải của agent, việc của người phát triển (xem mục dưới);
- `quy-tac-cua-toi.md` và `ghi-chu-chuyen-mon/`: **bạn viết**, máy chủ không bao giờ sửa.

Agent chỉ viết bảng trong file của mình (An: "Danh sách đã duyệt", "Tư thế"; Mai: "Danh sách nguồn"). Sau mỗi lượt,
máy chủ chép bảng thành note. Chỉ người trong `brainApprovers` (mặc định An) mới đưa được ý lên "đã duyệt".

**Bạn làm được gì**:
- ý sai: đánh `trang_thai: bac-bo` trong note, máy chủ không đổi ý đó nữa và agent thấy nhãn "BÁC BỎ, không dùng";
- thêm `khoa: true` vào note nào thì máy chủ không sửa note đó;
- thêm quy tắc vào `quy-tac-cua-toi.md` (mỗi dòng một quy tắc), ghi nhận xét của bác sĩ, giảng viên vào `ghi-chu-chuyen-mon/`;
- lọc bằng Bases (plugin lõi) hoặc Dataview theo `trang_thai`, `muc_bang_chung`, `truy_cap`.

**Agent dùng thế nào**: mỗi lượt, máy chủ soạn sẵn phần "BỐI CẢNH TỪ BỘ NÃO CHUNG" (quy tắc của bạn, quyết định đã chốt,
vấn đề đang mở của người đó, các note có thể liên quan). Agent gọi công cụ `tra_cuu` trước khi tìm web và chỉ tìm phần còn thiếu
(công cụ chỉ có khi bật `labTools`). Phần BỐI CẢNH của mỗi bước dự án được chép vào `du-an/<mã>/boi-canh/`; bấm nút **Bối cảnh** cạnh "Bàn giao" để xem bước đó đã nhận bài học, checklist nào.

## Nhóm tự học thế nào

1. Mỗi lỗi trong sổ vấn đề có **loại** (vd `lech-hai-file`) và **gốc**: `agent` (người làm sai), `quy-trinh` (thiếu bước, giao sai người), `cong-cu` (máy chủ, công cụ lỗi), `moi-truong` (trang web, tài khoản), `tri-thuc` (thiếu một sự thật).
   Chỉ lỗi gốc `agent` mới thành bài học. Gốc khác đi vào **lỗ hổng hệ thống** `tri-thuc/he-thong/lo-hong.md`, vào bộ não (ý nháp chờ kiểm), hoặc thành **đề xuất sửa quy trình** chờ bạn duyệt.
2. Bài học nằm trong `tri-thuc/bai-hoc/`, mỗi bài một note `BH-…` có phạm vi (cả nhóm, một người, một chủ đề), lúc áp dụng (`ap_dung_khi`: loại bước, loại file), bậc và trạng thái.
   Agent **chỉ thấy bài hợp với bước đang làm**, trong phần BỐI CẢNH của việc được giao (tối đa 12 bài). Bài đã được hệ thống chữa (`da-thang-cap`) hay đã huỷ thì không hiện nữa.
   Sau mỗi dự án, máy chủ đếm: bài có từ trước mà người đó vẫn mắc đúng loại lỗi thì tính **tái phạm** và bài lên **checklist bắt buộc** (bậc 2): agent phải ghi mã `[BH-…]` kèm "đã kiểm" vào mục Tự kiểm của bàn giao. Checklist vẫn tái phạm thì máy chủ ghi vào lỗ hổng hệ thống là cần một luật máy soát. Bài đã áp dụng ở hai dự án mà chưa tái phạm lần nào thì được đánh dấu `hieu-qua`.
3. Lúc nghiệm thu, máy chủ đưa điều phối viên **số liệu để rút kinh nghiệm**: lỗi BẮT BUỘC theo người và loại, theo gốc, bài học tái phạm, số lần agent thử chạy lệnh bị chặn, checklist chưa ghi, và những câu bạn trả lời khác phương án nhóm đề xuất. Điều phối viên trả lại bài học mới, bài cần gộp, lỗ hổng, đề xuất sửa hướng dẫn vai, và tối đa 2 **mẫu tốt** (chỉ khi đạt `passScore`). Mẫu tốt hiện làm "Ví dụ đạt chuẩn" ở bước cùng loại sau này.
4. **Đề xuất sửa hướng dẫn vai** hiện ở đầu cửa sổ **Dự án** (nút Dự án có dấu `!` khi có đề xuất chờ). Hướng dẫn chỉ đổi khi bạn bấm **Duyệt** hoặc **Sửa rồi duyệt**; bấm **Bỏ** để bỏ qua. Trong 7 ngày sau khi duyệt, bấm **Hoàn tác** để trả lại đoạn cũ. Trước mỗi lần đổi, máy chủ giữ bản `config.json` cũ trong `workspace/.yogalab/config-cu/`.
5. `agents/<id>/kinh-nghiem.md` giờ là **bản xem** do máy chủ sinh từ `tri-thuc/bai-hoc/`. Sửa bài học trong Obsidian (đổi `goc`, `trang_thai`, `bac`, nội dung, hoặc thêm `khoa: true`), không sửa ở `kinh-nghiem.md`.

Nâng cấp từ bản trước Đợt 3: chạy một lần `node scripts/chuyen-bai-hoc.js workspace` để chuyển bài học cũ trong `kinh-nghiem.md` thành note. Bảng phân loại nằm ở `tri-thuc/he-thong/chuyen-bai-hoc.md`; bài nào xếp sai thì sửa note `BH-…` tương ứng.

## config.json

| Mục | Ý nghĩa |
|---|---|
| `workspace` | Folder làm việc chung |
| `maxTurns` | Số bước tối đa của Claude cho một việc (chặn chạy vòng vòng tốn token) |
| `timeoutMinutes` | Quá thời gian này thì tự dừng |
| `skipMcp` | `true` = Claude không nạp MCP. Đặt `"useMcp": true` cho riêng agent nào thật sự cần |
| `claudeTools` | Công cụ Claude được dùng. Mặc định chỉ đọc/ghi file và tìm web, không chạy lệnh |
| `antigravityCommand` | Lệnh chạy Antigravity CLI (mặc định `agy`) |
| `claudeExtraArgs`, `geminiExtraArgs`, `antigravityExtraArgs` | Thêm tham số riêng nếu cần |
| `agents` | Danh sách agent (sửa trong giao diện cũng được, tối đa 8). `reportsTo` = id người nhận báo cáo |
| `coordinatorId` | Điều phối viên mặc định (tự lưu khi bạn chọn trong mục Dự án) |
| `maxPlanSteps` | Kế hoạch dài nhất bao nhiêu bước (mặc định 6) |
| `maxReplans` | Bước lỗi thì điều phối viên được lập lại kế hoạch mấy lần (mặc định 1) |
| `labTools` | Cho agent Claude gọi công cụ của máy chủ qua MCP nội bộ (soát lỗi, kiểm link, tải hình, tra bộ não). Với `thiet-ke.md`, số chữ từng trang của `soat_loi` là ước lượng từ dòng Bố cục. Mặc định tắt; bật sau khi thử trên máy |
| `issueLedger` | Sổ vấn đề: người duyệt ghi bảng lỗi, máy chủ giao sửa cho người phụ trách file có lỗi. `false` = vòng duyệt như trước. Mặc định bật |
| `maxCheckins` | Số lần tối đa điều phối viên được gọi giữa chừng (giao ban) khi có tín hiệu. `0` = tắt. Mặc định 3 |
| `chromePreflight` | Trước khi giao việc cho agent dùng Chrome, máy chủ thử kết nối bằng một lượt rất ngắn; hỏng thì tạm dừng dự án và báo cách sửa. Mặc định bật |
| `brain` | Bộ não chung `tri-thuc/`: máy chủ chép bảng của agent thành note, soạn bối cảnh cho mỗi lượt, công cụ `tra_cuu`. `false` = tắt. Mặc định bật |
| `brainApprovers` | Ai được đưa ý lên "đã duyệt" và ghi note tư thế (mặc định `["an"]`) |
| `obsidianVault` | Tên vault Obsidian của folder làm việc, cho nút "Mở trong Obsidian". Để trống = tên thư mục workspace |
| `stepModel` | Model riêng theo loại bước (`work`, `review`, `rereview`, `fix`), vd `{"rereview": "haiku"}`. Không áp dụng cho agent dùng Chrome. Gợi ý: sau khi sổ vấn đề đã chạy ổn, đặt `{"rereview": "haiku"}`, vì duyệt lại chỉ còn kiểm danh sách vấn đề. Mặc định `{}` |
| `maxParallel` | Số bước của dự án được chạy cùng lúc. `1` = tuần tự như trước (mặc định). Từ `2`: các bước độc lập chạy song song, vd sau một lần duyệt có lỗi của nhiều người thì những người đó sửa cùng lúc; bước cần bản cuối của sản phẩm vẫn chờ đủ vòng duyệt lại. Chỉ rút ngắn thời gian, không bớt token |
| `consultTool` | Thử nghiệm, cần bật `labTools`: agent trong dự án được gọi `hoi_dong_nghiep(ai, cau_hoi)` để hỏi nhanh một đồng nghiệp dùng Claude. Máy chủ chạy một lượt rất ngắn của người được hỏi (chỉ đọc file, tối đa 4 lượt, chờ tối đa 3 phút) và trả câu trả lời. Mỗi dự án tối đa 3 lần; token tính vào dự án. Mặc định tắt |
| `deepResearchTwoPhase` | Deep Research hai lượt ngắn: lượt 1 chỉ khởi chạy trên Gemini, máy chủ chờ (không tốn token), lượt 2 lấy báo cáo. Mặc định tắt |

Model chọn trong ô **Model** khi thêm hoặc sửa agent:
- **Claude**: `haiku` (nhẹ, rẻ), `sonnet` (cân bằng), `opus` (mạnh), `fable` (mạnh nhất, tốn nhất).
  Các bí danh này luôn dùng bản mới nhất. Muốn giữ cố định một bản thì chọn tên đầy đủ, ví dụ `claude-sonnet-5-5`.
- **Antigravity**: `gemini-3.8-flash-high` / `-medium` / `-low` (mức suy nghĩ nằm trong tên), `claude-sonnet-4-6`,
  `claude-opus-4-6-thinking`, `gpt-oss-120b-medium`. Danh sách đầy đủ theo tài khoản: chạy `agy models`.
  agy chưa có giới hạn số lượt, mỗi lượt chỉ dừng theo `timeoutMinutes`.
- **Gemini CLI**: `auto` (Gemini CLI tự chọn), `pro`, `flash`, `flash-lite`, hoặc tên đầy đủ như `gemini-3.5-flash`, `gemini-2.5-pro`.
  Bản preview chỉ chạy nếu tài khoản Google của bạn có quyền dùng.
- Danh sách lấy theo Claude Code 2.1 và Gemini CLI 0.63. Nếu CLI có model mới hơn, chọn **Khác…** rồi tự nhập tên.

Ô **Effort** (chỉ cho Claude) chỉnh mức suy nghĩ: Thấp, Vừa, Cao, Rất cao, Tối đa.
Effort cao làm việc khó kỹ hơn nhưng chậm và tốn token hơn. Gợi ý: điều phối viên và người kiểm chứng để Cao,
việc rút gọn hay biên tập để Thấp. Gemini CLI chưa có tuỳ chọn này cho từng agent, nên muốn Gemini nghĩ kỹ hơn thì chọn model Pro.

## Theo dõi tiến độ agent

Chạm vào một agent đang làm việc để xem:
- **Nhiệm vụ** và **thao tác ngay lúc này**; nếu là một bước trong dự án thì có cả "bước 2/4, nhận từ Mai, sau đó Lam".
- **Giai đoạn** Khởi động → Tìm hiểu → Viết → Bàn giao, đoán từ công cụ agent đang dùng (đọc/tìm web, ghi file, ghi bàn giao). CLI không báo % hoàn thành nên đây là ước lượng.
- **Thời gian so với thường lệ**: thanh chạy theo trung vị các lượt trước của chính agent đó; vàng khi quá giờ, đỏ khi lâu gấp đôi (có thể đang kẹt).
- Số file đã đọc, lần tìm web, file đã ghi (bấm để mở) và **diễn biến** từng thao tác kèm thời điểm.
Khi agent rảnh, ô giao việc lên đầu, kèm kết quả lần gần nhất và lịch sử 5 lượt trước.

## Bảng việc (nút 📋 Bảng việc)

Xem cả nhóm theo kiểu Kanban, năm cột: **Chờ · Đang làm · Đang duyệt · Cần sửa · Xong**.

- Một dự án 20 bước thật ra chỉ có vài sản phẩm. Mỗi **thẻ là một sản phẩm**, gồm bước làm và mọi vòng duyệt, sửa, duyệt lại của nó. Thẻ đi dần qua các cột: đang duyệt thì ở "Đang duyệt", bị trả về thì sang "Cần sửa" (ghi rõ vòng mấy), đạt thì vào "Xong" kèm "Đạt · 2 vòng" hoặc "Còn lỗi · hết vòng".
- Thẻ đang chạy có thanh thời gian so với thường lệ của người đó. Thẻ đang chờ ghi rõ chờ sản phẩm nào.
- Bấm thẻ để mở **ngăn chi tiết**: dòng thời gian làm → duyệt → sửa, tóm tắt và kết luận từng lượt, nút mở bàn giao và file, việc được giao nguyên văn, diễn biến trực tiếp nếu đang chạy.
- Ô chọn ở đầu bảng đổi giữa dự án đang chạy, các dự án trước và **Việc lẻ** (việc giao trực tiếp cho từng người). Nút **+ Giao việc lẻ** ở cột Chờ mở bảng giao việc của người bạn chọn.
- Khi chưa có việc nào đang chạy, đầu bảng có hai nút lớn: **Giao việc cho một người** và **Giao dự án cho cả nhóm**.
- Khi dự án cần bạn duyệt kế hoạch hoặc trả lời câu hỏi, bảng hiện nhắc kèm nút **Duyệt kế hoạch** / **Trả lời nhóm**, và nút Bảng việc có dấu **!**.

## Kết quả dự án

Trong **Dự án**, bấm **📄 Xem kết quả dự án** (hoặc nút trong thông báo khi dự án xong) (hoặc **Kết quả dự án** ở nhóm file trong Sản phẩm): tổng kết của trưởng nhóm, các file sản phẩm, rồi từng bước với người làm, thời gian, token, tóm tắt và bàn giao. Có nút tải cả báo cáo dạng .md, in / PDF, và giao việc tiếp cho trưởng nhóm từ kết quả này.

## Xem sản phẩm (nút 📦 Sản phẩm)

- Danh sách file trong `output/`, xếp theo **Dự án**, **Agent** hoặc **Thư mục**. Mỗi file ghi rõ ai làm, ở bước nào, cho việc gì (rê chuột để xem nguyên văn việc được giao).
- Ô tìm kiếm lọc theo tên file, việc được giao và cả nội dung bên trong file.
- Bấm một file để mở cửa sổ đọc: markdown hiện có định dạng (tiêu đề, bảng, danh sách, link), có mục lục bên trái và mục **Nguồn trong bài** gom mọi đường link để kiểm tra trích dẫn. CSV hiện thành bảng, JSON được định dạng, ảnh và PDF xem trực tiếp.
- Nút **Thô** xem chữ gốc; **Sao chép**, **Tải về**, **In / PDF**.
- **Yêu cầu sửa**: mở bảng giao việc cho agent đã viết file (đổi người được), đính kèm sẵn file. **Giao việc tiếp từ file này**: chuyển file cho người khác làm tiếp.
- Nguồn gốc file chỉ có với các lượt chạy từ phiên bản này trở đi; file cũ hiện "chưa rõ ai làm".

## Báo cáo sử dụng

Bấm **📊 Báo cáo** ở đầu trang (hoặc mở `http://127.0.0.1:4321/#usage`). Trang này có:
- **Bộ lọc**: hôm nay, 7 ngày, 30 ngày, tất cả; theo agent, trạng thái, giao lẻ hay trong dự án.
- **Tổng quan**: số lượt (lỗi, đã dừng), tổng token, đầu vào mới, ghi cache, đọc cache (kèm tỉ lệ trúng cache),
  đầu ra (gồm token suy nghĩ), chi phí tham khảo và tổng thời gian chạy.
- **Biểu đồ** token theo ngày (hoặc theo giờ khi xem hôm nay), chia 4 loại token. Rê chuột lên cột để xem số.
- **Bảng theo agent**: lượt, lỗi, từng loại token, tỉ lệ trúng cache, trung bình mỗi lượt, công cụ dùng nhiều.
  Bấm một dòng để lọc theo agent đó.
- **Bảng theo dự án**: token cả dự án và phần điều phối viên dùng.
- **Trí não**: các chỉ số so với mục tiêu của kế hoạch nâng cấp (chữ xanh là đã đạt):
  - thẻ số: tỉ lệ lần chạy có gọi Bash (mục tiêu dưới 5%), bài học tái phạm trong 30 ngày (0), số dòng `index.md` (dưới 30), số ý đã duyệt, số nguồn bị chặn;
  - theo dự án: token quy đổi theo loại bước (làm, duyệt, duyệt lại, sửa, điều phối), vòng duyệt–sửa so với bước làm (dưới 0,6), số vấn đề BẮT BUỘC (rê chuột để xem theo loại và theo gốc), vấn đề không rõ người sửa (0), số lần giao ban, điểm nghiệm thu lần đầu (từ 85), token bước nguồn ở dự án tiếp nối (dưới 0,8 triệu), câu hỏi trùng (0), tỉ lệ trang An mở lại mà người khác đã mở trước (dưới 10%), ảnh ghi ra ngoài `output/<chủ đề>/` (0);
  - theo agent: số lượt có gọi Bash, số lần dùng `tra_cuu`, `soat_loi`, `kiem_link`.
- **Từng lượt chạy (session)**: bấm vào để xem nhiệm vụ, đính kèm, kết quả hoặc lỗi, model thực tế,
  công cụ đã gọi và **diễn biến** từng bước kèm thời điểm.
- **Tải CSV** theo đúng bộ lọc đang chọn để mở bằng Excel hoặc Google Sheets.

Lượt chạy từ trước khi có trang này chưa tách số cache, nên cột cache hiện "—".
Chi phí chỉ Claude Code báo về. Với gói Pro, đó là số để tham khảo, không phải tiền bị trừ.

## Ghi chú

- Số token hiển thị là con số do CLI báo về. Với gói Pro, phần "chi phí" chỉ để tham khảo,
  vì việc chạy được tính vào quota Pro chứ không trừ tiền riêng.
- Agent của Claude không được chạy lệnh shell (Bash). Đây là chủ ý, để an toàn trên máy bạn.
  Nếu cần, thêm `"Bash"` vào `claudeTools`.
- Lịch sử chạy được lưu ở `workspace/.yogalab/runs.jsonl`, các kế hoạch ở `workspace/.yogalab/plans.json`.
  Nếu tắt máy chủ giữa chừng, kế hoạch sẽ tạm dừng; mở lại rồi bấm **Chạy tiếp**.
- Agent báo lỗi môi trường (Chrome, đăng nhập, hạn mức) thì dự án tạm dừng kèm cách sửa, không hiện thành câu hỏi cho bạn.
- Mở `public/index.html` trực tiếp (không qua máy chủ) sẽ vào **chế độ xem thử**, agent chỉ diễn tập.
- Ảnh trang trí nằm trong `public/assets/` (tạo bằng Gemini): `banner.jpg` ở đầu trang và
  `portrait-<id>.png` là chân dung trong bảng giao việc. Thêm agent mới thì bỏ ảnh vuông
  `portrait-<id>.png` vào đó (ví dụ `portrait-sen.png`). Không có ảnh thì giao diện dùng nhân vật pixel vẽ sẵn.
