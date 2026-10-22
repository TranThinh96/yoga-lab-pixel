# Đợt 4 · Tối ưu và đo

Đọc [README.md](README.md) trước. Cần Đợt 0–3 đã xong. Mỗi mục ở đây **độc lập**, làm theo thứ tự nào cũng được.
Mọi tính năng có công tắc và **mặc định tắt**. Chủ dự án bật sau khi thử trên máy.

| Mục | Việc | Công tắc (`DEFAULT_CONFIG`) |
|---|---|---|
| 4.1 | Deep Research hai pha: máy chủ chờ thay cho agent | `deepResearchTwoPhase: false` |
| 4.2 | Chọn model theo loại bước | `stepModel: {}` |
| 4.3 | Chạy song song các bước độc lập | `maxParallel: 1` |
| 4.4 | Chế độ tiếp nối (bản mới chỉ làm phần chênh) | (tuỳ chọn khi tạo dự án) |
| 4.5 | Thử nghiệm: hỏi nhanh đồng nghiệp | `consultTool: false` |
| 4.6 | Trang Báo cáo: chỉ số trí não | (luôn bật) |

---

## 4.1 Deep Research hai pha

Trong các lượt Mai dùng Chrome, khoảng 45% thao tác là chờ hoặc tải lại trang Gemini, và mỗi lần chờ đọc lại khoảng 44 nghìn token ngữ cảnh.
Tách thành hai lượt ngắn; máy chủ chờ ở giữa, không tốn token.

**Làm**
1. Áp dụng khi: `config.deepResearchTwoPhase`, bước trong dự án, `kind === 'work'`, `geminiWebOf(agent).mode === 'deep-research'`.
2. Thêm trạng thái lên bước: `s.pha` (1 hoặc 2, mặc định 1), `s.henLuc` (ISO), `s.lanKiem` (số lần thu hoạch).
3. `chromePrompt(agent, kind, pha)`: khi `pha` là 1 hoặc 2, thay khối `CÁCH NGHIÊN CỨU: GEMINI DEEP RESEARCH (bắt buộc)` bằng đúng một trong hai khối sau (`<…>` thay như code hiện có; `<file>` là `agents/<id>/<chu-de>-deep-research.md`):
   ~~~
   CÁCH LÀM: GEMINI DEEP RESEARCH, PHA 1/2 (KHỞI CHẠY). Lượt này chỉ khởi chạy, không chờ kết quả.
   - Việc chính chạy trên https://gemini.google.com trong tab đó, bằng tài khoản Gemini của chủ dự án. Không dùng WebSearch.
   - Mở chat mới.<chọn model nếu có> Bật "Deep Research" trong ô nhập.
   - Viết MỘT prompt gộp toàn bộ câu hỏi theo từng mục của brief/nhiệm vụ (bỏ những mục bộ não đã có ý đã duyệt), nêu loại nguồn ưu tiên, yêu cầu báo cáo bằng <ngôn ngữ> có link nguồn. Gửi.
   - Gemini hiện kế hoạch nghiên cứu: <đối chiếu với brief nếu checkPlan>; bấm "Start research"/"Bắt đầu nghiên cứu".
   - Ngay khi Gemini bắt đầu nghiên cứu: ghi <file> với 3 dòng đầu "Link: <URL cuộc chat dạng /app/…>", "Trạng thái: đang chạy", "Bắt đầu: <giờ>". Rồi ghi bàn giao ngắn và KẾT THÚC lượt. Không chờ kết quả: máy chủ sẽ chờ (không tốn token) rồi gọi lại bạn để lấy báo cáo.
   - Gặp trang đăng nhập, CAPTCHA, hết quota: dừng, ghi nguyên văn vào Vướng mắc.
   ~~~
   ~~~
   CÁCH LÀM: GEMINI DEEP RESEARCH, PHA 2/2 (LẤY KẾT QUẢ).
   - Đọc <file>, lấy dòng "Link:". Mở link đó trong một tab mới, kiểm tra Gemini đã xong chưa (có nút Xuất/Export, không còn dòng tiến độ).
   - CHƯA XONG: sửa dòng "Trạng thái:" thành "Trạng thái: đang chạy (kiểm lúc <giờ>)", ghi bàn giao một dòng rồi KẾT THÚC lượt; máy chủ sẽ gọi lại sau.
   - ĐÃ XONG: lấy toàn văn báo cáo và danh sách nguồn bằng get_page_text với max_chars: 200000. Ghi nguyên bản vào <file> (giữ dòng Link, đổi thành "Trạng thái: xong"). Rồi tổng hợp sang file nguồn theo hướng dẫn riêng; nguồn chỉ có trong báo cáo mà bạn chưa mở thì ghi "chưa kiểm".
   - Gemini báo lỗi hoặc hết quota: ghi nguyên văn vào Vướng mắc.
   ~~~
   Truyền `pha` từ `startRun` (`opts.pha`) xuống `buildPrompt` rồi `chromePrompt`. Pha 1 dùng `maxTurns: 40`.
