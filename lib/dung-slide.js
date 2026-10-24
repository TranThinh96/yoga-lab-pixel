'use strict';
// Dựng bộ slide hoàn thiện từ kịch bản (output/<chủ đề>/slides.md) và thiết kế (thiet-ke.md): đọc từng trang, chọn kiểu trang,
// dàn chữ và hình theo bảng màu của thiết kế. Kết quả là bộ slide cho lib/pptx.js. Chỉ xử lý chuỗi: không đọc file.
const { RONG, CAO } = require('./pptx');

const MAU_MAC_DINH = { nen: 'E4ECDF', the: 'FFFFFF', the2: 'F4F1E8', dam: '3E5F45', phu: '8A9A5B', phu2: 'E3CFAE', nhan: 'C2654F', chu: '2E3829' };
const LE = 0.6;

// ── Đọc kịch bản ──
// Mỗi trang: { so, tieuDe, truong: { 'loại': '…', 'ý chính': [...], … } }. Dòng thụt lề sau một trường thuộc về trường đó.
function docKichBan(md) {
  const lines = String(md || '').replace(/^\uFEFF/, '').normalize('NFC').split(/\r?\n/);
  const trang = [], phan = {};
  let cur = null, truong = null, muc = null;
  for (const l of lines) {
    const h = /^##\s+Trang\s+(\d+)\s*[·:.-]?\s*(.*)$/i.exec(l);
    if (h) { cur = { so: Number(h[1]), tieuDe: h[2].trim(), truong: {} }; trang.push(cur); truong = null; muc = null; continue; }
    const h2 = /^##\s+(.+)$/.exec(l);
    if (h2) { cur = null; muc = h2[1].trim(); phan[muc] = []; continue; }
    if (!cur) { if (muc && l.trim()) phan[muc].push(l); continue; }
    const f = /^- ([^:]{1,30}):\s*(.*)$/.exec(l);
    if (f) { truong = f[1].trim().toLowerCase(); cur.truong[truong] = { dau: f[2].trim(), con: [] }; continue; }
    if (truong && /^\s{2,}\S/.test(l)) cur.truong[truong].con.push(l.replace(/^\s{2}/, ''));
  }
  const tieuDe = (/^#\s+(.+)$/m.exec(lines.join('\n')) || [])[1] || '';
  return { tieuDe: tieuDe.replace(/^Workshop\s*·\s*/i, '').trim(), trang, phan };
}
const rong = v => !v || /^[—–-]?\s*$/.test(v);
const giaTri = (t, k) => { const f = t.truong[k]; return f && !rong(f.dau) ? f.dau : ''; };
const cacY = t => { const f = t.truong['ý chính']; return f ? f.con.filter(l => /^[-*]\s+/.test(l)).map(l => l.replace(/^[-*]\s+/, '').trim()) : []; };
const toanVan = (t, k) => { const f = t.truong[k]; return f ? [f.dau, ...f.con].filter(x => !rong(x)).join('\n') : ''; };

// ── Đọc thiết kế ──
function docThietKe(md) {
  const txt = String(md || '').replace(/^\uFEFF/, '').normalize('NFC'), lines = txt.split(/\r?\n/);
  const mau = { ...MAU_MAC_DINH };
  const bm = (lines.find(l => /^- Bảng màu:/i.test(l)) || '');
  for (const phan of bm.replace(/^- Bảng màu:[^.]*\.\s*/i, '').split(';')) {
    const hex = [...phan.matchAll(/#([0-9a-f]{6})\b/gi)].map(m => m[1].toUpperCase());
    if (!hex.length) continue;
    const p = phan.toLowerCase();
    if (/nền chính/.test(p)) mau.nen = hex[0];
    else if (/thẻ|nền phụ/.test(p)) { mau.the = hex[0]; if (hex[1]) mau.the2 = hex[1]; }
    else if (/tiêu đề|khối đậm/.test(p)) mau.dam = hex[0];
    else if (/nhấn phụ/.test(p)) { mau.phu = hex[0]; if (hex[1]) mau.phu2 = hex[1]; }
    else if (/cảnh báo|chữ nhấn/.test(p)) mau.nhan = hex[0];
    else if (/chữ thường|chữ chính/.test(p)) mau.chu = hex[0];
  }
  const fl = lines.find(l => /^- Font:/i.test(l)) || '';
  const fonts = fl.replace(/^- Font:\s*/i, '').split(';')[0].split('+').map(s => s.replace(/\(.*?\)/g, '').trim()).filter(Boolean);
  // Mục từng trang
  const trang = {};
  let cur = null;
  for (const l of lines) {
    const h = /^##\s+Trang\s+(\d+)/i.exec(l);
    if (h) { cur = trang[Number(h[1])] = { dong: [] }; continue; }
    if (/^##\s/.test(l)) { cur = null; continue; }
    if (cur) cur.dong.push(l);
  }
  for (const t of Object.values(trang)) {
    const all = t.dong.join('\n');
    t.ghiCong = ((/[Dd]òng (?:ghi|nguồn)[^"\n]*"([^"]+)"/.exec(all) || [])[1] || '').trim();
    t.dung = t.dong.map(docDongDung).filter(Boolean);
  }
  // Bảng "Danh sách hình"
  const dsHinh = [];
  const i0 = lines.findIndex(l => /^##\s*Danh sách hình\b/i.test(l));
  if (i0 >= 0) for (const l of lines.slice(i0 + 1)) {
    if (/^#{1,2}\s/.test(l)) break;
    if (!/^\s*\|/.test(l) || /^\s*\|[\s:|-]+\|\s*$/.test(l)) continue;
    const c = l.split('|').map(x => x.trim()).slice(1, -1);
    const ten = (/^`?([\p{L}\p{N}_.-]+\.(?:png|jpe?g))/iu.exec(c[0] || '') || [])[1];
    const so = ten && /^trang-0*(\d+)-/.exec(ten);
    if (!ten || !so) continue;
    dsHinh.push({ ten, trang: Number(so[1]), loai: (c[1] || '').trim(), nguon: c[2] || '', giayPhep: c[3] || '', trangThai: c[4] || '', ai: /^AI\b/i.test(c[3] || '') || /^AI:/i.test(c[2] || '') });
  }
  return { mau, fontTieuDe: fonts[0] || 'Lora', fontNoiDung: fonts[1] || fonts[0] || 'Be Vietnam Pro', trang, dsHinh };
}
// "- Dựng <file>: khung x0–x1, y0–y1; che x0–x1, y0–y1 = Nhãn; nhãn = Chú thích" (toạ độ điểm ảnh của file gốc)
const KHOANG = /(\d+)\s*[–-]\s*(\d+)\s*,\s*y?\s*(\d+)\s*[–-]\s*(\d+)/;
function docDongDung(l) {
  const m = /^-\s*Dựng\s+`?([\p{L}\p{N}_.-]+\.(?:png|jpe?g))`?\s*:\s*(.*)$/iu.exec(l);
  if (!m) return null;
  const out = { ten: m[1], khung: null, che: [], nhan: '' };
  for (const p of m[2].split(';').map(s => s.trim()).filter(Boolean)) {
    const k = KHOANG.exec(p.replace(/x\s*≈?|y\s*≈?|≈/g, s => (s.startsWith('y') ? 'y' : '')));
    const v = k && { x0: +k[1], x1: +k[2], y0: +k[3], y1: +k[4] };
    if (/^khung\b/i.test(p) && v) out.khung = v;
    else if (/^che\b/i.test(p) && v) out.che.push({ ...v, chu: (p.split('=').slice(1).join('=') || '').trim() });
    else if (/^nhãn\b/i.test(p)) out.nhan = p.split('=').slice(1).join('=').trim();
  }
  return out;
}

// ── Chữ ──
// "**Tiêu đề:** thân [1][2]" → các đoạn chữ; số nguồn [n] in nhỏ, nhạt
function chuoiChu(s, md) {
  const out = [];
  String(s || '').split(/(\*\*[^*]+\*\*)/).forEach(p => {
    if (!p) return;
    const dam = /^\*\*.*\*\*$/.test(p), t = dam ? p.slice(2, -2) : p;
    t.split(/((?:\[\d+\])+)/).forEach(q => {
      if (!q) return;
      if (/^(\[\d+\])+$/.test(q)) out.push({ t: q, co: Math.max(10, Math.round((md.co || 18) * 0.62)), mau: md.mauNguon || md.mau });
      else out.push({ t: q.replace(/`/g, ''), dam: dam || md.dam, nghieng: md.nghieng, mau: md.mau, font: md.font, co: md.co });
    });
  });
  return out;
}
const dinhDoan = (s, md) => ({ chu: chuoiChu(s, md), canh: md.canh, cham: md.cham, sau: md.sau });
const boDinhDang = s => String(s || '').replace(/\*\*/g, '').replace(/`/g, '');
// Bề rộng trung bình một ký tự (theo cỡ chữ), đo trên Be Vietnam Pro (font rộng): chữ thường ~0,64, in hoa ~0,84
function heSoRong(s) {
  const chu = String(s).replace(/[^\p{L}]/gu, ''), hoa = chu ? chu.replace(/[^\p{Lu}]/gu, '').length / chu.length : 0;
  return 0.64 + 0.2 * hoa;
}
const rongChu = (s, co) => (boDinhDang(s).length * co * heSoRong(s)) / 72;
// Ước lượng chiều cao chữ trong khung rộng w (inch), xuống dòng theo từ
function caoChu(doan, co, w) {
  let dong = 0;
  for (const d of doan) {
    const tu = boDinhDang(d).split(/\s+/).filter(Boolean), he = heSoRong(d);
    let n = 1, cur = 0;
    for (const t of tu) {
      let r = ((t.length + 1) * co * he) / 72;
      if (r > w) { if (cur) n++; n += Math.ceil(r / w) - 1; r = r % w; cur = r; continue; } // từ dài hơn dòng (đường link) tự gãy
      if (cur && cur + r > w) { n++; cur = r; } else cur += r;
    }
    dong += n;
  }
  return (dong * co * 1.38 + doan.length * 5) / 72; // khoảng dòng 1,1 của PowerPoint + phần dấu tiếng Việt
}
// Cỡ chữ lớn nhất (≤ max) để các đoạn vừa khung w×h, đã trừ lề trong le
function coVua(doan, w, h, max, min = 12, le = 0.15) {
  for (let co = max; co > min; co--) if (caoChu(doan, co, w - 2 * le - 0.1) <= h - 1.4 * le - 0.08) return co;
  return min;
}
// Ý: "(Câu to) …" là câu lớn; "**A:** b" thành thẻ có tiêu đề
function tachY(y) {
  const to = /^\(Câu to\)\s*(.*)$/i.exec(y);
  if (to) return { to: true, than: to[1] };
  // Chỉ phần in đậm có dấu hai chấm mới là tiêu đề thẻ ("**Ngồi:** …"); "**Đau lưng dưới** [1]" giữ nguyên là một ý
  const m = /^\*\*([^*]+?)(:\*\*|\*\*:)\s*(.*)$/.exec(y);
  if (m) return { tieuDe: m[1].trim(), than: m[3].trim() };
  return { than: y };
}

// ── Hình ──
// Khung cắt (theo tỉ lệ 0–1) để ảnh phủ kín ô w×h; vung: vùng được dùng của ảnh (bỏ logo, khung tự chọn)
function catPhu(anh, vung, w, h) {
  const vw = vung.x1 - vung.x0, vh = vung.y1 - vung.y0, tl = w / h;
  let cw = vw, ch = vw / tl;
  if (ch > vh) { ch = vh; cw = vh * tl; }
  const x0 = vung.x0 + (vw - cw) / 2, y0 = vung.y0 + (vh - ch) / 2;
  return { l: x0 / anh.w, t: y0 / anh.h, r: 1 - (x0 + cw) / anh.w, b: 1 - (y0 + ch) / anh.h, cua: { x0, y0, cw, ch } };
}
function vungDung(anh, h, dung) {
  if (dung && dung.khung) return { x0: dung.khung.x0, y0: dung.khung.y0, x1: Math.min(anh.w, dung.khung.x1), y1: Math.min(anh.h, dung.khung.y1) };
  // Ảnh Gemini có logo ngôi sao ở góc dưới phải: bỏ 7% mép phải
  return { x0: 0, y0: 0, x1: h && h.ai ? anh.w * 0.93 : anh.w, y1: anh.h };
}
// Đặt ảnh vào ô: phu = cắt kín ô, không thì vừa ô (giữ trọn vùng dùng). Trả về các hình (ảnh + khối che nhãn + nhãn Việt)
function datAnh(o, box, ctx, phu) {
  const anh = ctx.kichThuoc[o.ten];
  if (!anh) return [];
  const vung = vungDung(anh, o.hang, o.dung);
  let b = { ...box }, cat;
  if (phu) cat = catPhu(anh, vung, b.w, b.h);
  else {
    const vw = vung.x1 - vung.x0, vh = vung.y1 - vung.y0, s = Math.min(b.w / vw, b.h / vh);
    const w = vw * s, h = vh * s;
    b = { x: b.x + (b.w - w) / 2, y: b.y + (b.h - h) / 2, w, h };
    cat = { l: vung.x0 / anh.w, t: vung.y0 / anh.h, r: 1 - vung.x1 / anh.w, b: 1 - vung.y1 / anh.h, cua: { x0: vung.x0, y0: vung.y0, cw: vw, ch: vh } };
  }
  ctx.media.add(o.ten);
  const out = [{ kieu: 'anh', anh: o.ten, ten: o.ten, moTa: o.moTa || '', ...b, cat }];
  const { x0, y0, cw, ch } = cat.cua, sx = b.w / cw, sy = b.h / ch;
  // Mỗi nhãn Anh: một khối nền trắng che đi và chứa nhãn Việt (cỡ 10–14), khối nở ra cho vừa chữ nhưng không vượt mép phải
  // của ảnh (thẻ bên cạnh sẽ che mất). Ảnh đặt nhỏ quá, có nhãn không vừa: trên ảnh chỉ ghi số ①②…, chú thích đủ xuống dưới ảnh.
  const che = ((o.dung && o.dung.che) || []).map(c => ({ c, r: { x: b.x + (c.x0 - x0) * sx, y: b.y + (c.y0 - y0) * sy, w: (c.x1 - c.x0) * sx, h: (c.y1 - c.y0) * sy } }))
    .filter(({ r }) => !(r.x + r.w <= b.x || r.y + r.h <= b.y || r.x >= b.x + b.w || r.y >= b.y + b.h));
  const vua = ({ c, r }) => !c.chu || rongChu(c.chu, 10) + 0.12 <= Math.max(r.w, b.x + b.w - r.x);
  const danhSo = !che.every(vua), chuThich = [];
  let so = 0;
  for (const { c, r } of che) {
    let chu = c.chu;
    if (danhSo && chu) { const ky = String.fromCodePoint(0x2460 + so++); chuThich.push(`${ky} ${chu.replace(/^[①-⑳]\s*/, '')}`); chu = ky; }
    let co = Math.max(12, Math.min(14, Math.round(r.h * 72 * 0.6)));
    while (chu && co > 10 && rongChu(chu, co) + 0.12 > Math.max(r.w, b.x + b.w - r.x)) co--;
    const w = chu ? Math.max(r.w, Math.min(3.4, rongChu(chu, co) + 0.12)) : r.w, cao = Math.max(r.h, (co * 1.35) / 72 + 0.06);
    out.push({ kieu: 'hop', khongXuong: true, x: r.x, y: r.y + r.h / 2 - cao / 2, w: danhSo ? Math.min(w, r.w) : w, h: cao, nen: 'FFFFFF', le: 0.03, doc: 'ctr', font: ctx.fn, co, mau: ctx.mau.chu,
      doan: chu ? [dinhDoan(chu, { co, mau: ctx.mau.chu, font: ctx.fn, canh: danhSo ? 'l' : undefined })] : [], ten: chu ? 'Nhãn Việt' : 'Che nhãn' });
  }
  out.chuThich = chuThich;
  return out;
}
// Xếp nhiều ảnh vào một vùng: chọn số cột cho ảnh lớn nhất; mỗi ảnh có thể kèm chú thích dưới
function xepAnh(ds, vung, ctx, { phu = false, khoang = 0.25 } = {}) {
  const co = ds.filter(o => ctx.kichThuoc[o.ten]);
  if (!co.length) return [];
  const coNhan = co.some(o => o.dung && (o.dung.nhan || o.dung.che.length)), caoNhan = coNhan ? 0.55 : 0;
  let tot = null;
  for (let cot = 1; cot <= co.length; cot++) {
    const hang = Math.ceil(co.length / cot), w = (vung.w - khoang * (cot - 1)) / cot, h = (vung.h - khoang * (hang - 1)) / hang - caoNhan;
    if (w <= 0.5 || h <= 0.5) continue;
    const dt = co.reduce((a, o) => {
      const k = ctx.kichThuoc[o.ten], v = vungDung(k, o.hang, o.dung), vw = v.x1 - v.x0, vh = v.y1 - v.y0, s = Math.min(w / vw, h / vh);
      return a + (phu ? w * h : vw * s * vh * s);
    }, 0);
    if (!tot || dt > tot.dt) tot = { cot, hang, w, h, dt };
  }
  if (!tot) return [];
  const out = [];
  co.forEach((o, i) => {
    const c = i % tot.cot, r = Math.floor(i / tot.cot);
    const box = { x: vung.x + c * (tot.w + khoang), y: vung.y + r * (tot.h + caoNhan + khoang), w: tot.w, h: tot.h };
    const hinh = datAnh(o, box, ctx, phu);
    out.push(...hinh);
    const nhan = o.dung && o.dung.nhan, so = hinh.chuThich || [];
    if ((nhan || so.length) && hinh[0]) {
      // Chú thích dưới ảnh: tên hình (đậm) rồi các nhãn đã đánh số, nằm trong phần còn lại của ô
      const y = hinh[0].y + hinh[0].h + 0.04, h = Math.max(0.36, box.y + box.h + caoNhan - y), cs = coVua([[nhan, ...so].filter(Boolean).join(' · ')], box.w, h, 14, 9, 0.02);
      out.push({ kieu: 'hop', x: box.x, y, w: box.w, h, le: 0.02, font: ctx.fn, co: cs, mau: ctx.mau.dam,
        doan: [{ chu: [...(nhan ? [{ t: nhan, dam: true, co: cs }] : []), ...(so.length ? [{ t: (nhan ? ' · ' : '') + so.join(' · '), co: cs - 1, mau: ctx.mau.chu }] : [])], canh: 'ctr', sau: 0 }], ten: 'Chú thích hình' });
    }
  });
  return out;
}

// ── Khối dựng sẵn ──
function nhanTron(ctx, x, y, chu, { co = 18, nen, mauChu = 'FFFFFF', w } = {}) {
  const t = boDinhDang(chu).toUpperCase(), maxW = Math.min(w || RONG - 2 * LE, RONG - 2 * LE), le = 0.45;
  while (co > 12 && rongChu(t, co) + 2 * le > maxW) co--;
  const ww = w || Math.min(maxW, rongChu(t, co) + 2 * le);
  return { kieu: 'hop', dang: 'vienthuoc', khongXuong: true, x, y, w: ww, h: (co * 1.9) / 72 + 0.08, nen: nen || ctx.mau.dam, doc: 'ctr', le: 0.15, font: ctx.fn, co, mau: mauChu,
    doan: [{ chu: [{ t, dam: true }], canh: 'ctr', sau: 0 }], ten: 'Nhãn tiêu đề' };
}
// Cỡ chữ vừa một thẻ: tiêu đề (cỡ +1) và thân là hai đoạn
// Trả về 10 khi cả cỡ 11 cũng không vừa (để lưới chọn cách xếp khác)
function coThe(y, box, coMax) {
  const le = 0.18, w = box.w - 2 * le - 0.1, h = box.h - 1.4 * le - 0.08;
  // Tiêu đề in đậm rộng hơn chữ thường ~8%: đo với bề ngang hẹp lại tương ứng
  for (let co = coMax; co >= 11; co--) if ((y.tieuDe ? caoChu([y.tieuDe], co + 1, w / 1.08) : 0) + (y.than ? caoChu([y.than], co, w) : 0) <= h) return co;
  return 10;
}
// Thẻ: nền trắng bo góc đổ bóng như slide mẫu, tiêu đề chữ có chân. nen === null: chữ trần (không khung)
function the(ctx, box, y, { nen, mauChu, mauTieuDe, coMax = 22, mo, co: coDat, canh } = {}) {
  const mc = mauChu || ctx.mau.chu, mt = mauTieuDe || ctx.mau.dam;
  const co = coDat || coThe(y, box, coMax);
  const doan = [];
  if (y.tieuDe) doan.push({ chu: chuoiChu(y.tieuDe, { co: co + 2, mau: mt, font: ctx.ft, dam: true }), canh, sau: 3 });
  if (y.than) doan.push({ chu: chuoiChu(y.than, { co, mau: mc, font: ctx.fn, mauNguon: ctx.mau.phu }), canh, sau: 0 });
  const coNen = nen !== null;
  return { kieu: 'hop', dang: 'bo', bo: 0.1, ...box, nen: coNen ? nen || ctx.mau.the : null, mo, bong: coNen && (mo == null || mo > 0.5), le: 0.18, doc: 'ctr', font: ctx.fn, co, mau: mc, doan, ten: y.tieuDe || 'Thẻ' };
}
// Thẻ có dải tiêu đề màu ở trên (như các khối nguyên nhân của slide mẫu); màu dải đổi luân phiên
function theDai(ctx, box, y, co, i) {
  const hDai = ((co + 3) * 1.45) / 72 + 0.16, mauDai = [ctx.mau.dam, ctx.mau.phu, ctx.mau.nhan][i % 3];
  return [{ kieu: 'hop', dang: 'bo', bo: 0.08, ...box, nen: ctx.mau.the, bong: true, ten: 'Thẻ' },
    { kieu: 'hop', dang: 'dauBo', bo: 0.35, x: box.x, y: box.y, w: box.w, h: hDai, nen: mauDai, le: 0.16, doc: 'ctr', font: ctx.ft, co: co + 2, mau: 'FFFFFF',
      doan: [{ chu: chuoiChu(y.tieuDe, { co: co + 2, mau: 'FFFFFF', font: ctx.ft, dam: true, mauNguon: 'FFFFFF' }), canh: 'ctr', sau: 0 }], ten: y.tieuDe },
    { kieu: 'hop', x: box.x, y: box.y + hDai, w: box.w, h: box.h - hDai, le: 0.18, doc: 'ctr', font: ctx.fn, co, mau: ctx.mau.chu,
      doan: [{ chu: chuoiChu(y.than, { co, mau: ctx.mau.chu, font: ctx.fn, mauNguon: ctx.mau.phu }), sau: 0 }], ten: 'Nội dung thẻ' }];
}
// Danh sách đánh số (quy tắc "Trình bày liệt kê" của templates/thiet-ke.md): lưới thẻ sáng, số lớn 01, 02… màu nhấn,
// tên ý đậm, mô tả bên dưới. Lưới còn ô trống thì câu chốt vào ô đó, nền khối đậm (trả về daDungChot để trang không ghi lại);
// không còn ô thì chừa dải dưới cùng cho câu chốt. v: vùng tới mép dưới nội dung.
function theSo(ctx, ys, v, chot) {
  const n = ys.length, cot = n <= 3 ? n : n === 4 ? 2 : 3, hang = Math.ceil(n / cot), k = 0.25;
  const daDungChot = !!chot && cot * hang > n, vh = chot && !daDungChot ? v.h - 0.55 : v.h;
  const w = (v.w - k * (cot - 1)) / cot, h = Math.min(2.6, (vh - k * (hang - 1)) / hang), out = [];
  const coSo = Math.round(Math.min(44, h * 72 * 0.3)), hSo = (coSo * 1.15) / 72 + 0.1;
  const box = i => ({ x: v.x + (i % cot) * (w + k), y: v.y + Math.floor(i / cot) * (h + k), w, h });
  const vungChu = b => ({ x: b.x, y: b.y + 0.2 + hSo, w: b.w, h: b.h - 0.2 - hSo });
  const co = Math.min(...ys.map((y, i) => coThe(y, vungChu(box(i)), 20)));
  ys.forEach((y, i) => {
    const b = box(i);
    out.push({ kieu: 'hop', dang: 'bo', bo: 0.1, ...b, nen: ctx.mau.the, bong: true, ten: 'Thẻ số ' + (i + 1) });
    out.push({ kieu: 'hop', x: b.x + 0.06, y: b.y + 0.12, w: b.w - 0.12, h: hSo, le: 0.12, doc: 't', font: ctx.fn, co: coSo, mau: ctx.mau.nhan,
      doan: [{ chu: [{ t: String(i + 1).padStart(2, '0'), dam: true }], sau: 0 }], ten: 'Số ' + (i + 1) });
    out.push({ ...the(ctx, vungChu(b), y, { co, nen: null }), doc: 't' });
  });
  if (daDungChot) {
    const b = box(n), coC = coVua([chot], b.w, b.h, 30, 14, 0.3);
    out.push({ kieu: 'hop', dang: 'bo', bo: 0.1, ...b, nen: ctx.mau.dam, bong: true, le: 0.3, doc: 'ctr', font: ctx.ft, co: coC, mau: 'FFFFFF',
      doan: [dinhDoan(chot, { co: coC, mau: 'FFFFFF', font: ctx.ft, nghieng: true, mauNguon: ctx.mau.phu2 })], ten: 'Câu chốt' });
  }
  out.daDungChot = daDungChot;
  return out;
}
function cauChot(ctx, t, { y = 6.55, mauChu, w } = {}) {
  const s = giaTri(t, 'câu chốt');
  if (!s) return [];
  const co = coVua([s], w || RONG - 2 * LE, 0.75, 22, 14);
  return [{ kieu: 'hop', x: LE, y, w: w || RONG - 2 * LE, h: 0.75, le: 0.05, doc: 'ctr', font: ctx.ft, co, mau: mauChu || ctx.mau.dam,
    doan: [dinhDoan(s, { co, mau: mauChu || ctx.mau.dam, font: ctx.ft, nghieng: true, mauNguon: ctx.mau.phu })], ten: 'Câu chốt' }];
}
function luoiThe(ctx, ys, vung, opt = {}) {
  if (!ys.length) return [];
  const k = 0.22;
  // Số cột: theo yêu cầu, không thì thử 1–3 cột (cột rộng ≥ 2,6 inch) và chọn cách cho chữ to nhất
  const thu = cot => {
    const hang = Math.ceil(ys.length / cot), w = (vung.w - k * (cot - 1)) / cot, h = Math.min(opt.caoMax || 9, (vung.h - k * (hang - 1)) / hang);
    const box = i => ({ x: vung.x + (i % cot) * (w + k), y: vung.y + Math.floor(i / cot) * (h + k), w, h });
    // Cùng một cỡ chữ cho mọi thẻ trong lưới: lấy cỡ của thẻ nhiều chữ nhất
    return { box, co: Math.min(...ys.map((y, i) => coThe(y, box(i), opt.coMax || 22))) };
  };
  let tot = thu(opt.cot || 1);
  if (!opt.cot) for (let cot = 2; cot <= Math.min(3, ys.length); cot++) {
    if ((vung.w - k * (cot - 1)) / cot < 2.4) break;
    const t = thu(cot);
    if (t.co > tot.co + 2 || (tot.co <= 10 && t.co > tot.co)) tot = t;
  }
  // Lưới từ 2 cột mà ý nào cũng có tiêu đề: thẻ có dải tiêu đề màu
  const cot = Math.round((vung.w + k) / (tot.box(0).w + k));
  if (!opt.khongDai && cot >= 2 && !opt.nen && ys.every(y => y.tieuDe && y.than)) return ys.flatMap((y, i) => theDai(ctx, tot.box(i), y, Math.max(11, tot.co - 1), i));
  // Thẻ xếp một cột (ý ngang hàng): vạch màu nhấn ở mép trái
  const vach = cot === 1 && !opt.nen && ys.length >= 2;
  return ys.flatMap((y, i) => {
    const b = tot.box(i), c = the(ctx, b, y, { ...opt, co: tot.co });
    return vach ? [c, { kieu: 'hop', dang: 'vienthuoc', x: b.x + 0.06, y: b.y + 0.14, w: 0.06, h: b.h - 0.28, nen: ctx.mau.nhan, ten: 'Vạch' }] : [c];
  });
}

// ── Trang trí theo slide mẫu (vẽ bằng hình vector của PowerPoint, không cần ảnh, sửa được) ──
const TRANG_TRI = { trangTri: true };
// Cành lá: thân cong và 6 lá so le, toạ độ 0–1000 trong khung; lat = lật ngang
function canhLa(x, y, w, h, mau, { mo = 0.5, lat = false } = {}) {
  const X = v => (lat ? 1000 - v : v), la = [[505, 880, 250, 700], [492, 700, 770, 560], [512, 540, 260, 380], [528, 385, 790, 250], [522, 230, 320, 95], [520, 120, 640, 10]];
  const duong = [{ d: [['M', X(500), 1000], ['C', X(430), 700, X(600), 350, X(520), 40]] }];
  for (const [bx, by, tx, ty] of la) {
    const dx = tx - bx, dy = ty - by, l = Math.hypot(dx, dy), nx = (-dy / l) * 70, ny = (dx / l) * 70;
    duong.push({ kin: true, d: [['M', X(bx), by], ['C', X(bx + dx * 0.3 + nx), by + dy * 0.3 + ny, X(bx + dx * 0.75 + nx * 0.7), by + dy * 0.75 + ny * 0.7, X(tx), ty],
      ['C', X(bx + dx * 0.75 - nx * 0.7), by + dy * 0.75 - ny * 0.7, X(bx + dx * 0.3 - nx), by + dy * 0.3 - ny, X(bx), by], ['Z']] });
  }
  return { kieu: 've', ...TRANG_TRI, x, y, w, h, duong, nen: mau, mo, net: mau, netMo: mo, netDay: 1.25, ten: 'Cành lá' };
}
// Bó sóng nét mảnh chạy ngang khung
function bongSong(x, y, w, h, mau, { mo = 0.3, so = 9 } = {}) {
  const duong = [];
  for (let i = 0; i < so; i++) {
    const o = (i - (so - 1) / 2) * (420 / so);
    duong.push({ d: [['M', 0, 600 + o * 1.4], ['C', 180, 250 + o * 0.6, 360, 260 + o * 1.8, 520, 520 + o], ['C', 690, 800 + o * 0.4, 840, 760 + o * 1.6, 1000, 380 + o * 0.8]] });
  }
  return { kieu: 've', ...TRANG_TRI, x, y, w, h, duong, net: mau, netMo: mo, netDay: 0.75, ten: 'Sóng' };
}
// Vệt màu mềm (bầu dục méo)
const vetMau = (x, y, w, h, mau, mo = 0.45) => ({ kieu: 've', ...TRANG_TRI, x, y, w, h, nen: mau, mo, ten: 'Vệt màu',
  duong: [{ kin: true, d: [['M', 520, 0], ['C', 820, 20, 1000, 260, 980, 520], ['C', 960, 800, 700, 1000, 430, 980], ['C', 160, 960, 0, 760, 30, 470], ['C', 60, 200, 260, -10, 520, 0], ['Z']] }] });
// Bộ trang trí đổi theo số trang để các trang không giống hệt nhau; đặt ở mép, phía sau nội dung
function trangTri(ctx, so, { toi = false } = {}) {
  const la = toi ? ctx.mau.phu2 : ctx.mau.phu, vet = toi ? ctx.mau.dam : ctx.mau.phu2;
  switch (so % 3) {
    case 0: return [vetMau(RONG - 2.4, -0.9, 3.3, 2.4, vet, toi ? 0.5 : 0.55), canhLa(RONG - 1.25, 0.12, 0.85, 1.25, la, { mo: toi ? 0.35 : 0.45 })];
    case 1: return [bongSong(-0.4, CAO - 2.1, RONG + 0.8, 2.3, toi ? ctx.mau.phu2 : ctx.mau.dam, { mo: toi ? 0.22 : 0.16 }), canhLa(RONG - 1.2, 0.1, 0.8, 1.2, la, { mo: 0.4, lat: true })];
    default: return [vetMau(-1.1, CAO - 1.7, 3.0, 2.4, vet, toi ? 0.5 : 0.5), canhLa(RONG - 1.25, 0.12, 0.85, 1.25, la, { mo: toi ? 0.35 : 0.45 })];
  }
}
// Tiêu đề trang chữ có chân to như slide mẫu (thay cho nhãn viên thuốc ở trang nội dung)
function tieuDeTrang(ctx, s, { mau } = {}) {
  const w = RONG - 2 * LE - 1.3, co = coVua([s], w, 0.85, 32, 20, 0.05);
  return { kieu: 'hop', x: LE, y: 0.3, w, h: 0.85, le: 0.05, doc: 'ctr', font: ctx.ft, co, mau: mau || ctx.mau.dam, doan: [{ chu: [{ t: s, dam: true }], sau: 0 }], ten: 'Tiêu đề trang' };
}
// Ảnh không phủ kín trang: bo góc nhẹ, đổ bóng
const boAnh = ds => ds.map(s => (s.kieu === 'anh' ? { ...s, dang: 'bo', bo: 0.05, bong: true } : s));

// ── Kiểu trang ──
function trangBia(ctx, t, anh) {
  const ys = cacY(t), phan = boDinhDang(ys[0] || ctx.tieuDe).split(/\s*·\s*/);
  const out = [vetMau(-1.4, -1.2, 4.2, 3.2, ctx.mau.phu2, 0.5), canhLa(5.7, CAO - 1.95, 1.05, 1.6, ctx.mau.phu, { mo: 0.5, lat: true })];
  const xAnh = 6.9;
  if (anh.length) out.push(...datAnh(anh[0], { x: xAnh, y: 0, w: RONG - xAnh, h: CAO }, ctx, true));
  const [nhan, ...con] = phan.length > 1 ? phan : ['', ...phan];
  if (nhan) out.push(nhanTron(ctx, 0.75, 1.5, nhan, { co: 18 }));
  const chinh = con[0] || '', phu = con.slice(1).join(' · ');
  const coChinh = coVua([chinh], 5.9, 1.9, 54, 30);
  out.push({ kieu: 'hop', x: 0.7, y: 2.25, w: 5.9, h: 1.9, le: 0.05, doc: 'b', font: ctx.ft, co: coChinh, mau: ctx.mau.dam, doan: [{ chu: [{ t: chinh.toUpperCase(), dam: true }], sau: 0 }], ten: 'Tiêu đề' });
  if (phu) out.push({ kieu: 'hop', x: 0.7, y: 4.25, w: 5.9, h: 1.2, le: 0.05, font: ctx.fn, co: coVua([phu], 5.9, 1.2, 26, 16), mau: ctx.mau.nhan, doan: [{ chu: [{ t: phu.toUpperCase(), dam: true }], sau: 0 }], ten: 'Phụ đề' });
  if (ys[1]) out.push({ kieu: 'hop', x: 0.7, y: 6.3, w: 5.9, h: 0.55, le: 0.05, font: ctx.fn, co: 16, mau: ctx.mau.chu, doan: [dinhDoan(ys[1], { co: 16, mau: ctx.mau.chu, font: ctx.fn })], ten: 'Giảng viên' });
  return { bg: ctx.mau.the2, shapes: out };
}
function trangTuThe(ctx, t, anh) {
  const nhan = (giaTri(t, 'nhãn') || '').split(/\s*·\s*/).filter(Boolean), n = Math.max(anh.length, nhan.length, 1), out = [];
  // Nhãn ngay trên ảnh, cả khối nằm giữa trang theo chiều dọc
  const k = 0.35, w = (RONG - 2 * LE - k * (n - 1)) / n, hAnh = Math.min(w * 0.75, 5.4), hNhan = 0.62;
  const yNhan = Math.max(0.5, (CAO - hNhan - 0.25 - hAnh) / 2), yAnh = yNhan + hNhan + 0.25;
  const coNhan = Math.min(...nhan.map(s => nhanTron(ctx, 0, 0, s, { co: n > 2 ? 16 : 18, w }).co));
  // Như slide mẫu: nền trắng, nhãn viên thuốc ở giữa phía trên ảnh, cành lá nhạt ở góc
  out.push(canhLa(0.1, CAO - 1.55, 0.95, 1.4, ctx.mau.phu, { mo: 0.35 }), canhLa(RONG - 1.0, CAO - 1.55, 0.95, 1.4, ctx.mau.phu, { mo: 0.35, lat: true }));
  for (let i = 0; i < n; i++) {
    const x = LE + i * (w + k);
    if (nhan[i]) { const p = nhanTron(ctx, 0, yNhan, nhan[i], { co: coNhan }), pw = Math.min(w, p.w + 0.3); out.push({ ...p, x: x + (w - pw) / 2, w: pw, h: hNhan, bong: true }); }
    if (anh[i]) out.push(...boAnh(datAnh(anh[i], { x, y: yAnh, w, h: hAnh }, ctx, !(anh[i].dung && anh[i].dung.khung))));
  }
  return { bg: ctx.mau.the, shapes: out };
}
function trangTomLuoc(ctx, t, anh) {
  const out = [];
  if (anh.length) out.push(...datAnh(anh[0], { x: 0, y: 0, w: RONG, h: CAO }, ctx, true));
  else out.push({ kieu: 'hop', x: 0, y: 0, w: RONG, h: CAO, nen: ctx.mau.nen });
  out.push(nhanTron(ctx, LE, 0.5, t.tieuDe || 'Tóm lược'));
  const chot = giaTri(t, 'câu chốt');
  if (chot) out.push({ kieu: 'hop', dang: 'bo', x: LE, y: 1.3, w: 6.6, h: 1.25, nen: 'FFFFFF', mo: 0.82, le: 0.22, doc: 'ctr', font: ctx.ft, co: coVua([chot], 6.6, 1.25, 26, 16), mau: ctx.mau.dam,
    doan: [dinhDoan(chot, { co: coVua([chot], 6.6, 1.25, 26, 16), mau: ctx.mau.dam, font: ctx.ft, nghieng: true })], ten: 'Câu chốt' });
  const ys = cacY(t).map(tachY);
  out.push(...luoiThe(ctx, ys, { x: LE, y: 4.35, w: RONG - 2 * LE, h: 2.55 }, { cot: Math.min(3, ys.length) || 1, nen: 'FFFFFF', mo: 0.88, coMax: 17 }));
  return { bg: ctx.mau.nen, shapes: out };
}
function trangNguon(ctx, t, kb) {
  const out = [canhLa(RONG - 1.2, 0.1, 0.8, 1.2, ctx.mau.phu, { mo: 0.35 }), tieuDeTrang(ctx, t.tieuDe || 'Nguồn tham khảo')];
  const ds = (kb.phan['Nguồn tham khảo'] || []).map(l => l.trim()).filter(Boolean);
  const nguon = ds.filter(l => /^\[\d+\]/.test(l)), ghiCong = ds.filter(l => !/^\[\d+\]/.test(l));
  // Chia hai cột theo độ dài chữ (không theo số mục) cho hai cột cao bằng nhau
  const tong = nguon.reduce((a, l) => a + l.length, 0);
  let nua = 0;
  for (let s = 0; nua < nguon.length && s + nguon[nua].length / 2 <= tong / 2; nua++) s += nguon[nua].length;
  const cot = [nguon.slice(0, nua), nguon.slice(nua)], w = (RONG - 2 * LE - 0.3) / 2;
  // Đường link bỏ "https://www." cho gọn (vẫn mở được khi gõ vào trình duyệt)
  const gon = c => c.map(l => { const m = /^(.*?)\s*(https?:\/\/\S+)$/.exec(l) || [null, l, '']; return [m[1], m[2].replace(/^https?:\/\/(www\.)?/, '')]; });
  const co = Math.min(...cot.map(c => coVua(gon(c).map(x => x.join(' ')), w, 4.95, 12, 7, 0.05)));
  cot.forEach((c, i) => c.length && out.push({ kieu: 'hop', x: LE + i * (w + 0.3), y: 1.25, w, h: 4.95, le: 0.05, font: ctx.fn, co, mau: ctx.mau.chu,
    doan: gon(c).map(([t, u]) => ({ chu: [{ t }, { t: u ? '  ' + u : '', mau: ctx.mau.phu, co: co - 1 }], sau: 2 })), ten: 'Danh sách nguồn' }));
  if (ghiCong.length) out.push({ kieu: 'hop', x: LE, y: 6.3, w: RONG - 2 * LE, h: 0.9, le: 0.05, font: ctx.fn, co: coVua(ghiCong, RONG - 2 * LE, 0.9, 11, 8), mau: ctx.mau.chu,
    doan: ghiCong.map(l => dinhDoan(l, { co: coVua(ghiCong, RONG - 2 * LE, 0.9, 11, 8), mau: ctx.mau.chu, font: ctx.fn })), ten: 'Ghi công hình' });
  return { bg: ctx.mau.the, shapes: out };
}
// Trang nội dung: nhãn tiêu đề, câu lớn (nếu có), thẻ ý chính, hình bên trái, câu chốt dưới cùng; vài kiểu sơ đồ theo dòng Hình
function trangNoiDung(ctx, t, anh, tk) {
  const hinhTxt = (giaTri(t, 'hình') + ' ' + ((tk && tk.dong) || []).filter(l => /^- (Hình|Bố cục)/.test(l)).join(' ')).toLowerCase();
  const dam = /nền (?:xô thơm )?đậm/.test(hinhTxt);
  // Nền đổi luân phiên xô thơm / kem như slide mẫu; trang trí ở mép, vẽ trước để nằm dưới nội dung
  const nenTrang = dam ? ctx.mau.dam : t.so % 2 ? ctx.mau.the2 : ctx.mau.nen;
  const out = [...trangTri(ctx, t.so, { toi: dam }), tieuDeTrang(ctx, t.tieuDe, { mau: dam ? ctx.mau.phu2 : null })];
  let ys = cacY(t).map(tachY);
  let y0 = 1.35;
  const to = ys.find(y => y.to);
  if (to) {
    ys = ys.filter(y => y !== to);
    const co = coVua([to.than], RONG - 2 * LE, 1.3, 30, 18);
    out.push({ kieu: 'hop', dang: 'bo', bo: 0.12, x: LE, y: y0, w: RONG - 2 * LE, h: 1.3, nen: dam ? 'FFFFFF' : ctx.mau.the, mo: dam ? 0.15 : null, bong: !dam, le: 0.25, doc: 'ctr', font: ctx.ft, co, mau: dam ? 'FFFFFF' : ctx.mau.dam,
      doan: [dinhDoan(to.than, { co, mau: dam ? 'FFFFFF' : ctx.mau.dam, font: ctx.ft, mauNguon: ctx.mau.phu })], ten: 'Câu lớn' });
    y0 += 1.5;
  }
  const yCuoi = giaTri(t, 'câu chốt') ? 6.45 : 7.0, vung = { x: LE, y: y0, w: RONG - 2 * LE, h: yCuoi - y0 };
  const optThe = dam ? { nen: 'FFFFFF', mo: 0.14, mauChu: 'FFFFFF', mauTieuDe: ctx.mau.phu2 } : {};
  let wAnh = 0, daDungChot = false;
  if (/dòng thời gian/.test(hinhTxt) && !anh.length) out.push(...dongThoiGian(ctx, ys, vung));
  else if (/venn/.test(hinhTxt) && !anh.length && ys.length >= 2) out.push(...venn(ctx, ys, vung));
  else if (/cảnh báo/.test(hinhTxt) && !anh.length && ys.some(y => y.tieuDe && !y.than)) out.push(...canhBao(ctx, ys, vung));
  else if (!anh.length && /danh sách|lưới/.test(giaTri(t, 'loại').toLowerCase()) && ys.length >= 3 && ys.length <= 8 && ys.every(y => boDinhDang((y.tieuDe || '') + ' ' + y.than).length <= 120)) {
    const ds = theSo(ctx, ys, { ...vung, h: 7.0 - vung.y }, giaTri(t, 'câu chốt'));
    out.push(...ds);
    daDungChot = ds.daDungChot;
  } else if (anh.length >= 3) {
    // Nhiều hình: hình chiếm phần lớn bề ngang, thẻ một cột bên phải
    wAnh = vung.w * 0.62;
    out.push(...boAnh(xepAnh(anh, { x: vung.x, y: vung.y, w: wAnh, h: vung.h - (tk && tk.ghiCong ? 0.32 : 0) }, ctx, { khoang: 0.2 })));
    out.push(...luoiThe(ctx, ys, { x: vung.x + wAnh + 0.3, y: vung.y, w: vung.w - wAnh - 0.3, h: vung.h }, { ...optThe, cot: 1 }));
  } else if (anh.length) {
    // Hình ngang (tổng bề ngang lớn hơn chiều cao) được nửa trang trở lên, hình đứng ít hơn
    const tl = anh.reduce((a, o) => { const k = ctx.kichThuoc[o.ten], v = vungDung(k, o.hang, o.dung); return a + (v.x1 - v.x0) / (v.y1 - v.y0); }, 0);
    wAnh = vung.w * Math.min(tl > 1.5 ? 0.55 : tl > 1 ? 0.5 : 0.42, ys.length >= 4 ? 0.42 : 1); // nhiều ý thì nhường chỗ cho thẻ
    out.push(...boAnh(xepAnh(anh, { x: vung.x, y: vung.y, w: wAnh, h: vung.h - (tk && tk.ghiCong ? 0.32 : 0) }, ctx)));
    out.push(...luoiThe(ctx, ys, { x: vung.x + wAnh + 0.35, y: vung.y, w: vung.w - wAnh - 0.35, h: vung.h }, { ...optThe, caoMax: 1.9 }));
  } else out.push(...luoiThe(ctx, ys, vung, { ...optThe, caoMax: 2.2 }));
  if (tk && tk.ghiCong && anh.length) out.push({ kieu: 'hop', x: LE, y: yCuoi - 0.3, w: wAnh, h: 0.3, le: 0.02, font: ctx.fn, co: 9, mau: dam ? 'FFFFFF' : ctx.mau.phu,
    doan: [{ chu: [{ t: tk.ghiCong }], sau: 0 }], ten: 'Ghi nguồn hình' });
  if (!daDungChot) out.push(...cauChot(ctx, t, { mauChu: dam ? ctx.mau.phu2 : null }));
  return { bg: nenTrang, shapes: out };
}
// Dòng thời gian như slide mẫu: trục trắng dày, mốc tròn màu be viền trắng; dưới mỗi mốc một thẻ, mốc cuối (việc cần làm) thẻ khối đậm
function dongThoiGian(ctx, ys, v) {
  const n = ys.length, k = 0.25, w = (v.w - k * (n - 1)) / n, yLine = v.y + 0.5, out = [];
  out.push({ kieu: 'hop', dang: 'vienthuoc', x: v.x, y: yLine - 0.08, w: v.w, h: 0.16, nen: 'FFFFFF', bong: true, ten: 'Trục thời gian' });
  const box = i => ({ x: v.x + i * (w + k), y: yLine + 0.55, w, h: Math.min(3.6, v.h - 1.0) });
  const co = Math.min(...ys.map((y, i) => coThe(y, box(i), 20)));
  ys.forEach((y, i) => {
    const x = v.x + i * (w + k), cuoi = i === n - 1;
    out.push({ kieu: 'hop', dang: 'tron', x: x + w / 2 - 0.32, y: yLine - 0.32, w: 0.64, h: 0.64, nen: cuoi ? ctx.mau.nhan : ctx.mau.phu2, vien: 'FFFFFF', vienDay: 3, doc: 'ctr', le: 0,
      font: ctx.ft, co: 18, mau: cuoi ? 'FFFFFF' : ctx.mau.dam, doan: [{ chu: [{ t: String(i + 1), dam: true }], canh: 'ctr', sau: 0 }], ten: 'Mốc ' + (i + 1) });
    out.push({ ...the(ctx, box(i), y, cuoi ? { co, nen: ctx.mau.dam, mauChu: 'FFFFFF', mauTieuDe: ctx.mau.phu2, canh: 'ctr' } : { co, canh: 'ctr' }), doc: 't' });
  });
  return out;
}
// Venn như slide mẫu: vòng trái trắng viền xanh, vòng phải màu be, phần giao xanh đậm ghi tên ý thứ ba
function venn(ctx, ys, v) {
  const [a, b, ...khac] = ys, hDuoi = khac.length ? 1.05 : 0;
  const r = Math.min(v.h - hDuoi - 0.1, 4.2), R = r / 2, cx = v.x + v.w / 2, cy = v.y + (v.h - hDuoi - 0.1) / 2, lech = R * 0.62, out = [];
  out.push({ kieu: 'hop', dang: 'tron', x: cx - lech - R, y: cy - R, w: r, h: r, nen: 'FFFFFF', mo: 0.75, vien: ctx.mau.dam, vienDay: 1.25, ten: 'Vòng trái' });
  out.push({ kieu: 'hop', dang: 'tron', x: cx + lech - R, y: cy - R, w: r, h: r, nen: ctx.mau.phu2, mo: 0.85, ten: 'Vòng phải' });
  // Phần giao: hình thấu kính giữa hai giao điểm
  const hh = Math.sqrt(R * R - lech * lech), xL = cx + lech - R, xR = cx - lech + R;
  out.push({ kieu: 've', x: xL, y: cy - hh, w: xR - xL, h: 2 * hh, nen: ctx.mau.dam, ten: 'Phần giao',
    duong: [{ kin: true, d: [['M', 500, 0], ['C', 300, 110, 0, 280, 0, 500], ['C', 0, 720, 300, 890, 500, 1000], ['C', 700, 890, 1000, 720, 1000, 500], ['C', 1000, 280, 700, 110, 500, 0], ['Z']] }] });
  const g = khac[0];
  if (g && g.tieuDe) out.push({ kieu: 'hop', x: xL, y: cy - 0.6, w: xR - xL, h: 1.2, le: 0.04, doc: 'ctr', font: ctx.ft, co: coVua([g.tieuDe], xR - xL, 1.2, 20, 12, 0.04), mau: 'FFFFFF',
    doan: [{ chu: [{ t: g.tieuDe, dam: true }], canh: 'ctr', sau: 0 }], ten: 'Tên phần giao' });
  // Chữ mỗi vòng nằm ở phần không giao, cùng một cỡ
  const wChu = (xL - (cx - lech - R)) * 0.92, bA = { x: cx - lech - R + R * 0.12, y: cy - R * 0.62, w: wChu, h: R * 1.24 }, bB = { x: xR + R * 0.02, y: cy - R * 0.62, w: wChu, h: R * 1.24 };
  const co = Math.min(coThe(a, bA, 18), coThe(b, bB, 18));
  out.push(the(ctx, bA, a, { co, nen: null, canh: 'ctr' }), the(ctx, bB, b, { co, nen: null, canh: 'ctr' }));
  if (khac.length) {
    const ds = g && g.tieuDe ? [{ than: g.than }, ...khac.slice(1)] : khac, wx = Math.min(v.w, 10.5);
    out.push(...luoiThe(ctx, ds, { x: cx - wx / 2, y: v.y + v.h - hDuoi, w: wx, h: hDuoi }, { cot: ds.length, coMax: 15, khongDai: true }));
  }
  return out;
}
// Khối cảnh báo đậm dần: ý có tiêu đề mà không có thân mở một tầng mới, các ý sau nằm trong tầng đó
function canhBao(ctx, ys, v) {
  const tang = [];
  for (const y of ys) {
    if (y.tieuDe && !y.than) tang.push({ tieuDe: y.tieuDe, ys: [] });
    else if (!tang.length) tang.push({ tieuDe: '', ys: [y] });
    else tang[tang.length - 1].ys.push(y);
  }
  // Giữa hai tầng là mũi tên chỉ xuống (như các tầng biến chứng của slide mẫu)
  const out = [], k = tang.length > 1 ? 0.42 : 0, tong = tang.reduce((a, t) => a + (t.tieuDe ? 1 : 0) * 0.6 + t.ys.length, 0);
  let y = v.y;
  tang.forEach((t, i) => {
    const h = ((t.tieuDe ? 0.6 : 0) + t.ys.length) / tong * (v.h - k * (tang.length - 1));
    const muc = tang.length === 1 ? 1 : i / (tang.length - 1), nen = muc < 0.5 ? ctx.mau.phu2 : ctx.mau.nhan, mc = muc < 0.5 ? ctx.mau.chu : 'FFFFFF';
    if (i) out.push({ kieu: 'hop', dang: 'muiTenXuong', x: v.x + v.w / 2 - 0.3, y: y - k - 0.02, w: 0.6, h: k + 0.06, nen, ten: 'Mũi tên' });
    const dong = [...(t.tieuDe ? [t.tieuDe] : []), ...t.ys.map(x => (x.tieuDe ? x.tieuDe + ': ' : '') + x.than)];
    const co = coVua(dong, v.w, h, 22, 13);
    const doan = [];
    if (t.tieuDe) doan.push({ chu: chuoiChu(t.tieuDe, { co: co + 2, mau: mc, font: ctx.fn, dam: true }), sau: 4 });
    for (const x of t.ys) doan.push({ chu: [...(x.tieuDe ? chuoiChu(x.tieuDe + ': ', { co, mau: mc, font: ctx.fn, dam: true }) : []), ...chuoiChu(x.than, { co, mau: mc, font: ctx.fn, mauNguon: mc })], sau: 3 });
    out.push({ kieu: 'hop', dang: 'bo', bo: 0.08, x: v.x, y, w: v.w, h, nen, bong: true, le: 0.25, doc: 'ctr', font: ctx.fn, co, mau: mc, doan, ten: t.tieuDe || 'Tầng' });
    y += h + k;
  });
  return out;
}

// Ghi chú người nói: lời giảng, an toàn, nguồn, và việc còn làm khi dựng (từ dòng Hình)
function ghiChu(t) {
  const phan = [['Lời giảng', 'lời giảng'], ['An toàn', 'an toàn'], ['Nguồn', 'nguồn'], ['Hình (khi chỉnh sửa)', 'hình']];
  const loai = giaTri(t, 'loại');
  const L = loai ? [`Trang ${t.so} · ${loai}`] : [`Trang ${t.so}`];
  for (const [ten, k] of phan) { const v = toanVan(t, k); if (v) L.push('', `${ten}:`, boDinhDang(v)); }
  return L.join('\n');
}

// Ảnh của một trang: dòng "Dựng" của thiết kế nếu có, không thì các dòng "Danh sách hình" của trang đó có file thật
function anhCuaTrang(so, tk, kichThuoc) {
  const t = tk.trang[so], hang = ten => tk.dsHinh.find(h => h.ten === ten);
  if (t && t.dung.length) return t.dung.map(d => ({ ten: d.ten, dung: d, hang: hang(d.ten) })).filter(o => kichThuoc[o.ten]);
  return tk.dsHinh.filter(h => h.trang === so && kichThuoc[h.ten] && !/du-phong/.test(h.ten) && !/không dùng|chưa đạt|cần tạo/i.test(h.trangThai))
    .map(h => ({ ten: h.ten, hang: h, moTa: boDinhDang(h.nguon).slice(0, 200) }));
}

// kichBan, thietKe: nội dung hai file; kichThuoc: { tên file trong hinh/: { w, h } }
// → { tieuDe, slides, media: [tên file], canhBao: [chuỗi], fontTieuDe, fontNoiDung }
function dungBoSlide({ kichBan, thietKe, kichThuoc = {} }) {
  const kb = docKichBan(kichBan), tk = docThietKe(thietKe), canhBao = [];
  const ctx = { mau: tk.mau, ft: tk.fontTieuDe, fn: tk.fontNoiDung, tieuDe: kb.tieuDe, kichThuoc, media: new Set() };
  const slides = kb.trang.map(t => {
    const loai = giaTri(t, 'loại').toLowerCase(), anh = anhCuaTrang(t.so, tk, kichThuoc);
    const canAnh = /^[ABCD]\b/.test(giaTri(t, 'hình')) && !/không hình/i.test(giaTri(t, 'hình'));
    if (canAnh && !anh.length) canhBao.push(`Trang ${t.so}: dòng Hình cần ảnh nhưng hinh/ chưa có file nào của trang này`);
    let sl;
    if (/bìa/.test(loai) || t.so === 1) sl = trangBia(ctx, t, anh);
    else if (/tư thế/.test(loai)) sl = trangTuThe(ctx, t, anh);
    else if (/tóm lược/.test(loai)) sl = trangTomLuoc(ctx, t, anh);
    else if (/nguồn/i.test(t.tieuDe) && /danh sách/.test(loai)) sl = trangNguon(ctx, t, kb);
    else sl = trangNoiDung(ctx, t, anh, tk.trang[t.so]);
    return { ...sl, notes: ghiChu(t) };
  });
  if (!slides.length) canhBao.push('Kịch bản không có trang nào ("## Trang <n> · …")');
  return { tieuDe: kb.tieuDe, slides, media: [...ctx.media], canhBao, fontTieuDe: tk.fontTieuDe, fontNoiDung: tk.fontNoiDung };
}

module.exports = { dungBoSlide, docKichBan, docThietKe, docDongDung, catPhu, coVua, tachY };
