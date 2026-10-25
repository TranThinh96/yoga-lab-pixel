'use strict';
// Chân dung pixel cho agent chưa có ảnh (public/assets/portrait-<id>.png): vẽ trên lưới 64×64 theo màu trong
// config (look: skin, hair, outfit, mat, style), viền tối quanh các mảng như tranh pixel, rồi phóng 4 lần.
// Không gọi dịch vụ nào; chạy qua scripts/ve-chan-dung.js.

const N = 64;
const hex = h => { const m = /^#?([0-9a-f]{6})$/i.exec(h || ''); const v = m ? parseInt(m[1], 16) : 0x888888; return [v >> 16, (v >> 8) & 255, v & 255]; };
// f < 0 tối đi, f > 0 sáng lên
const sac = (c, f) => c.map(v => Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f));

const MAC_DINH = { skin: '#e3ad84', hair: '#3a2618', outfit: '#6f9a5b', mat: '#9fc7a0', style: 'short' };
const VAT = { chef: 'so', vy: 'but', nhi: 'may-anh' }; // đồ cầm tay theo vai, như Mai cầm sách

function veChanDung(look = {}, { vat, phong = 4 } = {}) {
  const L = { ...MAC_DINH, ...look };
  const da = hex(L.skin), toc = hex(L.hair), ao = hex(L.outfit), nen = hex(L.mat);
  const mau = new Array(N * N).fill(null), lop = new Uint8Array(N * N); // lop: 0 nền, 1 tóc, 2 da, 3 áo, 4 đồ vật
  const dat = (x, y, c, l) => { if (x >= 0 && y >= 0 && x < N && y < N) { mau[y * N + x] = c; lop[y * N + x] = l; } };
  const elip = (cx, cy, rx, ry, c, l, dk = () => true) => {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
      if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1 && dk(x, y)) dat(x, y, c, l);
  };
  const hcn = (x0, y0, x1, y1, c, l) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) dat(x, y, c, l); };
  const kieu = L.style;

  // Tóc phía sau (tóc dài, buộc đuôi ngựa, búi thấp) vẽ trước để đầu và vai che lên
  if (kieu === 'long') { elip(32, 28, 17, 20, toc, 1); hcn(16, 28, 48, 52, toc, 1); }
  if (kieu === 'pony') elip(48, 32, 5, 11, toc, 1);
  if (kieu === 'low' || kieu === 'bun') elip(32, 24, 15, 15, toc, 1);

  // Vai, áo ba lỗ, cổ, tai, đầu
  elip(32, 63, 28, 15, da, 2);
  elip(32, 64, 24, 14, ao, 3, (x, y) => y >= 50);
  for (const sx of [23, 41]) hcn(sx - 1, 46, sx + 1, 50, ao, 3);
  elip(32, 50, 6, 3, da, 2, (x, y) => y >= 50);
  hcn(27, 36, 36, 47, da, 2);
  for (const ex of [19, 45]) elip(ex, 27, 2.5, 3.5, da, 2);
  elip(32, 26, 13, 15, da, 2);

  // Tóc phía trước: mảng trên đầu, mái, hai bên
  elip(32, 19, 14.5, 11, toc, 1, (x, y) => y <= 18 || (x <= 21 || x >= 43) && y <= 24 || y <= 19 + ((x * 7) % 3 === 0 ? 1 : 0));
  if (kieu === 'long') { hcn(17, 20, 20, 50, toc, 1); hcn(44, 20, 47, 50, toc, 1); }
  if (kieu === 'short') { hcn(18, 18, 20, 29, toc, 1); hcn(44, 18, 46, 29, toc, 1); }
  if (kieu === 'pony') { hcn(18, 18, 20, 25, toc, 1); hcn(44, 18, 46, 25, toc, 1); hcn(45, 22, 47, 24, sac(ao, 0.2), 4); }
  if (kieu === 'bun') elip(32, 6, 6, 5, toc, 1);
  if (kieu === 'topknot') elip(32, 6, 4, 4, toc, 1);
  if (kieu === 'flower') { elip(44, 14, 3, 3, [240, 200, 210], 4); dat(44, 14, [250, 230, 140], 4); }

  // Đồ cầm tay ở dưới khung, nhỏ để vẫn thấy màu áo; hai bàn tay giữ hai bên
  const v = vat;
  if (v === 'so') { hcn(22, 53, 42, 63, [150, 100, 60], 4); hcn(24, 55, 40, 63, [246, 240, 226], 4); hcn(29, 52, 35, 54, [190, 190, 196], 4);
    for (let y = 57; y <= 63; y += 2) hcn(26, y, 38, y, [170, 180, 200], 4); }
  if (v === 'but') { hcn(21, 55, 43, 63, [236, 232, 220], 4); elip(28, 59, 3, 2, sac(ao, -0.1), 4); elip(36, 60, 3, 2, [120, 170, 200], 4);
    for (let i = 0; i < 9; i++) dat(33 + i, 63 - i, [60, 60, 70], 4); }
  if (v === 'may-anh') { hcn(22, 54, 42, 63, [64, 66, 72], 4); hcn(24, 52, 29, 54, [64, 66, 72], 4); elip(32, 59, 5, 4.5, [30, 32, 36], 4);
    elip(32, 59, 3, 2.5, [90, 130, 160], 4); dat(31, 58, [220, 235, 245], 4); hcn(38, 55, 40, 56, [200, 70, 60], 4); }
  if (v) for (const hx of [21, 43]) elip(hx, 60, 3.5, 3.5, da, 2);

  // Viền: điểm của một mảng nằm cạnh mảng khác (hoặc nền) thì tô tối, như tranh pixel vẽ tay
  const vien = mau.slice();
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const l = lop[y * N + x]; if (!l) continue;
    const ke = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => { const X = x + dx, Y = y + dy; return X >= 0 && Y >= 0 && X < N && Y < N && lop[Y * N + X] !== l && (lop[Y * N + X] === 0 || l > lop[Y * N + X] || l === 1); });
    if (ke) vien[y * N + x] = sac(mau[y * N + x], -0.45);
    else if (l === 2 && y < 44 && x >= 40) vien[y * N + x] = sac(da, -0.08);          // bóng một bên mặt
    else if (l === 1 && y >= 9 && y <= 11 && x >= 23 && x <= 30) vien[y * N + x] = sac(toc, 0.3); // ánh tóc
  }

  // Bóng dưới cằm; mặt: lông mày, mắt có điểm sáng, mũi, má hồng, miệng cười
  for (let x = 28; x <= 35; x++) { if (lop[42 * N + x] === 2) vien[42 * N + x] = sac(da, -0.18); if (lop[43 * N + x] === 2) vien[43 * N + x] = sac(da, -0.1); }
  const mat = [40, 26, 20], may = sac(toc, -0.2);
  for (const [x0, x1] of [[24, 28], [36, 40]]) for (let x = x0; x <= x1; x++) vien[22 * N + x] = may;
  for (const ex of [25, 37]) { for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2], [1, 2]]) vien[(25 + dy) * N + ex + dx] = mat; vien[25 * N + ex + 1] = [250, 250, 245]; }
  vien[30 * N + 32] = sac(da, -0.25); vien[31 * N + 31] = sac(da, -0.2);
  for (const cx of [23, 39]) for (const dx of [0, 1]) vien[31 * N + cx + dx] = sac([235, 130, 130], 0.25);
  const moi = [180, 90, 80];
  for (let x = 30; x <= 34; x++) vien[35 * N + x] = moi;
  vien[34 * N + 29] = moi; vien[34 * N + 35] = moi;

  // Phóng to, nền một màu như các chân dung Gemini
  const W = N * phong, px = Buffer.alloc(W * W * 3);
  for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) {
    const c = vien[Math.floor(y / phong) * N + Math.floor(x / phong)] || nen, o = (y * W + x) * 3;
    px[o] = c[0]; px[o + 1] = c[1]; px[o + 2] = c[2];
  }
  return { w: W, h: W, kenh: 3, px };
}

module.exports = { veChanDung, VAT };
