# Đợt 2 · Bộ não chung trong vault Obsidian riêng

Đọc [README.md](README.md) trước. Cần Đợt 0 và 1 đã xong: `lib/van-ban.js`, `docBang` trong `lib/van-de.js`, MCP, `planTopic`, sổ quyết định.

**Đã chốt:**
- `workspace/` được mở thành một vault Obsidian riêng tên "Yoga Lab". Bộ não nằm trong `workspace/tri-thuc/`.
- Dự án chạy thử là **chủ đề mới**. Đợt này còn nhập sẵn tri thức suy giáp v7 (ý, nguồn, tư thế), nên chủ đề mới vẫn dùng lại được phần chung: tư thế, nguồn, tình trạng link, thuật ngữ, quy tắc của bạn.

**Nguyên tắc ghi:**
- Agent chỉ viết **bảng** trong file của mình. **Máy chủ** chép bảng thành note.
- Máy chủ không bao giờ ghi vào `quy-tac-cua-toi.md`, `ghi-chu-chuyen-mon/`, hay note có `khoa: true`. Ý bạn đã đánh `trang_thai: bac-bo` thì máy chủ không đổi.

**Công tắc mới** (`DEFAULT_CONFIG`):
- `brain: true`: bật bộ não (ghi note, gói ngữ cảnh, `tra_cuu`).
- `brainApprovers: ['an']`: ai được đưa ý lên `da-duyet`.
- `obsidianVault: ''`: tên vault, để trống thì lấy tên thư mục workspace.

| Mục | Việc | File chính |
|---|---|---|
| 2.1 | Khung `tri-thuc/`, mẫu note, `.gitignore` | `server.js` (`ensureWorkspace`), `templates/tri-thuc/` |
| 2.2 | Đọc/ghi frontmatter | `lib/ghi-chu.js` |
| 2.3 | Gộp bảng vào note: ý, nguồn, tư thế, hình | `lib/tri-thuc.js` |
| 2.4 | Máy chủ nhập bảng sau mỗi lượt; ghi an toàn | `server.js` |
| 2.5 | Bản đồ bộ não và MOC chủ đề | `lib/tri-thuc.js`, `server.js` |
| 2.6 | `thuat-ngu.md` thành danh sách máy soát | `server.js` |
| 2.7 | Công cụ `tra_cuu` | `lib/tri-thuc.js`, `lib/cong-cu.js`, `server.js` |
| 2.8 | Gói ngữ cảnh cho từng bước | `lib/tri-thuc.js`, `server.js` (`buildPrompt`) |
| 2.9 | Sửa hướng dẫn vai của An, Mai, Lam, Vy, Nhi | `config.json` |
| 2.10 | Nút "Mở trong Obsidian" | `server.js` (`publicState`), `public/index.html` |
| 2.11 | Cập nhật README.md | `README.md` |

Nhập tri thức suy giáp v7 là việc chạy trên máy (cần Claude), nằm trong [thu-tren-may.md](thu-tren-may.md), phần Đợt 2.

---

## 2.1 Khung `tri-thuc/`, mẫu note, `.gitignore`

**Làm**
1. `.gitignore`: thêm dòng `workspace/.obsidian/` (cài đặt riêng của Obsidian trên máy bạn).
2. Tạo thư mục `templates/tri-thuc/` trong repo với các file dưới đây. `ensureWorkspace` chép chúng vào `workspace/tri-thuc/` **chỉ khi file chưa có**, giống cách đang chép `templates/`. Tạo thêm các thư mục rỗng `menh-de/`, `nguon/`, `tu-the/`, `hinh/`, `chu-de/`, `ghi-chu-chuyen-mon/`.
   - `quy-tac-cua-toi.md`:
     ```markdown
     # Quy tắc của tôi

     > Bạn viết file này. Máy chủ không bao giờ sửa nó. Mọi agent đọc phần dưới đây ở mỗi bước và coi là ưu tiên cao nhất.
     > Viết ngắn, mỗi dòng một quy tắc. Xoá dòng ví dụ khi đã có quy tắc thật.

     - (ví dụ) Không dạy tư thế đảo ngược cho người tăng nhãn áp.
     ```
   - `ghi-chu-chuyen-mon/README.md`: `# Ghi chú chuyên môn` và một dòng: `Ghi nhận xét của bác sĩ, giảng viên ở đây, mỗi chủ đề một file. Agent đọc khi làm chủ đề đó; máy chủ không sửa.`
   - `thuat-ngu.md`: xem 2.6.
   - `_mau/y-moi.md` (mẫu để bạn tự thêm ý trong Obsidian):
     ```markdown
     ---
     loai: menh-de
     ma:
     chu_de:
       - 
     muc_bang_chung: y-kien
     trang_thai: nhap
     nguon:
       - 
     trich:
     ---
     # <Ý một câu>

     <Ý đầy đủ>
     ```
3. Không tạo `00-ban-do.md` ở đây: 2.5 sinh nó.

---

## 2.2 `lib/ghi-chu.js`: đọc/ghi frontmatter

Chỉ hỗ trợ đúng phần YAML mà Obsidian Properties dùng. Bản dưới đã chạy thử: đọc rồi ghi lại giữ nguyên dữ liệu, kể cả danh sách khối do Obsidian tự ghi.

