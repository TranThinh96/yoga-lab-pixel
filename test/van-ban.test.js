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

test('locBaiHocMoi', () => {
  const [a, b] = TL.bai_hoc.giong[0];
  const khac = 'Đặt tiêu đề trang slide ngắn gọn, đúng như tiêu đề trong slide mẫu, không đổi thành câu hỏi.';
  assert.deepEqual(vb.locBaiHocMoi([b, khac], [a]), [khac]);
});

test('phanLoaiCauHoi', () => {
  const [c1, c2] = TL.cau_hoi.giong[0];
  const v = TL.cau_hoi.khac[0][0];
  assert.deepEqual(vb.phanLoaiCauHoi([c2, v], [c1], []), { moi: [v], trung: [{ q: c2, i: 0 }] });
  assert.deepEqual(vb.phanLoaiCauHoi([c1, c2], [], []).moi, [c1]);
});

test('docCauHoi: "Không (…)" không phải câu hỏi', () => {
  for (const s of TL.khong_phai_cau_hoi) {
    assert.deepEqual(vb.docCauHoi('## Câu hỏi cho chủ dự án\n' + s + '\n\n## Gợi ý bước sau\nx'), [], s);
    assert.deepEqual(vb.docCauHoi('## Câu hỏi cho chủ dự án\n- ' + s + '\n'), [], s);
  }
  for (const s of TL.la_cau_hoi) {
    assert.deepEqual(vb.docCauHoi('## Câu hỏi cho chủ dự án\n' + s + '\n\n## Gợi ý bước sau\nx'), [s]);
    assert.deepEqual(vb.docCauHoi('## Câu hỏi cho chủ dự án\n- ' + s + '\n'), [s]);
  }
});

test('chonChuDe', () => {
  const cases = [
    [{ jsonChuDe: 'Tăng huyết áp' }, 'tang-huyet-ap'],
    [{ jsonChuDe: '<chu-de>', tasks: ['ghi output/abc/slides.md'] }, 'abc'],
    [{ brief: readFixture('brief-v7.md') }, 'suy-giap-v7'],
    [{ brief: '# B\n\n## Sản phẩm cần giao\n| `output/x-y/slides.md` | Lam |\n\n## Ràng buộc\nxem output/khac/a.md' }, 'x-y'],
    [{ files: ['agents/an/a.md', 'output/q/thiet-ke.md'] }, 'q'],
    [{}, null]
  ];
  for (const [vao, ra] of cases) assert.equal(vb.chonChuDe(vao), ra, JSON.stringify(vao).slice(0, 80));
});

test('laCauHoiMoiTruong', () => {
  assert.equal(vb.laCauHoiMoiTruong('Vui lòng cấp quyền Chrome để tôi chạy Gemini Deep Research theo hướng dẫn.'), true);
  for (const pair of [...TL.cau_hoi.giong, ...TL.cau_hoi.khac]) for (const q of pair) assert.equal(vb.laCauHoiMoiTruong(q), false, q);
});
