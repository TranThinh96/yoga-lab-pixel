'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { docGhiChu, vietGhiChu } = require('../lib/ghi-chu');

const MAU = `---
loai: menh-de
chu_de:
  - suy-giap
  - thuoc
nguon:
  - "[[nhs-levothyroxine]]"
trich: "30 minutes to 1 hour before breakfast"
ngay_duyet: 2026-10-19
khoa: false
so: 3
rong: []
trong:
tieu_de: "Levothyroxine: medicine for underactive thyroid"
dong: [a, "b c"]
url: https://x.org/a#muc
---
# Tiêu đề

Nội dung.
`;
const MONG_DOI = { loai: 'menh-de', chu_de: ['suy-giap', 'thuoc'], nguon: ['[[nhs-levothyroxine]]'], trich: '30 minutes to 1 hour before breakfast',
  ngay_duyet: '2026-10-19', khoa: false, so: 3, rong: [], trong: '', tieu_de: 'Levothyroxine: medicine for underactive thyroid',
  dong: ['a', 'b c'], url: 'https://x.org/a#muc' };

test('docGhiChu đọc đúng frontmatter mẫu', () => {
  const { data, body } = docGhiChu(MAU);
  assert.deepEqual(data, MONG_DOI);
  assert.equal(body, '# Tiêu đề\n\nNội dung.\n');
});

test('ghi rồi đọc lại giữ nguyên dữ liệu', () => {
  const { data, body } = docGhiChu(MAU);
  const lai = docGhiChu(vietGhiChu(data, body));
  assert.deepEqual(lai.data, data);
  assert.equal(lai.body, body);
});

test('không có frontmatter', () => {
  assert.deepEqual(docGhiChu('không có frontmatter').data, {});
});
