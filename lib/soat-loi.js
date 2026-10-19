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

module.exports = { soatVanBan, REDUP_OK };