```js
'use strict';
// Đọc/ghi note Markdown có frontmatter, chỉ phần YAML đơn giản mà Obsidian Properties dùng:
// chuỗi, số, true/false, danh sách khối ("  - a") hoặc danh sách một dòng ("[a, b]").
function giaTri(s) {
  s = s.trim();
  if (s === '') return '';
  if (/^".*"$/.test(s)) { try { return JSON.parse(s); } catch { return s.slice(1, -1); } }
  if (/^'.*'$/.test(s)) return s.slice(1, -1).replace(/''/g, "'");
  if (/^\[.*\]$/.test(s)) return s.slice(1, -1).split(',').map(x => giaTri(x)).filter(x => x !== '');
  if (/^(true|false)$/.test(s)) return s === 'true';
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  return s;
}

function docGhiChu(text) {
  const t = String(text || '').replace(/^﻿/, '').normalize('NFC');
  const m = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/.exec(t);
  if (!m) return { data: {}, body: t };
  const data = {};
  let key = null;
  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim() || /^\s*#/.test(line)) continue;
    const kv = /^([A-Za-z0-9_-]+):(?:\s+(.*))?$/.exec(line);
    if (kv) { key = kv[1]; data[key] = kv[2] === undefined ? '' : giaTri(kv[2].replace(/\s+#.*$/, '')); continue; }
    const item = /^\s*-\s+(.*)$/.exec(line);
    if (item && key) { if (!Array.isArray(data[key])) data[key] = []; data[key].push(giaTri(item[1])); }
  }
  return { data, body: t.slice(m[0].length) };
}

const canNhay = s => s === '' || /^[\s'"\[\]{}>|*&!%@`#,?-]|: |\s#|^(true|false|null|~)$|^-?\d+(\.\d+)?$|\s$/.test(s);
const chuoi = s => { s = String(s); return canNhay(s) || /[\[\]]/.test(s) ? JSON.stringify(s) : s; };

// Ghi danh sách dạng khối, giống cách Obsidian tự ghi, để file không bị đổi qua lại mỗi lần lưu
function vietGhiChu(data, body) {
  const L = ['---'];
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) { L.push(v.length ? `${k}:` : `${k}: []`); for (const x of v) L.push(`  - ${chuoi(x)}`); }
    else if (typeof v === 'number' || typeof v === 'boolean') L.push(`${k}: ${v}`);
    else L.push(`${k}: ${chuoi(v)}`);
  }
  L.push('---');
  return L.join('\n') + '\n' + String(body || '').replace(/^\n+/, '');
}

module.exports = { docGhiChu, vietGhiChu };
```

**Kiểm thử `test/ghi-chu.test.js`**: frontmatter mẫu sau phải đọc ra đúng object, và `docGhiChu(vietGhiChu(data, body))` cho lại đúng `data` và `body`:
```
---
loai: menh-de
chu_de:
  - suy-giap
  - thuoc
nguon:
  - "[[nhs-levothyroxine]]"
trich: "30 minutes to 1 hour before breakfast"
ngay_duyet: 2026-10-19
khoa: false
so: 3
rong: []
trong:
tieu_de: "Levothyroxine: medicine for underactive thyroid"
dong: [a, "b c"]
url: https://x.org/a#muc
---
# Tiêu đề

Nội dung.
```
Kết quả mong đợi:
```js
{ loai: 'menh-de', chu_de: ['suy-giap', 'thuoc'], nguon: ['[[nhs-levothyroxine]]'], trich: '30 minutes to 1 hour before breakfast',
  ngay_duyet: '2026-10-19', khoa: false, so: 3, rong: [], trong: '', tieu_de: 'Levothyroxine: medicine for underactive thyroid',
  dong: ['a', 'b c'], url: 'https://x.org/a#muc' }
```
Thêm: `docGhiChu('không có frontmatter').data` deepEqual `{}`.

---

## 2.3 `lib/tri-thuc.js`: gộp bảng vào note

**Ba bảng agent viết** (tên cột sau khi qua `khoa()` của `lib/van-de.js` ghi trong ngoặc):

| Tiêu đề bảng | Cột |
|---|---|
| `## Danh sách nguồn` | Mã nguồn (`ma nguon`) · [n] (`n`) · Tổ chức (`to chuc`) · Tiêu đề (`tieu de`) · Link (`link`) · Loại nguồn (`loai nguon`) |
| `## Danh sách đã duyệt` | Mã (`ma`) · Ý (`y`) · Mức bằng chứng (`muc bang chung`) · Nguồn (`nguon`) · Câu trích (`cau trich`) · Ghi chú (`ghi chu`) |
| `## Tư thế` | Mã · Tên Việt · Tên Phạn · Đạo cụ · Chống chỉ định · Mức bằng chứng CCĐ · Prompt ảnh đã đạt · Lỗi AI hay vẽ sai |

Đọc bằng `docBang(text, /^#{2,3}\s*Danh sách nguồn(?![\p{L}\p{N}])/iu)`, v.v. (`docBang` có sẵn trong `lib/van-de.js`).
Bảng có tiêu đề nhưng không có dòng (vd mục "Danh sách đã duyệt" kiểu gạch đầu dòng cũ) thì ra `[]`, không nhập gì.

**Nơi lưu note**: `tri-thuc/menh-de/<ma>.md`, `tri-thuc/nguon/<ma>.md`, `tri-thuc/tu-the/<ma>.md`, `tri-thuc/hinh/<ma>.md`.

**Chủ đề kiến thức** khác thư mục sản phẩm: `suy-giap-v7` thuộc chủ đề `suy-giap`.
```js
const chuDeTriThuc = topic => String(topic || '').replace(/-v\d+$/, '') || null;
```
Nếu chữ của lượt chạy có dòng `Chủ đề: <x>` (chữ thường không dấu) thì dùng `<x>`.

