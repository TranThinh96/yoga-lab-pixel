'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { veChanDung } = require('../lib/chan-dung');
const { maHoa, giaiMa } = require('../lib/anh');

const LOOK = { outfit: '#4f8f8a', mat: '#a7d3cc', hair: '#3a2618', skin: '#f0c49c', style: 'short' };
const diem = (a, x, y) => { const o = (y * a.w + x) * 3; return [a.px[o], a.px[o + 1], a.px[o + 2]]; };

test('veChanDung: ảnh 256×256, nền là màu thảm, mặt màu da, áo màu của người đó', () => {
  const a = veChanDung(LOOK);
  assert.equal(a.w, 256); assert.equal(a.h, 256); assert.equal(a.px.length, 256 * 256 * 3);
  assert.deepEqual(diem(a, 2, 2), [0xa7, 0xd3, 0xcc]);
  assert.deepEqual(diem(a, 30 * 4, 29 * 4), [0xf0, 0xc4, 0x9c]); // má trái
  assert.deepEqual(diem(a, 32 * 4, 57 * 4), [0x4f, 0x8f, 0x8a]); // ngực áo
});

test('veChanDung: kiểu tóc và đồ cầm tay đổi hình; cùng đầu vào thì cùng ảnh', () => {
  const a = veChanDung(LOOK), b = veChanDung({ ...LOOK, style: 'long' }), c = veChanDung(LOOK, { vat: 'may-anh' });
  assert.ok(!a.px.equals(b.px));
  assert.ok(!a.px.equals(c.px));
  assert.ok(a.px.equals(veChanDung(LOOK).px));
});

test('veChanDung: thiếu màu trong look thì dùng mặc định; mã hoá PNG đọc lại được', () => {
  const a = veChanDung({});
  const png = giaiMa(maHoa(a));
  assert.equal(png.w, 256);
  assert.equal(png.h, 256);
});
