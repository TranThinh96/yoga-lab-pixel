# Đợt 1 · Sổ vấn đề, giao đúng người, công cụ kiểm link và tải hình

Đọc [README.md](README.md) trước. Cần Đợt 0 đã xong (dùng `lib/van-ban.js`, `planTopic`, đường ống MCP, `s.fileSua`).

**Mục tiêu đợt:**
- Người duyệt, người sửa và máy chủ nói chung một ngôn ngữ: bảng cố định cột.
- Lỗi nằm trong file của ai thì người đó sửa. Hết cảnh "CẦN GIAO LAM" treo qua nhiều vòng.
- Bước duyệt lại chỉ kiểm những vấn đề còn mở.
- Agent nhắn được cho nhau qua bàn giao. Điều phối viên chỉ được gọi giữa chừng khi có tín hiệu cần xử lý.
- Thêm công cụ `kiem_link` và `tai_hinh` cho agent.

**Công tắc mới** (thêm vào `DEFAULT_CONFIG`, kèm chú thích một dòng):
- `issueLedger: true`: sổ vấn đề và giao sửa theo chủ file. `false` thì vòng duyệt chạy y như trước Đợt 1.
- `maxCheckins: 3`: số lần tối đa điều phối viên được gọi giữa chừng. `0` là tắt.

| Mục | Việc | File chính |
|---|---|---|
| 1.1 | Bộ đọc bảng và trạng thái vấn đề | `lib/van-de.js` |
| 1.2 | Ghi sổ vấn đề từ bước duyệt; lời dặn người duyệt | `server.js` (`pumpPlan`, `emitPlan`, `boardText`, `insertSteps`) |
| 1.3 | Giao sửa theo chủ file | `server.js` (`handleReview`) |
| 1.4 | Bước sửa nhận danh sách vấn đề và báo lại từng mã | `server.js` (`pumpPlan`) |
| 1.5 | Duyệt lại hẹp | `server.js` (`pumpPlan`, `handleReview`) |
| 1.6 | Nhắn đồng đội, tin cho cả nhóm | `lib/van-de.js`, `server.js` (`buildPrompt`, `pumpPlan`, `boardText`) |
| 1.7 | Hình tải hỏng thì tự giao người đề xuất link thay link khác | `server.js` (`pumpPlan`) |
| 1.8 | Giao ban: gọi điều phối viên khi có tín hiệu | `server.js` |
| 1.9 | Công cụ `kiem_link` | `lib/cong-cu.js`, `server.js` |
| 1.10 | Công cụ `tai_hinh` | `lib/cong-cu.js`, `server.js` |
| 1.11 | Giao diện: số vấn đề trên thẻ, danh sách trong ngăn chi tiết | `public/index.html` |
| 1.12 | Cập nhật README.md | `README.md` |

---

## 1.1 `lib/van-de.js`: bộ đọc bảng và trạng thái vấn đề

Chép thêm vào `test/fixtures/` các file `van-de-mau.md`, `da-xu-ly-mau.md`, `duyet-lai-mau.md`, `tin-nhan-mau.md` trong `docs/trien-khai/fixtures/`.

Tạo `lib/van-de.js` như dưới. Code này đã được chạy thử trên các file mẫu đó, cho đúng kết quả ở phần kiểm thử.

```js
'use strict';
// Sổ vấn đề: đọc bảng của người duyệt / người sửa, giữ trạng thái từng vấn đề, tìm người phụ trách file.
const { boDau } = require('./van-ban');

const LOAI_LOI = ['thieu-nguon', 'nguon-khong-khop', 'phong-dai', 'an-toan-thieu-ccd', 'lech-hai-file', 'file-khong-ton-tai', 'anh-sai-tu-the',
  'anh-sai-thu-muc', 'chinh-ta-dau-cau', 'qua-chu', 'thieu-muc-brief', 'link-chet', 'bao-cao-sai-su-that', 'khac'];
const khoa = s => boDau(s).replace(/[^a-z0-9]+/g, ' ').trim();

// Bảng Markdown ngay dưới tiêu đề: [{ <tên cột đã bỏ dấu>: giá trị }]. Không có tiêu đề: null.
function docBang(text, tieuDeRe) {
  const lines = String(text || '').normalize('NFC').split(/\r?\n/);
  const i = lines.findIndex(l => tieuDeRe.test(l.trim()));
  if (i < 0) return null;
  const rows = [];
  for (const l of lines.slice(i + 1)) {
    if (/^#{1,6}\s/.test(l.trim())) break;
    if (!/^\s*\|/.test(l)) { if (rows.length) break; continue; } // chữ trước bảng thì bỏ qua, hết bảng thì dừng
    if (/^\s*\|[\s:|-]+\|\s*$/.test(l)) continue;
    rows.push(l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim()));
  }
  if (rows.length < 2) return [];
  const head = rows[0].map(khoa);
  return rows.slice(1).map(r => Object.fromEntries(head.map((h, k) => [h, r[k] || ''])));
}

// "## Danh sách vấn đề" của người duyệt. Không có bảng: null (để biết người duyệt không theo mẫu)
function docVanDe(text) {
  const rows = docBang(text, /^#{2,3}\s*Danh sách vấn đề(?![\p{L}\p{N}])/iu);
  if (!rows) return null;
  return rows.map((r, k) => {
    const loai = boDau(r['loai']).trim().replace(/\s+/g, '-').replace(/[^a-z-]/g, '');
    return { ma: r['ma'] || `V${k + 1}`, file: (r['file'] || '').replace(/`/g, '').trim(), viTri: r['vi tri'] || '',
      muc: /bat buoc/.test(khoa(r['muc'])) ? 'BẮT BUỘC' : 'NÊN', loai: LOAI_LOI.includes(loai) ? loai : 'khac',
      moTa: r['van de'] || '', deXuat: r['de xuat'] || '' };
  }).filter(v => v.moTa || v.file);
}