**Hàm gộp ý (`hopNhatMenhDe`)**. Bản dưới đã chạy thử với các quy tắc: giữ ý đã bác bỏ, giữ note đã khoá, người không có quyền duyệt không đổi mức hay câu trích của ý đã duyệt.

```js
'use strict';
// Bộ não chung tri-thuc/: gộp bảng của agent vào note (chỉ sửa phần của máy chủ), tìm kiếm, dựng bản đồ.
const { docGhiChu, vietGhiChu } = require('./ghi-chu');
const { boDau, tuKhoa } = require('./van-ban');

const slug = s => boDau(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
const MUC = s => { const k = boDau(s).replace(/[^a-z]+/g, ' ').trim(); return /^manh/.test(k) ? 'manh' : /^vua|trung binh/.test(k) ? 'vua' : /^so bo/.test(k) ? 'so-bo' : 'y-kien'; };
const hop = (a, b) => [...new Set([...(Array.isArray(a) ? a : a ? [a] : []), ...b])];
const LS = '## Lịch sử (máy chủ ghi)';
function themLichSu(body, dong) {
  if (!body.includes(LS)) return body.replace(/\s*$/, '\n\n') + LS + '\n- ' + dong + '\n';
  return body.replace(/\s*$/, '\n') + '- ' + dong + '\n';
}
const tieuDe = y => { const c = String(y).split(/(?<=[.!?;])\s/)[0]; return c.length > 80 ? c.slice(0, 77) + '…' : c; };
const lienKetDuAn = planId => planId ? [`[[du-an/${planId}/brief|${planId}]]`] : [];

// Gộp một dòng "Danh sách đã duyệt" vào note ý. cu: nội dung note cũ hoặc null. Trả về nội dung mới, hoặc { boQua: lý do }
function hopNhatMenhDe(cu, row, { chuDe, duyet, tacGia, ngay, planId }) {
  const nguon = String(row.nguon || '').split(/[,;]/).map(s => slug(s.replace(/[\[\]]/g, ''))).filter(Boolean).map(s => `[[${s}]]`);
  const hanXem = ngay.replace(/^(\d{4})/, (_, y) => String(Number(y) + 1));
  const lichSu = `${ngay} · ${planId || 'lượt lẻ'} · ${tacGia} ${duyet ? 'duyệt' : 'ghi nháp'} (${MUC(row.muc)})`;
  if (cu) {
    const { data, body } = docGhiChu(cu);
    if (data.khoa === true) return { boQua: 'note đã khoá' };
    if (data.trang_thai === 'bac-bo') return { boQua: 'chủ dự án đã bác bỏ ý này' };
    const giu = !duyet && data.trang_thai === 'da-duyet'; // người không có quyền duyệt không đổi mức, câu trích của ý đã duyệt
    const d = { ...data, chu_de: hop(data.chu_de, [chuDe]), muc_bang_chung: giu ? data.muc_bang_chung : MUC(row.muc), nguon: hop(data.nguon, nguon),
      trich: giu ? (data.trich || '') : (row.trich || data.trich || ''), trang_thai: duyet ? 'da-duyet' : (data.trang_thai || 'nhap'),
      ...(duyet ? { duyet_boi: tacGia, ngay_duyet: ngay, xem_lai_truoc: hanXem } : {}),
      dung_trong: hop(data.dung_trong, lienKetDuAn(planId)) };
    return vietGhiChu(d, themLichSu(body, lichSu));
  }
  const data = { loai: 'menh-de', ma: row.ma, chu_de: [chuDe], muc_bang_chung: MUC(row.muc), trang_thai: duyet ? 'da-duyet' : 'nhap', nguon, trich: row.trich || '',
    ...(duyet ? { duyet_boi: tacGia, ngay_duyet: ngay, xem_lai_truoc: hanXem } : {}), dung_trong: lienKetDuAn(planId) };
  const body = `# ${tieuDe(row.y)}\n\n${row.y}\n` + (row.ghiChu ? `\n## Ghi chú\n${row.ghiChu}\n` : '');
  return vietGhiChu(data, themLichSu(body, lichSu));
}
```
`row` ở đây là `{ ma, y, muc, nguon, trich, ghiChu }`, lấy từ dòng bảng. `ma` rỗng thì `slug(8 từ đầu của y)`.

**Các hàm gộp còn lại**, cùng kiểu (note cũ hoặc `null` → nội dung mới hoặc `{ boQua }`; tôn trọng `khoa: true`; luôn thêm một dòng lịch sử):
- `hopNhatNguon(cu, row, meta)`:
  - frontmatter: `loai: nguon`, `ma`, `to_chuc`, `tieu_de`, `url` (link `https?://` đầu tiên trong ô Link), `loai_nguon` (`slug` của ô), `truy_cap` (giữ giá trị cũ, mặc định `chua-kiem`), `kiem_luc` (giữ cũ), `cach_mo_khac` (giữ cũ), `chu_de` (gộp);
  - note cũ đã có `url` khác thì **giữ url cũ** và ghi lịch sử `đề xuất link khác: <url mới>`;
  - thân note mới: `# <tieu_de hoặc ma>`, dòng url, mục `## Câu trích đã dùng` (rỗng), rồi lịch sử.
