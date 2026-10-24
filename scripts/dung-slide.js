#!/usr/bin/env node
'use strict';
// Dựng slide hoàn thiện output/<chủ đề>/<chủ đề>.pptx từ slides.md, thiet-ke.md và ảnh trong hinh/.
// Máy chủ gọi dungSlideChoChuDe khi dự án xong; chạy tay khi đã sửa kịch bản, thiết kế hay ảnh:
//   node scripts/dung-slide.js <đường dẫn workspace> <chủ đề> [--html <file xem trước>]
const fs = require('fs');
const path = require('path');
const { dungBoSlide } = require('../lib/dung-slide');
const { taoPptx, kichThuocAnh, RONG, CAO } = require('../lib/pptx');
const { thuNhoPng } = require('../lib/anh');

// → { file (đường dẫn tương đối trong workspace), soTrang, canhBao, deck }
function dungSlideChoChuDe(ws, chuDe) {
  const dir = path.join(ws, 'output', chuDe), doc = n => fs.readFileSync(path.join(dir, n), 'utf8');
  for (const n of ['slides.md', 'thiet-ke.md']) if (!fs.existsSync(path.join(dir, n))) throw new Error(`thiếu output/${chuDe}/${n}`);
  const dirAnh = path.join(dir, 'hinh'), kichThuoc = {}, du = {};
  if (fs.existsSync(dirAnh)) for (const n of fs.readdirSync(dirAnh)) {
    if (!/\.(png|jpe?g)$/i.test(n)) continue;
    const data = fs.readFileSync(path.join(dirAnh, n)), k = kichThuocAnh(data);
    if (k) { kichThuoc[n] = k; du[n] = data; }
  }
  const deck = dungBoSlide({ kichBan: doc('slides.md'), thietKe: doc('thiet-ke.md'), kichThuoc });
  // Ảnh lớn thu về ≤ 1920 px bề ngang trước khi đóng gói (toạ độ cắt tính theo tỉ lệ nên không đổi)
  const buf = taoPptx({ ...deck, media: deck.media.map(n => ({ name: n, data: /\.png$/i.test(n) ? thuNhoPng(du[n]) : du[n] })) });
  const rel = `output/${chuDe}/${chuDe}.pptx`;
  fs.writeFileSync(path.join(ws, rel), buf);
  return { file: rel, soTrang: deck.slides.length, canhBao: deck.canhBao, deck, dirAnh };
}