4. `onDone` của bước (chỉ khi áp dụng 4.1). Đọc `<file>`:
   - Pha 1 xong mà file có dòng `^Trạng thái:\s*đang chạy`:
     - đặt `s.pha = 2`, `s.status = 'pending'`;
     - đặt `s.henLuc = now + max(10, g.maxWaitMinutes * 0.5)` phút;
     - ghi log `Deep Research đang chạy trên Gemini; máy chủ chờ tới <giờ> (không tốn token) rồi gọi <tên> lấy kết quả`.
   - Pha 2 xong mà file **vẫn** `đang chạy`:
     - nếu `s.lanKiem < 3`: tăng `s.lanKiem`, `s.henLuc = now + 10 phút`, trạng thái `pending`;
     - nếu đã đủ 3 lần: báo lỗi bước `Gemini chưa xong sau 3 lần kiểm` (đi qua `onStepError`).
   - File có `^Trạng thái:\s*xong` thì xử lý như bước xong bình thường.
5. `pumpPlan` (hoặc `chonBuocChay` nếu đã làm 4.3): bước `pending` có `henLuc` ở tương lai thì chưa chạy.
   - đặt `plan.note = 'Chờ Gemini Deep Research tới <giờ>'`;
   - hẹn `setTimeout(() => pumpPlan(plan), <thời gian còn lại>)`, giữ hẹn trong một `Map` theo id kế hoạch để không hẹn trùng;
   - `loadPlans` và `resumePlan` cũng hẹn lại cho bước có `henLuc`.
6. Kiểm: đọc code. Thử thật trên máy (thu-tren-may.md, Đợt 4).

---

## 4.2 Chọn model theo loại bước

**Làm**
1. `DEFAULT_CONFIG`: `stepModel: {}, // model theo loại bước, vd {"rereview": "haiku"}; không áp dụng cho agent dùng Chrome`.
2. `cliArgs`, nhánh Claude: `const m = (config.stepModel || {})[kind];`. Dùng `m` thay cho `chromeModel(agent)` khi `m && !usesChrome(agent)`.
   `startRun` ghi đúng model thực dùng vào `run.model`.
3. README: gợi ý đặt `{"rereview": "haiku"}` sau khi sổ vấn đề đã chạy ổn (duyệt lại chỉ còn kiểm danh sách vấn đề).

---

## 4.3 Chạy song song các bước độc lập

Lợi ích thật nằm ở **sau một bước duyệt có lỗi của nhiều người**. Ví dụ Vy sửa thiết kế và Lam sửa kịch bản cùng lúc.
Bước nào cần bản cuối của sản phẩm vẫn chờ đủ vòng duyệt lại. Không tiết kiệm token, chỉ rút ngắn thời gian.