- `capNhatTruyCap(cu, ket, ngay)`: đặt `truy_cap` (`ok`, `chan`, `captcha`, `khong-co`, `loi`) và `kiem_luc: ngay`. Không thêm lịch sử nếu `truy_cap` không đổi.
- `hopNhatTuThe(cu, row, meta)`. Chỉ người trong `brainApprovers` mới được ghi. Các cột cách nhau dấu `;` hoặc `,`.
  - frontmatter: `loai: tu-the`, `ma`, `ten_viet`, `ten_phan`, `dao_cu` (danh sách), `chong_chi_dinh` (danh sách), `muc_bang_chung_ccd` (`MUC`), `chu_de` (gộp);
  - thân note: mục `## Prompt ảnh đã đạt` và `## Lỗi AI hay vẽ sai`. Chỉ **thêm** dòng mới, không xoá dòng cũ; bỏ qua dòng đã có y hệt.
- `hopNhatHinh(cu, info, meta)` với `info = { file, link, tacGia, giayPhep, theHien }`:
  - frontmatter: `loai: hinh`, `ma` (tên file không đuôi), `file`, `link`, `tac_gia`, `giay_phep`, `the_hien`, `chu_de`. Chỉ điền trường còn trống, không ghi đè;
  - thân note mới: `# <the_hien hoặc ma>`, dòng trống, `![[<file>]]` (Obsidian hiện luôn ảnh trong note).
  - Trùng `ma` mà khác `file` (cùng tên ở chủ đề khác) thì dùng `ma = <ma>-<chủ đề>`.

`module.exports = { slug, MUC, chuDeTriThuc, hopNhatMenhDe, hopNhatNguon, capNhatTruyCap, hopNhatTuThe, hopNhatHinh, … }` (thêm các hàm của 2.5, 2.7, 2.8).

**Kiểm thử `test/tri-thuc.test.js`** (đã chạy thử với `hopNhatMenhDe`). Gọi đầu tiên là `row = { ma: 'x', y: 'Ý thử.', muc: 'Mạnh', nguon: 'a', trich: 'q1' }`, `meta = { chuDe: 'c1', duyet: true, tacGia: 'an', ngay: '2026-10-19' }`.
1. Note mới:
   - `trang_thai: da-duyet`, `xem_lai_truoc: 2027-10-19`;
   - ô nguồn `"nhs-levothyroxine, [ata-2014]"` cho `nguon: ['[[nhs-levothyroxine]]', '[[ata-2014]]']`.
2. Mai (không duyệt) gộp thêm vào note đó, `muc: 'Vừa'`, `trich: 'q2'`, `nguon: 'b'`, chủ đề `c2`:
   - `muc_bang_chung` vẫn `manh`, `trich` vẫn `q1`;
   - `nguon` thành `[[a]], [[b]]`, `chu_de` thành `c1, c2`;
   - thân có 2 dòng lịch sử.
3. An duyệt lại với `muc: 'Vừa'`, `trich: 'q3'`, ngày `2026-11-03`: thành `vua`, `q3`, `ngay_duyet: 2026-11-03`.
4. Note có `trang_thai: bac-bo` → `{ boQua: 'chủ dự án đã bác bỏ ý này' }`. Note có `khoa: true` → `{ boQua: 'note đã khoá' }`.
5. `MUC`: `Mạnh→manh`, `Vừa→vua`, `Trung bình→vua`, `Sơ bộ→so-bo`, `Ý kiến→y-kien`, `''→y-kien`.
6. `hopNhatNguon` khi note đã có url khác: url giữ nguyên, lịch sử có `đề xuất link khác`.
7. `hopNhatTuThe` gộp hai lần cùng một prompt: mục `## Prompt ảnh đã đạt` chỉ có một dòng.

---

## 2.4 Máy chủ nhập bảng sau mỗi lượt; ghi an toàn

**Làm** trong `server.js`:
1. Ghi an toàn, vì bạn có thể đang mở note trong Obsidian:
   ```js
   // Ghi note bộ não: ghi file tạm rồi đổi tên (Obsidian không thấy file dở dang); nội dung không đổi thì không ghi
   async function ghiTriThuc(rel, text) {
     const abs = insideWorkspace(rel);
     if (!abs || !rel.startsWith('tri-thuc/')) return false;
     if (readWs(rel) === text) return false;
     await fsp.mkdir(path.dirname(abs), { recursive: true });
     const tmp = abs + '.tmp-' + process.pid;
     await fsp.writeFile(tmp, text, 'utf8');
     await fsp.rename(tmp, abs);
     return true;
   }
   ```
   Kèm kiểm tra cứng: `rel` khớp `^tri-thuc/(quy-tac-cua-toi\.md|ghi-chu-chuyen-mon/)` thì không ghi.
2. `async function nhapTriThuc(agent, run, banGhi)`. Gọi trong `finishRun` khi `run.status === 'done'` và `config.brain !== false`, **trước** `entry.onDone`, có `await`, bọc `try/catch` ghi log.
   `banGhi = chuCuaLuot(run, readWs(run.handoff), fullSummary)` (hàm của 1.2).
   - chủ đề: dòng `Chủ đề: <x>` trong `banGhi`, nếu không có thì `chuDeTriThuc(planTopic(plan) || chuDeTu(run.task))`. Không có chủ đề thì bỏ qua cả hàm;
   - `duyet = (config.brainApprovers || ['an']).includes(agent.id)`;
   - bảng `Danh sách nguồn` → `hopNhatNguon` cho từng dòng có `ma nguon` hoặc `link`. Với dòng có url: xếp hàng `kiemMotLink(url)` (của 1.9), xong thì `capNhatTruyCap`. Tối đa 30 link mỗi lượt;
   - bảng `Danh sách đã duyệt` → `hopNhatMenhDe` cho từng dòng có `y`. **Bỏ dòng mà ô Ý có chữ "chờ"** (ý chưa duyệt xong);
   - bảng `Tư thế` → `hopNhatTuThe`, chỉ khi `duyet`;
   - mỗi kết quả là chuỗi thì `ghiTriThuc`; là `{ boQua }` thì ghi `plan.log` (hoặc thêm vào cuối bàn giao nếu là lượt lẻ): `Bộ não: bỏ qua <ma> (<lý do>)`;
   - cuối hàm: một dòng log `Bộ não: <a> ý, <b> nguồn, <c> tư thế` (chỉ khi có gì đó được ghi), rồi hẹn dựng lại bản đồ (2.5).
