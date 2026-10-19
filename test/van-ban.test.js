'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vb = require('../lib/van-ban');

const readFixture = n => fs.readFileSync(path.join(__dirname, 'fixtures', n), 'utf8').normalize('NFC');
const TL = JSON.parse(readFixture('trung-lap.json'));

test('giongNhau: bài học', () => {
  for (const [a, b] of TL.bai_hoc.giong) assert.ok(vb.giongNhau(a, b) >= vb.NGUONG_BAI_HOC, `phải giống: ${a} | ${b}`);
  for (const [a, b] of TL.bai_hoc.khac) assert.ok(vb.giongNhau(a, b) < vb.NGUONG_BAI_HOC, `phải khác: ${a} | ${b}`);
});

test('giongNhau: câu hỏi', () => {
  for (const [a, b] of TL.cau_hoi.giong) assert.ok(vb.giongNhau(a, b) >= vb.NGUONG_CAU_HOI, `phải giống: ${a} | ${b}`);
  for (const [a, b] of TL.cau_hoi.khac) assert.ok(vb.giongNhau(a, b) < vb.NGUONG_CAU_HOI, `phải khác: ${a} | ${b}`);
});

test('boDau', () => {
  assert.equal(vb.boDau('Đã ĐƯỢC'), 'da duoc');
});

test('chuDeTu', () => {
  assert.equal(vb.chuDeTu('ghi vào output/suy-giap-v7/slides.md'), 'suy-giap-v7');
  assert.equal(vb.chuDeTu('output/<chu-de>/slides.md'), null);
});
