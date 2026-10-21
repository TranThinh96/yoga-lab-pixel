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

const fs = require('fs');
const path = require('path');
// Mỗi dòng "- …" của fixture, kèm agent (tiêu đề "## <id>" ngay trên)
const baiCu = () => {
  let id = null;
  return fs.readFileSync(path.join(__dirname, 'fixtures', 'kinh-nghiem-cu.md'), 'utf8').normalize('NFC').split(/\r?\n/).flatMap(l => {
    if (/^## /.test(l)) { id = l.slice(3).trim(); return []; }
    return /^- /.test(l) ? [{ id, full: l.slice(2), text: l.slice(2).replace(/^\([^)]*\)\s*/, '') }] : [];
  });
};
const cau = (id, dau) => { const x = baiCu().find(b => b.id === id && b.text.startsWith(dau)); assert.ok(x, `không thấy câu của ${id}: ${dau}`); return x; };

test('phanLoaiBaiHoc với câu thật', () => {
  const r = s => bh.phanLoaiBaiHoc(s);
  assert.deepEqual([r(cau('ha', 'Khi có thư mục ảnh tạm (hinh-moi/)').full).goc, r(cau('ha', 'Khi có thư mục ảnh tạm (hinh-moi/)').full).trang_thai], ['cong-cu', 'da-thang-cap']);
  // Câu của đặc tả; bài thật đã viết lại sau Đợt 1, cụm "CẦN GIAO LAM" giờ nằm trong tiền tố
  const chef = r("Bàn giao nào có dòng 'CẦN GIAO LAM' thì chèn bước sửa cho Lam.");
  assert.deepEqual([chef.goc, chef.trang_thai], ['quy-trinh', 'da-thang-cap']);
  assert.equal(r(baiCu().find(b => b.id === 'chef' && /CẦN GIAO LAM/.test(b.full)).full).goc, 'quy-trinh');
  const mai = r(cau('mai', 'Tìm nguồn Việt Nam (Bộ Y tế) cho số cấp cứu 115').full);
  assert.deepEqual([mai.goc, mai.trang_thai], ['tri-thuc', 'da-thang-cap']);
  const lam = r(cau('lam', 'Đếm chữ từng trang bằng tay khi viết').full);
  assert.deepEqual([lam.goc, lam.trang_thai], ['cong-cu', 'da-thang-cap']);
  const an = r(cau('an', 'Khi duyệt kịch bản, rà cả những câu an toàn do chính mình viết').full);
  assert.deepEqual([an.loai_loi, an.goc, an.trang_thai], ['an-toan-thieu-ccd', 'agent', 'moi']);
  const lam2 = r(cau('lam', 'Đọc lại từng ý trên slide như một câu trọn nghĩa').full);
  assert.deepEqual([lam2.loai_loi, lam2.goc], ['chinh-ta-dau-cau', 'agent']);
  assert.equal(baiCu().filter(b => r(b.full).trang_thai === 'da-thang-cap').length, 17);
});

test('doanApDungKhi', () => {
  assert.deepEqual(bh.doanApDungKhi(cau('lam', 'Dòng "Hình" trong slides.md phải khớp').text), ['slides', 'thiet-ke']);
  assert.deepEqual(bh.doanApDungKhi('Khi duyệt, kiểm prompt ảnh'), ['review', 'anh']);
  assert.deepEqual(bh.doanApDungKhi('Viết ngắn gọn.'), []);
});

test('nhanBuoc', () => {
  assert.deepEqual(bh.nhanBuoc({ task: 'Viết output/x/slides.md' }), ['work', 'slides']);
  assert.deepEqual(bh.nhanBuoc({ kind: 'review', files: ['output/x/thiet-ke.md', 'agents/mai/x-nguon.md'] }), ['review', 'thiet-ke', 'nguon']);
  assert.deepEqual(bh.nhanBuoc({ agent: { engine: 'claude', geminiWeb: { mode: 'deep-research' } } }), ['work', 'nguon']);
  assert.deepEqual(bh.nhanBuoc({ kind: 'fix', agent: { engine: 'antigravity' } }), ['fix', 'anh']);
});

test('chonBaiHoc', () => {
  const ds = bh.docBaiHoc([
    note('BH-1', { ap_dung_khi: ['anh'] }),
    note('BH-2', { pham_vi: 'agent:an' }),
    note('BH-3', { ap_dung_khi: ['slides'], ngay: '2026-10-17' }),
    note('BH-4', { bac: 2, ap_dung_khi: ['fix'] }),
    note('BH-5', { trang_thai: 'da-thang-cap' }),
    note('BH-6', { pham_vi: 'nhom' }),
    note('BH-7', { pham_vi: 'chu-de:mat-ngu' }),
    note('BH-8', { trang_thai: 'khong-hieu-qua' })
  ]);
  const ma = x => x.map(b => b.ma);
  const lam = bh.chonBaiHoc(ds, { agentId: 'lam', nhan: ['fix', 'slides'], chuDe: 'mat-ngu' });
  assert.ok(!ma(lam).includes('BH-1'));  // ảnh không ra cho bước slides
  assert.ok(!ma(lam).includes('BH-2'));  // bài của An không ra cho Lam
  assert.ok(!ma(lam).includes('BH-5'));  // đã thăng cấp
  assert.equal(lam[0].ma, 'BH-4');       // bậc 2 đứng đầu
  assert.deepEqual(ma(lam).slice(1, 2), ['BH-3']); // rồi bài mới hơn
  assert.ok(ma(lam).includes('BH-6') && ma(lam).includes('BH-7') && ma(lam).includes('BH-8'));
  assert.ok(!ma(bh.chonBaiHoc(ds, { agentId: 'lam', nhan: ['work', 'slides'], chuDe: 'suy-giap' })).includes('BH-7'));
  assert.equal(bh.chonBaiHoc(ds, { agentId: 'lam', nhan: ['fix', 'slides'] }, 2).length, 2);
});

