'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const tt = require('../lib/tri-thuc');
const { docGhiChu, vietGhiChu } = require('../lib/ghi-chu');

const row = { ma: 'x', y: 'Ý thử.', muc: 'Mạnh', nguon: 'a', trich: 'q1' };
const meta = { chuDe: 'c1', duyet: true, tacGia: 'an', ngay: '2026-10-19' };
const lichSu = body => body.split('\n').filter(l => /^- \d{4}-/.test(l));

test('hopNhatMenhDe: note mới, Mai gộp thêm, An duyệt lại', () => {
  const n1 = tt.hopNhatMenhDe(null, row, meta);
  const d1 = docGhiChu(n1).data;
  assert.equal(d1.trang_thai, 'da-duyet');
  assert.equal(d1.xem_lai_truoc, '2027-10-19');
  assert.deepEqual(docGhiChu(tt.hopNhatMenhDe(null, { ...row, nguon: 'nhs-levothyroxine, [ata-2014]' }, meta)).data.nguon, ['[[nhs-levothyroxine]]', '[[ata-2014]]']);

  const n2 = tt.hopNhatMenhDe(n1, { ...row, muc: 'Vừa', trich: 'q2', nguon: 'b' }, { chuDe: 'c2', duyet: false, tacGia: 'mai', ngay: '2026-10-20' });
  const g2 = docGhiChu(n2);
  assert.equal(g2.data.muc_bang_chung, 'manh');
  assert.equal(g2.data.trich, 'q1');
  assert.deepEqual(g2.data.nguon, ['[[a]]', '[[b]]']);
  assert.deepEqual(g2.data.chu_de, ['c1', 'c2']);
  assert.equal(lichSu(g2.body).length, 2);

  const d3 = docGhiChu(tt.hopNhatMenhDe(n2, { ...row, muc: 'Vừa', trich: 'q3' }, { ...meta, ngay: '2026-11-03' })).data;
  assert.equal(d3.muc_bang_chung, 'vua');
  assert.equal(d3.trich, 'q3');
  assert.equal(d3.ngay_duyet, '2026-11-03');
});

test('hopNhatMenhDe: tôn trọng bác bỏ và khoá', () => {
  const n1 = tt.hopNhatMenhDe(null, row, meta);
  const { data, body } = docGhiChu(n1);
  assert.deepEqual(tt.hopNhatMenhDe(vietGhiChu({ ...data, trang_thai: 'bac-bo' }, body), row, meta), { boQua: 'chủ dự án đã bác bỏ ý này' });
  assert.deepEqual(tt.hopNhatMenhDe(vietGhiChu({ ...data, khoa: true }, body), row, meta), { boQua: 'note đã khoá' });
});

test('hopNhatMenhDe: nhập lại cùng lượt không thêm lịch sử trùng', () => {
  const n1 = tt.hopNhatMenhDe(null, row, meta);
  assert.equal(tt.hopNhatMenhDe(n1, row, meta), n1);
});

test('MUC', () => {
  assert.deepEqual(['Mạnh', 'Vừa', 'Trung bình', 'Sơ bộ', 'Ý kiến', ''].map(tt.MUC), ['manh', 'vua', 'vua', 'so-bo', 'y-kien', 'y-kien']);
});

test('chuDeTriThuc', () => {
  assert.equal(tt.chuDeTriThuc('suy-giap-v7'), 'suy-giap');
  assert.equal(tt.chuDeTriThuc('mat-ngu'), 'mat-ngu');
  assert.equal(tt.chuDeTriThuc(null), null);
});

test('hopNhatNguon: giữ url cũ, ghi đề xuất link khác', () => {
  const m = { chuDe: 'suy-giap', tacGia: 'mai', ngay: '2026-10-19', planId: 'plan-1' };
  const n1 = tt.hopNhatNguon(null, { ma: 'nhs-levo', toChuc: 'NHS', tieuDe: 'Levothyroxine', link: 'https://www.nhs.uk/a', loaiNguon: 'Hướng dẫn' }, m);
  const d1 = docGhiChu(n1).data;
  assert.equal(d1.url, 'https://www.nhs.uk/a');
  assert.equal(d1.truy_cap, 'chua-kiem');
  assert.equal(d1.loai_nguon, 'huong-dan');
  const n2 = tt.hopNhatNguon(n1, { ma: 'nhs-levo', link: 'xem https://www.nhs.uk/b' }, { ...m, chuDe: 'mat-ngu' });
  const g2 = docGhiChu(n2);
  assert.equal(g2.data.url, 'https://www.nhs.uk/a');
  assert.deepEqual(g2.data.chu_de, ['suy-giap', 'mat-ngu']);
  assert.match(g2.body, /đề xuất link khác: https:\/\/www\.nhs\.uk\/b/);
});

