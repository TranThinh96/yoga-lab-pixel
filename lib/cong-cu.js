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

const CONG_CU = {
  soat_loi: {
    description: 'Máy chủ soát lỗi máy móc trong một file .md của folder làm việc: dấu câu đôi, dấu cách trước dấu câu, lặp từ, từ cần tránh, cách gọi lẫn lộn, số chữ từng trang slide. Với slides.md và thiet-ke.md còn đối chiếu hai file theo từng trang và kiểm file hình đã có chưa. Gọi trước khi bàn giao cho từng file sản phẩm bạn vừa ghi hoặc sửa.',
    inputSchema: { type: 'object', properties: { file: { type: 'string', description: 'Đường dẫn trong folder làm việc, vd output/tang-huyet-ap/slides.md' } }, required: ['file'] },
    run: soatLoi
  },
  kiem_link: {
    description: 'Máy chủ mở thử tối đa 10 link: còn mở được, bị chặn (403, CAPTCHA), không có (404), tiêu đề trang. Link Wikimedia Commons thì kiểm file có thật và đọc tác giả, giấy phép. Trước khi ghi link hình Commons vào bảng, kiểm bằng công cụ này để chắc tên file có thật.',
    inputSchema: { type: 'object', properties: { urls: { type: 'array', items: { type: 'string' }, maxItems: 10, description: 'Các link cần kiểm' } }, required: ['urls'] },
    run: kiemLink
  },
  tai_hinh: {
    description: 'Máy chủ tải một hình có giấy phép (trang File: của Wikimedia Commons hoặc link thẳng .jpg/.png/.webp) vào output/<chủ đề của dự án>/hinh-nguon/ (hoặc hinh/) và ghi vào danh-sach.md. Trả về đường dẫn file, tác giả, giấy phép, hoặc lý do không tải được.',
    inputSchema: { type: 'object', properties: { link: { type: 'string' }, ten: { type: 'string', description: 'Tên file không đuôi, chữ thường không dấu, nối gạch ngang, vd giai-phau-tuyen-giap' }, thu_muc: { type: 'string', enum: ['hinh-nguon', 'hinh'] }, mo_ta: { type: 'string', description: 'Hình thể hiện gì (ghi vào danh-sach.md)' } }, required: ['link', 'ten'] },
    run: taiHinh
  }
};

const danhSach = ten => ten.filter(t => CONG_CU[t]).map(t => ({ name: t, description: CONG_CU[t].description, inputSchema: CONG_CU[t].inputSchema }));
async function goi(ten, args, ctx, choPhep) {
  if (!choPhep.includes(ten) || !CONG_CU[ten]) return { text: `Không có công cụ "${ten}"`, isError: true };
  try { return await CONG_CU[ten].run(args || {}, ctx); } catch (e) { return { text: 'Lỗi: ' + e.message, isError: true }; }
}

module.exports = { CONG_CU, danhSach, goi };