**Làm**
1. `lib/lich.js` (đã chạy thử với các tình huống ở bước 3):
   ```js
   'use strict';
   // Gốc của một bước (đánh số từ 1): đi theo checks/fixOf về bước làm ban đầu
   function gocBuoc(steps, k) {
     for (let n = 0; n < 50; n++) { const s = steps[k - 1]; const t = s && (s.checks || s.fixOf); if (!t) return k; k = t; }
     return k;
   }
   // Bước idx (đánh số từ 0) chạy được chưa: phụ thuộc là bước duyệt thì chỉ cần bước đó xong;
   // là bước làm/sửa thì cần bản cuối của sản phẩm đó (mọi bước cùng gốc đứng trước idx đã xong)
   function sanSang(steps, idx) {
     const s = steps[idx];
     const deps = new Set([...(s.from && s.from.length ? s.from : idx > 0 ? [idx] : []), ...(s.checks ? [s.checks] : [])]);
     for (const d of deps) {
       const b = steps[d - 1];
       if (!b) continue;
       if (b.checks) { if (b.status !== 'done') return false; continue; }
       const g = gocBuoc(steps, d);
       for (let j = 0; j < idx; j++) if (gocBuoc(steps, j + 1) === g && steps[j].status !== 'done') return false;
     }
     return true;
   }
   // Chọn các bước bắt đầu ngay. max = 1 giữ đúng cách chạy tuần tự cũ.
   function chonBuocChay(steps, { max = 1, dangBan = new Set() } = {}) {
     if (steps.some(s => s.status === 'error')) return [];
     const dangLam = steps.filter(s => s.status === 'working');
     if (max <= 1) {
       if (dangLam.length) return [];
       const idx = steps.findIndex(s => s.status !== 'done');
       return idx >= 0 && steps[idx].status === 'pending' ? [idx] : [];
     }
     const out = [], ban = new Set([...dangBan, ...dangLam.map(s => s.agentId)]);
     for (let idx = 0; idx < steps.length && dangLam.length + out.length < max; idx++) {
       const s = steps[idx];
       if (s.status !== 'pending' || ban.has(s.agentId)) continue;
       if (steps.slice(0, idx).some(x => x.agentId === s.agentId && x.status !== 'done')) continue;
       if (!sanSang(steps, idx)) continue;
       out.push(idx); ban.add(s.agentId);
     }
     return out;
   }
   module.exports = { gocBuoc, sanSang, chonBuocChay };
   ```
2. `server.js`:
   - tách phần thân `pumpPlan` (từ `const s = plan.steps[idx]` tới hết) thành `startStep(plan, idx)`, **không đổi gì bên trong**;
   - `pumpPlan` mới:
     - giữ các dòng kiểm đầu hàm (`status`, giao ban, kiểm Chrome, hết bước thì `finishPlan`);
     - với `maxParallel` là 1: giữ y cách cũ, gồm cả `plan.waiting` khi agent đang bận;
     - với `maxParallel` từ 2: gọi `chonBuocChay(plan.steps, { max, dangBan: new Set(running.keys()) })` rồi `startStep` từng chỉ số. Mỗi lần trước khi chạy thêm một bước, kiểm `overBudget`;
   - `finishPlan` chỉ chạy khi mọi bước `done` và không có bước `working`.
   - Đang hỏi chủ dự án (`asking`) thì bước khác đang chạy vẫn chạy nốt; `onDone` thấy `plan.status !== 'running'` thì chỉ lưu, không chạy tiếp (như hiện nay).
3. Kiểm thử `test/lich.test.js` với các bước mẫu:
   ```js
   const B = () => [
     { agentId: 'lam', status: 'done', from: [] },
     { agentId: 'vy', status: 'done', from: [1] },
     { agentId: 'ha', status: 'done', from: [2], checks: 2 },
     { agentId: 'vy', status: 'pending', from: [2, 3], fixOf: 2 },
     { agentId: 'lam', status: 'pending', from: [1, 3], fixOf: 1 },
     { agentId: 'ha', status: 'pending', from: [3, 4, 5], checks: 4 },
     { agentId: 'nhi', status: 'pending', from: [2] }
   ];
   ```
   - `max: 2` → `[3, 4]` (Vy và Lam sửa cùng lúc); `max: 1` → `[3]`;
   - bước 4 xong, bước 5 đang chạy, `max: 2` → `[]` (duyệt lại chờ Lam; Nhi chờ bản thiết kế qua duyệt lại);
   - bước 4, 5 xong, `max: 3` → `[5]`. Thêm bước 6 xong → `[6]`;
   - `dangBan: new Set(['vy'])`, `max: 2` → `[4]`;
   - có bước `error` → `[]`;
   - chuỗi tuần tự `[done, done, pending, pending]` với `max: 1` → `[2]`.

---

## 4.4 Chế độ tiếp nối

Cho lần làm lại một chủ đề đã có (vd suy giáp v8). Bản mới bắt đầu từ bản cũ, chỉ làm phần chênh.