3. Hình: trong `downloadSourceImages`, sau khi ghi `danh-sach.md`, với mỗi dòng `đã tải` hoặc `đã có`, gọi `hopNhatHinh` rồi `ghiTriThuc`.
   Công cụ `tai_hinh` (1.10) cũng vậy khi tải xong. Chủ đề lấy theo `chuDeTriThuc(topic)`.
4. Kiểm: chạy thử khởi động. Phần nhập chạy thật sẽ được thử trên máy (thu-tren-may.md, Đợt 2).

---

## 2.5 Bản đồ bộ não và MOC chủ đề

**Làm**
1. `server.js`: hàm `docKhoTriThuc()` đọc mọi `tri-thuc/{menh-de,nguon,tu-the,hinh}/*.md`, trả `[{ path, data, title, para }]`:
   - `title` là dòng `# ` đầu tiên;
   - `para` là đoạn chữ đầu tiên sau tiêu đề, cắt 300 ký tự;
   - giữ bộ nhớ đệm theo `mtime` từng file, để gọi nhiều lần không đọc lại cả kho.
2. `lib/tri-thuc.js`: hai hàm dựng Markdown, chỉ dùng bảng và link thường, nên **không cần plugin nào**.
   - `vietMocChuDe(chuDe, notes, homNay)` → `tri-thuc/chu-de/<chuDe>.md`:
     - mục `## Ý đã kiểm chứng`: bảng `| Ý | Mức | Nguồn | Hạn xem lại |`, cột Ý là `[[menh-de/<ma>|<title>]]`;
     - mục `## Ý nháp hoặc cần xem lại`;
     - mục `## Tư thế`, `## Hình` (mỗi hình một dòng `[[hinh/<ma>|<the_hien>]] · <giay_phep>`);
     - mục `## Nguồn` (`truy_cap` đi kèm), `## Dự án đã dùng` (gộp `dung_trong`).
   - `vietBanDoTriThuc(notes, homNay)` → `tri-thuc/00-ban-do.md`:
     - dòng `> Máy chủ tự sinh file này. Ghi chú của bạn: [[quy-tac-cua-toi]], thư mục ghi-chu-chuyen-mon/, [[thuat-ngu]], [[quyet-dinh]].`;
     - mục `## Chủ đề`: mỗi chủ đề một dòng kèm số ý (đã duyệt), số nguồn, số tư thế, số hình;
     - mục `## Cần bạn xem`: bảng các ý có một trong các lý do: `can-xem-lai`; `da-duyet` mà quá `xem_lai_truoc`; `da-duyet` mà `trich` rỗng;
     - mục `## Nguồn đang bị chặn`: `truy_cap` là `chan`, `captcha` hoặc `khong-co`, kèm `cach_mo_khac` nếu có.
3. Hẹn dựng lại (gộp sau 3 giây) sau mỗi lần `nhapTriThuc` có ghi, và khi một dự án xong. Dùng `ghiTriThuc` (không đổi thì không ghi).
4. `vietBanDo` của 0.9: truyền `coTriThuc: true` khi đã có `tri-thuc/00-ban-do.md`.
5. Kiểm thử: 4 note giả (2 ý `suy-giap`, một đã quá hạn; 1 nguồn `captcha`; 1 tư thế):
   - MOC `suy-giap` có đủ các mục;
   - bản đồ có ý quá hạn trong "Cần bạn xem" và nguồn trong "Nguồn đang bị chặn".

---

## 2.6 `thuat-ngu.md` thành danh sách máy soát

**Làm**
1. Mẫu `templates/tri-thuc/thuat-ngu.md` (chép khi chưa có, rồi điền từ `config.json` ở lần đầu; xem bước 2):
   ```markdown
   # Thuật ngữ

   > Bạn sửa file này trong Obsidian. Máy chủ đọc hai bảng dưới để soát chữ trong sản phẩm (cộng thêm danh sách trong config.json).

   ## Từ cần tránh
   | Từ | Lý do |
   |---|---|

   ## Cách gọi thống nhất
   | Dùng | Không dùng |
   |---|---|
   ```
2. Lần đầu tạo file: thêm mỗi từ trong `config.lintBanned` thành một dòng `| <từ> | (từ config.json) |`.
   Mỗi cặp `[a, b]` trong `config.lintVariants` thành `| <b> | <a> |` (cặp mặc định `['giáo viên', 'giảng viên']` thành dòng `| giảng viên | giáo viên |`, theo bài học của Lam).
   Sau lần đầu, máy chủ không ghi file này nữa.
3. `lintText` (wrapper của 0.6) dùng danh sách hợp:
   - `tuTranh` = `config.lintBanned` ∪ cột "Từ";
   - `cachGoi` = `config.lintVariants` ∪ các cặp `[Không dùng, Dùng]`.

   Đọc file theo `mtime`, không đọc lại mỗi lần gọi.
