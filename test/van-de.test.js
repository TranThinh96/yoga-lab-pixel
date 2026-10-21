'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vd = require('../lib/van-de');

const readFixture = n => fs.readFileSync(path.join(__dirname, 'fixtures', n), 'utf8').normalize('NFC');
const steps = [
  { agentId: 'mai', status: 'done', files: ['agents/mai/thu-nguon.md'] },
  { agentId: 'an', status: 'done', checks: 1, files: ['agents/an/thu-kiem.md'] },
  { agentId: 'lam', status: 'done', files: ['output/thu/slides.md'] },
  { agentId: 'vy', status: 'done', files: ['output/thu/thiet-ke.md'] },
  { agentId: 'nhi', status: 'done', files: [], images: ['output/thu/hinh/trang-16-a.png'] },
  { agentId: 'ha', status: 'done', checks: 4, files: ['agents/ha/thu-duyet.md'] }
];
const taoVanDe = () => {
  const plan = {};
  vd.ganVanDe(plan, vd.docVanDe(readFixture('van-de-mau.md')), { buoc: 6, tu: 'ha', chuDe: 'thu', chuFileFn: f => vd.chuFile(steps, f, 5) });
  return plan;
};

test('docVanDe', () => {
  const r = vd.docVanDe(readFixture('van-de-mau.md'));
  assert.deepEqual(r.map(x => [x.ma, x.file, x.muc, x.loai]), [
    ['V1', 'output/thu/slides.md', 'BẮT BUỘC', 'chinh-ta-dau-cau'],
    ['V2', 'output/thu/thiet-ke.md', 'BẮT BUỘC', 'lech-hai-file'],
    ['V3', 'slides.md', 'NÊN', 'khac'],
    ['V4', 'output/thu/hinh/trang-17-ghe.png', 'BẮT BUỘC', 'anh-sai-tu-the']
  ]);
  assert.equal(vd.docVanDe('không có bảng'), null);
  assert.deepEqual(vd.docVanDe('## Danh sách vấn đề\nKhông có lỗi.\n'), []);
});

test('docDaXuLy', () => {
  const r = vd.docDaXuLy(readFixture('da-xu-ly-mau.md'));
  assert.deepEqual(r.map(x => [x.ma, x.ketQua]), [['VD-1', 'da-sua'], ['VD-3', 'khong-sua'], ['VD-9', 'da-sua']]);
  assert.equal(r[1].ghiChu, '"gối kê" đúng thuật ngữ trong mẫu');
});

test('docDuyetLai', () => {
  const t = readFixture('duyet-lai-mau.md');
  assert.deepEqual(vd.docDuyetLai(t), [{ ma: 'VD-1', dong: true, ghiChu: '' }, { ma: 'VD-3', dong: false, ghiChu: 'vẫn dùng "gối" ở tr.22' }]);
  assert.equal(vd.docVanDe(t).length, 1);
});

test('docTinNhan', () => {
  const { gui, chung } = vd.docTinNhan(readFixture('tin-nhan-mau.md'));
  assert.deepEqual(gui.map(x => x.to), ['lam', 'Vy', 'ai-do', 'chef']);
  assert.deepEqual(chung, ['NICE trả 403 cho công cụ tải trang; Mayo mở được qua Chrome.']);
});

test('chuanHoaFile', () => {
  assert.equal(vd.chuanHoaFile('`slides.md`', 'thu'), 'output/thu/slides.md');
  assert.equal(vd.chuanHoaFile('output/thu/slides.md:120', 'thu'), 'output/thu/slides.md');
  assert.equal(vd.chuanHoaFile('thu/thiet-ke.md', 'thu'), 'output/thu/thiet-ke.md');
  assert.equal(vd.chuanHoaFile('agents/an/a.md', 'thu'), 'agents/an/a.md');
});

test('chuFile', () => {
  assert.deepEqual(vd.chuFile(steps, 'output/thu/slides.md', 5), { agentId: 'lam', step: 3 });
  assert.deepEqual(vd.chuFile(steps, 'output/thu/hinh/trang-17-ghe.png', 5), { agentId: 'nhi', step: 5 });
  assert.equal(vd.chuFile(steps, 'agents/an/thu-kiem.md', 5), null);
  assert.equal(vd.chuFile(steps, 'output/thu/thiet-ke.md', 3), null);
});

