'use strict';
// Máy soát lỗi máy móc trong sản phẩm (server tự làm, không tốn token): dấu câu, từ lặp, từ cấm, cách gọi lẫn lộn, trang quá chữ.
const { boDau } = require('./van-ban');

const REDUP_OK = new Set(['từ', 'dần', 'đều', 'mãi', 'xa', 'lâu', 'nhiều', 'ngày', 'năm', 'khác', 'nhau', 'chính', 'song', 'sinh']); // 'Ý chính chính là…', 'sơ sinh sinh ra' là câu đúng
function soatVanBan(rel, txt, { maxChu, tuTranh, cachGoi } = {}) {
  const out = [], lines = String(txt || '').normalize('NFC').split(/\r?\n/);
  const max = maxChu, banned = tuTranh || [];
  let page = '', mode = '', words = 0, inCode = false;
  // Từ cấm, lặp từ, cách gọi chỉ soát trong sản phẩm: ghi chú nghiên cứu/duyệt hay nhắc các từ này để bác bỏ
  const product = /^output\//.test(rel);
  const at = i => `${rel}:${i + 1}${page ? ' (' + page + ')' : ''}`;
  const count = t => (t.match(/[\p{L}\p{N}]+/gu) || []).length;
  const flushPage = () => { if (page && max > 0 && words > max + 5) out.push(`${rel} (${page}): ${words} chữ trên slide, vượt ngưỡng ~${max}`); words = 0; mode = ''; };
  lines.forEach((l, i) => {
    if (/^\s*```/.test(l)) { inCode = !inCode; return; }
    if (inCode) return;
    const h = /^#{1,3}\s+(Trang\s+\d+)/i.exec(l);
    if (h) { flushPage(); page = h[1]; return; }
    if (/^#{1,3}\s/.test(l)) { flushPage(); page = ''; }
    const t = l.replace(/https?:\/\/[^\s)\]>]+/g, 'URL').replace(/`[^`]*`/g, 'X'); // giữ chỗ, tránh báo nhầm lỗi dấu cách
    const dbl = /.{0,12}([,;:][ \t]*[.,;]|[^.]\.\.(?!\.)).{0,6}/.exec(t);
    const sp = !dbl && !/^\s*\|/.test(t) && /.{0,12}\S[ \t]+[,.;:!?](?=\s|$)/.exec(t);
    if (dbl) out.push(`${at(i)}: dấu câu đôi "${dbl[0].trim()}"`);
    else if (sp) out.push(`${at(i)}: dấu cách trước dấu câu "${sp[0].trim()}"`);
    const dup = /(^|[^\p{L}])(\p{L}+)\s+\2(?=$|[^\p{L}])/iu.exec(t);
    // Tên riêng viết hoa lặp lại (vd "Chang Chang") không phải lỗi
    const hai = dup && t.slice(dup.index).match(/\p{L}+\s+\p{L}+/u);
    const tenRieng = !!hai && hai[0].split(/\s+/).every(w => /^\p{Lu}/u.test(w));
    if (product && dup && !tenRieng && !REDUP_OK.has(dup[2].toLowerCase())) out.push(`${at(i)}: lặp từ "${dup[2]} ${dup[2]}"`);
    const low = t.toLowerCase();
    if (product) for (const w of banned) if (w && low.includes(String(w).toLowerCase())) out.push(`${at(i)}: từ cần tránh "${w}" (nếu là câu bác bỏ thì bỏ qua)`);
    // Đếm chữ trên slide: các ý dưới "Ý chính" + "Câu chốt"
    if (!page) return;
    if (/^- Ý chính:/i.test(l)) { mode = 'y'; return; }
    const cc = /^- Câu chốt:\s*(.*)$/i.exec(l);
    if (cc) { mode = ''; if (!/^[—–-]?\s*$/.test(cc[1])) words += count(cc[1]); return; }
    if (/^- \S/.test(l)) { mode = ''; return; }
    const item = /^\s{2,}[-*]\s+(.*)$/.exec(l);
    if (item && mode === 'y') words += count(item[1]);
  });
  flushPage();
  const all = lines.join('\n').toLowerCase();
  if (product) for (const pair of cachGoi || []) {
    const n = pair.map(w => all.split(String(w).toLowerCase()).length - 1);
    if (n.filter(x => x > 0).length > 1) out.push(`${rel}: lẫn cách gọi ${pair.map((w, k) => '"' + w + '" (' + n[k] + ' chỗ)').join(' và ')}, chọn một`);
  }
  return out;
}

// Số chữ trên slide của từng trang (Ý chính + Câu chốt, bỏ khối mã), đếm đúng như soatVanBan
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

// Đối chiếu từng trang của slides.md với thiet-ke.md: thiếu trang, lệch tiêu đề, lệch loại hình, lệch đồ dùng
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

// File hình còn thiếu: hình trong "Danh sách hình" chưa có trong output/<chủ đề>/hinh/, và hinh-nguon/<file> slides.md nhắc mà chưa có
function kiemFileHinh({ dsHinh = [], slidesTxt = '', chuDe, coFile, coThuMucHinh }) {
  const out = [];
  if (coThuMucHinh) for (const { name, pages = [] } of dsHinh) {
    const goc = name.replace(/\.[a-z]+$/i, '');
    if (!['.png', '.jpg', '.jpeg', '.webp', '.svg'].some(d => coFile(`output/${chuDe}/hinh/${goc}${d}`)))
      out.push(`Trang ${pages.join(', ')}: chưa có output/${chuDe}/hinh/${name}`);
  }
  const da = new Set();
  for (const m of String(slidesTxt || '').normalize('NFC').matchAll(/hinh-nguon\/([\p{L}\p{N}_.-]+?\.(?:png|jpe?g|webp|svg))/giu)) {
    const file = m[1];
    if (da.has(file)) continue;
    da.add(file);
    if (!coFile(`output/${chuDe}/hinh-nguon/${file}`)) out.push(`slides.md nhắc hinh-nguon/${file} nhưng chưa có file`);
  }
  return out;
}

module.exports = { soatVanBan, soChuTungTrang, doiChieuThietKe, kiemFileHinh, REDUP_OK };