4. Kiểm thử hàm thuần `docThuatNgu(text)` → `{ tuTranh: [...], cachGoi: [[...], ...] }` với mẫu có 2 dòng mỗi bảng.

---

## 2.7 Công cụ `tra_cuu`

**Làm**
1. `lib/tri-thuc.js` → `timTriThuc(notes, { tuKhoa: q, loai, chuDe }, max = 10)`:
   - `Q = tuKhoa(q)` (hàm của `lib/van-ban.js`). `Q` rỗng thì trả `[]`;
   - mỗi note: `W = tuKhoa([title, para, data.ma, data.ten_viet, data.ten_phan, data.to_chuc, ...(data.chu_de || [])].join(' '))`; `diem = |Q ∩ W| / |Q|`;
   - lọc theo `loai` nếu có; lọc `chuDe` (so với `chuDeTriThuc(chuDe)`) nếu có;
   - giữ note có `diem >= 0.34`, hoặc có ít nhất 1 từ chung khi `|Q| <= 2`;
   - sắp xếp theo `diem` giảm dần, rồi theo `trang_thai`: `da-duyet`, `nhap`, `can-xem-lai`, `bac-bo`; cắt `max`;
   - ý `bac-bo` vẫn trả về, kèm nhãn để agent biết là không được dùng lại.
2. Định dạng mỗi dòng (trong `lib/cong-cu.js`):
   - ý: `- tri-thuc/menh-de/<ma>.md · ý · <đã duyệt|nháp|cần xem lại|BÁC BỎ, không dùng> · <mức> · <title>`;
   - nguồn: `- tri-thuc/nguon/<ma>.md · nguồn · truy cập: <truy_cap> · <to_chuc> · <tieu_de>`;
   - tư thế: `- tri-thuc/tu-the/<ma>.md · tư thế · <ten_viet> (<ten_phan>)`;
   - hình: `- tri-thuc/hinh/<ma>.md · hình · <giay_phep> · <file>`.

   Không có kết quả: `Không thấy gì trong bộ não cho "<q>". Đây là phần cần tìm mới.`
3. `CONG_CU.tra_cuu`:
   - `description`: `Tìm trong bộ não chung tri-thuc/: ý đã kiểm chứng, nguồn (kèm tình trạng truy cập), tư thế (chống chỉ định, đạo cụ, prompt ảnh đã đạt), hình có giấy phép. Trả về tối đa 10 mục gọn kèm đường dẫn note; cần chi tiết thì Read note đó.`
   - `inputSchema`: `{ type: 'object', properties: { tu_khoa: { type: 'string' }, loai: { type: 'string', enum: ['menh-de', 'nguon', 'tu-the', 'hinh'] }, chu_de: { type: 'string' } }, required: ['tu_khoa'] }`.
4. `labCtx` thêm `timTriThuc: q => timTriThuc(docKhoTriThuc(), q)`. `labToolsFor` thêm `'tra_cuu'` cho mọi loại bước khi `config.brain !== false`.
5. `buildPrompt`, khối công cụ, thêm dòng:
   `- tra_cuu(tu_khoa): tìm trong bộ não chung (ý đã kiểm chứng, nguồn, tư thế, hình). Tra trước khi tìm web: mục nào đã có ý đã duyệt còn hạn thì dùng lại, không tìm lại.`
6. Kiểm thử `timTriThuc` với 5 note giả: tìm "levothyroxine lúc đói" ra đúng ý đó đầu tiên; lọc `loai: 'nguon'` chỉ ra nguồn; ý `bac-bo` có mặt nhưng đứng sau ý `da-duyet` cùng điểm.

---

## 2.8 Gói ngữ cảnh cho từng bước

**Làm**
1. `lib/tri-thuc.js` → `goiNguCanh({ quyTac, quyetDinh, vanDe, lienQuan, coBanDo })`, trả về chuỗi; phần nào rỗng thì bỏ cả tiêu đề phần đó:
   ```
   BỐI CẢNH TỪ BỘ NÃO CHUNG (máy chủ soạn cho bước này; đọc trước khi làm):
   Quy tắc của chủ dự án (ưu tiên cao nhất):
   <quyTac>
   Quyết định đã chốt:
   - <mỗi quyết định một dòng>
   Vấn đề đang mở giao cho bạn:
   - <mỗi vấn đề một dòng>
   Trong bộ não có thể liên quan (Read note nếu cần):
   - <mỗi dòng như kết quả tra_cuu>
   Bản đồ bộ não: tri-thuc/00-ban-do.md
   ```
   Cắt tổng độ dài ở 6.000 ký tự (khoảng 1.500 chữ). Cắt từ cuối phần "Trong bộ não…" trước.
2. `server.js`, khi dựng prompt cho mọi lượt (khi `config.brain !== false`):
   - `quyTac`: nội dung `tri-thuc/quy-tac-cua-toi.md`, bỏ frontmatter, bỏ dòng bắt đầu bằng `>` và dòng có `(ví dụ)`. Rỗng thì bỏ qua. Cắt 1.500 ký tự;
   - `quyetDinh`: `quyetDinhChoKeHoach(…)` của 0.10, tối đa 8 dòng;
   - `vanDe` (chỉ bước trong dự án): vấn đề `mo` có `owner === agent.id` và `fixStep` khác bước hiện tại, tối đa 8;
   - `lienQuan`: `timTriThuc(docKhoTriThuc(), { tuKhoa: (plan ? plan.goal + ' ' : '') + task.slice(0, 300), chuDe }, 8)`.