**Làm**
1. `createPlan(b)` nhận `b.tiepNoiTu` (id một kế hoạch đã `done`):
   - **Chủ đề mới**: bỏ đuôi `-v<n>` của chủ đề cũ rồi thêm `-v<n lớn nhất đang có trong output/ + 1>`. Chủ đề cũ chưa có đuôi thì thêm `-v2`. Gán ngay `plan.topic`.
   - **Chép sản phẩm**:
     - các file `.md` nằm ngay trong `output/<cũ>/` → `output/<mới>/`;
     - ảnh trong `output/<cũ>/hinh/` và `hinh-nguon/`: tạo liên kết cứng `fs.link`, lỗi thì `copyFile`;
     - bỏ qua `cac-ban/`.
   - **Chép brief** giống `retryPlan`, thay mọi chuỗi `output/<cũ>/` thành `output/<mới>/` và dòng `Thư mục chủ đề:`.
   - Chép `answers` của kế hoạch cũ sang (giống `retryPlan`).
2. `buildPlanPrompt`: khi kế hoạch có `tiepNoiTu`, thêm khối sau ngay sau `MỤC TIÊU`:
   ```
   DỰ ÁN TIẾP NỐI từ <id cũ>: sản phẩm đã được chép sang output/<mới>/.
   Phần còn thiếu theo nghiệm thu cũ:
   <mục "## Phần còn thiếu" trong du-an/<id cũ>/nghiem-thu.md, tối đa 2.000 ký tự; không có thì ghi "(không có)">
   Vấn đề còn mở của dự án cũ:
   - <tối đa 15 dòng từ issues có trạng thái mo hoặc khong-sua>
   Chỉ lập kế hoạch cho phần chênh: sửa phần còn thiếu, cập nhật theo mục tiêu mới; không làm lại phần đã đạt.
   ```
3. Giao diện, ô tạo dự án: thêm ô chọn "Tiếp nối từ dự án…" (danh sách kế hoạch `done`, mặc định "Không"), gửi `tiepNoiTu` trong body `POST /api/plan`.
4. README: mô tả ngắn chế độ tiếp nối.

---

## 4.5 Thử nghiệm: hỏi nhanh đồng nghiệp

**Làm** (chỉ khi `config.consultTool`):
1. Công cụ MCP `hoi_dong_nghiep(ai, cau_hoi)`:
   - `description`: `Hỏi nhanh một đồng nghiệp trong nhóm (vd hỏi An một ý đã được duyệt chưa). Máy chủ chạy một lượt rất ngắn của người đó (chỉ đọc file) và trả câu trả lời 3–6 câu. Mỗi dự án tối đa 3 lần; dùng khi tra_cuu và file bàn giao không đủ.`
   - `inputSchema`: `{ ai: string, cau_hoi: string }`, bắt buộc cả hai.
2. Máy chủ chỉ chạy khi:
   - lượt hỏi thuộc một dự án;
   - `findAgent(ai)` có thật, không phải người hỏi, và không đang bận;
   - `(plan.consults || 0) < 3`.

   Chạy `startRun(nguoiDuocHoi, …, { prompt, maxTurns: 4, effort: 'low', planId, step: 0, chiDoc: true })` rồi **chờ** `onDone` (tối đa 3 phút). Trả về `run.summary` cắt 1.500 ký tự.
3. `opts.chiDoc`: công cụ chỉ còn `Read`, `Glob`, `Grep` (không Chrome, không web, không MCP).
4. Prompt:
   `Bạn là <Tên> — <vai>. Đồng nghiệp <Tên người hỏi> đang làm dự án "<goal>" hỏi bạn: "<câu hỏi>". Trả lời ngắn (3–6 câu) dựa trên file của bạn trong agents/<id>/ và sản phẩm của bạn; được đọc file nhưng không ghi file nào. Không chắc thì nói không chắc.`
5. Cộng token vào dự án (`addUsage`); ghi log `Hỏi nhanh: <A> hỏi <B>`.

---

## 4.6 Trang Báo cáo: chỉ số trí não

**Làm**
1. `GET /api/tri-nao?days=<n>` trả về các chỉ số tính từ `runs.jsonl`, `plans.json`, `tri-thuc/`:
   - theo dự án:
     - token quy đổi theo loại bước (`work`, `review`, `rereview`, `fix`, điều phối);
     - tỉ lệ vòng duyệt–sửa so với bước làm;
     - số vấn đề BẮT BUỘC theo loại và theo gốc;
     - số lần giao ban;
     - điểm nghiệm thu lần đầu;
   - theo agent: số lần chạy có gọi Bash/PowerShell; số lần `tra_cuu`, `soat_loi`, `kiem_link` (đếm act theo `describeTool` của 0.13);
   - bài học: số theo `trang_thai`; số bài tái phạm trong 30 ngày;
   - bộ não: số ý (đã duyệt / nháp / cần xem lại), số nguồn theo `truy_cap`, số note được dự án gần nhất dùng (`dung_trong`).
