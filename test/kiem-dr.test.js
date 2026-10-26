'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { promptKiemDr, taoBoBatTrang, ketLuanKiem, capNhatTrangThai, ghiBaoCaoDr, thanBaoCao } = require('../lib/kiem-dr');

const LINK = 'https://gemini.google.com/app/d106d75247ef7950';
const DAI = 'Báo cáo: thở cơ hoành giúp giảm căng thẳng [1]. '.repeat(60);

test('promptKiemDr: có link, chỉ dặn dùng Chrome, không chép lại kết quả get_page_text', () => {
  const p = promptKiemDr(LINK);
  assert.ok(p.includes(LINK));
  assert.match(p, /get_page_text MỘT lần/);
  assert.match(p, /KHÔNG chép lại/);
  assert.match(p, /ĐANG CHẠY/);
});

test('taoBoBatTrang: chỉ lấy kết quả của get_page_text, giữ bản dài nhất, bỏ kết quả lỗi', () => {
  const bo = taoBoBatTrang();
  bo.napGoi({ type: 'tool_use', id: 't1', name: 'mcp__claude-in-chrome__find' });
  bo.napGoi({ type: 'tool_use', id: 't2', name: 'mcp__claude-in-chrome__get_page_text' });
  bo.napGoi({ type: 'tool_use', id: 't3', name: 'mcp__claude-in-chrome__get_page_text' });
  bo.napKetQua({ type: 'tool_result', tool_use_id: 't1', content: [{ type: 'text', text: 'nút Xuất ở ref_12' + 'x'.repeat(5000) }] });
  bo.napKetQua({ type: 'tool_result', tool_use_id: 't2', content: [{ type: 'text', text: 'ngắn' }] });
  bo.napKetQua({ type: 'tool_result', tool_use_id: 't3', content: [{ type: 'text', text: 'phần 1' }, { type: 'text', text: 'phần 2' }] });
  assert.equal(bo.text, 'phần 1\nphần 2');
  bo.napKetQua({ type: 'tool_result', tool_use_id: 't2', is_error: true, content: 'Lỗi' + 'y'.repeat(9000) });
  assert.equal(bo.text, 'phần 1\nphần 2');
  bo.napKetQua({ type: 'tool_result', tool_use_id: 't2', content: DAI });
  assert.equal(bo.text, DAI.trim());
});

test('ketLuanKiem: XONG cần toàn văn đủ dài; ĐANG CHẠY; LỖI; câu khác là không rõ', () => {
  assert.deepEqual(ketLuanKiem('XONG', DAI), { loai: 'xong', baoCao: DAI });
  assert.equal(ketLuanKiem('**XONG**', DAI).loai, 'xong');
  assert.equal(ketLuanKiem('XONG', '').loai, 'khong-ro');
  assert.match(ketLuanKiem('XONG', 'khung trang').lyDo, /quá ngắn/);
  assert.deepEqual(ketLuanKiem('ĐANG CHẠY'), { loai: 'dang-chay' });
  assert.deepEqual(ketLuanKiem('LỖI: Something went wrong'), { loai: 'loi', lyDo: 'Something went wrong' });
  assert.equal(ketLuanKiem('Trang hiện HẾT HẠN MỨC GEMINI tới 20:01').loai, 'loi');
  assert.equal(ketLuanKiem('Tôi đã mở trang và thấy…').loai, 'khong-ro');
  assert.equal(ketLuanKiem('').loai, 'khong-ro');
});

test('capNhatTrangThai: sửa dòng có sẵn (giữ in đậm), chưa có thì chèn sau dòng Link', () => {
  assert.equal(capNhatTrangThai(`Link: ${LINK}\nTrạng thái: đang chạy\nBắt đầu: 20:08`, 'đang chạy (kiểm lúc 20:39)'),
    `Link: ${LINK}\nTrạng thái: đang chạy (kiểm lúc 20:39)\nBắt đầu: 20:08`);
  assert.equal(capNhatTrangThai('**Trạng thái:** đang chạy', 'xong'), '**Trạng thái:** xong');
  assert.equal(capNhatTrangThai(`Link: ${LINK}\nBắt đầu: 20:08`, 'đang chạy'), `Link: ${LINK}\nTrạng thái: đang chạy\nBắt đầu: 20:08`);
});

test('ghiBaoCaoDr: giữ Link và Bắt đầu, trạng thái xong, rồi nguyên văn; thanBaoCao bỏ các dòng đầu', () => {
  const moi = ghiBaoCaoDr(`Link: ${LINK}\nTrạng thái: đang chạy (kiểm lúc 21:12)\nBắt đầu: 20:08\n\nGhi chú cũ`, DAI, '21:30 25/10');
  const dong = moi.split('\n');
  assert.deepEqual(dong.slice(0, 3), [`Link: ${LINK}`, 'Bắt đầu: 20:08', 'Trạng thái: xong']);
  assert.match(dong[3], /^Lấy báo cáo: 21:30 25\/10/);
  assert.ok(!moi.includes('Ghi chú cũ'));
  assert.equal(thanBaoCao(moi), DAI.trim());
  assert.equal(thanBaoCao(`Link: ${LINK}\nTrạng thái: đang chạy`), '');
});
