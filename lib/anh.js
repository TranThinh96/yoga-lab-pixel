'use strict';
// Thu nhỏ ảnh PNG cho slide (ảnh Gemini ~2752 px, 8 MB mỗi ảnh) mà không cần gói npm: giải mã PNG 8 bit không xen kẽ,
// lấy trung bình từng ô k×k điểm ảnh, mã hoá lại. Ảnh không đọc được hoặc đã đủ nhỏ thì trả nguyên bản. Không đọc file.
const zlib = require('zlib');
const { crc32 } = require('./pptx');

const KENH = { 0: 1, 2: 3, 4: 2, 6: 4 }; // xám, RGB, xám + alpha, RGBA

function giaiMa(buf) {
  if (buf.length < 33 || buf.readUInt32BE(0) !== 0x89504e47) return null;
  let i = 8, w, h, sau, loai, xenKe;
  const idat = [];
  while (i + 8 <= buf.length) {
    const len = buf.readUInt32BE(i), type = buf.toString('ascii', i + 4, i + 8), d = buf.subarray(i + 8, i + 8 + len);
    if (type === 'IHDR') { w = d.readUInt32BE(0); h = d.readUInt32BE(4); sau = d[8]; loai = d[9]; xenKe = d[12]; }
    else if (type === 'IDAT') idat.push(d);
    else if (type === 'IEND') break;
    i += 12 + len;
  }
  const kenh = KENH[loai];
  if (!w || sau !== 8 || !kenh || xenKe) return null;
  const raw = zlib.inflateSync(Buffer.concat(idat)), bpr = w * kenh, out = Buffer.alloc(bpr * h);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (bpr + 1)], src = y * (bpr + 1) + 1, dst = y * bpr, tren = dst - bpr;
    for (let x = 0; x < bpr; x++) {
      const a = x >= kenh ? out[dst + x - kenh] : 0, b = y ? out[tren + x] : 0, c = y && x >= kenh ? out[tren + x - kenh] : 0;
      let v = raw[src + x];
      if (f === 1) v += a;
      else if (f === 2) v += b;
      else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
      out[dst + x] = v & 255;
    }
  }
  return { w, h, kenh, px: out };
}

function maHoa({ w, h, kenh, px }) {
  const loai = { 1: 0, 2: 4, 3: 2, 4: 6 }[kenh], bpr = w * kenh, raw = Buffer.alloc((bpr + 1) * h);
  for (let y = 0; y < h; y++) { // lọc "Sub" cho mọi dòng
    const o = y * (bpr + 1), s = y * bpr;
    raw[o] = 1;
    for (let x = 0; x < bpr; x++) raw[o + 1 + x] = (px[s + x] - (x >= kenh ? px[s + x - kenh] : 0)) & 255;
  }
  const khoi = (type, data) => {
    const t = Buffer.from(type, 'ascii'), len = Buffer.alloc(4), crc = Buffer.alloc(4);
    len.writeUInt32BE(data.length); crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
    return Buffer.concat([len, t, data, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = loai;
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), khoi('IHDR', ihdr),
    khoi('IDAT', zlib.deflateSync(raw, { level: 6 })), khoi('IEND', Buffer.alloc(0))]);
}

// buf: file PNG; rongToiDa: bề ngang tối đa (px). Kênh alpha toàn đục thì bỏ cho nhẹ.
function thuNhoPng(buf, rongToiDa = 1920) {
  let anh;
  try { anh = giaiMa(buf); } catch { return buf; }
  if (!anh || anh.w <= rongToiDa) return buf;
  const k = Math.ceil(anh.w / rongToiDa), w = Math.floor(anh.w / k), h = Math.floor(anh.h / k), n = anh.kenh;
  const coAlpha = n === 2 || n === 4;
  let duc = true;
  if (coAlpha) for (let i = n - 1; i < anh.px.length; i += n) if (anh.px[i] !== 255) { duc = false; break; }
  const ra = coAlpha && duc ? n - 1 : n, px = Buffer.alloc(w * h * ra), k2 = k * k;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) for (let c = 0; c < ra; c++) {
    let s = 0;
    for (let dy = 0; dy < k; dy++) { const hang = ((y * k + dy) * anh.w + x * k) * n + c; for (let dx = 0; dx < k; dx++) s += anh.px[hang + dx * n]; }
    px[(y * w + x) * ra + c] = Math.round(s / k2);
  }
  const moi = maHoa({ w, h, kenh: ra, px });
  return moi.length < buf.length ? moi : buf;
}

module.exports = { thuNhoPng, giaiMa, maHoa };
