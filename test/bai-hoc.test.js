'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const bh = require('../lib/bai-hoc');

test('gocCua', () => {
  assert.equal(bh.gocCua('lech-hai-file'), 'quy-trinh');
  assert.equal(bh.gocCua('link-chet'), 'moi-truong');
  assert.equal(bh.gocCua('file-khong-ton-tai'), 'cong-cu');
  assert.equal(bh.gocCua('phong-dai'), 'agent');
  assert.equal(bh.gocCua('khac'), 'agent');
});

const { docGhiChu } = require('../lib/ghi-chu');
const note = (ma, d = {}, noi_dung = `Bài ${ma}.`) => {
  const t = bh.taoBaiHoc({ ma, pham_vi: 'agent:lam', noi_dung, ngay: '2026-10-16', ...d });
  const { data, body } = docGhiChu(t);
  return { path: `tri-thuc/bai-hoc/${ma}.md`, data, para: '', noiDung: bh.noiDungBaiHoc(body) };
};

test('taoBaiHoc, docBaiHoc, maMoi', () => {
  const t = bh.taoBaiHoc({ ma: 'BH-17', goc: 'agent', pham_vi: 'agent:lam', ap_dung_khi: ['fix', 'slides'], loai_loi: 'lech-hai-file',
    noi_dung: 'Sau khi sửa dòng Hình, mở thiet-ke.md đối chiếu.', ngay: '2026-10-17', ghi_chu: 'Đã thành luật (1.3)' });
  const { data, body } = docGhiChu(t);
  assert.deepEqual(data.ap_dung_khi, ['fix', 'slides']);
  assert.equal(data.bac, 1);
  assert.equal(data.trang_thai, 'moi');
  assert.deepEqual(data.tu_van_de, []);
  assert.match(body, /## Ghi chú\nĐã thành luật/);
  assert.equal(bh.noiDungBaiHoc(body), 'Sau khi sửa dòng Hình, mở thiet-ke.md đối chiếu.');
  const ds = bh.docBaiHoc([note('BH-3'), note('BH-17'), { path: 'tri-thuc/nguon/x.md', data: { loai: 'nguon' } }]);
  assert.deepEqual(ds.map(b => b.ma), ['BH-3', 'BH-17']);
  assert.equal(bh.maMoi(ds), 'BH-18');
  assert.equal(bh.maMoi([]), 'BH-1');
});

test('suaBaiHoc giữ nội dung, thêm ghi chú; note khoá thì bỏ qua', () => {
  const t = bh.taoBaiHoc({ ma: 'BH-9', noi_dung: 'Cũ.', ngay: '2026-10-16' });
  const s = docGhiChu(bh.suaBaiHoc(t, { trang_thai: 'huy' }, { ghi_chu: 'gộp vào BH-3' }));
  assert.equal(s.data.trang_thai, 'huy');
  assert.equal(bh.noiDungBaiHoc(s.body), 'Cũ.');
  assert.match(s.body, /## Ghi chú\n- gộp vào BH-3/);
  assert.equal(bh.noiDungBaiHoc(docGhiChu(bh.suaBaiHoc(t, {}, { noi_dung: 'Mới.' })).body), 'Mới.');
  assert.ok(bh.suaBaiHoc(t.replace('loai: bai-hoc', 'loai: bai-hoc\nkhoa: true'), { bac: 2 }).boQua);
});

test('banXemKinhNghiem', () => {
  const ds = bh.docBaiHoc([note('BH-3'), note('BH-17', { bac: 2 }), note('BH-5', { trang_thai: 'huy' }), note('BH-6', { trang_thai: 'da-thang-cap' }),
    note('BH-7', { pham_vi: 'agent:an' }), note('BH-8', { pham_vi: 'nhom' })]);
  const t = bh.banXemKinhNghiem('Lam', 'lam', ds);
  assert.match(t, /^# Kinh nghiệm của Lam\n\n> Máy chủ tự sinh từ tri-thuc\/bai-hoc\//);
  assert.deepEqual(t.split('\n').filter(l => l.startsWith('- ')), ['- [BH-17] (checklist) Bài BH-17.', '- [BH-3] Bài BH-3.', '- [BH-8] Bài BH-8.']);
});
