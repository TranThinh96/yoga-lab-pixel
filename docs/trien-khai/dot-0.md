# Đợt 0 · Sửa lỗi, dọn nền, đường ống công cụ chung

Đọc [README.md](README.md) trước (quy ước code, kiểm thử, commit).

**Mục tiêu đợt:** sửa 7 lỗi hệ thống đã thấy trong dữ liệu thật, dựng khung kiểm thử, cho máy chủ tự viết `index.md`,
nhớ quyết định của chủ dự án qua các dự án, kiểm Chrome trước khi chạy, và dựng đường ống MCP nội bộ (tắt sẵn) để chủ dự án thử trên Windows.

**Không đổi trong đợt này:** cách lập kế hoạch, vòng duyệt, nghiệm thu, giao diện (trừ ô trả lời câu hỏi ở 0.10).

| Mục | Việc | File chính |
|---|---|---|
| 0.1 | Khung kiểm thử, `lib/van-ban.js` | `package.json`, `lib/van-ban.js`, `test/` |
| 0.2 | So trùng gần đúng cho bài học và câu hỏi | `server.js` (`appendLessons`, `newQuestions`) |
| 0.3 | "Không (…)" không phải câu hỏi | `lib/van-ban.js`, `server.js` (`parseQuestions`) |
| 0.4 | Chủ đề của dự án; ảnh hết rơi vào `hinh-moi/` | `lib/van-ban.js`, `server.js` |
| 0.5 | Mai được WebSearch ở bước sửa | `server.js` (`claudeToolsOf`, `cliArgs`, `chromePrompt`) |
| 0.6 | Tách máy soát sang `lib/soat-loi.js`; đếm chữ từng trang; đối chiếu slides ↔ thiết kế | `lib/soat-loi.js` |
| 0.7 | Máy soát cho cả người sửa | `server.js` (`pumpPlan`) |
| 0.8 | Bước sửa mà không ghi vào file được giao | `server.js` (`pumpPlan`) |
| 0.9 | Máy chủ tự viết `index.md` | `lib/ban-do.js`, `server.js` |
| 0.10 | Sổ quyết định, gợi ý câu trả lời cũ | `lib/quyet-dinh.js`, `server.js`, `public/index.html` |
| 0.11 | Câu hỏi về môi trường; kiểm Chrome trước khi chạy | `lib/van-ban.js`, `server.js` |
| 0.12 | Tải hình bị 429 thì máy chủ thử lại sau | `server.js` |
| 0.13 | Đường ống MCP nội bộ + công cụ `soat_loi` (tắt sẵn) | `mcp/yogalab-mcp.js`, `lib/cong-cu.js`, `server.js` |
| 0.14 | Cập nhật README.md | `README.md` |

---

## 0.1 Khung kiểm thử và `lib/van-ban.js`

**Làm**
1. `package.json`: thêm `"test": "node --test"` vào `scripts` (giữ `start`).
2. Tạo `test/fixtures/` và chép vào đó:
   - toàn bộ file trong `docs/trien-khai/fixtures/`;
   - `workspace/output/suy-giap-v7/slides.md` → `test/fixtures/slides-v7.md`;
   - `workspace/output/suy-giap-v6/slides.md` → `test/fixtures/slides-v6.md`;
   - `workspace/output/suy-giap-v6/thiet-ke.md` → `test/fixtures/thiet-ke-v6.md`;
   - `workspace/du-an/plan-20261019-193827/brief.md` → `test/fixtures/brief-v7.md`.
3. Tạo `lib/van-ban.js` đúng như sau (các mục sau sẽ thêm hàm vào file này):

```js
'use strict';
// Xử lý chữ tiếng Việt dùng chung: bỏ dấu, so độ giống giữa hai câu, tìm chủ đề trong đường dẫn.

// Từ nối bỏ qua khi so độ giống (đã bỏ dấu)
const STOP = new Set('va la cua cho co khong nhung thi de duoc mot cac nay do khi hay hoac voi trong tren duoi theo neu se da dang rat cung ve ra vao tu den nguoi nhom phai can bi lai con chi moi nhu sau truoc thay'.split(' '));
const NGUONG_BAI_HOC = 0.6;  // đo trên kinh-nghiem.md thật: cặp trùng ≥ 0,60, cặp khác ≤ 0,57
const NGUONG_CAU_HOI = 0.65; // đo trên 27 câu hỏi thật: cặp trùng ≥ 0,67, cặp khác ≤ 0,53

const boDau = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();

// Tập từ khoá: bỏ dấu, bỏ ngày trong ngoặc "(2026-10-17, …)", bỏ từ một ký tự và từ nối
function tuKhoa(s) {
  const t = boDau(s).replace(/\([^)]*\d{4}-\d{2}-\d{2}[^)]*\)/g, ' ').replace(/[^a-z0-9]+/g, ' ');
  return new Set(t.split(' ').filter(w => w.length >= 2 && !STOP.has(w)));
}

// Độ giống 0–1 = số từ khoá chung / số từ khoá của câu ngắn hơn.
// Câu quá ngắn (dưới 6 từ khoá) chỉ coi là giống khi trùng hẳn.
function giongNhau(a, b) {
  const A = tuKhoa(a), B = tuKhoa(b), min = Math.min(A.size, B.size);
  if (min < 6) return boDau(a).replace(/\s+/g, ' ').trim() === boDau(b).replace(/\s+/g, ' ').trim() ? 1 : 0;
  let chung = 0;
  for (const w of A) if (B.has(w)) chung++;
  return chung / min;
}

// Vị trí phần tử đầu tiên của list giống s từ ngưỡng trở lên; không có thì -1
const timGiong = (s, list, nguong) => list.findIndex(x => giongNhau(s, x) >= nguong);

// Chủ đề từ đường dẫn output/<chủ đề>/ đầu tiên trong đoạn chữ ("output/<chu-de>/" mẫu thì không tính)
function chuDeTu(text) {
  const m = /output\/([\p{L}\p{N}_.-]+)\//u.exec(String(text || '').normalize('NFC'));
  return m ? m[1] : null;
}

module.exports = { boDau, tuKhoa, giongNhau, timGiong, chuDeTu, NGUONG_BAI_HOC, NGUONG_CAU_HOI };
```

4. Tạo `test/van-ban.test.js`, đọc `test/fixtures/trung-lap.json`:
   - mọi cặp trong `bai_hoc.giong`: `giongNhau(a, b) >= 0.6`; mọi cặp trong `bai_hoc.khac`: `< 0.6`;
   - mọi cặp trong `cau_hoi.giong`: `>= 0.65`; mọi cặp trong `cau_hoi.khac`: `< 0.65`;
   - `boDau('Đã ĐƯỢC')` bằng `'da duoc'`;
   - `chuDeTu('ghi vào output/suy-giap-v7/slides.md')` bằng `'suy-giap-v7'`; `chuDeTu('output/<chu-de>/slides.md')` bằng `null`.

**Xong khi:** `npm test` qua. Cặp Nhi trong `bai_hoc.giong` có độ giống đúng 0,60, nên phải so bằng `>=`.

---

## 0.2 So trùng gần đúng cho bài học và câu hỏi (lỗi L3)

Hiện `qKey` chỉ so 80 ký tự đầu, nên Mai có 2 bài học về số 115, và ở v6 câu Canva bị hỏi 3 lần.

**Làm**
1. Thêm vào `lib/van-ban.js` (và `module.exports`):

```js
// Bài học mới không trùng bài cũ, cũng không trùng nhau trong cùng đợt
function locBaiHocMoi(list, cu, nguong = NGUONG_BAI_HOC) {
  const da = [...cu], out = [];
  for (const x of list) if (timGiong(x, da, nguong) < 0) { out.push(x); da.push(x); }
  return out;
}

// Chia câu hỏi trong bàn giao: giống câu đã trả lời (kèm vị trí câu đó), giống câu đang chờ (bỏ), hay thật sự mới
function phanLoaiCauHoi(list, daTraLoi, dangCho, nguong = NGUONG_CAU_HOI) {
  const moi = [], trung = [];
  for (const q of list) {
    const i = timGiong(q, daTraLoi, nguong);
    if (i >= 0) { trung.push({ q, i }); continue; }
    if (timGiong(q, [...dangCho, ...moi], nguong) >= 0) continue;
    moi.push(q);
  }
  return { moi, trung };
}
```

2. `server.js` → `appendLessons` (khoảng dòng 1633): thay đoạn tạo `have` và `add` bằng:
   ```js
   const cu = old.split(/\r?\n/).filter(l => /^\s*[-*•]\s+/.test(l)).map(l => l.replace(/^\s*[-*•]\s+(\([^)]*\)\s*)?/, ''));
   const add = locBaiHocMoi(list.slice(0, 3).map(x => String(x || '').replace(/\s+/g, ' ').trim().slice(0, 400)).filter(Boolean), cu);
   ```
