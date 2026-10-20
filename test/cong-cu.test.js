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

test('kiem_link', async () => {
  const kiemMotLink = async u => {
    if (u.endsWith('/1')) return { ket: 'ok', http: 200, title: 'Trang một' };
    if (u.endsWith('/2')) return { ket: 'chan', http: 403 };
    throw new Error('mạng hỏng');
  };
  const r = await goi('kiem_link', { urls: ['https://a.vn/1', 'https://a.vn/2', 'https://a.vn/3'] }, { kiemMotLink }, ['kiem_link']);
  assert.ok(!r.isError);
  assert.match(r.text, /a\.vn\/1 → ✓ mở được \(HTTP 200\) · "Trang một"/);
  assert.match(r.text, /a\.vn\/2 → BỊ CHẶN \(HTTP 403\)/);
  assert.match(r.text, /a\.vn\/3 → LỖI · mạng hỏng/);
  assert.equal((await goi('kiem_link', { urls: ['abc'] }, { kiemMotLink }, ['kiem_link'])).isError, true);
  let dem = 0;
  const muoiHai = Array.from({ length: 12 }, (_, i) => `https://b.vn/${i}`);
  await goi('kiem_link', { urls: muoiHai }, { kiemMotLink: async () => { dem++; return { ket: 'ok' }; } }, ['kiem_link']);
  assert.equal(dem, 10);
});

test('tai_hinh', async () => {
  const kq = [{ loi: 'HTTP 404' }, { xepHang: true, rel: 'output/t/hinh-nguon/a.jpg' }, { daCo: true, rel: 'output/t/hinh-nguon/a.jpg' }, { rel: 'output/t/hinh-nguon/a.jpg', kb: 120, license: 'CC BY 4.0' }];
  const ctx = { taiHinh: async () => kq.shift() };
  const g = () => goi('tai_hinh', { link: 'https://commons.wikimedia.org/wiki/File:A.jpg', ten: 'a' }, ctx, ['tai_hinh']);
  const r1 = await g();
  assert.equal(r1.isError, true);
  assert.equal(r1.text, 'Không tải được: HTTP 404');
  assert.match((await g()).text, /^Commons đang giới hạn lượt tải \(HTTP 429\)\. Máy chủ sẽ tự tải output\/t\/hinh-nguon\/a\.jpg sau vài phút/);
  assert.equal((await g()).text, 'Đã có sẵn output/t/hinh-nguon/a.jpg, không tải lại. Muốn bản khác thì đặt tên khác.');
  assert.equal((await g()).text, 'Đã tải output/t/hinh-nguon/a.jpg (120 KB) · CC BY 4.0');
  assert.equal((await goi('tai_hinh', { link: 'https://x.vn/a.jpg' }, ctx, ['tai_hinh'])).isError, true);
});
