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