3. `server.js` → `newQuestions` (khoảng dòng 992): thay phần tạo `seen` và `out` bằng:
   ```js
   plan.answers = plan.answers || [];
   const { moi, trung } = phanLoaiCauHoi(list, plan.answers.map(x => x.q), (plan.questions || []).map(x => x.q));
   // Câu giống câu đã trả lời: không hỏi lại, ghi kèm câu trả lời cũ để người hỏi thấy trong bảng dự án
   for (const { q, i } of trung) plan.answers.push({ q, from, step, a: `(Giống câu đã trả lời: "${snippet(plan.answers[i].q)}" → ${plan.answers[i].a})` });
   if (trung.length) plan.log.push(`Không hỏi lại ${trung.length} câu giống câu đã trả lời`);
   const out = moi.map(q => ({ q, from, step }));
   ```
   Giữ nguyên khối `maxAskRounds` phía sau, nó dùng `out` như cũ.
4. Xoá `qKey` nếu không còn chỗ nào dùng (tìm `qKey(` trong `server.js`).
5. Kiểm thử thêm vào `test/van-ban.test.js`:
   - `locBaiHocMoi([b, 'Đặt tiêu đề trang slide ngắn gọn, đúng như tiêu đề trong slide mẫu, không đổi thành câu hỏi.'], [a])` với `a, b` là cặp `bai_hoc.giong[0]` → chỉ còn câu thứ hai;
   - `phanLoaiCauHoi([c2, v], [c1], [])` với `c1, c2` là cặp `cau_hoi.giong[0]`, `v` là câu đầu của `cau_hoi.khac[0]` → `moi` là `[v]`, `trung` là `[{ q: c2, i: 0 }]`;
   - `phanLoaiCauHoi([c1, c2], [], [])` → `moi` là `[c1]` (câu thứ hai giống câu thứ nhất trong cùng đợt).

**Xong khi:** `npm test` qua; `node --check server.js` không lỗi.

---

## 0.3 "Không (…)" không phải câu hỏi (lỗi L2)

Ở v6, hai bàn giao ghi "Không (3 câu của An đã có trả lời…)" và "Không. Tr.17 theo phương án (a)…", và máy chủ coi đó là câu hỏi, làm dự án dừng chờ.

**Làm**
1. Chuyển nguyên hàm `parseQuestions` (khoảng dòng 881) sang `lib/van-ban.js` với tên `docCauHoi`, thêm `.normalize('NFC')` ở dòng đầu, và thay `none` bằng:
   ```js
   // "Không", "Không.", "(Không)", "Không (giải thích…)", "Không có câu hỏi mới…" đều là không có câu hỏi.
   // "Không dùng X có được không?" vẫn là câu hỏi.
   const none = s => {
     s = s.trim();
     return /^\(?\s*không có câu hỏi[^?]*$/iu.test(s) || /^\(?\s*(không có|chưa có|không|none|n\/a)\s*($|[.:;,)—–-]|\()/iu.test(s);
   };
   ```
   Sửa thêm một chỗ: khi phần câu hỏi **có** dòng gạch đầu dòng mà mọi dòng đều là "không", trả về `[]`.
   Hiện hàm rơi xuống nhánh ghép cả đoạn, nên `- Không` thành câu hỏi "- Không":
   ```js
   const bullets = body.filter(l => /^\s*([-*•]|\d+[.)])\s+/.test(l));
   const items = bullets.map(l => l.replace(/^\s*([-*•]|\d+[.)])\s+/, '').trim()).filter(s => s && !none(s));
   if (bullets.length) return items.slice(0, 5);
   ```
2. `server.js`: `const { docCauHoi: parseQuestions, … } = require('./lib/van-ban');` và xoá hàm cũ.
3. Kiểm thử, với mỗi chuỗi `s` trong `khong_phai_cau_hoi` của `trung-lap.json`:
   - `docCauHoi('## Câu hỏi cho chủ dự án\n' + s + '\n\n## Gợi ý bước sau\nx')` trả về `[]`;
   - `docCauHoi('## Câu hỏi cho chủ dự án\n- ' + s + '\n')` trả về `[]`.

   Với mỗi chuỗi trong `la_cau_hoi`: kết quả là `[s]` (cả hai dạng).

---

## 0.4 Chủ đề của dự án; ảnh hết rơi vào `hinh-moi/` (lỗi L1)

`imageDirOf(run.task)` lấy thư mục ảnh từ chữ trong nhiệm vụ. Nhiệm vụ không ghi `output/<chủ đề>/` thì ảnh rơi vào `hinh-moi/`.
Ở v6, việc này sinh ra 5 bài học cho Hạ, Nhi, Chef dù lỗi nằm ở máy chủ.

**Làm**
1. Thêm vào `lib/van-ban.js`:

```js
// Thư mục chủ đề của dự án (output/<chủ đề>/). Thứ tự ưu tiên: khai trong JSON kế hoạch → dòng "Thư mục chủ đề:"
// trong brief → mục "Sản phẩm cần giao" của brief → cả brief → việc của các bước → file các bước đã ghi
function chonChuDe({ jsonChuDe, brief, tasks = [], files = [] } = {}) {
  const sach = s => boDau(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (jsonChuDe && !/[<>]/.test(jsonChuDe) && /^[a-z0-9][a-z0-9-]{1,60}$/.test(sach(jsonChuDe))) return sach(jsonChuDe);
  const b = String(brief || '').normalize('NFC');
  const dong = /Thư mục chủ đề:\s*`?([\p{L}\p{N}_.-]+)`?/u.exec(b);
  if (dong) return dong[1];
  const muc = b.split(/^(?=## )/m).find(x => /^##\s*Sản phẩm cần giao/i.test(x));
  return (muc && chuDeTu(muc)) || chuDeTu(b) || tasks.map(chuDeTu).find(Boolean) || files.map(chuDeTu).find(Boolean) || null;
}
```

2. `buildPlanPrompt` (khoảng dòng 900):
   - Trong danh sách mục của brief (ngay sau dòng `VIỆC 1 — …`), thêm một dòng **trước** dòng `"## Mục tiêu & người nhận"`:
     `'- Dòng đầu tiên sau tiêu đề: "Thư mục chủ đề: <chu-de>" (chữ thường, không dấu, nối gạch ngang, vd tang-huyet-ap). Mọi sản phẩm cuối nằm trong output/<chu-de>/.',`
   - Trong mẫu JSON, thêm `"chu_de":"<chu-de>"` vào đầu: `'{"chu_de":"<chu-de>","questions":[],"steps":[…như cũ…]}'`.
3. `parsePlan` trả thêm `chuDe: j.chu_de` trong object kết quả. Trong `runCoordinator`, khi `parsed` hợp lệ và `!plan.topic`:
   `plan.topic = chonChuDe({ jsonChuDe: parsed.chuDe }) || null;`
4. Thêm vào `server.js` (gần `briefPath`):
   ```js
   // Chủ đề của dự án: tính một lần rồi giữ trong plan.topic (lưu cùng plans.json)
   function planTopic(plan) {
     if (!plan) return null;
     if (!plan.topic) plan.topic = chonChuDe({ brief: readWs(briefPath(plan)), tasks: plan.steps.map(s => s.task), files: plan.steps.flatMap(s => s.files || []) });
     return plan.topic;
   }
   // Thư mục ảnh của một lượt chạy: theo chủ đề của dự án; lượt lẻ thì theo đường dẫn trong nhiệm vụ
   function imageDirFor(run) {
     const plan = run.planId && plans.find(p => p.id === run.planId);
     const topic = planTopic(plan) || chuDeTu(run.task);
     return topic ? `output/${topic}/hinh` : null;
   }
   ```
5. `placeImages` (khoảng dòng 1339): thay `const dirRel = imageDirOf(run.task)` bằng `const dirRel = imageDirFor(run) || 'hinh-moi'`.
   Khi phải dùng `hinh-moi`, thêm vào **đầu** `extraNote`:
   `'KHÔNG xác định được chủ đề nên ảnh tạm để ở hinh-moi/. Chép tay vào output/<chủ đề>/hinh/, hoặc ghi rõ output/<chủ đề>/ trong nhiệm vụ.'`
   Nếu lượt chạy thuộc một dự án thì thêm câu đó vào `plan.log` luôn. Xoá hàm `imageDirOf`.
6. `retryPlan`: thêm `topic: old.topic || null` vào object kế hoạch mới.
7. Kiểm thử `chonChuDe` (mỗi dòng: đầu vào → kết quả):
   ```js
   [
     [{ jsonChuDe: 'Tăng huyết áp' }, 'tang-huyet-ap'],
     [{ jsonChuDe: '<chu-de>', tasks: ['ghi output/abc/slides.md'] }, 'abc'],
     [{ brief: readFixture('brief-v7.md') }, 'suy-giap-v7'],
     [{ brief: '# B\n\n## Sản phẩm cần giao\n| `output/x-y/slides.md` | Lam |\n\n## Ràng buộc\nxem output/khac/a.md' }, 'x-y'],
     [{ files: ['agents/an/a.md', 'output/q/thiet-ke.md'] }, 'q'],
     [{}, null]
   ]
   ```

---

## 0.5 Mai được WebSearch ở bước sửa (lỗi L4)

Agent Deep Research bị bỏ WebSearch ở **mọi** lượt, kể cả bước sửa chỉ cần tìm vài nguồn. Ở v6, Mai ghi "WebSearch chưa được cấp quyền; không tìm được nguồn 115".