test('ganVanDe và nhomTheoChu', () => {
  const plan = taoVanDe();
  assert.deepEqual(plan.issues.map(x => [x.id, x.owner]), [['VD-1', 'lam'], ['VD-2', 'vy'], ['VD-3', 'lam'], ['VD-4', 'nhi']]);
  assert.deepEqual(plan.issues.map(x => x.goc), ['agent', 'quy-trinh', 'agent', 'agent']);
  const { nhom, khongChu } = vd.nhomTheoChu(plan.issues.filter(x => x.level === 'BẮT BUỘC'));
  assert.deepEqual([...nhom].map(([a, g]) => [a, g.issues.map(x => x.id)]), [['lam', ['VD-1']], ['vy', ['VD-2']], ['nhi', ['VD-4']]]);
  assert.equal(khongChu.length, 0);
});

test('capNhatTuSua', () => {
  const rows = vd.docDaXuLy(readFixture('da-xu-ly-mau.md'));
  let p = taoVanDe();
  vd.capNhatTuSua(p.issues, rows, ['output/thu/slides.md'], ['VD-1', 'VD-3']);
  assert.equal(p.issues[0].status, 'da-sua');
  assert.equal(p.issues[2].status, 'khong-sua');
  assert.equal(p.issues[2].note, '"gối kê" đúng thuật ngữ trong mẫu');
  assert.equal(p.issues.length, 4); // VD-9 không có trong sổ: bỏ qua
  p = taoVanDe();
  vd.capNhatTuSua(p.issues, rows, [], ['VD-1', 'VD-3']);
  assert.equal(p.issues[0].status, 'mo');
  assert.equal(p.issues[0].note, 'báo đã sửa nhưng file không đổi');
  p = taoVanDe();
  vd.capNhatTuSua(p.issues, [], [], ['VD-2']);
  assert.equal(p.issues[1].status, 'mo');
  assert.equal(p.issues[1].note, 'người sửa không báo');
});

test('capNhatTuDuyetLai', () => {
  const p = taoVanDe();
  p.issues[0].status = 'da-sua'; p.issues[1].status = 'da-sua'; p.issues[2].status = 'khong-sua';
  vd.capNhatTuDuyetLai(p.issues, vd.docDuyetLai(readFixture('duyet-lai-mau.md')), p.issues.map(x => x.id), 10);
  assert.deepEqual(p.issues.map(x => [x.id, x.status]), [['VD-1', 'dong'], ['VD-2', 'dong'], ['VD-3', 'mo'], ['VD-4', 'mo']]);
  assert.equal(p.issues[2].lastStep, 10);
  assert.equal(p.issues[3].lastStep, 10);
});

test('vietSoVanDe', () => {
  const md = vd.vietSoVanDe({ id: 'plan-x', ...taoVanDe() }, id => id.toUpperCase());
  assert.match(md, /^# Sổ vấn đề · plan-x/);
  assert.match(md, /\| VD-4 \| Mở \| BẮT BUỘC \| anh-sai-tu-the \| output\/thu\/hinh\/trang-17-ghe\.png · Trang 17 \|.*\| NHI \|/);
});

test('duyệt lại ghi nối vào cùng file: không nạp lại vấn đề cũ, vẫn nhận vấn đề mới', () => {
  const plan = taoVanDe();
  const moi = `| V5 | output/thu/slides.md | Trang 3 | BẮT BUỘC | thieu-nguon | Ý mới chưa có trích | Thêm trích |`;
  const banGhi = `${readFixture('van-de-mau.md')}\n\n## Kết quả duyệt lại\n| Mã | Kết luận | Ghi chú |\n|---|---|---|\n| VD-1 | Đóng | |\n\n` +
    `## Danh sách vấn đề\n| Mã | File | Vị trí | Mức | Loại | Vấn đề | Đề xuất |\n|---|---|---|---|---|---|---|\n${moi}\n`;
  assert.equal(vd.docVanDe(banGhi).length, 5);
  const them = vd.ganVanDe(plan, vd.docVanDe(banGhi), { buoc: 6, tu: 'ha', chuDe: 'thu', chuFileFn: f => vd.chuFile(steps, f, 5) });
  assert.deepEqual(them.map(x => [x.id, x.maGoc, x.text]), [['VD-5', 'V5', 'Ý mới chưa có trích']]);
  assert.equal(plan.issues.length, 5);
  assert.equal(vd.docDuyetLai(banGhi)[0].ma, 'VD-1');
});
