'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { soatVanBan } = require('../lib/soat-loi');

const readFixture = n => fs.readFileSync(path.join(__dirname, 'fixtures', n), 'utf8').normalize('NFC');
const MD = JSON.parse(readFixture('soat-loi-mong-doi.json'));

test('soatVanBan khớp kết quả mong đợi', () => {
  for (const c of MD.lint) {
    assert.deepEqual(soatVanBan(c.file, readFixture(c.nguon), { maxChu: c.max, tuTranh: c.banned, cachGoi: c.variants }), c.mong_doi, `${c.file} · ${c.nguon} · ${c.max}`);
  }
});