**Làm**
1. `claudeToolsOf(agent, kind)` (khoảng dòng 259): điều kiện bỏ WebSearch thành
   `if (!agent.tools && g && g.mode === 'deep-research' && kind !== 'fix')`.
2. `cliArgs(agent, maxTurns, effort, kind)`: thêm tham số `kind`, truyền vào `claudeToolsOf(agent, kind)`. Trong `startRun`: `cliArgs(agent, opts.maxTurns, opts.effort, opts.kind)`.
3. `chromePrompt` (khoảng dòng 266), nhánh `deep && kind && kind !== 'work'`: dòng bắt đầu bằng `- Cần tìm nguồn thay thế cho vài ý` dùng nội dung khác nhau theo `kind`:
   - `kind === 'fix'`: `- Cần tìm nguồn thay thế cho vài ý: dùng WebSearch, rồi mở link bằng WebFetch để xác minh trước khi ghi. Chỉ khi WebSearch không ra mới hỏi Gemini trên https://gemini.google.com trong một tab mới (chat thường, KHÔNG bật Deep Research).`
   - loại bước khác: giữ nguyên dòng cũ.

Lượt lẻ (không có `kind`) giữ nguyên như cũ.

---

## 0.6 Tách máy soát sang `lib/soat-loi.js`; đếm chữ từng trang; đối chiếu slides ↔ thiết kế

Làm thành **5 commit nhỏ** theo đúng thứ tự dưới đây. Commit A chỉ dời code, không đổi hành vi.

**A. Dời `lintText` sang `lib/soat-loi.js`**
1. Tạo `lib/soat-loi.js` (đầu file: `'use strict';` và `const { boDau } = require('./van-ban');`, mục D cần `boDau`).
   Chép nguyên `REDUP_OK` và thân `lintText` thành `soatVanBan(rel, txt, { maxChu, tuTranh, cachGoi })`. Chỉ thay:
   - `cfgNum('lintMaxWords', 40)` → `maxChu`;
   - `config.lintBanned || DEFAULT_CONFIG.lintBanned || []` → `tuTranh || []`;
   - `config.lintVariants || DEFAULT_CONFIG.lintVariants || []` → `cachGoi || []`.
2. `server.js` giữ tên cũ:
   ```js
   const lintText = (rel, txt) => soatVanBan(rel, txt, { maxChu: cfgNum('lintMaxWords', 40),
     tuTranh: config.lintBanned || DEFAULT_CONFIG.lintBanned || [], cachGoi: config.lintVariants || DEFAULT_CONFIG.lintVariants || [] });
   ```
3. `test/soat-loi.test.js`: với mỗi phần tử `c` của `lint` trong `soat-loi-mong-doi.json`:
   `assert.deepEqual(soatVanBan(c.file, readFixture(c.nguon), { maxChu: c.max, tuTranh: c.banned, cachGoi: c.variants }), c.mong_doi)`
   (`readFixture` đọc `test/fixtures/<tên>` rồi `.normalize('NFC')`). Bộ mẫu này phủ đủ: dấu câu đôi, dấu cách trước dấu câu, lặp từ, từ cần tránh, quá chữ, lẫn cách gọi, khối mã, link, file không phải sản phẩm.

**B. Tên riêng viết hoa lặp lại không phải lỗi**
"HLV Chang Chang" đang bị báo "lặp từ". Trong `soatVanBan`, ngay sau dòng tìm `dup`:
```js
// Tên riêng viết hoa lặp lại (vd "Chang Chang") không phải lỗi
const hai = dup && t.slice(dup.index).match(/\p{L}+\s+\p{L}+/u);
const tenRieng = !!hai && hai[0].split(/\s+/).every(w => /^\p{Lu}/u.test(w));
```
và thêm `!tenRieng &&` vào điều kiện báo lặp từ. Sửa kiểm thử của A: trước khi so, bỏ khỏi `c.mong_doi` mọi dòng chứa `lặp từ "Chang Chang"`.
Dòng `lặp từ "độ độ"` vẫn phải còn.

**C. `soChuTungTrang(txt)`**
Trả về `[{ trang, chu }]` cho **mọi** trang, đếm đúng như phần đếm chữ trong `soatVanBan` (Ý chính + Câu chốt, bỏ khối mã):
```js
function soChuTungTrang(txt) {
  const lines = String(txt || '').normalize('NFC').split(/\r?\n/), out = [];
  const count = t => (t.match(/[\p{L}\p{N}]+/gu) || []).length;
  let page = '', mode = '', words = 0, inCode = false;
  const flush = () => { if (page) out.push({ trang: Number(/\d+/.exec(page)[0]), chu: words }); words = 0; mode = ''; };
  for (const l of lines) {
    if (/^\s*```/.test(l)) { inCode = !inCode; continue; }
    if (inCode) continue;
    const h = /^#{1,3}\s+(Trang\s+\d+)/i.exec(l);
    if (h) { flush(); page = h[1]; continue; }
    if (/^#{1,3}\s/.test(l)) { flush(); page = ''; }
    if (!page) continue;
    if (/^- Ý chính:/i.test(l)) { mode = 'y'; continue; }
    const cc = /^- Câu chốt:\s*(.*)$/i.exec(l);
    if (cc) { mode = ''; if (!/^[—–-]?\s*$/.test(cc[1])) words += count(cc[1]); continue; }
    if (/^- \S/.test(l)) { mode = ''; continue; }
    const item = /^\s{2,}[-*]\s+(.*)$/.exec(l);
    if (item && mode === 'y') words += count(item[1]);
  }
  flush();
  return out;
}
```
Kiểm thử: với mỗi khoá `k` trong `so_chu` của `soat-loi-mong-doi.json`, `soChuTungTrang(readFixture(k))` deepEqual giá trị đó.

**D. `doiChieuThietKe(slidesTxt, designTxt)`**
Đối chiếu từng trang của slides.md với thiet-ke.md. Ở v5, v6, các lệch này phải nhờ người duyệt tự dò.
```js
// Đồ dùng trên trang tư thế: tên Việt (slides.md) và cách prompt tiếng Anh hay gọi (thiet-ke.md).
// Bỏ "gối" vì trùng với "đầu gối".
const DO_DUNG = [
  ['gạch', /\b(blocks?|bricks?)\b/i],
  ['ghế', /\bchairs?\b/i],
  ['bolster', /\bbolsters?\b/i],
  ['chăn', /\bblankets?\b/i],
  ['khăn', /\b(towels?|eye pillows?|eye masks?)\b/i],
  ['dây tập', /\bstraps?\b/i],
  ['tường', /\b(legs? (?:up|against) (?:the|a) wall|against (?:the|a) wall)\b/i] // "beige wall" là phông nền, không phải đồ dùng
];
// "không khăn", "no eye pillow", "without a chair": coi như không có
const PHU_DINH = /(không|no|without)\s+(?:[\p{L}-]+\s+){0,2}?(gạch|ghế|bolster|chăn|khăn|dây tập|tường|blocks?|bricks?|chairs?|bolsters?|blankets?|towels?|eye pillows?|eye masks?|straps?|walls?)/giu;