// Bản xem trước HTML (để kiểm bố cục trong trình duyệt): cùng toạ độ với file .pptx, cỡ chữ gần đúng
// dirAnh: đường dẫn tới hinh/ tính từ chỗ đặt file HTML
function xemTruocHtml(deck, dirAnh) {
  const px = 72, e = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const hex = (c, a) => { if (!c) return 'transparent'; const n = parseInt(c, 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a == null ? 1 : a})`; };
  const trang = deck.slides.map((sl, i) => {
    const hinh = sl.shapes.map(s => {
      const box = `left:${s.x * px}px;top:${s.y * px}px;width:${s.w * px}px;height:${s.h * px}px`;
      if (s.kieu === 'anh') {
        const c = s.cat, W = s.w / (1 - c.l - c.r), H = s.h / (1 - c.t - c.b);
        return `<div style="position:absolute;${box};overflow:hidden;${s.dang === 'bo' ? `border-radius:${Math.round(Math.min(s.w, s.h) * px * (s.bo || 0.05) / 2)}px;` : ''}${s.bong ? 'box-shadow:0 2px 7px rgba(0,0,0,.14);' : ''}"><img src="${encodeURI(path.join(dirAnh, s.anh).replace(/\\/g, '/'))}" style="position:absolute;left:${-c.l * W * px}px;top:${-c.t * H * px}px;width:${W * px}px;height:${H * px}px"></div>`;
      }
      if (s.kieu === 've') {
        const d = (s.duong || []).map(p => `<path d="${p.d.map(([l, ...v]) => l + v.join(' ')).join(' ')}" fill="${p.kin && s.nen ? hex(s.nen, s.mo) : 'none'}" stroke="${s.net ? hex(s.net, s.netMo) : 'none'}" stroke-width="${(s.netDay || 1) * 1.33}" vector-effect="non-scaling-stroke" stroke-linecap="round"/>`).join('');
        return `<svg viewBox="0 0 1000 1000" preserveAspectRatio="none" style="position:absolute;${box};overflow:visible">${d}</svg>`;
      }
      const r = s.dang === 'tron' ? '50%' : s.dang === 'vienthuoc' ? '999px' : s.dang === 'bo' ? `${Math.round(Math.min(s.w, s.h) * px * (s.bo != null ? s.bo : 0.12) / 2)}px` : s.dang === 'dauBo' ? '12px 12px 0 0' : '0';
      const them = (s.bong ? 'box-shadow:0 2px 7px rgba(0,0,0,.14);' : '') + (s.vien ? `border:${(s.vienDay || 1.5) * 1.33}px solid #${s.vien};` : '') + (s.dang === 'muiTenXuong' ? 'clip-path:polygon(25% 0,75% 0,75% 50%,100% 50%,50% 100%,0 50%,25% 50%);' : '');
      const doan = (s.doan || []).map(d => `<p style="margin:0 0 ${(d.sau != null ? d.sau : 4)}pt;text-align:${({ ctr: 'center', r: 'right' })[d.canh] || 'left'}">${(d.cham ? '• ' : '') + (d.chu || []).map(c => `<span style="font-size:${c.co || s.co}pt;font-weight:${c.dam ? 700 : 400};font-style:${c.nghieng ? 'italic' : 'normal'};color:#${c.mau || s.mau};font-family:'${c.font || s.font}'">${e(c.t)}</span>`).join('')}</p>`).join('');
      const doc = { ctr: 'center', b: 'flex-end' }[s.doc] || 'flex-start';
      return `<div style="position:absolute;${box};background:${hex(s.nen, s.mo)};border-radius:${r};${them}box-sizing:border-box;padding:${(s.le != null ? s.le : 0.12) * px * 0.7}px ${(s.le != null ? s.le : 0.12) * px}px;display:flex;flex-direction:column;justify-content:${doc};overflow:${s.khongXuong ? 'visible;white-space:nowrap' : 'hidden'};line-height:1.22">${doan}</div>`;
    }).join('');
    return `<section><div class="so">Trang ${i + 1}</div><div class="sl" style="background:#${sl.bg}">${hinh}</div></section>`;
  }).join('');
  const fonts = [deck.fontTieuDe, deck.fontNoiDung].filter(Boolean).map(f => 'family=' + encodeURIComponent(f).replace(/%20/g, '+') + ':ital,wght@0,400;0,700;1,400').join('&');
  // Thêm #<số trang> vào địa chỉ để chỉ xem một trang
  return `<!doctype html><meta charset="utf-8"><title>${e(deck.tieuDe)}</title><link rel="stylesheet" href="https://fonts.googleapis.com/css2?${fonts}&display=swap">` +
    `<script>addEventListener('DOMContentLoaded',()=>{const n=+location.hash.slice(1);if(n){document.querySelectorAll('section').forEach((s,i)=>{if(i+1!==n)s.remove()});document.body.style.zoom=innerWidth/${Math.round(RONG * px + 40)}}})</script>` +
    `<style>body{background:#888;margin:0;padding:20px;font-family:sans-serif}section{margin:0 auto 24px;width:${RONG * px}px}.so{color:#fff;margin-bottom:4px}.sl{position:relative;width:${RONG * px}px;height:${CAO * px}px;overflow:hidden}</style>${trang}`;
}

module.exports = { dungSlideChoChuDe, xemTruocHtml };

if (require.main === module) {
  const [ws, chuDe] = process.argv.slice(2), iHtml = process.argv.indexOf('--html');
  if (!ws || !chuDe || !fs.existsSync(path.join(ws, 'output', chuDe))) {
    console.error('Cách chạy: node scripts/dung-slide.js <đường dẫn workspace> <chủ đề> [--html <file xem trước>]  (vd: node scripts/dung-slide.js workspace thoat-vi-dia-dem)');
    process.exit(1);
  }
  const kq = dungSlideChoChuDe(ws, chuDe);
  console.log(`Đã dựng ${kq.file}: ${kq.soTrang} trang`);
  for (const c of kq.canhBao) console.log('  Lưu ý: ' + c);
  const fHtml = iHtml > 0 && process.argv[iHtml + 1];
  if (fHtml) { fs.writeFileSync(fHtml, xemTruocHtml(kq.deck, path.relative(path.dirname(path.resolve(fHtml)), kq.dirAnh))); console.log('Bản xem trước: ' + fHtml); }
}
