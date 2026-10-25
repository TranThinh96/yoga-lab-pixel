'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { gocBuoc, chonBuocChay, choBuocChen, hetHanMucGemini } = require('../lib/lich');

// Sau một bước duyệt (3) có lỗi của cả Vy (thiết kế, bước 2) và Lam (kịch bản, bước 1)
const B = () => [
  { agentId: 'lam', status: 'done', from: [] },
  { agentId: 'vy', status: 'done', from: [1] },
  { agentId: 'ha', status: 'done', from: [2], checks: 2 },
  { agentId: 'vy', status: 'pending', from: [2, 3], fixOf: 2 },
  { agentId: 'lam', status: 'pending', from: [1, 3], fixOf: 1 },
  { agentId: 'ha', status: 'pending', from: [3, 4, 5], checks: 4 },
  { agentId: 'nhi', status: 'pending', from: [2] }
];

test('gocBuoc: đi theo checks/fixOf về bước làm ban đầu', () => {
  const b = B();
  assert.equal(gocBuoc(b, 1), 1);
  assert.equal(gocBuoc(b, 4), 2);
  assert.equal(gocBuoc(b, 6), 2);
  assert.equal(gocBuoc(b, 5), 1);
});

test('chonBuocChay: Vy và Lam sửa cùng lúc; max 1 giữ cách tuần tự', () => {
  assert.deepEqual(chonBuocChay(B(), { max: 2 }), [3, 4]);
  assert.deepEqual(chonBuocChay(B(), { max: 1 }), [3]);
});

test('chonBuocChay: duyệt lại chờ Lam; Nhi chờ bản thiết kế qua duyệt lại', () => {
  const b = B();
  b[3].status = 'done'; b[4].status = 'working';
  assert.deepEqual(chonBuocChay(b, { max: 2 }), []);
  b[4].status = 'done';
  assert.deepEqual(chonBuocChay(b, { max: 3 }), [5]);
  b[5].status = 'done';
  assert.deepEqual(chonBuocChay(b, { max: 3 }), [6]);
});

test('chonBuocChay: agent đang bận việc khác thì bỏ qua bước của người đó', () => {
  assert.deepEqual(chonBuocChay(B(), { max: 2, dangBan: new Set(['vy']) }), [4]);
});

test('chonBuocChay: có bước lỗi thì không chạy gì', () => {
  const b = B();
  b[3].status = 'error';
  assert.deepEqual(chonBuocChay(b, { max: 2 }), []);
});

test('chonBuocChay: chuỗi tuần tự với max 1', () => {
  const b = ['done', 'done', 'pending', 'pending'].map((status, i) => ({ agentId: 'a' + i, status, from: [] }));
  assert.deepEqual(chonBuocChay(b, { max: 1 }), [2]);
});

test('choBuocChen: duyệt lại phía sau chờ các bước giao ban chèn vào', () => {
  // Như plan-20261022-203403: giao ban chèn Mai tải hình, Vy sửa thiết kế trước bước Hạ duyệt lại
  const b = [
    { agentId: 'vy', status: 'done', from: [] },
    { agentId: 'ha', status: 'done', from: [1], checks: 1 },
    { agentId: 'vy', status: 'done', from: [1, 2], fixOf: 1 },
    { agentId: 'mai', status: 'pending', from: [] },
    { agentId: 'vy', status: 'pending', from: [] },
    { agentId: 'ha', status: 'pending', from: [2, 3], checks: 3 }
  ];
  assert.deepEqual(chonBuocChay(b, { max: 2 }), [3, 5]);
  choBuocChen(b, 3, 2);
  assert.deepEqual(b[5].from, [2, 3, 4, 5]);
  assert.deepEqual(b[4].from, []);
  assert.deepEqual(chonBuocChay(b, { max: 2 }), [3]);
});

test('chonBuocChay: bước dùng sản phẩm chờ lượt làm tiếp sau câu trả lời', () => {
  const b = [
    { agentId: 'lam', status: 'done', from: [] },
    { agentId: 'lam', status: 'pending', from: [1], contOf: 1 },
    { agentId: 'vy', status: 'pending', from: [1] }
  ];
  assert.equal(gocBuoc(b, 2), 1);
  assert.deepEqual(chonBuocChay(b, { max: 2 }), [1]);
});

test('hetHanMucGemini: đọc giờ làm mới hạn mức Gemini từ bàn giao', () => {
  const now = new Date(2026, 9, 25, 19, 57);
  const gio = r => [r.at.getDate(), r.at.getHours(), r.at.getMinutes()];
  // Giờ 24h theo mẫu dòng trong prompt, cộng 2 phút dự phòng
  assert.deepEqual(gio(hetHanMucGemini('## Vướng mắc\n- HẾT HẠN MỨC GEMINI: đặt lại lúc 20:01 (Limit resets Oct 25, 8:01 PM)', now)), [25, 20, 3]);
  // Agent quên đổi giờ: đọc được giờ am/pm của Gemini
  assert.deepEqual(gio(hetHanMucGemini('HẾT HẠN MỨC GEMINI: Limit resets Oct 25, 8:01 PM', now)), [25, 20, 3]);
  // Giờ đã qua lâu: sang hôm sau; vừa qua ít phút: chạy lại ngay
  assert.deepEqual(gio(hetHanMucGemini('HẾT HẠN MỨC GEMINI: đặt lại lúc 9:00', now)), [26, 9, 2]);
  assert.deepEqual(gio(hetHanMucGemini('HẾT HẠN MỨC GEMINI: đặt lại lúc 19:50', now)), [25, 19, 59]);
  // Không có giờ: vẫn nhận ra hết hạn mức, máy chủ tự chọn giờ chờ
  assert.deepEqual(hetHanMucGemini('HẾT HẠN MỨC GEMINI: Deep Research bị mờ', now), { dong: 'Deep Research bị mờ', at: null });
  assert.equal(hetHanMucGemini('Gemini báo lỗi, không rõ lý do', now), null);
});
