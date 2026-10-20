'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { vietBanDo } = require('../lib/ban-do');

const plans = [
  { id: 'plan-3', goal: 'Workshop tăng huyết áp', status: 'running', score: null, topic: 'tang-huyet-ap', brief: 'du-an/plan-3/brief.md' },
  { id: 'plan-2', goal: 'Workshop đau lưng cho dân văn phòng ngồi nhiều, cần slide và lời giảng chi tiết', status: 'paused', score: null, topic: null, brief: 'du-an/plan-2/brief.md' },
  { id: 'plan-1', goal: 'Suy giáp', status: 'done', score: 83, topic: 'suy-giap-v7', brief: 'du-an/plan-1/brief.md', nghiemThu: 'du-an/plan-1/nghiem-thu.md' }
];
const topics = [
  { ten: 'tang-huyet-ap', files: [{ path: 'output/tang-huyet-ap/slides.md', by: 'Lam' }, { path: 'output/tang-huyet-ap/thiet-ke.md', by: '' }] },
  { ten: 'suy-giap-v7', files: [{ path: 'output/suy-giap-v7/slides.md', by: 'Lam' }] }
];

test('vietBanDo', () => {
  const md = vietBanDo({ plans, topics, coTriThuc: false, coBanCu: true });
  assert.ok(md.split('\n').length < 30);
  assert.match(md, /Xong, 83\/100 · nghiệm thu:/);
  assert.match(md, /Tạm dừng/);
  assert.doesNotMatch(md, /## File quan trọng/);
  assert.doesNotMatch(md, /^- tri-thuc\//m);
  assert.match(md, /thiet-ke\.md(,|$)/m); // by rỗng thì bỏ ngoặc
  assert.match(md, /luu-tru\/index-cu\.md/);
  assert.match(vietBanDo({ plans, topics, coTriThuc: true }), /^- tri-thuc\//m);
  assert.match(vietBanDo({}), /## Dự án gần đây\n\(chưa có\)/);
});
