#!/usr/bin/env node
'use strict';
// Chạy MỘT LẦN: chuyển bài học trong agents/<id>/kinh-nghiem.md (kiểu cũ) thành note tri-thuc/bai-hoc/BH-<n>.md,
// viết lại kinh-nghiem.md thành bản xem, và ghi báo cáo phân loại tri-thuc/he-thong/chuyen-bai-hoc.md để bạn xem lại.
// Cách chạy: node scripts/chuyen-bai-hoc.js <đường dẫn workspace>   (thường là: node scripts/chuyen-bai-hoc.js workspace)
const fs = require('fs');
const path = require('path');
const { phanLoaiBaiHoc, doanApDungKhi, taoBaiHoc, banXemKinhNghiem, docBaiHoc, noiDungBaiHoc } = require('../lib/bai-hoc');
const { locBaiHocMoi } = require('../lib/van-ban');
const { docGhiChu } = require('../lib/ghi-chu');

const ws = process.argv[2];
if (!ws || !fs.existsSync(path.join(ws, 'agents'))) {
  console.error('Cách chạy: node scripts/chuyen-bai-hoc.js <đường dẫn workspace> (thư mục có agents/)');
  process.exit(1);
}
const dirBH = path.join(ws, 'tri-thuc', 'bai-hoc');
if (fs.existsSync(dirBH) && fs.readdirSync(dirBH).some(n => /^BH-\d+\.md$/.test(n))) {
  console.error('tri-thuc/bai-hoc/ đã có note BH-…: script chỉ chạy một lần. Xoá các note đó nếu muốn chuyển lại.');
  process.exit(1);
}

// Thứ tự agent: theo config.json (nếu đọc được), agent khác xếp sau theo tên thư mục
let agents = [];
try { agents = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'config.json'), 'utf8')).agents || []; } catch {}
const ids = fs.readdirSync(path.join(ws, 'agents')).filter(id => fs.existsSync(path.join(ws, 'agents', id, 'kinh-nghiem.md')));
const thuTu = id => { const i = agents.findIndex(a => a.id === id); return i < 0 ? agents.length : i; };
ids.sort((a, b) => thuTu(a) - thuTu(b) || a.localeCompare(b));

const docFile = rel => fs.readFileSync(path.join(ws, rel), 'utf8').replace(/^﻿/, '').normalize('NFC');
const tenCua = id => (agents.find(a => a.id === id) || {}).name
  || ((/^#\s*Kinh nghiệm của\s+(.+)$/mu.exec(docFile(`agents/${id}/kinh-nghiem.md`)) || [])[1] || id).trim();

const baiHoc = [], bao = [];
for (const id of ids) {
  const dong = docFile(`agents/${id}/kinh-nghiem.md`).split(/\r?\n/).filter(l => /^\s*[-*•]\s+/.test(l)).map(l => l.replace(/^\s*[-*•]\s+/, '').trim());
  const ds = dong.map((full, i) => {
    const tienTo = (/^\(([^)]*)\)\s*/.exec(full) || [])[1] || '';
    // Phân loại cả dòng: tiền tố có khi ghi bài cũ mà bài này thay ("thay bài … về 'CẦN GIAO LAM'")
    return { i, full, text: full.replace(/^\([^)]*\)\s*/, '').trim(), ngay: (/\d{4}-\d{2}-\d{2}/.exec(tienTo) || ['2026-10-16'])[0], pl: phanLoaiBaiHoc(full) };
  }).filter(x => x.text);
  // Trùng thì giữ bản mới hơn: xét bản mới trước (ngày sau, dòng sau), rồi trả về thứ tự dòng.
  // Chỉ lọc bài còn hiệu lực: bài đã thăng cấp giữ cả làm hồ sơ, và không được thay một bài còn hiệu lực
  const moiTruoc = ds.filter(x => x.pl.trang_thai !== 'da-thang-cap').sort((a, b) => b.ngay.localeCompare(a.ngay) || b.i - a.i);
  const giu = locBaiHocMoi(moiTruoc.map(x => x.text), []); // giữ thứ tự, nên đi song song được
  let k = 0;
  for (const x of moiTruoc) if (giu[k] === x.text) k++; else x.bo = true;
  const bo = ds.filter(x => x.bo).length;
  if (bo) console.log(`${id}: bỏ ${bo} bài trùng`);
  for (const x of ds.filter(x => !x.bo)) {
    const pl = x.pl;
    const ma = `BH-${baiHoc.length + 1}`;
    const note = taoBaiHoc({ ma, goc: pl.goc, pham_vi: `agent:${id}`, ap_dung_khi: doanApDungKhi(x.text), loai_loi: pl.loai_loi,
      noi_dung: x.text, ngay: x.ngay, trang_thai: pl.trang_thai, ghi_chu: pl.ghi_chu });
    baiHoc.push({ ma, id, note, pl, text: x.text });
  }
}

fs.mkdirSync(dirBH, { recursive: true });
for (const b of baiHoc) fs.writeFileSync(path.join(dirBH, `${b.ma}.md`), b.note, 'utf8');

const notes = baiHoc.map(b => { const { data, body } = docGhiChu(b.note); return { path: `tri-thuc/bai-hoc/${b.ma}.md`, data, noiDung: noiDungBaiHoc(body) }; });
for (const id of ids) fs.writeFileSync(path.join(ws, 'agents', id, 'kinh-nghiem.md'), banXemKinhNghiem(tenCua(id), id, docBaiHoc(notes)), 'utf8');

const o = s => String(s || '').replace(/\|/g, '/').replace(/\s+/g, ' ').trim();
const dem = k => baiHoc.reduce((m, b) => (m[b.pl[k]] = (m[b.pl[k]] || 0) + 1, m), {});
const tom = m => Object.entries(m).map(([k, n]) => `${k} ${n}`).join(', ');
const L = ['# Chuyển bài học sang tri-thuc/bai-hoc/', '',
  `> Script scripts/chuyen-bai-hoc.js ghi file này một lần (${new Date().toISOString().slice(0, 10)}). Bài xếp sai thì sửa note BH-… trong Obsidian (goc, trang_thai), không sửa ở đây.`, '',
  `- Tổng: ${baiHoc.length} bài · ${baiHoc.filter(b => b.pl.trang_thai === 'da-thang-cap').length} đã thăng cấp (hệ thống đã chữa)`,
  `- Theo gốc: ${tom(dem('goc'))}`, `- Theo loại: ${tom(dem('loai_loi'))}`, '',
  '| Mã | Agent | Loại | Gốc | Trạng thái | Ghi chú | Nội dung (60 ký tự) |', '|---|---|---|---|---|---|---|',
  ...baiHoc.map(b => `| [[bai-hoc/${b.ma}\\|${b.ma}]] | ${b.id} | ${b.pl.loai_loi} | ${b.pl.goc} | ${b.pl.trang_thai} | ${o(b.pl.ghi_chu)} | ${o(b.text.length > 60 ? b.text.slice(0, 59) + '…' : b.text)} |`)];
fs.mkdirSync(path.join(ws, 'tri-thuc', 'he-thong'), { recursive: true });
fs.writeFileSync(path.join(ws, 'tri-thuc', 'he-thong', 'chuyen-bai-hoc.md'), L.join('\n') + '\n', 'utf8');
console.log(`Đã ghi ${baiHoc.length} note bài học (${baiHoc.filter(b => b.pl.trang_thai === 'da-thang-cap').length} đã thăng cấp). Báo cáo: tri-thuc/he-thong/chuyen-bai-hoc.md`);
