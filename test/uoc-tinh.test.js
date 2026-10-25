'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { thongKeChiPhi, uocTinhKeHoach } = require('../lib/uoc-tinh');

// Dự án p1: Mai làm (2 lượt: hai pha Deep Research), An duyệt, Mai sửa, An duyệt lại; tổng 3,0 USD
const plans = [
  { id: 'p1', status: 'done', costUsd: 3.0, steps: [
    { agentId: 'mai', status: 'done' },
    { agentId: 'an', status: 'done', checks: 1 },
    { agentId: 'mai', status: 'done', fixOf: 1 },
    { agentId: 'an', status: 'done', checks: 1, round: 1 }
  ] },
  { id: 'p2', status: 'done', costUsd: 1.0, steps: [{ agentId: 'mai', status: 'done' }, { agentId: 'an', status: 'error', checks: 1 }] }
];
const runs = [
  { planId: 'p1', step: 1, costUsd: 0.5, tokens: 100 }, { planId: 'p1', step: 1, costUsd: 0.5, tokens: 100 },
  { planId: 'p1', step: 2, costUsd: 0.6, tokens: 60 },
  { planId: 'p1', step: 3, costUsd: 0.4, tokens: 40 },
  { planId: 'p1', step: 4, costUsd: 0.2, tokens: 20 },
  { planId: 'p1', costUsd: 0.8, tokens: 80 }, // lập kế hoạch, nghiệm thu: không thuộc bước nào
  { planId: 'p2', step: 1, costUsd: 0.6, tokens: 50 },
  { agentId: 'lam', costUsd: 9, tokens: 900 } // việc lẻ: không tính
];

test('thongKeChiPhi: cộng mọi lượt của một bước, tách theo người và loại bước', () => {
  const tk = thongKeChiPhi(plans, runs);
  assert.deepEqual(tk.buoc.mai.work, { usd: 0.8, wtok: 125, n: 2 }); // trung vị của 1,0 (hai pha) và 0,6
  assert.deepEqual(tk.buoc.mai.fix, { usd: 0.4, wtok: 40, n: 1 });
  assert.deepEqual(tk.buoc.an.review, { usd: 0.6, wtok: 60, n: 1 }); // bước lỗi của p2 không tính
  assert.equal(tk.buoc.an.rereview.usd, 0.2);
  assert.equal(tk.chung.work.n, 2);
});

test('thongKeChiPhi: hệ số cả dự án chỉ lấy dự án xong có đủ lượt chạy trong nhật ký', () => {
  const tk = thongKeChiPhi(plans, runs);
  // p1: tổng 3,0 / bước gốc (Mai làm 1,0 + An duyệt 0,6) = 1,875 → 1,9. p2 có bước gốc lỗi: bỏ
  assert.equal(tk.heSo, 1.9);
  assert.equal(tk.soDuAn, 1);
  // Nhật ký đã mất bớt lượt (tổng lượt lệch chi phí dự án quá 10%): không tính hệ số
  assert.equal(thongKeChiPhi(plans, runs.filter(r => r.step !== 3)).heSo, null);
});

test('uocTinhKeHoach: thiếu số liệu của người đó thì lấy trung vị cả nhóm, không có gì thì bỏ qua', () => {
  const tk = thongKeChiPhi(plans, runs);
  const u = uocTinhKeHoach([{ agent: 'mai' }, { agent: 'an', checks: 1 }, { agent: 'lam' }, { agent: 'ha', checks: 1 }], tk);
  // Mai 0,8 + An duyệt 0,6 + Lam (chung làm 0,8) + Hạ (chung duyệt 0,6)
  assert.equal(u.usd, 2.8);
  assert.equal(u.doan, 2);
  assert.equal(u.thieu, 0);
  assert.deepEqual(u.caDuAn, { usd: 5.32, wtok: Math.round(u.wtok * 1.9) });
  assert.equal(uocTinhKeHoach([{ agent: 'mai', checks: 1 }], { buoc: {}, chung: {}, heSo: null }), null);
  assert.equal(uocTinhKeHoach([{ agent: 'mai' }], null), null);
});
