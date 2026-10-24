'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { congSoat, dienCotCoFile, doiChieuThietKe, COT_CO_FILE } = require('../lib/soat-loi');
const { docThietKe } = require('../lib/dung-slide');

const readFixture = n => fs.readFileSync(path.join(__dirname, 'fixtures', n), 'utf8').normalize('NFC');

test('congSoat: trang quá chữ chỉ khi bước vừa ghi slides.md', () => {
  const slides = readFixture('slides-thoat-vi.md'); // tr.3: 89 chữ, tr.8: 86, tr.13: 87 (ngưỡng 80 + 5 dung sai)
  const ra = congSoat({ slidesTxt: slides, vietSlides: true, maxChu: 80 });
  assert.deepEqual(ra.map(x => `${x.trang}:${x.loai}:${x.kieu}`), ['3:qua-chu:qua-chu', '8:qua-chu:qua-chu', '13:qua-chu:qua-chu']);
  assert.ok(ra.every(x => x.file === 'slides.md'));
  assert.deepEqual(congSoat({ slidesTxt: slides, vietSlides: false, maxChu: 80 }), []);
  assert.deepEqual(congSoat({ slidesTxt: slides, vietSlides: true, maxChu: 90 }), [], 'ngưỡng 90 (+5 dung sai): không trang nào vượt');
});

test('congSoat: lệch hai file luôn tính cho thiet-ke.md', () => {
  const sl = readFixture('doi-chieu-slides.md'), tk = readFixture('doi-chieu-thiet-ke.md');
  const lech = doiChieuThietKe(sl, tk);
  assert.ok(lech.length > 0);
  for (const viet of [{ vietSlides: true }, { vietThietKe: true }]) {
    const ra = congSoat({ slidesTxt: sl, thietKeTxt: tk, ...viet });
    assert.equal(ra.length, lech.length);
    assert.ok(ra.every(x => x.file === 'thiet-ke.md' && x.loai === 'lech-hai-file'));
    assert.deepEqual(ra.map(x => x.kieu), lech.map(x => x.loai));
  }
  assert.deepEqual(congSoat({ slidesTxt: sl, thietKeTxt: tk }), [], 'bước không ghi file nào trong hai file');
  assert.deepEqual(congSoat({ slidesTxt: sl, vietSlides: true }), [], 'chưa có thiet-ke.md thì chưa đối chiếu');
});

test('dienCotCoFile: thêm cột cuối theo file thật, giữ cột Trạng thái', () => {
  const tk = readFixture('thiet-ke-thoat-vi.md');
  const tinhTrang = ten => ten.startsWith('trang-14') ? 'chua' : ten.startsWith('trang-09') ? 'cac-ban' : 'co';
  const ra = dienCotCoFile(tk, tinhTrang);
  const bang = ra.split('\n').filter((l, i, a) => i > a.findIndex(x => /^## Danh sách hình/.test(x)) && /^\|/.test(l));
  const o = l => l.split('|').map(c => c.trim()).slice(1, -1);
  assert.equal(o(bang[0]).at(-1), COT_CO_FILE);
  assert.equal(o(bang[1]).length, o(bang[0]).length);
  const theoTen = Object.fromEntries(bang.slice(2).map(l => [o(l)[0].split(' ')[0], o(l).at(-1)]));
  assert.equal(theoTen['trang-01-bia.png'], '✓ có trong hinh/');
  assert.equal(theoTen['trang-14-tom-luoc.png'], '✗ chưa có');
  assert.equal(theoTen['trang-09-bieu-tuong-an-toan.png'], '✗ chỉ có bản cũ trong hinh/cac-ban/');
  assert.equal(theoTen['trang-04'], '—', 'dòng Canva không có file');
  // Chạy lại không đổi gì; tình trạng đổi thì chỉ đổi đúng ô đó
  assert.equal(dienCotCoFile(ra, tinhTrang), ra);
  const lan2 = dienCotCoFile(ra, () => 'co');
  assert.equal(lan2.split('\n').filter(l => l.includes('✗')).length, 0);
  assert.equal(lan2.split('\n').filter(l => /^\|/.test(l)).length, ra.split('\n').filter(l => /^\|/.test(l)).length);
  // Phần ngoài bảng giữ nguyên
  const ngoai = t => t.split('\n').filter(l => !/^\|/.test(l)).join('\n');
  assert.equal(ngoai(ra), ngoai(tk));
  // Bộ dựng slide vẫn đọc đúng cột Trạng thái (cột thứ 5)
  assert.deepEqual(docThietKe(ra).dsHinh.map(h => h.trangThai), docThietKe(tk).dsHinh.map(h => h.trangThai));
});

test('dienCotCoFile: không có bảng thì trả nguyên văn', () => {
  const t = '# Thiết kế\n\n## Trang 1 · Bìa\n- Hình: D\n';
  assert.equal(dienCotCoFile(t, () => 'co'), t);
});
