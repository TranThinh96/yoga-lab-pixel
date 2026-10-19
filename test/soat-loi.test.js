'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { soatVanBan } = require('../lib/soat-loi');

const readFixture = n => fs.readFileSync(path.join(__dirname, 'fixtures', n), 'utf8').normalize('NFC');
const MD = JSON.parse(readFixture('soat-loi-mong-doi.json'));

test('soatVanBan khớp kết quả mong đợi', () => {
  let doDo = 0;
  for (const c of MD.lint) {
    // Tên riêng viết hoa lặp lại không còn bị báo (mục 0.6B)
    const mong = c.mong_doi.filter(x => !x.includes('lặp từ "Chang Chang"'));
    const ra = soatVanBan(c.file, readFixture(c.nguon), { maxChu: c.max, tuTranh: c.banned, cachGoi: c.variants });
    assert.deepEqual(ra, mong, `${c.file} · ${c.nguon} · ${c.max}`);
    doDo += ra.filter(x => x.includes('lặp từ "độ độ"')).length;
  }
  assert.ok(doDo > 0, 'vẫn phải báo lặp từ "độ độ"');
});

test('soChuTungTrang', () => {
  const { soChuTungTrang } = require('../lib/soat-loi');
  for (const [k, v] of Object.entries(MD.so_chu)) assert.deepEqual(soChuTungTrang(readFixture(k)), v, k);
});

test('doiChieuThietKe', () => {
  const { doiChieuThietKe } = require('../lib/soat-loi');
  const DC = JSON.parse(readFixture('doi-chieu-mong-doi.json'));
  assert.deepEqual(doiChieuThietKe(readFixture('doi-chieu-slides.md'), readFixture('doi-chieu-thiet-ke.md')), DC.mau);
  assert.deepEqual(doiChieuThietKe(readFixture('slides-v6.md'), readFixture('thiet-ke-v6.md')), DC.v6);
});

test('kiemFileHinh', () => {
  const { kiemFileHinh } = require('../lib/soat-loi');
  const co = new Set(['output/t/hinh/trang-04-a.jpg', 'output/t/hinh-nguon/x.jpg']);
  const vao = {
    dsHinh: [{ name: 'trang-04-a.png', pages: [4] }, { name: 'trang-05-b.jpg', pages: [5] }],
    slidesTxt: '- Hình: C, hinh-nguon/x.jpg\n- Hình: C, `hinh-nguon/y.png` và lại hinh-nguon/y.png',
    chuDe: 't', coFile: r => co.has(r), coThuMucHinh: true
  };
  assert.deepEqual(kiemFileHinh(vao), ['Trang 5: chưa có output/t/hinh/trang-05-b.jpg', 'slides.md nhắc hinh-nguon/y.png nhưng chưa có file']);
  assert.deepEqual(kiemFileHinh({ ...vao, coThuMucHinh: false }), ['slides.md nhắc hinh-nguon/y.png nhưng chưa có file']);
});