3. `buildPrompt`: thêm tham số `goi`; nếu có thì chèn **ngay trước** dòng `NHIỆM VỤ:`.
4. Kiểm thử `goiNguCanh`: phần rỗng không có tiêu đề; chuỗi dài bị cắt dưới 6.000 ký tự và vẫn còn phần "Quy tắc".

---

## 2.9 Sửa hướng dẫn vai trong `config.json`

Sửa đúng chuỗi `instructions` của từng agent. Dùng Edit với chuỗi cũ nguyên văn.

1. **An**: thay câu
   `ĐẦU RA CHO NGƯỜI VIẾT: cuối file kiểm chứng có mục \"## Danh sách đã duyệt\" gọn (mỗi ý một dòng: ý đã sửa đúng · [n] link), đủ để Lam viết mà không phải mở lại file nguồn của Mai.`
   bằng
   `ĐẦU RA CHO NGƯỜI VIẾT VÀ BỘ NÃO CHUNG: cuối file kiểm chứng ghi bảng \"## Danh sách đã duyệt\" đúng các cột | Mã | Ý | Mức bằng chứng | Nguồn | Câu trích | Ghi chú |. Mã: dùng lại mã ý đã có trong tri-thuc/menh-de/ (tra bằng tra_cuu hoặc Grep), ý mới thì đặt mã chữ thường không dấu nối gạch ngang. Ý: một câu đã sửa đúng. Mức bằng chứng: Mạnh, Vừa, Sơ bộ hoặc Ý kiến. Nguồn: Mã nguồn trong bảng \"Danh sách nguồn\" của Mai, cách nhau dấu phẩy. Câu trích: nguyên văn ngắn từ nguồn. Chỉ đưa ý đã duyệt xong; máy chủ chép bảng này vào bộ não. Ý đã có trong bộ não với trang_thai da-duyet còn hạn thì không mở lại link, chỉ kiểm ý mới hoặc vừa sửa. Có kiểm tư thế thì ghi thêm bảng \"## Tư thế\" đúng các cột | Mã | Tên Việt | Tên Phạn | Đạo cụ | Chống chỉ định | Mức bằng chứng CCĐ | Prompt ảnh đã đạt | Lỗi AI hay vẽ sai |.`
   (giữ nguyên câu `Kiểm link theo mẫu…` phía sau).
2. **Mai**: thêm vào **cuối**:
   `\nBỘ NÃO CHUNG: trước khi tìm, đọc tri-thuc/chu-de/<chủ đề>.md nếu có và tra từng mục của brief bằng tra_cuu (hoặc Grep trong tri-thuc/). Mục nào đã có ý trang_thai da-duyet còn hạn thì ghi lại mã ý vào file nguồn, không tìm lại; chỉ tìm cho mục còn trống. Cuối file nguồn ghi bảng \"## Danh sách nguồn\" đúng các cột | Mã nguồn | [n] | Tổ chức | Tiêu đề | Link | Loại nguồn |; nguồn đã có trong tri-thuc/nguon/ thì dùng lại đúng Mã nguồn đó. Nguồn có truy_cap là chan hoặc captcha thì dùng cách mở khác ghi trong note, hoặc tìm nguồn thay thế.`
3. **Lam**: thêm vào cuối:
   `\nTrong dàn ý (agents/lam/<chu-de>-dan-y.md), mỗi ý y khoa ghi kèm Mã ý trong \"Danh sách đã duyệt\" để người duyệt đối chiếu.`
4. **Vy**: thêm vào cuối:
   `\nTrước khi tìm hình có giấy phép hay viết prompt ảnh tư thế, xem tri-thuc/hinh/ và tri-thuc/tu-the/ (tra_cuu hoặc Grep): dùng lại hình đã tải và prompt đã đạt, tránh các lỗi AI đã ghi.`
5. **Nhi**: thêm vào cuối:
   `\nTrước khi tạo ảnh tư thế, đọc note tư thế trong tri-thuc/tu-the/ (nếu có): dùng prompt đã đạt và tránh các lỗi AI hay vẽ sai đã ghi.`

Sau khi sửa, kiểm `node -e "JSON.parse(require('fs').readFileSync('config.json','utf8'))"` không lỗi.

---

## 2.10 Nút "Mở trong Obsidian"

**Làm**
1. `publicState`: thêm `obsidianVault: config.obsidianVault || path.basename(workspaceDir())`.
2. `public/index.html`:
   - nơi nạp kết quả `/api/state` (tìm chỗ gán `S.agents =` từ dữ liệu state): gán thêm `S.obsidianVault = st.obsidianVault || ''`;
   - `viewFile`, dòng dựng `#fileFoot`: ngay sau `<span class="path">…</span>`, nếu `S.obsidianVault && !S.demo` thì thêm
     `<a class="btn sm" href="obsidian://open?vault=${encodeURIComponent(S.obsidianVault)}&file=${encodeURIComponent(path.replace(/\.md$/, ''))}">🔗 Mở trong Obsidian</a>`.
3. Kiểm: thử khởi động, gọi `/api/state` thấy có `obsidianVault`.

---

## 2.11 Cập nhật README.md

Thêm mục **"Bộ não chung (Obsidian)"** sau mục "Folder làm việc", gồm:
1. Cách mở: trong Obsidian chọn **Open folder as vault** → chọn thư mục `workspace/`. Tên vault mặc định là tên thư mục; đổi tên thì đặt `obsidianVault` trong config.
2. Bên trong có gì:
   - `tri-thuc/00-ban-do.md`: bản đồ;
   - `chu-de/`: mỗi chủ đề một trang tổng hợp;
   - `menh-de/`: ý đã kiểm chứng;
   - `nguon/`: nguồn và tình trạng truy cập;
   - `tu-the/`, `hinh/`;
   - `quyet-dinh.md`, `thuat-ngu.md`;
   - `quy-tac-cua-toi.md` và `ghi-chu-chuyen-mon/`: bạn viết, máy chủ không sửa.