2. Trang Báo cáo (`#usage`): thêm khối "Trí não" dưới bảng theo dự án.
   - một bảng theo dự án;
   - một dòng thẻ số: lần chạy gọi Bash, bài học tái phạm, ý đã duyệt, nguồn bị chặn;
   - mỗi chỉ số kèm mục tiêu ở mục 5 của kế hoạch, tô xanh khi đạt.
3. Mục tiêu ghi cứng trong giao diện. Chép đúng các con số ở mục 5 của `docs/ke-hoach-tri-nao.md`.

---

## Xong Đợt 4 khi

- `npm test` qua hết, `node --check server.js` không lỗi, thử khởi động không lỗi.
- Với mọi công tắc ở giá trị mặc định (tắt), máy chủ chạy y như sau Đợt 3.
- Chủ dự án bật từng tính năng theo phần **Đợt 4** trong [thu-tren-may.md](thu-tren-may.md).

## Phát hiện thêm

(Người triển khai ghi vào đây.)

Lựa chọn khi đặc tả chưa nói rõ (chủ dự án xem lại):

1. **4.1 File Deep Research:** khi đã biết chủ đề, máy chủ thay `<file>` bằng đường dẫn thật `agents/<id>/<chủ đề>-deep-research.md`. Sau mỗi pha, máy chủ ưu tiên file `*-deep-research.md` agent vừa ghi (phòng khi agent đặt tên chủ đề khác) và nhớ trong `s.drFile` cho pha 2.
2. **4.1 Dòng "Trạng thái:"** được đọc lỏng: cho phép in đậm, gạch đầu dòng (`**Trạng thái:** đang chạy`). Pha 1 xong mà file không ghi "đang chạy" (agent chờ luôn tới khi xong, hoặc không ghi file) thì xử lý như bước xong bình thường.
3. **4.1 Bàn giao của pha 1 không được xử lý** (câu hỏi, tin gửi đồng đội, tải hình): bước chưa xong, mọi thứ đó đọc ở pha 2. Pha 2 giữ số lượt mặc định của agent Deep Research (150), vì lượt lấy được kết quả còn phải tổng hợp; chỉ pha 1 đặt 40.
4. **4.1 Câu dòng kế hoạch nghiên cứu** (`<đối chiếu với brief nếu checkPlan>`) ghép thành: "đối chiếu với brief, thiếu mục nào thì bấm sửa kế hoạch và bổ sung; bấm …". Mỗi lần kiểm lại ở pha 2 có một dòng nhật ký "Gemini chưa xong (lần kiểm n/3)".
5. **4.1 Lỗi "Gemini chưa xong sau 3 lần kiểm"** đi qua `onStepError`, nên còn được tự chạy lại `stepRetries` lần (mỗi lần là một lượt pha 2) trước khi lập lại kế hoạch.
6. **4.1 Khởi động lại máy chủ:** kế hoạch chỉ đang chờ Gemini (không bước nào chạy dở hay lỗi) thì giữ "đang chạy" và hẹn lại, thay vì chuyển sang tạm dừng như các kế hoạch khác.
7. **4.3 Ba chỗ sửa thêm cho chạy song song** (với `maxParallel: 1` không đổi hành vi):
   - `onDone` và `.catch` của `startStep` tính lại `idx` bằng `plan.steps.indexOf(s)`: trong lúc bước này chạy, bước duyệt khác có thể đã chèn bước phía trước. Đặc tả nói giữ nguyên thân hàm; đây là dòng thêm duy nhất.
   - `onStepError`: hết lượt chạy lại mà còn bước khác đang chạy thì **tạm dừng** thay vì lập lại kế hoạch, vì lập lại kế hoạch thay mọi bước chưa xong, kể cả bước đang chạy.
   - `resumePlan` không đặt lại bước còn đang chạy (tạm dừng vì ngân sách khi bước khác chưa xong).
