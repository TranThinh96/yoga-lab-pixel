'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { goi, danhSach } = require('../lib/cong-cu');

const readFixture = n => fs.readFileSync(path.join(__dirname, 'fixtures', n), 'utf8').normalize('NFC');
const FILES = { 'output/t/slides.md': readFixture('doi-chieu-slides.md'), 'output/t/thiet-ke.md': readFixture('doi-chieu-thiet-ke.md') };
const ctx = {
  read: rel => FILES[rel] || '', exists: rel => rel in FILES, lint: () => ['dòng lỗi giả'],
  listImages: () => [], hasImages: () => false
};

test('soat_loi', async () => {
  const r = await goi('soat_loi', { file: 'output/t/slides.md' }, ctx, ['soat_loi']);
  assert.ok(!r.isError);
  assert.match(r.text, /dòng lỗi giả/);
  assert.match(r.text, /Trang 4 · lech-dao-cu/);
  assert.match(r.text, /Số chữ trên slide/);
  const k = await goi('soat_loi', { file: 'output/t/slides.md' }, ctx, []);
  assert.equal(k.isError, true);
  const x = await goi('soat_loi', { file: 'output/t/khong-co.md' }, ctx, ['soat_loi']);
  assert.equal(x.isError, true);
});

test('danhSach', () => {
  assert.deepEqual(danhSach(['soat_loi', 'khong_co']).map(t => t.name), ['soat_loi']);
});