// "## Đã xử lý" của người sửa
function docDaXuLy(text) {
  const rows = docBang(text, /^#{2,3}\s*Đã xử lý(?![\p{L}\p{N}])/iu);
  return (rows || []).filter(r => r['ma']).map(r => ({ ma: r['ma'].trim(), ketQua: /khong/.test(khoa(r['ket qua'])) ? 'khong-sua' : 'da-sua', ghiChu: r['ghi chu'] || '' }));
}

// "## Kết quả duyệt lại" của người duyệt lại
function docDuyetLai(text) {
  const rows = docBang(text, /^#{2,3}\s*Kết quả duyệt lại(?![\p{L}\p{N}])/iu);
  return (rows || []).filter(r => r['ma']).map(r => ({ ma: r['ma'].trim(), dong: !/con loi/.test(khoa(r['ket luan'])) && /dong/.test(khoa(r['ket luan'])), ghiChu: r['ghi chu'] || '' }));
}

function mucTrong(text, tieuDeRe) {
  const lines = String(text || '').normalize('NFC').split(/\r?\n/), i = lines.findIndex(l => tieuDeRe.test(l.trim()));
  if (i < 0) return [];
  const out = [];
  for (const l of lines.slice(i + 1)) { if (/^#{1,6}\s/.test(l.trim())) break; out.push(l); }
  return out;
}

// "## Gửi đồng đội" (dòng "@id: nội dung") và "## Cho cả nhóm biết" (mỗi dòng một ý)
function docTinNhan(text) {
  const gui = mucTrong(text, /^#{2,3}\s*Gửi đồng đội(?![\p{L}\p{N}])/iu)
    .map(l => /^\s*(?:[-*•]\s*)?@([\p{L}\p{N}_-]+)\s*[:：]\s*(.+)$/u.exec(l)).filter(Boolean)
    .map(m => ({ to: m[1], text: m[2].trim().slice(0, 400) }));
  const chung = mucTrong(text, /^#{2,3}\s*Cho cả nhóm biết(?![\p{L}\p{N}])/iu).map(l => l.replace(/^\s*[-*•]\s*/, '').trim())
    .filter(s => s && !/^\(?\s*(không|không có|chưa có)\s*[.)]?$/iu.test(s)).map(s => s.slice(0, 400));
  return { gui: gui.slice(0, 5), chung: chung.slice(0, 5) };
}

// Đường dẫn người duyệt ghi ("slides.md", "`output/x/slides.md:120`") về dạng đầy đủ trong workspace
function chuanHoaFile(file, chuDe) {
  let f = String(file || '').replace(/`/g, '').trim().replace(/\\/g, '/').replace(/^\.\//, '').replace(/:\d+(-\d+)?$/, '');
  if (!f) return '';
  if (chuDe && f.startsWith(chuDe + '/')) return 'output/' + f;
  if (chuDe && !f.includes('/')) return `output/${chuDe}/${f}`;
  return f;
}

// Chủ của một file: người làm bước gần nhất (trước vị trí beforeIdx, đánh số từ 0) đã ghi file đó; bước duyệt không tính.
// Ảnh trong .../hinh/: người gần nhất đã đưa ảnh vào thư mục đó.
function chuFile(steps, file, beforeIdx) {
  for (let i = beforeIdx - 1; i >= 0; i--) {
    const s = steps[i];
    if (s.status === 'done' && !s.checks && [...(s.files || []), ...(s.images || [])].includes(file)) return { agentId: s.agentId, step: i + 1 };
  }
  const dir = file.replace(/[^/]+$/, '');
  if (/\/hinh\/$/.test(dir)) for (let i = beforeIdx - 1; i >= 0; i--) {
    const s = steps[i];
    if (s.status === 'done' && (s.images || []).some(f => f.startsWith(dir))) return { agentId: s.agentId, step: i + 1 };
  }
  return null;
}

// Vấn đề mới từ bảng của người duyệt; mã chung VD-<n> trong cả dự án (state = kế hoạch)
function ganVanDe(state, rows, { buoc, tu, chuDe, chuFileFn }) {
  state.issues = state.issues || []; state.issueSeq = state.issueSeq || 0;
  const moi = rows.map(r => {
    const file = chuanHoaFile(r.file, chuDe), chu = file ? chuFileFn(file) : null;
    return { id: `VD-${++state.issueSeq}`, maGoc: r.ma, file, where: r.viTri, level: r.muc, kind: r.loai, text: r.moTa, fix: r.deXuat,
      from: tu, owner: chu ? chu.agentId : null, ownerStep: chu ? chu.step : null, status: 'mo', note: '', round: 0, lastStep: buoc, fixStep: null };
  });
  state.issues.push(...moi);
  return moi;
}

// Nhóm vấn đề theo chủ file; step = bước mới nhất của chủ đó có liên quan
function nhomTheoChu(issues) {
  const nhom = new Map(), khongChu = [];
  for (const v of issues) {
    if (!v.owner) { khongChu.push(v); continue; }
    const g = nhom.get(v.owner) || { step: 0, issues: [] };
    g.step = Math.max(g.step, v.ownerStep || 0); g.issues.push(v); nhom.set(v.owner, g);
  }
  return { nhom, khongChu };
}

// Sau bước sửa: báo "Đã sửa" mà file không đổi thì vấn đề vẫn mở
function capNhatTuSua(issues, rows, runFiles, issueIds) {
  const byId = new Map(rows.map(r => [r.ma, r]));
  for (const v of issues) {
    if (!issueIds.includes(v.id)) continue;
    const r = byId.get(v.id);
    if (!r) { v.note = 'người sửa không báo'; continue; }
    if (r.ketQua === 'khong-sua') { v.status = 'khong-sua'; v.note = r.ghiChu; continue; }
    if (runFiles.includes(v.file)) { v.status = 'da-sua'; v.note = r.ghiChu; }
    else v.note = 'báo đã sửa nhưng file không đổi';
  }
}

// Sau bước duyệt lại: "Đóng" / "Còn lỗi"; vấn đề đã sửa mà người duyệt không nhắc thì coi như đóng; còn mở thì gắn vào bước này
function capNhatTuDuyetLai(issues, rows, ids, buoc) {
  const byId = new Map(rows.map(r => [r.ma, r]));
  for (const v of issues) {
    if (!ids.includes(v.id)) continue;
    const r = byId.get(v.id);
    if (r) { v.status = r.dong ? 'dong' : 'mo'; if (r.ghiChu) v.note = r.ghiChu; }
    else if (v.status === 'da-sua') v.status = 'dong';
    if (v.status === 'mo') v.lastStep = buoc;
  }
}

const TRANG_THAI = { mo: 'Mở', 'da-sua': 'Đã sửa, chờ duyệt lại', 'khong-sua': 'Không sửa', dong: 'Đóng' };
// Bản xem trong Obsidian: du-an/<mã>/van-de.md
function vietSoVanDe(plan, ten) {
  const cell = s => String(s || '').replace(/\|/g, '/').replace(/\s+/g, ' ').trim();
  const L = [`# Sổ vấn đề · ${plan.id}`, '', '> Máy chủ tự sinh từ các bảng "Danh sách vấn đề", "Đã xử lý", "Kết quả duyệt lại". Đừng sửa tay.', '',
    '| Mã | Trạng thái | Mức | Loại | File · vị trí | Vấn đề | Người sửa | Ghi chú |', '|---|---|---|---|---|---|---|---|'];
  for (const v of plan.issues || []) L.push(`| ${v.id} | ${TRANG_THAI[v.status] || v.status} | ${v.level} | ${v.kind} | ${cell(v.file)}${v.where ? ' · ' + cell(v.where) : ''} | ${cell(v.text)} | ${v.owner ? cell(ten(v.owner)) : '(chưa rõ)'} | ${cell(v.note)} |`);
  return L.join('\n') + '\n';
}

module.exports = { LOAI_LOI, TRANG_THAI, docBang, docVanDe, docDaXuLy, docDuyetLai, docTinNhan, chuanHoaFile, chuFile,
  ganVanDe, nhomTheoChu, capNhatTuSua, capNhatTuDuyetLai, vietSoVanDe };
```

**Kiểm thử `test/van-de.test.js`** (kết quả đã chạy thử):

1. `docVanDe(van-de-mau.md)` cho 4 vấn đề. Bảng "TC" phía trên không bị đọc nhầm.

   | ma | file | muc | loai |
   |---|---|---|---|
   | V1 | `output/thu/slides.md` | BẮT BUỘC | `chinh-ta-dau-cau` |
   | V2 | `output/thu/thiet-ke.md` | BẮT BUỘC | `lech-hai-file` (viết "Lệch hai file" vẫn nhận) |
   | V3 | `slides.md` | NÊN | `khac` ("thuật ngữ" không có trong danh mục) |
   | V4 | `output/thu/hinh/trang-17-ghe.png` | BẮT BUỘC (viết "Bắt buộc") | `anh-sai-tu-the` |

   Thêm: `docVanDe('không có bảng')` là `null`; `docVanDe('## Danh sách vấn đề\nKhông có lỗi.\n')` là `[]`.
2. `docDaXuLy(da-xu-ly-mau.md)`:
   `[{ma:'VD-1', ketQua:'da-sua', …}, {ma:'VD-3', ketQua:'khong-sua', ghiChu:'"gối kê" đúng thuật ngữ trong mẫu'}, {ma:'VD-9', ketQua:'da-sua', …}]`.
3. `docDuyetLai(duyet-lai-mau.md)`: `[{ma:'VD-1', dong:true, ghiChu:''}, {ma:'VD-3', dong:false, ghiChu:'vẫn dùng "gối" ở tr.22'}]`.
   Cùng file đó, `docVanDe` cho 1 vấn đề mới.
4. `docTinNhan(tin-nhan-mau.md)`:
   - `gui`: 4 tin, tới `lam`, `Vy`, `ai-do`, `chef`. Dòng `@chef:` không có gạch đầu dòng vẫn nhận.
   - `chung`: `['NICE trả 403 cho công cụ tải trang; Mayo mở được qua Chrome.']`. Dòng "Không" bị bỏ.
5. `chuanHoaFile`, với chủ đề `thu`:
   - `` '`slides.md`' `` → `output/thu/slides.md`;
   - `'output/thu/slides.md:120'` → `output/thu/slides.md`;
   - `'thu/thiet-ke.md'` → `output/thu/thiet-ke.md`;
   - `'agents/an/a.md'` giữ nguyên.
6. `chuFile` với các bước mẫu:
   ```js
   const steps = [
     { agentId: 'mai', status: 'done', files: ['agents/mai/thu-nguon.md'] },
     { agentId: 'an', status: 'done', checks: 1, files: ['agents/an/thu-kiem.md'] },
     { agentId: 'lam', status: 'done', files: ['output/thu/slides.md'] },
     { agentId: 'vy', status: 'done', files: ['output/thu/thiet-ke.md'] },
     { agentId: 'nhi', status: 'done', files: [], images: ['output/thu/hinh/trang-16-a.png'] },
     { agentId: 'ha', status: 'done', checks: 4, files: ['agents/ha/thu-duyet.md'] }
   ];
   ```
   - `chuFile(steps, 'output/thu/slides.md', 5)` → `{ agentId: 'lam', step: 3 }`;
   - `chuFile(steps, 'output/thu/hinh/trang-17-ghe.png', 5)` → `{ agentId: 'nhi', step: 5 }` (cùng thư mục `hinh/`);
   - `chuFile(steps, 'agents/an/thu-kiem.md', 5)` → `null` (bước duyệt không làm chủ);
   - `chuFile(steps, 'output/thu/thiet-ke.md', 3)` → `null` (chỉ xét bước trước vị trí 3).
7. `ganVanDe({}, docVanDe(van-de-mau.md), { buoc: 6, tu: 'ha', chuDe: 'thu', chuFileFn: f => chuFile(steps, f, 5) })` tạo `VD-1`…`VD-4`, chủ lần lượt là `lam`, `vy`, `lam`, `nhi`.
   `nhomTheoChu` của các vấn đề BẮT BUỘC chia thành 3 nhóm: `lam` [VD-1], `vy` [VD-2], `nhi` [VD-4].
8. `capNhatTuSua`:
   - với `docDaXuLy(da-xu-ly-mau.md)`, `runFiles = ['output/thu/slides.md']`, `issueIds = ['VD-1','VD-3']`:
     VD-1 thành `da-sua`, VD-3 thành `khong-sua` (ghi chú là lý do), VD-9 bị bỏ qua;
   - với `runFiles = []`: VD-1 vẫn `mo`, ghi chú `báo đã sửa nhưng file không đổi`;
   - với `rows = []`, `issueIds = ['VD-2']`: VD-2 vẫn `mo`, ghi chú `người sửa không báo`.
9. `capNhatTuDuyetLai`. Trước khi gọi: VD-1, VD-2 là `da-sua`; VD-3 là `khong-sua`; VD-4 là `mo`.
   Gọi với `docDuyetLai(duyet-lai-mau.md)`, `ids` = 4 mã, `buoc = 10`. Kết quả:
   - VD-1 `dong`;
   - VD-2 `dong` (đã sửa, người duyệt không nhắc);
   - VD-3 `mo`, `lastStep` 10;
   - VD-4 `mo`, `lastStep` 10.

---

## 1.2 Ghi sổ vấn đề từ bước duyệt

**Dữ liệu trên kế hoạch** (lưu cùng `plans.json`):
- `plan.issues`: mảng vấn đề (dạng `ganVanDe` tạo ra);
- `plan.issueSeq`: số đếm mã;
- `plan.messages`, `plan.notes`: thêm ở 1.6.

**Làm**
1. `server.js`: require các hàm của `lib/van-de.js`; thêm `const issuesPath = plan => `${projDir(plan)}/van-de.md`;`.
2. Hàm đọc mọi chữ agent để lại trong một lượt, để tìm bảng:
   ```js
   // Bảng có thể nằm trong bàn giao, câu trả lời cuối, hoặc file nhận xét agent ghi trong agents/
   function chuCuaLuot(run, handoffText, full) {
     const files = (run.files || []).filter(f => /^agents\/[^/]+\/.+\.md$/.test(f) && !/\/kinh-nghiem\.md$/.test(f));
     return [handoffText, full || run.summary || '', ...files.map(readWs)].filter(Boolean).join('\n\n');
   }
   ```
3. `onDone` của `pumpPlan`, khi bước xong:
   - ghi ảnh của bước:
     `s.images = [...new Set([...(s.images || []), ...(run.files || []).filter(f => /\/hinh(-nguon)?\/[^/]+\.(png|jpe?g|webp|svg)$/i.test(f))])].slice(0, 60);`
   - tính `const banGhi = chuCuaLuot(run, handoffText, full);` rồi gọi `handleReview(plan, idx, text, banGhi)` (thêm tham số thứ tư).
4. `insertSteps`: sau vòng dời `from/checks/fixOf/latest`, dời luôn:
   ```js
   for (const v of plan.issues || []) for (const f of ['lastStep', 'fixStep', 'ownerStep']) if (v[f]) v[f] = sh(v[f]);
   for (const m of plan.messages || []) if (m.step) m.step = sh(m.step);
   ```
5. `emitPlan`: nếu `plan.issues && plan.issues.length`, ghi thêm `issuesPath(plan)` = `vietSoVanDe(plan, id => tên agent)`, cùng chỗ đang ghi bảng dự án.
6. `boardText`: sau mục "Các bước", thêm (khi có vấn đề):
   ```
   ## Vấn đề
   - Còn mở: <số mo> (BẮT BUỘC: <số>) · Không sửa: <số> · Đóng: <số> · chi tiết: du-an/<mã>/van-de.md
   ```
7. Lời dặn người duyệt (khối `ĐÂY LÀ BƯỚC DUYỆT` trong `pumpPlan`), khi `config.issueLedger !== false`. Thay đúng dòng
   `` `- Không sửa sản phẩm của người khác. Ghi nhận xét vào agents/${agent.id}/: mỗi lỗi một dòng gồm vị trí (trang/mục), vấn đề, mức (BẮT BUỘC / NÊN), cách sửa đề xuất.`, ``
   bằng hai dòng:
   ```
   - Không sửa sản phẩm của người khác. Ghi nhận xét vào một file trong agents/<id>/. Trong file đó có bảng đúng tiêu đề "## Danh sách vấn đề" với đúng các cột: | Mã | File | Vị trí | Mức | Loại | Vấn đề | Đề xuất |
     Mã: V1, V2… · File: đường dẫn file có lỗi (vd output/<chu-de>/slides.md; lỗi ở file nào ghi đúng file đó, máy chủ tự giao cho người phụ trách file) · Vị trí: trang, mục · Mức: BẮT BUỘC hoặc NÊN · Loại: một trong <LOAI_LOI nối bằng ", "> · Vấn đề, Đề xuất: mỗi ô một câu ngắn.
   ```
   `<id>` là `agent.id`. `<LOAI_LOI …>` là `LOAI_LOI.join(', ')`.
8. Dặn thêm cho đúng kiểu: bảng có cột `|` nên ô không được chứa ký tự `|`. Thêm câu `Trong ô không dùng ký tự "|".` vào cuối dòng thứ hai ở trên.

---

## 1.3 Giao sửa theo chủ file

Thay toàn bộ `handleReview` bằng bản dưới. Khi `issueLedger` tắt, hoặc không đọc được bảng, hàm chạy y như cũ: trả về người làm bước được duyệt.

```js
// Người duyệt kết luận CẦN SỬA: chèn một bước sửa cho từng chủ file còn vấn đề BẮT BUỘC, rồi một bước duyệt lại
function handleReview(plan, idx, text, banGhi = '') {
  const s = plan.steps[idx], n = idx + 1;
  const v = parseVerdict(text);
  const name = id => (config.agents.find(a => a.id === id) || {}).name || id;
  if (!v) plan.log.push(`Bước ${n}: ${name(s.agentId)} không ghi "KẾT LUẬN", coi như đạt`);
  s.verdict = v || 'pass';
  const soVanDe = config.issueLedger !== false;
  if (soVanDe) {
    if (s.round) capNhatTuDuyetLai(plan.issues || [], docDuyetLai(banGhi), (plan.issues || []).filter(x => s.from.includes(x.fixStep)).map(x => x.id), n);
    const rows = docVanDe(banGhi);
    if (rows) ganVanDe(plan, rows, { buoc: n, tu: s.agentId, chuDe: planTopic(plan), chuFileFn: f => chuFile(plan.steps, f, idx) });
    else if (!s.round) plan.log.push(`Bước ${n}: không thấy bảng "Danh sách vấn đề" của ${name(s.agentId)}`);
    const moBB = (plan.issues || []).filter(x => x.status === 'mo' && x.level === 'BẮT BUỘC' && x.lastStep === n);
    if (s.verdict === 'pass' && moBB.length) plan.log.push(`Bước ${n}: kết luận ĐẠT nhưng còn ${moBB.length} vấn đề BẮT BUỘC mở`);
  }
  if (s.verdict !== 'fix') return;
  const target = plan.steps[s.checks - 1];
  const round = (s.round || 0) + 1;
  // Vấn đề BẮT BUỘC đang mở của bước này, nhóm theo chủ file; vấn đề NÊN của cùng chủ đi kèm
  const mo = soVanDe ? (plan.issues || []).filter(x => x.status === 'mo' && x.lastStep === n) : [];
  const { nhom, khongChu } = nhomTheoChu(mo.filter(x => x.level === 'BẮT BUỘC'));
  for (const x of mo.filter(x => x.level !== 'BẮT BUỘC' && nhom.has(x.owner))) nhom.get(x.owner).issues.push(x);
  if (khongChu.length) plan.log.push(`Bước ${n}: ${khongChu.length} vấn đề không rõ ai phụ trách file (${khongChu.map(x => x.id).join(', ')})`);
  if (!nhom.size) nhom.set(target.agentId, { step: s.checks, issues: [] }); // không đọc được bảng: trả về người làm như cũ
  const chu = [...nhom].sort((a, b) => (a[0] === target.agentId ? -1 : b[0] === target.agentId ? 1 : a[1].step - b[1].step));
  if (round > cfgNum('maxReviewRounds', 2) || plan.steps.length + chu.length + 1 > cfgNum('maxTotalSteps', 20)) {
    s.verdict = 'fix-left';
    plan.log.push(`Bước ${n}: vẫn CẦN SỬA nhưng đã hết vòng sửa → chuyển tiếp, để nghiệm thu xử lý`);
    return;
  }
  const fixes = chu.map(([agentId, g]) => ({ agentId, from: [g.step, n], fixOf: g.step, round, kind: 'fix', issueIds: g.issues.map(x => x.id), ...blankStep,
    task: g.issues.length ? `Sửa các vấn đề ${name(s.agentId)} giao cho bạn: ${g.issues.map(x => x.id).join(', ')} (danh sách chi tiết kèm theo).`
      : `Sửa sản phẩm của bước ${s.checks} theo nhận xét của ${name(s.agentId)} (bàn giao bước ${n} và file nhận xét được nêu trong đó). ` +
        `Mỗi nhận xét BẮT BUỘC: sửa, hoặc giải thích rõ vì sao không sửa. Nhận xét NÊN: sửa nếu hợp lý. Sửa thẳng vào file sản phẩm, và trong bàn giao liệt kê từng nhận xét → đã xử lý thế nào.` }));
  const k = Math.max(0, chu.findIndex(([a]) => a === target.agentId));
  const re = { agentId: s.agentId, from: [n, ...fixes.map((_, i) => n + 1 + i)], checks: n + 1 + k, round, ...blankStep,
    task: `Duyệt lại sau khi sửa (vòng ${round}): kiểm các vấn đề trong danh sách kèm theo; chỉ nêu lỗi còn lại hoặc lỗi mới phát sinh.` };
  insertSteps(plan, n, [...fixes, re]);
  fixes.forEach((f, i) => {
    plan.steps[f.fixOf - 1].latest = n + 1 + i;
    for (const x of plan.issues || []) if (f.issueIds.includes(x.id)) { x.fixStep = n + 1 + i; x.round = round; }
  });
  s.latest = n + fixes.length + 1;
  plan.log.push(`Bước ${n}: ${name(s.agentId)} kết luận CẦN SỬA → ${chu.map(([a]) => name(a)).join(', ')} sửa (bước ${n + 1}${fixes.length > 1 ? '–' + (n + fixes.length) : ''}), duyệt lại ở bước ${n + fixes.length + 1}`);
}
```

Lưu ý khi chép:
- `fixOf` của các bước sửa trỏ về bước **trước** `n`. `insertSteps` chỉ dời số lớn hơn `n`, nên `plan.steps[f.fixOf - 1]` vẫn đúng sau khi chèn.
- `planCards` trong giao diện gom thẻ theo `fixOf`/`checks`. Bước Lam sửa `slides.md` sẽ nằm dưới thẻ kịch bản của Lam: đúng ý.

**Kiểm** (đọc code, vì `handleReview` nằm trong `server.js`), với bảng `van-de-mau.md` ở bước duyệt 6 (Hạ duyệt bước 4 của Vy):
- chèn 3 bước sửa theo thứ tự Vy (chủ bước được duyệt) → Lam → Nhi, ở bước 7, 8, 9;
- bước duyệt lại ở bước 10, có `checks: 7` (bước sửa của Vy).

---

## 1.4 Bước sửa nhận danh sách vấn đề và báo lại từng mã

**Làm** trong `pumpPlan`:
1. Khi dựng việc cho bước `kind === 'fix'` có `s.issueIds && s.issueIds.length`: thêm khối sau, ngay sau `s.task`, **trước** khối máy soát của 0.7:
   ```
   VẤN ĐỀ GIAO CHO BẠN (mã do máy chủ đặt; chi tiết trong file nhận xét của người duyệt):
     - <id> · <file> · <where> · <level> · <kind>: <text> → Đề xuất: <fix>
   Mỗi vấn đề BẮT BUỘC: sửa, hoặc giải thích vì sao không sửa. Vấn đề NÊN: sửa nếu hợp lý. Sửa thẳng vào file sản phẩm.
   Trong bàn giao, ghi bảng "## Đã xử lý" với cột | Mã | Kết quả | Ghi chú |; Kết quả là "Đã sửa" hoặc "Không sửa" (Không sửa thì ghi lý do vào Ghi chú). Máy chủ đối chiếu với file bạn thật sự đã ghi.
   ```
   Danh sách lấy từ `plan.issues` lọc theo `s.issueIds`. Bỏ phần `→ Đề xuất: …` khi `fix` rỗng.
2. `onDone` khi bước sửa xong và `config.issueLedger !== false`:
   ```js
   if (kind === 'fix' && (s.issueIds || []).length) {
     capNhatTuSua(plan.issues || [], docDaXuLy(banGhi), run.files || [], s.issueIds);
     const chua = (plan.issues || []).filter(x => s.issueIds.includes(x.id) && x.status === 'mo');
     if (chua.length) plan.log.push(`Bước ${idx + 1}: còn ${chua.length} vấn đề chưa xử lý (${chua.map(x => x.id + (x.note ? ': ' + x.note : '')).join('; ')})`);
   }
   ```
   (`banGhi` tính như 1.2 cho mọi bước xong, không chỉ bước duyệt.)

---

## 1.5 Duyệt lại hẹp

**Làm** trong `pumpPlan`, khối `ĐÂY LÀ BƯỚC DUYỆT`, khi `kind === 'rereview'` và `config.issueLedger !== false`.
Thay đúng dòng bắt đầu bằng `` kind === 'rereview' ? `- Đây là DUYỆT LẠI: `` bằng:
```
- Đây là DUYỆT LẠI. Các vấn đề cần kiểm (mã do máy chủ đặt):
    - <id> · <file> · <where> · <level> · <text><đuôi>
  Ghi bảng "## Kết quả duyệt lại" với cột | Mã | Kết luận | Ghi chú |; Kết luận là "Đóng" hoặc "Còn lỗi". Lỗi mới phát hiện thì thêm bảng "## Danh sách vấn đề" như lần duyệt đầu. Chỉ đọc những chỗ liên quan; không duyệt lại cả file, không mở lại link đã kiểm.
```
- Danh sách: `plan.issues` có `s.from.includes(x.fixStep)`.
- `<đuôi>` theo trạng thái:
  - `da-sua` → ` · người sửa báo: Đã sửa`;
  - `khong-sua` → ` · người sửa báo: Không sửa (<note>)`;
  - `mo` có `note` → ` · CHÚ Ý: <note>`.
- Danh sách rỗng (vd không đọc được bảng ở vòng trước) thì giữ dòng cũ.

Phần cập nhật trạng thái sau duyệt lại đã nằm trong `handleReview` (1.3).

---

## 1.6 Nhắn đồng đội, tin cho cả nhóm

**Làm**
1. `buildPrompt`, sau dòng `` `   "## Vướng mắc", "## Câu hỏi cho chủ dự án" (ghi "Không" nếu không có), "## Gợi ý bước sau".`, ``, thêm:
   ```
      Khi cần, thêm sau mục cuối: "## Gửi đồng đội" (mỗi dòng "@<mã người>: <việc hoặc thông tin cho người đó>") và "## Cho cả nhóm biết" (mỗi dòng một sự thật có ích cho cả nhóm, vd trang web nào chặn công cụ tải trang và cách mở khác). Mã người: <danh sách>.
   ```
   `<danh sách>` là `config.agents.map(a => `${a.id} (${a.name})`).join(', ')`.
2. `onDone` khi bước xong (mọi loại bước):
   ```js
   const tin = docTinNhan(handoffText);
   for (const m of tin.gui) {
     const den = findAgent(m.to);
     if (!den) { plan.log.push(`Bước ${idx + 1}: tin gửi "@${m.to}" không có người nhận`); continue; }
     (plan.messages = plan.messages || []).push({ from: agent.id, to: den.id, text: m.text, step: idx + 1, delivered: false });
   }
   for (const t of tin.chung) (plan.notes = plan.notes || []).push({ from: agent.id, text: t, step: idx + 1 });
   ```
3. Khi dựng việc cho một bước, trong `pumpPlan`:
   - lấy `const tinMoi = (plan.messages || []).filter(m => m.to === agent.id && !m.delivered);`;
   - nếu có, thêm vào cuối `task`:
     ```
     TIN TỪ ĐỒNG ĐỘI:
     - (từ <tên>, bước <step>) <text>
     ```
   - trong `.then(run => …)` sau `startRun` thành công: đặt `delivered = true` cho các tin đó.
4. `boardText`: thêm hai mục khi có dữ liệu, mỗi mục tối đa 15 dòng mới nhất:
   ```
   ## Tin nhắn giữa các bước
   - (bước <step>) <tên gửi> → <tên nhận>: <text>
   ## Cho cả nhóm biết
   - (bước <step>, <tên>) <text>
   ```
5. Kiểm thử: `docTinNhan` đã có ở 1.1. Phần còn lại kiểm bằng cách đọc code.

---

## 1.7 Hình tải hỏng thì tự giao người đề xuất link thay link khác

Ở v6, "máy chủ không tải được 3 hình" treo tới tận nghiệm thu. Ở v7, 7/20 hình hỏng vì tên file Commons không có thật.
Chef đã tự rút bài học "giao tải tay ngay". Đây là luật máy chủ làm được, không cần Chef phải nhớ.

**Làm** trong `pumpPlan`, phần `prep` sau khi tải hình. Chỉ khi `config.issueLedger !== false`:
1. Với mỗi kết quả `r` của `downloadSourceImages(f, …)` (file nguồn `f`) và `downloadListedImages(d)` (file thiết kế `d`), lấy `r.fail` mà `why` không chứa `429` (429 đã có 0.12 lo).
2. Tạo vấn đề trực tiếp, không qua bảng, rồi gom bằng `nhomTheoChu`:
   ```js
   { id: `VD-${++plan.issueSeq}`, file: <f hoặc d>, where: 'Bảng hình', level: 'BẮT BUỘC', kind: 'file-khong-ton-tai',
     text: `Máy chủ không tải được ${x.name}: ${x.why}`,
     fix: 'Thay bằng trang File: Commons có thật (kiểm bằng công cụ kiem_link nếu có) hoặc link thẳng .jpg/.png',
     from: 'may-chu', owner, ownerStep, status: 'mo', note: '', round: 0, lastStep: idx + 1, fixStep: null }
   ```
   `owner`, `ownerStep` lấy từ `chuFile(plan.steps, file, idx + 1)` (tính cả bước vừa xong).
3. Với mỗi chủ, nếu bước ngay sau **chưa phải** bước sửa của người đó cho cùng `fixOf`, và chưa chạm `maxTotalSteps`, chèn một bước sửa ngay sau bước hiện tại:
   ```js
   { agentId: owner, from: [ownerStep], fixOf: ownerStep, round: 0, kind: 'fix', issueIds, ...blankStep,
     task: `Thay các hình máy chủ không tải được: ${issueIds.join(', ')} (danh sách chi tiết kèm theo). Chỉ sửa bảng hình, không làm lại phần khác.` }
   ```
   Dùng `insertSteps(plan, idx + 1, [fix])`, rồi đặt `plan.steps[ownerStep - 1].latest = idx + 2` và `fixStep` của các vấn đề.
   Ghi log: `Máy chủ: <n> hình không tải được → giao <tên> thay link (bước <idx + 2>)`.
4. Bước duyệt kế tiếp của sản phẩm đó sẽ tự đọc bản mới nhất (`latestStep` đã theo `latest`).

---

## 1.8 Giao ban: gọi điều phối viên khi có tín hiệu

**Tín hiệu** (máy chủ tự dò sau mỗi bước xong; bỏ qua nếu bước đó do chính điều phối viên làm):
1. vấn đề **mới** của bước này không có chủ (`owner` null);
2. tin `@<mã điều phối viên>` trong "Gửi đồng đội" (1.6). Tin này không cần chờ giao: điều phối viên đọc ngay trong giao ban;
3. dòng trong mục "## Vướng mắc" của bàn giao khớp `/chưa có file|chưa tải|không tải được|chưa (có|thấy) (ảnh|hình)|chờ máy chủ/iu`.

**Làm**
1. `DEFAULT_CONFIG`: `maxCheckins: 3, // số lần tối đa điều phối viên được gọi giữa chừng khi có tín hiệu (0 = tắt)`.
2. `const checkingIn = new Set();`. Đầu `pumpPlan`: `if (checkingIn.has(plan.id) || chromeChecking.has(plan.id)) return;`.
3. Cuối `onDone` (bước xong), ngay **trước** `emitPlan(plan); pumpPlan(plan);` cuối cùng. Chỉ khi:
   - không đang hỏi chủ dự án;
   - `plan.status === 'running'`;
   - có tín hiệu;
   - `(plan.checkins || 0) < cfgNum('maxCheckins', 3)`.

   Khi đó gọi `return runCheckin(plan, idx, tinHieu);`.
4. `runCheckin`:
   ```js
   function runCheckin(plan, idx, tinHieu) {
     const coord = coordinatorOf(plan);
     if (!coord || running.has(coord.id)) { emitPlan(plan); return pumpPlan(plan); } // không gọi được thì chạy tiếp như thường
     plan.checkins = (plan.checkins || 0) + 1; checkingIn.add(plan.id);
     plan.log.push(`Giao ban sau bước ${idx + 1}: ${tinHieu.length} tín hiệu`);
     emitPlan(plan);
     const done = () => { checkingIn.delete(plan.id); };
     startRun(coord, `Giao ban: ${plan.goal}`, [boardPath(plan), issuesPath(plan)].filter(wsExists), {
       prompt: checkinPrompt(coord, plan, idx, tinHieu), maxTurns: 6, effort: 'low', planId: plan.id, step: 0,
       onDone: (run, full) => {
         done(); addUsage(plan, run);
         if (plan.status !== 'running') return emitPlan(plan);
         const j = jsonBlocks(full || run.summary).find(x => x && Array.isArray(x.chen)) || { chen: [] };
         let them = [];
         try { them = cleanSteps(j.chen.slice(0, 2), idx + 1, teamOf(plan), true); } catch (e) { plan.log.push('Giao ban: bước chèn không hợp lệ: ' + e.message); }
         if (them.length && plan.steps.length + them.length <= cfgNum('maxTotalSteps', 20)) insertSteps(plan, idx + 1, them);
         else them = [];
         plan.log.push(`Giao ban: ${them.length ? 'chèn ' + them.length + ' bước' : 'không chèn bước'}${j.ghi_chu ? ' · ' + String(j.ghi_chu).slice(0, 200) : ''}`);
         emitPlan(plan); pumpPlan(plan);
       }
     }).catch(e => { done(); plan.log.push('Giao ban lỗi: ' + e.message); emitPlan(plan); pumpPlan(plan); });
   }
   ```
5. `checkinPrompt(coord, plan, idx, tinHieu)` trả về đúng nội dung sau (thay phần `<…>`):
   ~~~
   Bạn là <coord.name>, điều phối viên của Yoga Lab. Dự án "<plan.goal>" đang chạy: bước <idx + 1>/<plan.steps.length> vừa xong.
   Máy chủ thấy các tín hiệu cần xử lý:
   - <mỗi tín hiệu một dòng>
   Bảng dự án: <boardPath>. Sổ vấn đề: <issuesPath>. Chỉ đọc những file cần để quyết. Không tự làm việc chuyên môn, không ghi file nào.
   Trả lời: chỉ một khối ```json {"chen":[{"agent":"<id>","task":"<việc cụ thể, có file đầu ra>"}],"ghi_chu":"<1–2 câu>"}```.
   Tối đa 2 bước chèn, chỉ giao cho người trong nhóm (<teamOf(plan) nối bằng ", ">). Không cần chèn thì "chen": [].
   ~~~
   Lưu ý khi viết code: dòng có ```` ```json ```` mà nằm trong template literal (chuỗi dấu `` ` ``) thì phải thoát thành `` \`\`\`json ``.
   Cách dễ hơn là viết dòng đó bằng chuỗi nháy đơn, như `buildPlanPrompt` đang làm.

---

## 1.9 Công cụ `kiem_link`

**Làm**
1. `lib/cong-cu.js`: thêm công cụ. Phần định dạng nằm ở đây; phần mạng do `ctx.kiemMotLink` của máy chủ làm.
   ```js
   const NHAN_LINK = { ok: '✓ mở được', chan: 'BỊ CHẶN', 'khong-co': 'KHÔNG CÓ', captcha: 'CAPTCHA', loi: 'LỖI' };
   async function kiemLink(args, ctx) {
     const urls = [...new Set((Array.isArray(args.urls) ? args.urls : [args.urls]).map(u => String(u || '').trim()).filter(u => /^https?:\/\//i.test(u)))].slice(0, 10);
     if (!urls.length) return { text: 'Chưa có link hợp lệ (cần bắt đầu bằng http:// hoặc https://).', isError: true };
     const kq = await Promise.all(urls.map(u => ctx.kiemMotLink(u).catch(e => ({ ket: 'loi', loi: e.message }))));
     const L = urls.map((u, i) => { const r = kq[i];
       return `- ${u} → ${NHAN_LINK[r.ket] || r.ket}${r.http ? ' (HTTP ' + r.http + ')' : ''}${r.title ? ' · "' + r.title + '"' : ''}${r.license ? ' · ' + r.license : ''}${r.author ? ' · ' + r.author : ''}${r.loi ? ' · ' + r.loi : ''}`; });
     L.push('', 'Chỉ cho biết link mở được hay không. Muốn đối chiếu nội dung vẫn dùng WebFetch. Link bị chặn hay CAPTCHA: ghi "không xác minh được" hoặc tìm nguồn khác.');
     return { text: L.join('\n') };
   }
   ```
   Thêm vào `CONG_CU`:
   - `description`: `Máy chủ mở thử tối đa 10 link: còn mở được, bị chặn (403, CAPTCHA), không có (404), tiêu đề trang. Link Wikimedia Commons thì kiểm file có thật và đọc tác giả, giấy phép. Trước khi ghi link hình Commons vào bảng, kiểm bằng công cụ này để chắc tên file có thật.`
   - `inputSchema`: `{ type: 'object', properties: { urls: { type: 'array', items: { type: 'string' }, maxItems: 10, description: 'Các link cần kiểm' } }, required: ['urls'] }`.
2. `server.js`:
   - `commonsInfo(link)`: nhận link trang File: hoặc Special:FilePath (dùng đúng hai regex đang có trong `imageUrlOf`).
     Gọi API `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1920&titles=<File:…>` và trả về
     `{ exists, url: ii.thumburl || ii.url, license: extmetadata.LicenseShortName.value, author: extmetadata.Artist.value bỏ thẻ HTML, cắt 120 ký tự }`.
     Không phải link Commons thì trả `null`.
     Sửa `imageUrlOf` dùng `commonsInfo` cho link Commons (URL trả về giữ như cũ: `thumburl || url`; `exists` sai thì ném `Commons không có file này`).
   - `fetchTrang(url, hops = 0)`: giống `fetchBuf` nhưng:
     - nhận cả `http:` và `https:`;
     - gửi thêm `Accept: text/html,application/xhtml+xml,*/*`;
     - **không** báo lỗi khi mã trạng thái khác 200, mà trả `{ status, body }`;
     - chỉ đọc tối đa 200 KB thân trang; theo tối đa 5 lần chuyển hướng; quá 15 giây thì dừng.
   - `kiemMotLink(url)`: dùng bộ nhớ đệm `.yogalab/link.json` (nạp lúc khởi động vào một `Map`, ghi lại gộp sau 2 giây; giữ 7 ngày).
     - Link Commons: `commonsInfo` có `exists` → `{ ket: 'ok', license, author }`, không có → `{ ket: 'khong-co' }`.
     - Link khác: `fetchTrang`, rồi xếp loại theo mã trạng thái:
       - 200–299: lấy `title` từ `<title>` (tối đa 200 ký tự). Nếu `title` hoặc 20.000 ký tự đầu của trang khớp `/captcha|recaptcha|cf-chl|just a moment|are you a robot|verify you are human/i` thì `{ ket: 'captcha', http, title }`, không thì `{ ket: 'ok', http, title }`;
       - 401, 403, 429, 503 → `chan`;
       - 404, 410 → `khong-co`;
       - mã khác → `loi`;
       - lỗi mạng → `{ ket: 'loi', loi: e.message }`.
     - Mỗi lúc chỉ mở tối đa 3 link (hàng đợi nhỏ).
   - `labCtx` thêm `kiemMotLink`.
   - `labToolsFor`: `['soat_loi', 'kiem_link']` cho mọi loại bước.
3. `buildPrompt`, khối `CÔNG CỤ CỦA MÁY CHỦ`: khi có `kiem_link`, thêm dòng
   `- kiem_link(urls): máy chủ mở thử tối đa 10 link: còn mở được, bị chặn (403, CAPTCHA), không có (404); link Commons thì kiểm file có thật và đọc giấy phép. Dùng khi chỉ cần biết link sống hay chết; muốn đối chiếu nội dung vẫn dùng WebFetch.`
4. Kiểm thử `test/cong-cu.test.js`:
   - `ctx.kiemMotLink` giả trả `ok` có `title` cho link 1, `chan` có `http: 403` cho link 2, ném lỗi cho link 3;
   - kết quả có 3 dòng với `✓ mở được · "…"`, `BỊ CHẶN (HTTP 403)`, `LỖI · <thông báo>`;
   - `urls: ['abc']` thì `isError` là `true`;
   - 12 link thì chỉ kiểm 10.

---

## 1.10 Công cụ `tai_hinh`

**Làm**
1. `lib/cong-cu.js`:
   ```js
   async function taiHinh(args, ctx) {
     const link = String(args.link || '').trim(), ten = String(args.ten || '').trim();
     const thuMuc = args.thu_muc === 'hinh' ? 'hinh' : 'hinh-nguon';
     if (!/^https:\/\//i.test(link) || !ten) return { text: 'Cần link https (trang File: của Commons hoặc link thẳng .jpg/.png/.webp) và tên file.', isError: true };
     const r = await ctx.taiHinh({ link, ten, thuMuc, moTa: String(args.mo_ta || '') });
     if (r.loi) return { text: `Không tải được: ${r.loi}`, isError: true };
     if (r.xepHang) return { text: `Commons đang giới hạn lượt tải (HTTP 429). Máy chủ sẽ tự tải ${r.rel} sau vài phút; cứ ghi tên file này vào bảng như bình thường.` };
     if (r.daCo) return { text: `Đã có sẵn ${r.rel}, không tải lại. Muốn bản khác thì đặt tên khác.` };
     return { text: `Đã tải ${r.rel} (${r.kb} KB)${r.license ? ' · ' + r.license : ''}${r.author ? ' · ' + r.author : ''}` };
   }
   ```
   Mô tả trong `CONG_CU`:
   - `description`: `Máy chủ tải một hình có giấy phép (trang File: của Wikimedia Commons hoặc link thẳng .jpg/.png/.webp) vào output/<chủ đề của dự án>/hinh-nguon/ (hoặc hinh/) và ghi vào danh-sach.md. Trả về đường dẫn file, tác giả, giấy phép, hoặc lý do không tải được.`
   - `inputSchema`: `{ type: 'object', properties: { link: { type: 'string' }, ten: { type: 'string', description: 'Tên file không đuôi, chữ thường không dấu, nối gạch ngang, vd giai-phau-tuyen-giap' }, thu_muc: { type: 'string', enum: ['hinh-nguon', 'hinh'] }, mo_ta: { type: 'string', description: 'Hình thể hiện gì (ghi vào danh-sach.md)' } }, required: ['link', 'ten'] }`.
2. `server.js` → `ctx.taiHinh({ link, ten, thuMuc, moTa })`:
   - chủ đề = `planTopic(plan của lượt chạy) || chuDeTu(run.task)`; không có thì `{ loi: 'không xác định được chủ đề: ghi rõ output/<chủ đề>/ trong nhiệm vụ' }`;
   - `base = slugFile(ten).replace(/\.(png|jpe?g|webp|svg)$/i, '')`; rỗng thì `{ loi: 'tên file không hợp lệ' }`;
   - link Commons: `commonsInfo`. Không có thì `{ loi: 'Commons không có file này (kiểm lại đúng tên trang File:)' }`.
     Link thẳng tới file ảnh: dùng luôn. Link khác: `{ loi: 'không phải link file ảnh' }`;
   - `rel = output/<chủ đề>/<thuMuc>/<base>.<đuôi lấy từ URL, mặc định jpg>`; đã có thì `{ daCo: true, rel }`;
   - `fetchImage(url)`:
     - lỗi `429`: hẹn tải lại sau 2, 5, 10 phút giống `henTaiLai` của 0.12 (chỉ file này; xong thì ghi `plan.log`), rồi trả `{ xepHang: true, rel }`;
     - lỗi khác: `{ loi: e.message }`;
     - nội dung không phải `image/`: `{ loi: 'không phải ảnh' }`;
   - ghi file; thêm `rel` vào `entry.run.files`;
   - nếu `thuMuc === 'hinh-nguon'`, nối một dòng vào `output/<chủ đề>/hinh-nguon/danh-sach.md` theo đúng cột `downloadSourceImages` đang ghi:
     `| tên file | link | tác giả | giấy phép | mô tả | đã tải (công cụ) |`.
     Chưa có file thì tạo với phần đầu y như `downloadSourceImages`;
   - trả `{ rel, kb, license, author }`.
3. `labToolsFor`: thêm `'tai_hinh'` khi `kind !== 'review' && kind !== 'rereview'`. Người duyệt chỉ kiểm, không tải.
4. `buildPrompt`, khối công cụ, khi có `tai_hinh`:
   `- tai_hinh(link, ten): máy chủ tải một hình có giấy phép (trang File: của Commons hoặc link thẳng .jpg/.png/.webp) vào output/<chủ đề>/hinh-nguon/ (hoặc hinh/) và ghi danh-sach.md. Dùng khi cần hình thật; đừng thử tự tải bằng lệnh.`
5. Kiểm thử với `ctx.taiHinh` giả trả lần lượt `{ loi }`, `{ xepHang, rel }`, `{ daCo, rel }`, `{ rel, kb, license }`: đúng 4 câu như code. Thiếu `ten` thì `isError`.

---

## 1.11 Giao diện

`public/index.html`:
1. `planCards(p)`: thêm trường
   `issues: (p.issues || []).filter(v => v.status === 'mo' && list.some(x => x.n === v.lastStep || x.n === v.fixStep)).length`.
2. `kcardHtml`: sau dòng tag `c.tag`, thêm `if (c.issues) tags.push(`<span class="ktag err">⚑ ${c.issues} vấn đề mở</span>`);`.
3. `renderBoard`: thêm `c.issues` vào mảng dùng làm `key` (dòng `const key = JSON.stringify([...])`, phần `cards.map(c => [...])`), để thẻ vẽ lại khi số vấn đề đổi.
4. `renderDrawer`, nhánh `c.kind === 'plan'`: sau `</ol>`, nếu có vấn đề thuộc thẻ (lọc như mục 1 nhưng lấy mọi trạng thái), thêm:
   ```html
   <details data-k="vd" open><summary>Vấn đề (<n>)</summary><ul class="kvd">
     <li><b>VD-3</b> · Mở · BẮT BUỘC · Trang 9 — "…" <span class="muted">(Lam)</span></li>
   </ul></details>
   ```
   Trạng thái dùng chữ như `TRANG_THAI` ở 1.1 (chép bảng chữ đó sang giao diện). Mọi giá trị qua `esc()`.
5. CSS: thêm `.kvd{margin:6px 0 0 18px; font-size:13px}` cạnh các luật `.ktl`.
6. Bản xem thử (demo) không có `issues`, nên không được lỗi: mọi chỗ đọc dùng `(p.issues || [])`.

---

## 1.12 Cập nhật README.md

1. Mục "Giao cả dự án…", bước 5 (Vòng duyệt):
   - người duyệt ghi lỗi thành bảng "Danh sách vấn đề" (mã, file, vị trí, mức, loại, vấn đề, đề xuất);
   - máy chủ ghi vào `du-an/<mã>/van-de.md` và giao sửa cho **người phụ trách file có lỗi** (có thể nhiều người);
   - người sửa báo lại từng mã trong bảng "Đã xử lý"; báo "Đã sửa" mà file không đổi thì vấn đề vẫn mở;
   - bước duyệt lại chỉ kiểm vấn đề còn mở.
2. Thêm đoạn "Nhắn đồng đội": mục "Gửi đồng đội" và "Cho cả nhóm biết" trong bàn giao. Máy chủ chuyển tin tới bước kế tiếp của người nhận và ghi vào bảng dự án.
3. Thêm đoạn "Giao ban": khi có tín hiệu (vấn đề không rõ ai sửa, hình tải hỏng, tin gửi điều phối viên), máy chủ gọi điều phối viên một lượt ngắn để chèn tối đa 2 bước. Tối đa `maxCheckins` lần mỗi dự án.
4. Bảng `config.json`: thêm `issueLedger`, `maxCheckins`; sửa dòng `labTools` thành "soát lỗi, kiểm link, tải hình".

---

## Xong Đợt 1 khi

- `npm test` qua hết, `node --check server.js` không lỗi, thử khởi động không lỗi.
- Đặt `issueLedger: false` thì lời dặn người duyệt và vòng sửa y như trước Đợt 1 (đọc lại code).
- Chủ dự án chạy dự án thử theo phần **Đợt 1** trong [thu-tren-may.md](thu-tren-may.md).

## Phát hiện thêm

(Người triển khai ghi vào đây.)