3. Bạn làm được gì:
   - đánh `trang_thai: bac-bo` cho ý sai, máy chủ sẽ không dùng lại;
   - thêm `khoa: true` để máy chủ không sửa note đó;
   - thêm quy tắc, ghi chú chuyên môn;
   - lọc bằng Bases (plugin lõi) hoặc Dataview theo `trang_thai`, `muc_bang_chung`, `truy_cap`.
4. Agent dùng thế nào: đọc gói ngữ cảnh máy chủ soạn, gọi `tra_cuu` trước khi tìm web, chỉ tìm phần còn thiếu.
5. Bảng `config.json`: thêm `brain`, `brainApprovers`, `obsidianVault`.

---

## Xong Đợt 2 khi

- `npm test` qua hết, `node --check server.js` không lỗi, thử khởi động không lỗi.
- Khởi động lần đầu tạo đủ khung `workspace/tri-thuc/`, không ghi đè file đã có. Commit riêng phần dữ liệu này, tiêu đề `2.1 dữ liệu: khung tri-thuc/`.
- Chủ dự án làm phần **Đợt 2** trong [thu-tren-may.md](thu-tren-may.md):
  - nhập tri thức suy giáp v7;
  - chạy dự án chủ đề mới;
  - xem bộ não trong Obsidian.

## Phát hiện thêm

Lựa chọn khi đặc tả chưa nói rõ (chủ dự án xem lại):

1. **Lịch sử trong note không lặp.** `themLichSu` bỏ qua dòng y hệt đã có. Lý do: bước sửa của An ghi lại file kiểm chứng thì cả bảng được nhập lại, cùng ngày, cùng dự án; không chặn thì note dài ra sau mỗi vòng sửa. Dòng khác ngày, khác người, khác dự án vẫn được thêm như đặc tả.
2. **Cột "Prompt ảnh đã đạt", "Lỗi AI hay vẽ sai" chỉ tách theo `;` (hoặc `<br>`)**, không tách theo dấu phẩy, vì prompt tiếng Anh luôn có dấu phẩy. Cột Đạo cụ, Chống chỉ định vẫn tách theo `;` và `,`.
3. **Ô Nguồn ghi số `[n]`** thay vì Mã nguồn: đổi theo bảng "Danh sách nguồn" trong cùng văn bản; không đổi được thì bỏ số đó (không tạo link `[[1]]`).
4. **Dòng nguồn không có Mã nguồn** (chỉ có Link): mã = slug của "Tổ chức + Tiêu đề", không có thì slug của link.
5. **Kiểm link sau khi nhập chạy nền**, không giữ dự án chờ (30 link, mỗi lúc 3 link, có thể mất vài phút). Kết quả về thì ghi `truy_cap` rồi dựng lại bản đồ.
6. **Link trong ô bảng viết `[[menh-de/x\|tiêu đề]]`** (Obsidian cần `\|` trong bảng, không thì vỡ cột).
7. **Trang chủ đề**: ý `da-duyet` đã quá hạn xem lại nằm ở "Ý nháp hoặc cần xem lại" (kèm lý do), không ở "Ý đã kiểm chứng". Ý `bac-bo` không hiện trong trang chủ đề (vẫn tìm được bằng `tra_cuu`, kèm nhãn BÁC BỎ).
8. **Gói ngữ cảnh, phần "Trong bộ não có thể liên quan"**: câu tìm là mục tiêu dự án + 300 ký tự đầu của việc (thường 20–40 từ khoá), nên ngưỡng tỉ lệ 0,34 của `tra_cuu` gần như không bao giờ đạt. Ở đây dùng "ít nhất 2 từ khoá chung" (`toiThieu: 2` của `timTriThuc`), vẫn xếp theo điểm. Chủ đề mới chưa có note nào thì tìm cả kho, để tư thế, nguồn của chủ đề cũ vẫn hiện.
9. **Quy tắc của chủ dự án** trong gói ngữ cảnh: bỏ thêm dòng tiêu đề `# Quy tắc của tôi`, không thì phần này không bao giờ rỗng.
10. **Note hình**: tạo cho cả hình tải bằng công cụ `tai_hinh` vào `hinh/` (không chỉ `hinh-nguon/`). Lịch sử ghi người có file nguồn (vd `mai`) và mã dự án.
11. **Dòng `Chủ đề: <x>`** được phép có `**`, dấu gạch đầu dòng hoặc backtick quanh `<x>`; `<x>` phải là chữ thường không dấu, nối gạch ngang (dòng `Thư mục chủ đề:` của brief không bị nhầm).
12. **`thuat-ngu.md`**: cặp cách gọi trùng với `lintVariants` (kể cả đảo thứ tự) chỉ tính một lần.
13. **Lưu ý cho Obsidian**: cột `nguon` của note ý ghi `[[<mã nguồn>]]` (tên file, không có thư mục). Nếu một ý và một nguồn trùng mã, link này sẽ mơ hồ. Chưa gặp trong dữ liệu thật; nếu gặp thì đổi mã ý.
14. Công cụ `tra_cuu` chỉ có khi bật `labTools` (giống các công cụ khác của máy chủ). Gói ngữ cảnh thì có ở mọi lượt khi `brain` bật.