test('capNhatTruyCap: chỉ thêm lịch sử khi đổi', () => {
  const n1 = tt.hopNhatNguon(null, { ma: 's', link: 'https://x.org' }, { chuDe: 'c', tacGia: 'mai', ngay: '2026-10-19' });
  const n2 = tt.capNhatTruyCap(n1, 'captcha', '2026-10-20');
  assert.equal(docGhiChu(n2).data.truy_cap, 'captcha');
  assert.equal(lichSu(docGhiChu(n2).body).length, 2);
  const n3 = tt.capNhatTruyCap(n2, 'captcha', '2026-10-21');
  assert.equal(docGhiChu(n3).data.kiem_luc, '2026-10-21');
  assert.equal(lichSu(docGhiChu(n3).body).length, 2);
});

test('hopNhatTuThe: gộp hai lần cùng prompt chỉ có một dòng', () => {
  const r = { ma: 'balasana', tenViet: 'Tư thế em bé', tenPhan: 'Balasana', daoCu: 'gối; chăn', ccd: 'chấn thương gối', mucCcd: 'Ý kiến',
    prompt: 'woman in child pose, wide 16:9', loiAi: 'tay sai số ngón' };
  const m = { chuDe: 'suy-giap', duyet: true, tacGia: 'an', ngay: '2026-10-19' };
  const n1 = tt.hopNhatTuThe(null, r, m);
  const n2 = tt.hopNhatTuThe(n1, { ...r, daoCu: 'gạch', loiAi: 'tay sai số ngón; gối co sai' }, { ...m, chuDe: 'mat-ngu' });
  const { data, body } = docGhiChu(n2);
  assert.deepEqual(data.dao_cu, ['gối', 'chăn', 'gạch']);
  const muc = t => body.split(/^## /m).find(x => x.startsWith(t)).split('\n').filter(l => l.startsWith('- '));
  assert.deepEqual(muc('Prompt ảnh đã đạt'), ['- woman in child pose, wide 16:9']);
  assert.deepEqual(muc('Lỗi AI hay vẽ sai'), ['- tay sai số ngón', '- gối co sai']);
  assert.deepEqual(tt.hopNhatTuThe(null, r, { ...m, duyet: false }), { boQua: 'chỉ người duyệt được ghi tư thế' });
});

test('hopNhatHinh: chỉ điền trường trống; maHinh tránh trùng', () => {
  const m = { chuDe: 'suy-giap', tacGia: 'mai', ngay: '2026-10-19' };
  const n1 = tt.hopNhatHinh(null, { file: 'output/suy-giap-v7/hinh-nguon/tuyen-giap.jpg', link: 'https://commons.wikimedia.org/wiki/File:T.jpg', giayPhep: 'CC BY-SA 4.0', theHien: 'Tuyến giáp' }, m);
  assert.match(n1, /!\[\[output\/suy-giap-v7\/hinh-nguon\/tuyen-giap\.jpg\]\]/);
  const d2 = docGhiChu(tt.hopNhatHinh(n1, { file: 'x.jpg', giayPhep: 'khác', tacGia: 'Ai đó' }, m)).data;
  assert.equal(d2.giay_phep, 'CC BY-SA 4.0');
  assert.equal(d2.tac_gia, 'Ai đó');
  assert.equal(tt.maHinh('output/mat-ngu/hinh-nguon/tuyen-giap.jpg', 'mat-ngu', () => n1), 'tuyen-giap-mat-ngu');
  assert.equal(tt.maHinh('output/suy-giap-v7/hinh-nguon/tuyen-giap.jpg', 'suy-giap', () => n1), 'tuyen-giap');
});

test('docBangTriThuc: bỏ ý chờ, đổi số [n] sang mã nguồn', () => {
  const t = [
    '## Danh sách nguồn', '| Mã nguồn | [n] | Tổ chức | Tiêu đề | Link | Loại nguồn |', '|---|---|---|---|---|---|',
    '| nhs-levo | 1 | NHS | Levothyroxine | https://www.nhs.uk/a | Hướng dẫn |', '| | 2 | ATA | Không mã | https://ata.org/x | Hướng dẫn |', '',
    '## Danh sách đã duyệt', '| Mã | Ý | Mức bằng chứng | Nguồn | Câu trích | Ghi chú |', '|---|---|---|---|---|---|',
    '| uong-luc-doi | Uống levothyroxine lúc đói. | Mạnh | [1], 7 | "before breakfast" | |', '| | Ý còn chờ An kiểm. | Vừa | 1 | | |', '',
    '## Tư thế', '| Mã | Tên Việt | Tên Phạn | Đạo cụ | Chống chỉ định | Mức bằng chứng CCĐ | Prompt ảnh đã đạt | Lỗi AI hay vẽ sai |', '|---|---|---|---|---|---|---|---|',
    '| balasana | Em bé | Balasana | gối | | | p | |'
  ].join('\n');
  const r = tt.docBangTriThuc(t);
  assert.deepEqual(r.nguon.map(x => x.ma), ['nhs-levo', 'ata-khong-ma']);
  assert.deepEqual(r.menhDe.map(x => [x.ma, x.nguon, x.trich]), [['uong-luc-doi', 'nhs-levo', 'before breakfast']]);
  assert.deepEqual(r.tuThe.map(x => x.ma), ['balasana']);
  assert.deepEqual(tt.docBangTriThuc('## Danh sách đã duyệt\n- ý gạch đầu dòng kiểu cũ'), { nguon: [], menhDe: [], tuThe: [] });
});