8. **4.3** Ở chế độ song song, `plan.waiting` chỉ được đặt khi không bước nào chạy được và có bước bị chặn vì người đó đang làm việc lẻ. Bước đang chờ Gemini vẫn chiếm một chỗ khi chọn bước.
9. **4.4 Chủ đề mới:** luật "thêm -v2 nếu chủ đề cũ chưa có đuôi" gộp vào luật "số lớn nhất + 1" (chưa có đuôi coi là bản 1), viết thành `chuDeTiepNoi` trong `lib/van-ban.js` kèm kiểm thử.
10. **4.4 Chép ảnh:** mọi file nằm ngay trong `hinh/`, `hinh-nguon/` (cả `danh-sach.md` ghi giấy phép); ảnh liên kết cứng, file khác hoặc khi lỗi thì chép. Thư mục con (như `cac-ban/`) bỏ qua. Dòng "Thư mục chủ đề:" trong brief được đổi cả khi viết in đậm hay trong dấu `` ` ``.
11. **4.4 Vấn đề còn mở** ghi dạng `- VD-n [mức] <file> (vị trí): <vấn đề>` (thêm "— không sửa: <ghi chú>" với vấn đề `khong-sua`); đường dẫn file đã đổi sang thư mục chủ đề mới. Đã thử trên bản sao workspace: chép đúng `output/thoai-hoa-khop-goi/` sang `-v2`, brief trỏ đúng thư mục, khối "DỰ ÁN TIẾP NỐI" có trong prompt lập kế hoạch.
12. **4.5 Chỉ đọc:** `--permission-mode acceptEdits` tự duyệt Write/Edit dù không có trong `--allowedTools`. Lượt `chiDoc` vì vậy chạy `--permission-mode default`, `--allowedTools Read,Glob,Grep`, `--disallowedTools Write,Edit,NotebookEdit,Bash,WebFetch,WebSearch`, `--strict-mcp-config`, không `--chrome`.
13. **4.5 Chỉ hỏi được người dùng Claude** (Gemini CLI và agy không giới hạn được công cụ). Công cụ chỉ có khi bật cả `labTools` (MCP nội bộ) và `consultTool`, và chỉ cho lượt thuộc một bước dự án. Hỏi quá 3 phút thì máy chủ dừng lượt của người được hỏi. Lần hỏi không chạy được (người bận, không có…) không tính vào 3 lần. Cầu nối MCP chờ tối đa 4 phút (trước là 2).
14. **4.6 Định nghĩa chỉ số:**
    - Vòng duyệt–sửa = số bước duyệt lại ÷ số bước làm (mỗi vòng kết thúc bằng một bước duyệt lại).
    - Token theo loại bước: lượt khớp bước theo `runId`, không khớp thì theo số bước lúc chạy; bước 0 là điều phối (lập kế hoạch, giao ban, nghiệm thu); lượt hỏi nhanh tách riêng.
    - Điểm lần đầu: dòng "Nghiệm thu lần 1: n/100" trong nhật ký.
    - Bài học tái phạm 30 ngày: `danhGiaSauDuAn` nay lưu mã vào `plan.baiHocTaiPham`; dự án cũ đọc số trong dòng nhật ký "Bài học: n tái phạm".
    - Lần chạy gọi Bash: đếm theo `run.tools` (Bash, PowerShell, run_command); lượt cũ chưa có `tools` thì đọc diễn biến. Trên dữ liệu thật khớp số đã đo ở Đợt 1 (dự án mất ngủ: 5 lượt).
    - Thêm hai chỉ số có sẵn mục tiêu ở mục 5: vấn đề không rõ người sửa (0) và token bước nguồn ở dự án tiếp nối (dưới 0,8 triệu; "bước nguồn" = bước làm của agent Deep Research).
    - Bỏ qua các chỉ số mục 5 chưa có dữ liệu máy đọc được (câu hỏi trùng, link mở lại, `index.md`, ảnh ngoài thư mục chủ đề).
      Bốn chỉ số này đã có ở 5.5.
15. Chưa xem được giao diện bằng trình duyệt trong môi trường viết code (trang giữ kết nối sự kiện nên trình duyệt headless không dừng). Khối "Trí não" đã kiểm bằng cách chạy riêng hàm dựng HTML trên dữ liệu thật.

Thử trên máy (2026-10-22, dự án tiếp nối `plan-20261022-203403` từ `plan-20261021-195355`, thêm 2 trang tập cơ tứ đầu; bật cùng lúc bốn công tắc `deepResearchTwoPhase`, `stepModel: {"rereview": "haiku"}`, `maxParallel: 2`, `consultTool`; dự án đang tạm dừng ở bước 14/16, chưa nghiệm thu):

16. **Đạt 4.4:** ô "Tiếp nối từ dự án…" có trong ô tạo dự án; máy chủ tạo `output/thoai-hoa-khop-goi-v2/`, chép `slides.md`, `thiet-ke.md`, `hinh-nguon/`; kế hoạch chỉ làm phần chênh (6 bước ban đầu). Token bước nguồn 0,44 triệu quy đổi (mục tiêu dưới 0,8), nhưng Deep Research không chạy được (số 18) nên chưa phải số thật.
17. **Đạt 4.2, 4.3, 4.5:** cả ba bước duyệt lại của An chạy `haiku`. Sau bước 6 (An CẦN SỬA), Lam và Mai sửa cùng lúc (cùng giây 21:02:03); sau bước 11 (Hạ CẦN SỬA), Vy và Lam cũng sửa song song. Nhật ký có "Hỏi nhanh: Lam hỏi An"; lượt của An chỉ có Grep, Read, không ghi file, 26 nghìn token quy đổi.
18. **4.1 chưa thử được hết:** Gemini báo lỗi ("I seem to be encountering an error…") rồi kẹt ở "Tôi đang tạo kế hoạch nghiên cứu". Mai ghi `Trạng thái: CHƯA CHẠY — kẹt…`, không khớp `đang chạy`, nên máy chủ coi bước 1 xong như thường (lựa chọn số 2) và chuyển sang An dù chưa có file nguồn. An duyệt một file không tồn tại, máy chủ gọi giao ban vì 3 vấn đề "không rõ người sửa", rồi Mai sửa bằng WebFetch. Pha 1 cũng không ngắn: 11 phút, 2,8 triệu token (chưa quy đổi). Chưa thấy được đoạn "máy chủ chờ tới <giờ>" và pha 2. Đề xuất: pha 1 xong mà file không ghi "đang chạy" và không có file nguồn thì coi là lỗi bước, không chuyển cho người duyệt.
19. **Lỗi (đã sửa): lỗi tải hình bị hiểu nhầm là hết hạn mức tài khoản.** Bước 14 (Mai tải hình cơ tứ đầu) không tạo được file vì Commons trả HTTP 429. Lỗi "Không tạo được sản phẩm nào" chép kèm lời tóm tắt của agent, chữ "429" khớp `LIMIT_RE`, nên dự án tạm dừng với ghi chú "hết hạn mức tài khoản". `onStepError` nay bỏ qua `LIMIT_RE` với lỗi "Không tạo được sản phẩm nào"; lỗi này đi theo đường chạy lại bước như lỗi thường.
20. **Lỗi (đã sửa): tiếp nối nối cứng cả `hinh-nguon/danh-sach.md`.** Máy chủ ghi đè `danh-sach.md` của bản v2 tại chỗ, nên danh sách hình (kèm giấy phép) của dự án cũ `output/thoai-hoa-khop-goi/` bị thay theo. `chepTiepNoi` nay chỉ nối cứng file ảnh, file khác thì chép. Đã khôi phục bản cũ từ git và tách bản v2 thành file riêng.
21. **Còn hở:** bản v2 của `danh-sach.md` chỉ còn 3 dòng hình mới (tải hỏng); 4 dòng hình khớp gối cũ (ảnh vẫn ở `hinh-nguon/`) bị mất khi máy chủ ghi lại danh sách từ file nguồn mới. Ở chế độ tiếp nối, nên gộp với danh sách cũ thay vì ghi đè.
22. **Giao ban thừa:** sau bước 7, máy soát báo `thiet-ke.md` lệch `slides.md` ở tr.5–12. Đây là lệch đã dự kiến (bước 10 của Vy mới cập nhật thiết kế), nhưng vẫn tốn một lượt giao ban. Cả dự án có 3 lần giao ban.
23. Số khác ở khối Trí não: 5/19 lượt gọi Bash (lượt Haiku duyệt lại cũng thử Bash, bị chặn); An mở lại 3/3 link (100%); vòng duyệt–sửa 0,6 mỗi bước làm.