test('maTrong', () => {
  assert.deepEqual(bh.maTrong('- [BH-17] đã kiểm\n- BH-3 không ngoặc\n- [BH-4]'), ['BH-17', 'BH-4']);
});

test('danhGiaBaiHoc: tái phạm thì lên bậc, không tái phạm thì tính hiệu quả', () => {
  const ds = bh.docBaiHoc([note('BH-17', { loai_loi: 'lech-hai-file', ap_dung_khi: ['fix', 'slides'] })]);
  const vd = [{ id: 'VD-1', kind: 'lech-hai-file', owner: 'lam' }, { id: 'VD-2', kind: 'lech-hai-file', owner: 'lam' }];
  const ctx = { batDau: '2026-10-20', nguoiThamGia: ['lam', 'an'], nhanTheoNguoi: { lam: ['work', 'slides'], an: ['review'] } };
  const [r] = bh.danhGiaBaiHoc(ds, vd, ctx);
  assert.deepEqual(r.sua, { lan_tai_pham: 1, trang_thai: 'khong-hieu-qua', bac: 2 });
  assert.ok(r.ghi);
  const [h] = bh.danhGiaBaiHoc(ds, [{ id: 'VD-1', kind: 'phong-dai', owner: 'lam' }], ctx);
  assert.deepEqual(h.sua, { lan_hieu_qua: 1 });
  // lỗi của người khác không tính cho bài của Lam; Lam không làm bước khớp thì không tính gì
  assert.deepEqual(bh.danhGiaBaiHoc(ds, [{ id: 'VD-1', kind: 'lech-hai-file', owner: 'vy' }], { ...ctx, nhanTheoNguoi: { lam: ['review'] } }), []);
  // bài có từ chính ngày dự án bắt đầu (bài mới) không xét
  assert.deepEqual(bh.danhGiaBaiHoc(ds, vd, { ...ctx, batDau: '2026-10-16' }), []);
  // lần hiệu quả thứ hai, chưa tái phạm → hieu-qua
  const ds2 = bh.docBaiHoc([note('BH-3', { loai_loi: 'qua-chu' })]);
  ds2[0].data.lan_hieu_qua = 1;
  assert.deepEqual(bh.danhGiaBaiHoc(ds2, [], ctx)[0].sua, { lan_hieu_qua: 2, trang_thai: 'hieu-qua' });
});

test('danhGiaBaiHoc: bậc 2 → lỗ hổng + đề xuất len-bac; bậc 3 → đề xuất sửa hướng dẫn', () => {
  const vd = [{ id: 'VD-4', kind: 'qua-chu', owner: 'lam' }];
  const ctx = { batDau: '2026-11-01', nguoiThamGia: ['lam'], nhanTheoNguoi: { lam: ['work'] } };
  const [r2] = bh.danhGiaBaiHoc(bh.docBaiHoc([note('BH-5', { loai_loi: 'qua-chu', bac: 2 })]), vd, ctx);
  assert.equal(r2.sua.bac, undefined);
  assert.match(r2.loHong.mo_ta, /^Cần luật máy soát cho: Bài BH-5\./);
  assert.equal(r2.deXuat.loai, 'len-bac');
  const [r3] = bh.danhGiaBaiHoc(bh.docBaiHoc([note('BH-6', { loai_loi: 'qua-chu', bac: 3 })]), vd, ctx);
  assert.deepEqual([r3.deXuat.loai, r3.deXuat.agent, r3.deXuat.cu], ['sua-huong-dan', 'lam', '']);
  const [rn] = bh.danhGiaBaiHoc(bh.docBaiHoc([note('BH-7', { loai_loi: 'qua-chu', bac: 3, pham_vi: 'nhom' })]), vd, ctx);
  assert.equal(rn.deXuat.loai, 'quy-trinh');
});

test('themLoHong chỉ thêm dòng, bỏ mô tả đã có', () => {
  const t1 = bh.themLoHong('', [{ mo_ta: 'Máy chủ đặt ảnh sai thư mục', bang_chung: 'VD-3' }], { ngay: '2026-11-02', planId: 'plan-1' });
  assert.match(t1, /^# Lỗ hổng hệ thống\n/);
  assert.match(t1, /\n- \[ \] \(2026-11-02, plan-1\) Máy chủ đặt ảnh sai thư mục — VD-3\n$/);
  const t2 = bh.themLoHong(t1.replace('- [ ]', '- [x]') + '', [{ mo_ta: 'Máy chủ đặt ảnh sai thư mục' }, { mo_ta: 'Thiếu công cụ đếm chữ' }], { ngay: '2026-11-03' });
  assert.equal(bh.demLoHongMo(t2), 2); // dòng cũ đã [x] thì thêm lại được
  assert.equal(bh.themLoHong(t2, [{ mo_ta: 'Thiếu công cụ đếm chữ' }], { ngay: '2026-11-04' }), t2);
});