function cacTrang(txt) {
  const m = new Map();
  let cur = null;
  for (const l of String(txt || '').normalize('NFC').split(/\r?\n/)) {
    const h = /^##\s+Trang\s+(\d+)\s*[·:.\-–—]?\s*(.*)$/.exec(l);
    if (h) { cur = { title: h[2].trim(), body: '' }; m.set(Number(h[1]), cur); continue; }
    if (/^#{1,2}\s/.test(l)) { cur = null; continue; }
    if (cur) cur.body += l + '\n';
  }
  return m;
}
const coDoDung = (text, [vi, en]) => {
  const t = text.replace(PHU_DINH, ' ');
  return new RegExp('(^|[^\\p{L}])' + vi + '(?=$|[^\\p{L}])', 'iu').test(t) || en.test(t);
};

function doiChieuThietKe(slidesTxt, designTxt) {
  const A = cacTrang(slidesTxt), B = cacTrang(designTxt), out = [];
  const k = x => boDau(x).replace(/[^a-z0-9]+/g, ' ').trim();
  for (const n of [...new Set([...A.keys(), ...B.keys()])].sort((x, y) => x - y)) {
    const s = A.get(n), d = B.get(n);
    if (!d) { out.push({ trang: n, loai: 'thieu-trang', chi_tiet: 'có trong slides.md, không có trong thiet-ke.md' }); continue; }
    if (!s) { out.push({ trang: n, loai: 'thieu-trang', chi_tiet: 'có trong thiet-ke.md, không có trong slides.md' }); continue; }
    if (k(s.title) !== k(d.title)) out.push({ trang: n, loai: 'lech-tieu-de', chi_tiet: `slides.md: "${s.title}" · thiet-ke.md: "${d.title}"` });
    const ls = (/^- Hình:\s*([A-E])\b/m.exec(s.body) || [])[1];
    const ld = (/^- Hình(?:\s*\([A-E/]+\))?:\s*([A-E])\b/m.exec(d.body) || [])[1];
    if (ls && ld && ls !== ld) out.push({ trang: n, loai: 'lech-loai-hinh', chi_tiet: `slides.md: ${ls} · thiet-ke.md: ${ld}` });
    if (ls === 'B' || ld === 'B') for (const p of DO_DUNG) {
      const x = coDoDung(s.body, p), y = coDoDung(d.body, p);
      if (x && !y) out.push({ trang: n, loai: 'lech-dao-cu', chi_tiet: `slides.md có "${p[0]}", thiet-ke.md không có` });
      if (y && !x) out.push({ trang: n, loai: 'lech-dao-cu', chi_tiet: `thiet-ke.md có "${p[0]}", slides.md không có` });
    }
  }
  return out;
}
```
Kiểm thử với `doi-chieu-mong-doi.json`:
- `doiChieuThietKe(doi-chieu-slides.md, doi-chieu-thiet-ke.md)` deepEqual `mau` (5 dòng);
- `doiChieuThietKe(slides-v6.md, thiet-ke-v6.md)` deepEqual `v6` (2 dòng: trang 17 "tường", trang 22 "bolster"). Đây là dữ liệu thật.

**E. `kiemFileHinh({ dsHinh, slidesTxt, chuDe, coFile, coThuMucHinh })`**
Hàm thuần; `coFile(rel)` do người gọi truyền vào. Trả về mảng chuỗi:
- Nếu `coThuMucHinh`: với mỗi dòng `{ name, pages }` của `dsHinh` (kết quả `listedImages` có sẵn trong `server.js`), không có file
  `output/<chuDe>/hinh/<tên không đuôi>` với một trong các đuôi `.png .jpg .jpeg .webp .svg` thì thêm
  `` `Trang ${pages.join(', ')}: chưa có output/${chuDe}/hinh/${name}` ``.
- Mọi chỗ `hinh-nguon/<file>.(png|jpg|jpeg|webp|svg)` trong `slidesTxt` mà `coFile('output/<chuDe>/hinh-nguon/<file>')` sai thì thêm
  `` `slides.md nhắc hinh-nguon/${file} nhưng chưa có file` `` (mỗi file một lần).

Kiểm thử với `coFile` giả: `dsHinh = [{ name: 'trang-04-a.png', pages: [4] }, { name: 'trang-05-b.jpg', pages: [5] }]`, có sẵn `output/t/hinh/trang-04-a.jpg`.
`slidesTxt` nhắc `hinh-nguon/x.jpg` (có) và `hinh-nguon/y.png` (không có).
Kết quả đúng 2 dòng: trang 5 thiếu, và `y.png` thiếu. Với `coThuMucHinh: false` thì chỉ còn dòng `y.png`.

`module.exports = { soatVanBan, soChuTungTrang, doiChieuThietKe, kiemFileHinh, REDUP_OK }`.

---

## 0.7 Máy soát cho cả người sửa (lỗi L6)

Hiện kết quả máy soát chỉ đưa cho người duyệt. Người sửa phải tự dò lại, hoặc đếm chữ bằng tay.

**Làm** trong `pumpPlan` (khoảng dòng 1078), khi `kind === 'fix'`:
1. Tính file sản phẩm cần sửa:
   ```js
   // File của sản phẩm đang sửa: bước gốc và các bước sửa trước của nó; bước sửa sau nghiệm thu thì lấy mọi file người này đã ghi
   const fileSua = s.fixOf
     ? [...new Set(plan.steps.slice(0, idx).filter((x, i) => i + 1 === s.fixOf || x.fixOf === s.fixOf).flatMap(x => x.files || []))]
     : [...new Set(plan.steps.slice(0, idx).filter(x => x.agentId === agent.id).flatMap(x => x.files || []))];
   ```
2. `const loiSua = lintFiles(fileSua);` Nếu `loiSua.length`, thêm vào `task` (ngay sau `s.task`):
   ```
   MÁY ĐÃ SOÁT sản phẩm bạn sửa và thấy <n> chỗ (dấu câu, từ cần tránh, cách gọi, số chữ/trang). Sửa luôn những chỗ đúng là lỗi:
     - <tối đa 25 dòng>
   ```
   Viết thành hàm `lintBlockFix(issues)` cạnh `lintBlock`, cùng kiểu (cắt 25 dòng, ghi "… và N chỗ nữa"). Không có lỗi thì không thêm gì.
3. Lưu `s.fileSua = fileSua` để 0.8 dùng lại.

---

## 0.8 Bước sửa mà không ghi vào file được giao

Bàn giao từng báo "đã sửa tr.22" trong khi file chưa đổi (bài học của Hạ và Lam). Máy chủ biết lượt đó đã ghi file nào (`run.files`).

**Làm**
1. Trong `onDone` của `pumpPlan`, khi `run.status === 'done'` và `kind === 'fix'`:
   ```js
   const doi = (run.files || []).filter(f => (s.fileSua || []).includes(f));
   if ((s.fileSua || []).length && !doi.length) {
     s.noChange = true;
     plan.log.push(`Bước ${idx + 1}: ${agent.name} sửa nhưng không ghi vào ${s.fileSua.slice(0, 3).join(', ')}`);
   }
   ```
2. Khi dựng việc cho bước duyệt (`s.checks`): nếu bước được duyệt (`checked`, đã có trong code) có `noChange`, thêm dòng vào khối "ĐÂY LÀ BƯỚC DUYỆT":
   `- CHÚ Ý: bước sửa trước không ghi vào file sản phẩm nào (<tối đa 3 file>). Kiểm kỹ từng chỗ người sửa báo "đã sửa".`

---

## 0.9 Máy chủ tự viết `index.md` (lỗi L7)

`index.md` hiện có 85 dòng và dài thêm sau mỗi lượt, vì quy tắc 5 trong `buildPrompt` bảo agent tự thêm dòng. Lượt nào cũng đọc file này đầu tiên.

**Làm**
1. Tạo `lib/ban-do.js` với `vietBanDo({ plans, topics, coTriThuc, coBanCu })`, trả về chuỗi Markdown:
   - `plans`: tối đa 3 phần tử `{ id, goal, status, score, topic, brief, nghiemThu }` (mới nhất trước);
   - `topics`: tối đa 3 phần tử `{ ten, files: [{ path, by }] }` (mỗi chủ đề tối đa 6 file);
   - `coTriThuc`: có `tri-thuc/00-ban-do.md` hay chưa; `coBanCu`: có `luu-tru/index-cu.md` hay chưa.

   Đầu ra đúng mẫu sau (phần trong `<>` thay bằng dữ liệu):
   ```
   # Bản đồ Yoga Lab

   > Máy chủ tự cập nhật file này sau mỗi lượt. Đừng sửa tay: ghi chú của bạn để trong tri-thuc/.

   ## Cấu trúc
   - sources/ — tài liệu gốc (chỉ đọc)
   - templates/ — mẫu kịch bản slide và quy tắc thiết kế (chỉ đọc)
   - handoff/ — bàn giao giữa các agent
   - agents/<id>/ — nháp riêng; agents/<id>/kinh-nghiem.md là bài học của người đó
   - du-an/<mã>/ — brief.md, bang.md (bảng dự án), nghiem-thu.md
   - output/<chủ đề>/ — sản phẩm cuối
   - tri-thuc/ — bộ não chung, bắt đầu từ tri-thuc/00-ban-do.md      ← chỉ khi coTriThuc

   ## Dự án gần đây
   - <id> · <topic, hoặc 60 ký tự đầu của goal> · <trạng thái>[, <score>/100][ · nghiệm thu: <nghiemThu> | · brief: <brief>]

   ## Sản phẩm mới nhất
   - output/<ten>/: <tên file> (<by>), <tên file> (<by>)

   Bản đồ cũ (agent tự ghi trước đây): luu-tru/index-cu.md      ← chỉ khi coBanCu
   ```
   - Trạng thái dùng đúng chữ như `PLAN_TXT` trong `public/index.html` (`planning: 'Đang lập kế hoạch'`, … `asking: 'Chờ bạn trả lời'`, `done: 'Xong'` …).
   - Có `nghiemThu` thì ghi nghiệm thu; không có mà có `brief` thì ghi brief. `by` rỗng thì bỏ ngoặc.
   - Không có dự án hoặc sản phẩm thì ghi `(chưa có)` dưới tiêu đề mục.
2. Thêm vào `server.js`:
   - hàm `async function writeIndex()`:
     - `plans` lấy 3 kế hoạch cuối của `plans` (đảo thứ tự), `topic: planTopic(p)`;
     - `topics`: từ `walkOutputs()`, nhóm file theo `path.split('/')[1]`; chủ đề mới nhất là chủ đề có `mtime` lớn nhất; chỉ lấy file `.md` nằm ngay trong `output/<chủ đề>/`; `by` lấy từ `originIndex(runs).get(path)?.agentName`;
     - nếu `index.md` hiện tại có dòng `## File quan trọng` và chưa có `luu-tru/index-cu.md`: chép `index.md` hiện tại sang `luu-tru/index-cu.md` trước (chỉ một lần);
     - chỉ ghi `index.md` khi nội dung khác bản đang có.
   - hàm hẹn giờ gộp: `let indexTimer = null; const scheduleIndex = () => { clearTimeout(indexTimer); indexTimer = setTimeout(() => writeIndex().catch(e => console.error('Không ghi được index.md:', e.message)), 2000); };`
   - gọi `scheduleIndex()` ở cuối `finishRun`, và một lần lúc khởi động (sau `loadPlans()`).
3. `buildPrompt` (khoảng dòng 326): thay đúng dòng
   `` `5. Tạo file quan trọng nào thì thêm một dòng mô tả vào index.md.`, ``
   bằng
   `` `5. Không sửa index.md: máy chủ tự cập nhật bản đồ sau mỗi lượt.`, ``
   (giữ nguyên các dòng phụ phía dưới).
4. `INDEX_TEMPLATE`: bỏ dòng `(agent tự thêm một dòng khi tạo file đáng chú ý)`.
5. Kiểm thử `test/ban-do.test.js`: 3 kế hoạch giả (một `done` có `score: 83` và `nghiemThu`, một `paused` có `brief`, một `running`) + 2 chủ đề giả.
   Kiểm: số dòng dưới 30; có `Xong, 83/100 · nghiệm thu:`; có `Tạm dừng`; không có `## File quan trọng`; có dòng `tri-thuc/` chỉ khi `coTriThuc: true`.

---

## 0.10 Sổ quyết định và gợi ý câu trả lời cũ

Chủ dự án đã chốt: **câu hỏi vẫn làm dự án dừng chờ.** Mục này chỉ giúp trả lời nhanh hơn và để điều phối viên không hỏi lại điều đã quyết.

**Dữ liệu:** `.yogalab/quyet-dinh.json` là bản gốc, một mảng:
```json
[{ "id": "QD-1", "q": "…", "a": "…", "from": "an", "step": 4, "planId": "plan-…", "topic": "suy-giap-v7",
   "goal": "…", "at": "2026-10-19T…", "tuQuyet": true }]
```
`tuQuyet: true` khi câu trả lời là câu máy chủ tự điền: bắt đầu bằng `(Chủ dự án để nhóm tự quyết` hoặc `(Đã hỏi đủ số lần`.

**Làm**
1. `lib/quyet-dinh.js` (dùng `giongNhau`, `NGUONG_CAU_HOI` từ `lib/van-ban.js`):
   - `ghiQuyetDinh(list, moi)` → mảng mới.
     - Bỏ qua câu trả lời bắt đầu bằng `(Giống câu đã trả lời` (đó là bản sao).
     - Gán `tuQuyet` theo quy tắc trên.
     - Nếu đã có quyết định **cùng `topic`** và `giongNhau(q) >= 0.65` thì thay bằng bản mới (giữ `id` cũ); không có thì thêm, `id` là `QD-<số lớn nhất + 1>`.
   - `goiYChoCauHoi(list, q, topic)` → quyết định giống nhất (`>= 0.65`) hoặc `null`.
     Ưu tiên lần lượt: cùng `topic`, không phải `tuQuyet`, `at` mới hơn.
   - `quyetDinhChoKeHoach(list, topic, max = 10)`: lấy quyết định của bạn (không `tuQuyet`) ở **mọi** chủ đề, cộng quyết định `tuQuyet` **cùng** `topic`.
     Sắp xếp cùng chủ đề trước, rồi không `tuQuyet` trước, rồi mới hơn trước; cắt `max`.
   - `vietSoQuyetDinh(list)` → Markdown để xem trong Obsidian:
     - tiêu đề `# Sổ quyết định`, dòng `> Máy chủ tự sinh từ .yogalab/quyet-dinh.json. Sửa câu trả lời trong giao diện Yoga Lab, không sửa ở đây.`;
     - nhóm theo `topic` (`null` thì vào nhóm "Chung");
     - mỗi quyết định: `- **QD-3** (<planId>, <ngày>) bạn trả lời` hoặc `… *nhóm tự quyết*`, rồi hai dòng con `  - Hỏi: …` và `  - Trả lời: …`.
2. `server.js`:
   - Nạp lúc khởi động. Chưa có file thì tạo từ `answers` của mọi kế hoạch trong `plans.json`, `topic = planTopic(p)`, `at = p.endedAt || p.createdAt`.
   - Ghi file mỗi khi đổi, kèm `tri-thuc/quyet-dinh.md` = `vietSoQuyetDinh(...)` (tạo thư mục `tri-thuc/` nếu chưa có).
   - `answerPlan`: sau khi ghép câu trả lời, gọi `ghiQuyetDinh` cho đúng các câu vừa trả lời (`planId`, `topic: planTopic(plan)`, `goal: plan.goal`, `at: now`).
   - `newQuestions`: các câu bị tự điền "(Đã hỏi đủ số lần…)" cũng ghi vào sổ (sẽ thành `tuQuyet`).
   - `askOwner`: với mỗi câu hỏi `x`, nếu `goiYChoCauHoi(...)` có kết quả thì gán `x.goiY = { a, planId, at, tuQuyet }`.
   - `buildPlanPrompt`: ngay sau dòng `MỤC TIÊU: …`, nếu `quyetDinhChoKeHoach(...)` không rỗng, thêm:
     ```
     QUYẾT ĐỊNH TỪ CÁC DỰ ÁN TRƯỚC (dùng lại nếu còn hợp với mục tiêu này và ghi vào "Quyết định đã chốt" của brief; không hỏi lại những điều đã có ở đây):
     - (<planId>[, nhóm tự quyết]) <q> → <a>
     ```
     Mỗi dòng tối đa 300 ký tự. Lúc lập kế hoạch thì `planTopic(plan)` thường còn `null`, nên chỉ ra các quyết định của bạn. Như vậy là đúng ý.
3. `public/index.html` → `askBox` (khoảng dòng 2877). Trong vòng `map` của mỗi câu hỏi:
   - nếu có `x.goiY`, chèn ngay dưới `<label>`:
     `<p class="hint" style="margin:4px 0">Lần trước (<planId>, <yyyy-mm-dd>) bạn trả lời: <a></p>`
     (nếu `x.goiY.tuQuyet` thì "nhóm tự quyết" thay cho "bạn trả lời"; mọi giá trị qua `esc()`);
   - nếu `x.goiY` có và **không** `tuQuyet` thì điền sẵn câu trả lời cũ vào `<textarea>` (`>${esc(x.goiY.a)}</textarea>`).
   - Bản xem thử (demo) không có `goiY` nên không đổi gì.
4. Kiểm thử `test/quyet-dinh.test.js`:
   - ghi 2 câu Canva giống nhau cùng topic → còn 1 quyết định, mang câu trả lời mới hơn;
   - câu trả lời `(Chủ dự án để nhóm tự quyết…)` → `tuQuyet: true`;
   - `goiYChoCauHoi` chọn quyết định không `tuQuyet` khi có cả hai;
   - `quyetDinhChoKeHoach(list, 'moi')` không có quyết định `tuQuyet` của chủ đề khác.

---

## 0.11 Câu hỏi về môi trường; kiểm Chrome trước khi chạy

Ở 2 dự án, Mai "hỏi" chủ dự án "Vui lòng cấp quyền Chrome". 3 lượt của Mai hỏng vì Chrome chưa sẵn sàng, mà chỉ biết khi cả lượt đã chạy xong.

**Làm**
1. `lib/van-ban.js`:
   ```js
   // Câu "hỏi" về môi trường (Chrome, đăng nhập, hạn mức) không phải câu hỏi cho chủ dự án: là việc phải sửa trên máy
   const MOI_TRUONG_RE = /cấp quyền chrome|quyền (dùng )?chrome|claude in chrome|bật extension|extension (chưa|claude)|đăng nhập (vào )?(gemini|google)|hết hạn mức|hết quota|quota|session limit|usage limit/iu;
   const laCauHoiMoiTruong = q => MOI_TRUONG_RE.test(String(q || '').normalize('NFC'));
   ```
   Kiểm thử: `Vui lòng cấp quyền Chrome để tôi chạy Gemini Deep Research theo hướng dẫn.` → đúng; mọi chuỗi trong `cau_hoi.giong` và `cau_hoi.khac` → sai.
2. `pumpPlan`, trong `onDone` khi bước xong. **Trước** đoạn `if (s.checks) handleReview(...)`:
   - `const tatCa = parseQuestions(handoffText || text), moiTruong = tatCa.filter(laCauHoiMoiTruong);`
   - Nếu `moiTruong.length`:
     ```js
     s.status = 'error'; s.error = 'Lỗi môi trường: ' + snippet(moiTruong[0]);
     plan.status = 'paused';
     plan.note = `${agent.name} báo lỗi môi trường: ${snippet(moiTruong[0])}. Sửa trên máy (vd mở Chrome, bật Claude in Chrome, đăng nhập Gemini) rồi bấm "Chạy tiếp".`;
     plan.log.push(`Bước ${idx + 1}: lỗi môi trường → tạm dừng (không hỏi chủ dự án)`);
     return emitPlan(plan);
     ```
     `resumePlan` đã đưa bước lỗi về `pending`, nên bấm "Chạy tiếp" sẽ chạy lại bước này.
   - Dòng tính `qs` dùng `tatCa.filter(q => !laCauHoiMoiTruong(q))` thay cho `parseQuestions(...)`.
3. Kiểm Chrome trước. Thêm khoá `chromePreflight: true` vào `DEFAULT_CONFIG` với chú thích
   `// kiểm Chrome bằng một lượt rất ngắn trước khi giao việc cho agent dùng Chrome`. Thêm vào `server.js` (gần `probeClaude`):

```js
// Kiểm Chrome trước khi giao việc cho agent dùng Chrome: một lượt rất ngắn, chỉ gọi tabs_context_mcp.
// Chưa bật extension hay chưa cấp quyền thì dừng dự án ngay, không để agent chạy hết lượt rồi mới báo.
let chromeOkAt = 0, chromeCheck = null;
const chromeChecking = new Set(); // id kế hoạch đang chờ kết quả kiểm
function checkChrome() {
  if (chromeCheck) return chromeCheck;
  chromeCheck = new Promise(resolve => {
    const args = ['-p', '--output-format', 'stream-json', '--verbose', '--model', 'sonnet', '--max-turns', '3',
      '--strict-mcp-config', '--chrome', '--permission-mode', 'acceptEdits', '--allowedTools', 'mcp__claude-in-chrome'];
    let proc, buf = '', text = '', errs = '';
    try { proc = spawn(config.claudeCommand || 'claude', IS_WIN ? args.map(quoteWinArg) : args, { cwd: workspaceDir(), shell: IS_WIN, windowsHide: true, env: { ...process.env, FORCE_COLOR: '0' } }); }
    catch (e) { return resolve({ ok: false, err: e.message }); }
    const timer = setTimeout(() => { errs += ' quá thời gian 2 phút'; try { killProc(proc); } catch {} }, 120e3);
    proc.stdin.on('error', () => {});
    proc.stdin.end('Gọi công cụ tabs_context_mcp với createIfEmpty: true. Gọi được thì trả lời đúng một chữ: OK. Lỗi thì trả lời "LỖI: " kèm nguyên văn thông báo lỗi.', 'utf8');
    proc.stdout.setEncoding('utf8');
    proc.stdout.on('data', d => {
      buf += d; let i;
      while ((i = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
        try {
          const o = JSON.parse(line);
          if (o.type === 'result' && typeof o.result === 'string') text = o.result;
          if (o.type === 'user' && o.message && Array.isArray(o.message.content))
            for (const c of o.message.content) if (c.type === 'tool_result' && c.is_error) errs += ' ' + JSON.stringify(c.content).slice(0, 200);
        } catch {}
      }
    });
    proc.on('error', e => { errs += ' ' + e.message; });
    proc.on('close', () => {
      clearTimeout(timer);
      const ok = /^\s*OK\b/i.test(text) && !/requires permission|not connected/i.test(errs);
      resolve({ ok, err: ok ? '' : (text || errs || 'không rõ').trim().slice(0, 300) });
    });
  }).finally(() => { chromeCheck = null; });
  return chromeCheck;
}
```

   Trong `pumpPlan`: **sau** dòng `if (overBudget(plan)) …` và **trước** khi dựng `task`, thêm:
   ```js
   if (usesChrome(agent) && config.chromePreflight !== false && Date.now() - chromeOkAt > 30 * 60e3) {
     if (chromeChecking.has(plan.id)) return;
     chromeChecking.add(plan.id); plan.note = 'Đang kiểm Chrome trước khi giao việc…'; emitPlan(plan);
     return checkChrome().then(r => {
       chromeChecking.delete(plan.id);
       if (plan.status !== 'running') return emitPlan(plan);
       if (r.ok) { chromeOkAt = Date.now(); plan.note = ''; return pumpPlan(plan); }
       plan.status = 'paused';
       plan.note = `Chrome chưa sẵn sàng (${snippet(r.err)}). Mở Chrome, bật Claude in Chrome, đăng nhập Gemini nếu cần, rồi bấm "Chạy tiếp".`;
       plan.log.push(`Kiểm Chrome trước bước ${idx + 1}: chưa sẵn sàng → tạm dừng`);
       emitPlan(plan);
     });
   }
   ```

---

## 0.12 Tải hình bị 429 thì máy chủ thử lại sau

Ở v7 có 5 hình tải hỏng vì Wikimedia Commons trả HTTP 429 khi tải dồn. Các hàm tải đều bỏ qua file đã có, nên chạy lại cả hàm là an toàn.

**Làm**
1. Thêm vào `server.js` (cạnh `downloadSourceImages`):
   ```js
   // Commons trả 429 khi tải dồn: thử lại cả bảng sau 2, 5, 10 phút (file đã tải thì tự bỏ qua)
   function henTaiLai(plan, label, fn, lan = 1) {
     const cho = [2, 5, 10];
     if (lan > cho.length) return;
     setTimeout(async () => {
       const r = await fn().catch(e => ({ ok: [], fail: [{ name: label, why: e.message }] })) || { ok: [], fail: [] };
       plan.log.push(`Tải lại hình (${label}, lần ${lan}): ${r.ok.length} tải được${r.fail.length ? ', còn ' + r.fail.length + ' lỗi' : ''}`);
       emitPlan(plan);
       if (r.fail.some(x => /429/.test(x.why))) henTaiLai(plan, label, fn, lan + 1);
     }, cho[lan - 1] * 60e3);
   }
   ```
2. Trong `pumpPlan`, ở hai chỗ ghi log tải hình (sau `downloadListedImages(d)` và `downloadSourceImages(f, run.handoff)`):
   nếu `r.fail.some(x => /429/.test(x.why))` thì gọi `henTaiLai(plan, d, () => downloadListedImages(d))`, hoặc
   `henTaiLai(plan, f, () => downloadSourceImages(f, null))`.
3. Trong `downloadSourceImages`, ở phần nối vào bàn giao: dòng nào lỗi `Commons không có file này` thì ghi thêm `(tên file không có trên Commons: tìm lại đúng tên trang File:)`.

---

## 0.13 Đường ống MCP nội bộ và công cụ `soat_loi` (tắt sẵn)

Để agent tự soát lỗi ngay trong lượt của mình (đếm chữ, đối chiếu hai file), thay vì thử Bash rồi bị chặn: 46/87 lượt chạy đã làm vậy.
Mục này dựng đường ống và một công cụ. Các công cụ khác thêm ở Đợt 1 và 2.
**Mặc định tắt** (`labTools: false`). Chủ dự án bật sau khi thử trên máy theo `thu-tren-may.md`.

Làm thành 3 commit:

**A. `mcp/yogalab-mcp.js`: cầu nối stdio, không thêm thư viện**

```js
#!/usr/bin/env node
'use strict';
// Cầu nối MCP (stdio) cho agent Claude Code: chuyển lời gọi công cụ về máy chủ Yoga Lab qua 127.0.0.1.
// Mỗi dòng stdin/stdout là một thông điệp JSON-RPC 2.0. stdout chỉ dành cho thông điệp; ghi log ra stderr.
const http = require('http');
const readline = require('readline');
const BASE = process.env.YOGALAB_URL || 'http://127.0.0.1:4321', KEY = process.env.YOGALAB_KEY || '';

function goi(duong, body) {
  return new Promise((resolve, reject) => {
    const data = Buffer.from(JSON.stringify(body));
    const req = http.request(BASE + '/api/lab/' + duong, { method: 'POST', timeout: 120000,
      headers: { 'Content-Type': 'application/json', 'Content-Length': data.length } }, res => {
      let s = ''; res.setEncoding('utf8');
      res.on('data', d => { s += d; });
      res.on('end', () => { try { resolve(JSON.parse(s)); } catch { reject(new Error('HTTP ' + res.statusCode)); } });
    });
    req.on('timeout', () => req.destroy(new Error('quá thời gian')));
    req.on('error', reject);
    req.end(data);
  });
}
const gui = m => process.stdout.write(JSON.stringify(m) + '\n');

async function xuLy(m) {
  if (!m || m.id === undefined || m.id === null) return; // thông báo (notifications/…): không trả lời
  const ok = result => gui({ jsonrpc: '2.0', id: m.id, result });
  try {
    if (m.method === 'initialize') return ok({ protocolVersion: (m.params && m.params.protocolVersion) || '2025-06-18',
      capabilities: { tools: {} }, serverInfo: { name: 'yogalab', version: '1.0.0' } });
    if (m.method === 'ping') return ok({});
    if (m.method === 'tools/list') return ok({ tools: (await goi('_list', { key: KEY })).tools || [] });
    if (m.method === 'tools/call') {
      const r = await goi('_call', { key: KEY, name: m.params && m.params.name, args: (m.params && m.params.arguments) || {} });
      return ok({ content: [{ type: 'text', text: String(r.text || r.error || '') }], isError: !!(r.isError || r.error) });
    }
    gui({ jsonrpc: '2.0', id: m.id, error: { code: -32601, message: 'Method not found' } });
  } catch (e) {
    if (m.method === 'tools/call') return ok({ content: [{ type: 'text', text: 'Máy chủ Yoga Lab không trả lời: ' + e.message }], isError: true });
    gui({ jsonrpc: '2.0', id: m.id, error: { code: -32603, message: e.message } });
  }
}

readline.createInterface({ input: process.stdin }).on('line', line => {
  line = line.trim(); if (!line) return;
  let m; try { m = JSON.parse(line); } catch { return; }
  for (const x of Array.isArray(m) ? m : [m]) xuLy(x);
});
```

Kiểm thử `test/mcp.test.js`:
- dựng một `http.createServer` giả trên cổng ngẫu nhiên:
  - `POST /api/lab/_list` trả `{ tools: [{ name: 'soat_loi', description: 'x', inputSchema: { type: 'object' } }] }`;
  - `POST /api/lab/_call` trả `{ text: 'ok:' + body.name }`;
  - kiểm `body.key === 'k'`;
- chạy `node mcp/yogalab-mcp.js` bằng `child_process.spawn(process.execPath, …)` với `YOGALAB_URL`, `YOGALAB_KEY=k`;
- ghi 5 dòng:
  - `initialize` (id 1, `protocolVersion: '2025-06-18'`);
  - `notifications/initialized` (không id);
  - `tools/list` (id 2);
  - `tools/call` (id 3, `name: 'soat_loi'`, `arguments: { file: 'a.md' }`);
  - `foo/bar` (id 4);
- chờ đủ 4 dòng trả lời rồi kiểm:
  - id 1: `protocolVersion` đúng và `serverInfo.name === 'yogalab'`;
  - không có dòng nào cho thông báo;
  - id 2: `tools.length === 1`;
  - id 3: `content[0].text === 'ok:soat_loi'` và `isError === false`;
  - id 4: `error.code === -32601`;
- tắt tiến trình và máy chủ giả.

**B. `lib/cong-cu.js`: định nghĩa công cụ và công cụ `soat_loi`**

```js
'use strict';
// Công cụ máy chủ cho agent (gọi qua MCP). Mỗi công cụ: mô tả + schema gửi cho Claude Code, và hàm chạy nhận ctx do server.js cấp.
const { chuDeTu } = require('./van-ban');
const { soChuTungTrang, doiChieuThietKe, kiemFileHinh } = require('./soat-loi');

async function soatLoi(args, ctx) {
  const rel = String(args.file || '').replace(/\\/g, '/').replace(/^\.\//, '');
  if (!/\.md$/i.test(rel) || !ctx.exists(rel)) return { text: `Không thấy file .md "${rel}" trong folder làm việc.`, isError: true };
  const txt = ctx.read(rel), dong = [...ctx.lint(rel)];
  const dir = rel.replace(/[^/]+$/, ''), ten = rel.slice(dir.length), chuDe = chuDeTu(rel);
  const capDoi = /^(slides|thiet-ke)\.md$/.test(ten);
  if (capDoi && ctx.exists(dir + 'slides.md') && ctx.exists(dir + 'thiet-ke.md'))
    for (const x of doiChieuThietKe(ctx.read(dir + 'slides.md'), ctx.read(dir + 'thiet-ke.md'))) dong.push(`Trang ${x.trang} · ${x.loai}: ${x.chi_tiet}`);
  if (capDoi && chuDe) dong.push(...kiemFileHinh({ dsHinh: ctx.listImages(dir + 'thiet-ke.md'),
    slidesTxt: ctx.exists(dir + 'slides.md') ? ctx.read(dir + 'slides.md') : '', chuDe, coFile: ctx.exists, coThuMucHinh: ctx.hasImages(`output/${chuDe}/hinh`) }));
  const L = [dong.length ? `Soát ${rel}: ${dong.length} chỗ cần xem` : `Soát ${rel}: không thấy lỗi máy móc.`, ...dong.slice(0, 60).map(x => '- ' + x)];
  if (dong.length > 60) L.push(`- … và ${dong.length - 60} chỗ nữa`);
  const soChu = soChuTungTrang(txt);
  if (soChu.length) L.push('', 'Số chữ trên slide (Ý chính + Câu chốt): ' + soChu.map(x => `Trang ${x.trang}: ${x.chu}`).join(' · '));
  return { text: L.join('\n') };
}

const CONG_CU = {
  soat_loi: {
    description: 'Máy chủ soát lỗi máy móc trong một file .md của folder làm việc: dấu câu đôi, dấu cách trước dấu câu, lặp từ, từ cần tránh, cách gọi lẫn lộn, số chữ từng trang slide. Với slides.md và thiet-ke.md còn đối chiếu hai file theo từng trang và kiểm file hình đã có chưa. Gọi trước khi bàn giao cho từng file sản phẩm bạn vừa ghi hoặc sửa.',
    inputSchema: { type: 'object', properties: { file: { type: 'string', description: 'Đường dẫn trong folder làm việc, vd output/tang-huyet-ap/slides.md' } }, required: ['file'] },
    run: soatLoi
  }
};

const danhSach = ten => ten.filter(t => CONG_CU[t]).map(t => ({ name: t, description: CONG_CU[t].description, inputSchema: CONG_CU[t].inputSchema }));
async function goi(ten, args, ctx, choPhep) {
  if (!choPhep.includes(ten) || !CONG_CU[ten]) return { text: `Không có công cụ "${ten}"`, isError: true };
  try { return await CONG_CU[ten].run(args || {}, ctx); } catch (e) { return { text: 'Lỗi: ' + e.message, isError: true }; }
}

module.exports = { CONG_CU, danhSach, goi };
```

Kiểm thử `test/cong-cu.test.js` với `ctx` giả:
- `read` trả nội dung `doi-chieu-slides.md` cho `output/t/slides.md` và `doi-chieu-thiet-ke.md` cho `output/t/thiet-ke.md`;
- `exists` đúng với hai file đó; `lint` trả `['dòng lỗi giả']`; `listImages` trả `[]`; `hasImages` trả `false`.

Gọi `goi('soat_loi', { file: 'output/t/slides.md' }, ctx, ['soat_loi'])`, kết quả có `dòng lỗi giả`, `Trang 4 · lech-dao-cu` và `Số chữ trên slide`.
Gọi `goi('soat_loi', …, ctx, [])` thì `isError` là `true`.

**C. Nối vào `server.js`**
1. `DEFAULT_CONFIG`: `labTools: false, // cho agent Claude gọi công cụ của máy chủ qua MCP nội bộ (bật sau khi thử trên máy)`.
2. `const crypto = require('crypto');` ở đầu file; `const congCu = require('./lib/cong-cu');`.
3. Ngay trước `startRun`:
   ```js
   // Công cụ máy chủ cho từng lượt (MCP nội bộ). Đợt 1, 2 thêm kiem_link, tai_hinh, tra_cuu theo loại bước.
   const labKeys = new Map(); // khoá của lượt chạy → { entry, agent, tools }
   function labToolsFor(agent, kind) {
     if (!config.labTools || agent.engine !== 'claude' || agent.labTools === false) return [];
     return ['soat_loi'];
   }
   function labCtx(lab) {
     return {
       read: rel => readWs(rel), exists: rel => wsExists(rel), lint: rel => lintFiles([rel]), listImages: rel => listedImages(rel),
       hasImages: rel => { const a = insideWorkspace(rel); try { return !!a && fs.readdirSync(a).some(n => IMG_EXT.test(n)); } catch { return false; } },
       entry: lab.entry, agent: lab.agent
     };
   }
   ```
4. `startRun`, theo đúng thứ tự (giữ nguyên phần còn lại):
   1. ngay sau `ensureWorkspace()`: `const lab = labToolsFor(agent, opts.kind);`;
   2. nếu `lab.length`:
      - tạo `labKey = crypto.randomBytes(16).toString('hex')`;
      - ghi file `mcpFile = path.join(stateDir(), 'mcp', `${stamp(startedAt)}-${agent.id}.json`)` (tạo thư mục `mcp/` nếu chưa có) với nội dung
        `{ mcpServers: { yogalab: { type: 'stdio', command: process.execPath, args: [path.join(ROOT, 'mcp', 'yogalab-mcp.js')], env: { YOGALAB_URL: `http://${HOST}:${PORT}`, YOGALAB_KEY: labKey } } } }`;
      - ghi lỗi thì `running.delete(agent.id)` rồi ném lỗi, giống cách đang xử lý lỗi `ensureWorkspace`;
   3. `buildPrompt(…, opts.kind, lab)` và `cliArgs(agent, opts.maxTurns, opts.effort, opts.kind, lab, mcpFile)`;
   4. sau khi tạo `entry`: nếu có `labKey` thì đặt `entry.labKey = labKey`, `entry.mcpFile = mcpFile`, rồi `labKeys.set(labKey, { entry, agent, tools: lab })`. Làm việc này **trước** `spawnInto`.
5. `cliArgs(agent, maxTurns, effort, kind, lab = [], mcpFile = null)`, nhánh Claude: thay dòng `if (config.skipMcp && !agent.useMcp) args.push('--strict-mcp-config');` bằng:
   ```js
   if (mcpFile) { args.push('--mcp-config', mcpFile); if (!agent.useMcp) args.push('--strict-mcp-config'); }
   else if (config.skipMcp && !agent.useMcp) args.push('--strict-mcp-config');
   ```
   Dùng đường dẫn file, không dùng chuỗi JSON: `quoteWinArg` từ chối dấu nháy kép trên Windows.
6. `claudeToolsOf(agent, kind, lab = [])`: cuối hàm, nếu `lab.length` thì thêm `'mcp__yogalab'` vào danh sách.
7. `finishRun`: nếu có `entry.labKey` thì `labKeys.delete(entry.labKey)` và xoá `entry.mcpFile` (bỏ qua lỗi).
   Khi khởi động, xoá mọi file còn sót trong `.yogalab/mcp/`.
8. Router, trước các route `/api/plan`:
   ```js
   if (req.method === 'POST' && p.startsWith('/api/lab/')) {
     const b = await readBody(req);
     const lab = labKeys.get(String(b.key || ''));
     if (!lab) return send(res, 403, { error: 'Khoá không hợp lệ hoặc lượt chạy đã xong' });
     const what = p.slice('/api/lab/'.length);
     if (what === '_list') return send(res, 200, { tools: congCu.danhSach(lab.tools) });
     if (what === '_call') return send(res, 200, await congCu.goi(String(b.name || ''), b.args || {}, labCtx(lab), lab.tools));
     return send(res, 404, { error: 'Không có' });
   }
   ```
9. `describeTool`: thêm 4 dòng, **trước** các dòng `mcp__claude-in-chrome`:
   ```js
   if (n === 'mcp__yogalab__soat_loi') return { kind: 'read', text: `Máy soát ${short(input.file)}` };
   if (n === 'mcp__yogalab__kiem_link') return { kind: 'web', text: `Kiểm ${(input.urls || []).length} link` };
   if (n === 'mcp__yogalab__tai_hinh') return { kind: 'write', text: `Tải hình ${short(input.ten || input.link)}` };
   if (n === 'mcp__yogalab__tra_cuu') return { kind: 'read', text: `Tra bộ não: ${short(input.tu_khoa)}` };
   ```
10. `buildPrompt(agent, task, handoffPath, attachments, kind, lab = [])`: nếu `lab.includes('soat_loi')`, thêm khối sau, ngay **trước** `HƯỚNG DẪN RIÊNG CHO VAI CỦA BẠN`:
    ```
    CÔNG CỤ CỦA MÁY CHỦ (gọi như công cụ thường):
    - soat_loi(file): soát lỗi máy móc và đếm chữ từng trang của một file .md; với slides.md, thiet-ke.md còn đối chiếu hai file và kiểm file hình. Trước khi bàn giao, gọi soat_loi cho từng file sản phẩm bạn vừa ghi hoặc sửa, rồi sửa những chỗ đúng là lỗi.
    - Không có Bash: đừng thử chạy lệnh, script hay python. Việc máy móc thì dùng công cụ trên.
    ```
11. Tạo `.gitignore` ở gốc repo với một dòng: `workspace/.yogalab/mcp/`.

**Xong khi:**
- `npm test` qua, và thử khởi động như README không lỗi.
- Với `labTools: false`, lệnh `claude` sinh ra **y hệt trước** (không có `--mcp-config`, không có `mcp__yogalab`). Kiểm bằng cách đọc lại code, vì ở đây không chạy được Claude Code.

---

## 0.14 Cập nhật README.md

1. Bảng `config.json`, thêm 2 dòng:

   | Mục | Ý nghĩa |
   |---|---|
   | `labTools` | Cho agent Claude gọi công cụ của máy chủ qua MCP nội bộ (soát lỗi, đếm chữ, đối chiếu slides với thiết kế). Mặc định tắt; bật sau khi thử trên máy |
   | `chromePreflight` | Trước khi giao việc cho agent dùng Chrome, máy chủ thử kết nối bằng một lượt rất ngắn; hỏng thì tạm dừng dự án và báo cách sửa. Mặc định bật |

2. Mục "Một vài mẹo khác": thay dòng `Giữ workspace/index.md ngắn. Mọi agent đều đọc nó đầu tiên.` bằng
   `workspace/index.md do máy chủ tự cập nhật (dự án gần đây, sản phẩm mới nhất). Đừng sửa tay; bản cũ nằm ở workspace/luu-tru/index-cu.md.`
3. Bước 6 của mục "Giao cả dự án…" (Hỏi chủ dự án), thêm câu:
   `Câu hỏi giống câu đã trả lời trong cùng dự án thì nhóm không hỏi lại. Câu giống câu bạn đã trả lời ở dự án trước thì ô trả lời được điền sẵn câu cũ. Mọi quyết định được ghi vào workspace/tri-thuc/quyet-dinh.md.`
4. Thêm vào mục "Ghi chú": `Agent báo lỗi môi trường (Chrome, đăng nhập, hạn mức) thì dự án tạm dừng kèm cách sửa, không hiện thành câu hỏi cho bạn.`

---

## Xong Đợt 0 khi

- `npm test` qua hết. `node --check server.js` không lỗi. Thử khởi động không lỗi.
- Đã khởi động máy chủ một lần trên workspace thật. Kết quả:
  - `index.md` mới dưới 30 dòng; `luu-tru/index-cu.md` giữ bản cũ;
  - `.yogalab/quyet-dinh.json` và `tri-thuc/quyet-dinh.md` được tạo từ 27 câu trả lời cũ.

  Đây là những thay đổi dữ liệu duy nhất của đợt này trong `workspace/`. Commit riêng, tiêu đề `0.9–0.10 dữ liệu: bản đồ và sổ quyết định do máy chủ sinh`.
- Chủ dự án làm phần **Đợt 0** trong [thu-tren-may.md](thu-tren-may.md).

## Phát hiện thêm

(Người triển khai ghi vào đây những gì thấy mà đặc tả chưa nói, và lựa chọn đã làm.)

- Đã biết, chưa sửa: trong `DEFAULT_CONFIG`, chú thích `// máy soát: số chữ tối đa…` đang nằm nhầm ở dòng `agyBrainDir`.
  Có thể dời về dòng `lintMaxWords` khi sửa gần đó.
- 0.9 `INDEX_TEMPLATE`: bỏ cả dòng tiêu đề `## File quan trọng`, không chỉ dòng `(agent tự thêm…)`.
  Nếu còn tiêu đề này thì workspace mới tinh cũng bị `writeIndex` chép bản mẫu rỗng sang `luu-tru/index-cu.md`.
- 0.9 Chủ đề trong `output/` không có file `.md` nằm ngay trong thư mục (vd `output/thu-anh/` chỉ có ảnh) vẫn được liệt kê, ghi `(chưa có file .md)`.
- 0.9 `index.md` trong commit dữ liệu được sinh trên bản sao của repo, nơi mọi file có cùng giờ sửa, nên thứ tự "Sản phẩm mới nhất" chưa đúng thực tế.
  Máy chủ trên máy thật ghi lại theo giờ sửa thật ngay lần khởi động đầu.
- Commit dữ liệu được sinh trên **bản sao** workspace đã bỏ `resumeAt`: dự án `plan-20261019-193827` đang hẹn tự chạy tiếp (`resumeAt` 2026-10-19T17:32Z, đã qua),
  nên khởi động thẳng trên workspace thật sẽ gọi `claude` và đổi `plans.json`. Trên máy thật, dự án này sẽ **tự chạy tiếp khoảng 3 giây sau khi mở máy chủ** (hành vi có từ trước).
- 0.10 27 câu trả lời cũ gộp thành 19 quyết định (câu giống nhau cùng chủ đề giữ bản mới nhất); chỉ 1 là câu bạn trả lời, 18 là nhóm tự quyết.
  Trong đó có câu cũ "Vui lòng cấp quyền Chrome…" (câu hỏi môi trường từ trước 0.11). Nó là tự quyết của suy-giap-v6 nên không đưa vào kế hoạch chủ đề khác.
- 0.10 `vietSoQuyetDinh`: nhóm có quyết định mới nhất lên trước; trong nhóm xếp theo số `QD-`. `answerPlan` bỏ trường `goiY` khỏi câu trả lời lưu vào `plan.answers`.
- 0.12 `henTaiLai`: thêm một dòng chặn khi `downloadSourceImages` trả `null` hoặc `{ none: true }` (không có `ok`/`fail`), nếu không sẽ lỗi trong `setTimeout`.
- 0.13C `startRun`: nếu `spawnInto` lỗi thì xoá luôn khoá trong `labKeys` và file `.yogalab/mcp/…` (đặc tả không nói).
  File cấu hình MCP được ghi sau khi có `startedAt` (tên file cần `stamp(startedAt)`), không phải ngay sau `ensureWorkspace()`.
- 0.13C Đã thử trọn đường ống trên bản sao workspace với `labTools: true` và một lệnh `claude` giả: lượt chạy gọi được `soat_loi` qua `mcp/yogalab-mcp.js`,
  nhận kết quả thật (v6: trang 17 "tường", trang 22 "bolster"), và `.yogalab/mcp/` được dọn sau lượt. Claude Code thật thì chưa thử.
- 0.14 README: sửa thêm dòng `index.md` trong sơ đồ folder thành "bản đồ ngắn do máy chủ viết".
