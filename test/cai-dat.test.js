'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { CAI_DAT, docCaiDat, kiemCaiDat } = require('../lib/cai-dat');

test('docCaiDat: bật/tắt mặc định là bật trừ khi ghi false; số đọc từ config', () => {
  const ds = docCaiDat({ planTokenBudget: 4000000, machineGate: false, deepResearchTwoPhase: true });
  const lay = k => ds.find(m => m.key === k).giaTri;
  assert.equal(lay('planTokenBudget'), 4000000);
  assert.equal(lay('machineGate'), false);
  assert.equal(lay('deepResearchTwoPhase'), true);
  assert.equal(lay('buildSlides'), true); // không có trong config = bật
  assert.equal(ds.length, CAI_DAT.length);
});

test('kiemCaiDat: nhận giá trị hợp lệ, chuẩn hoá số', () => {
  assert.deepEqual(kiemCaiDat({ planTokenBudget: '6000000', maxParallel: 2, labTools: false }), { moi: { planTokenBudget: 6000000, maxParallel: 2, labTools: false } });
});

test('kiemCaiDat: từ chối mục lạ, sai kiểu, ngoài khoảng', () => {
  assert.match(kiemCaiDat({ workspace: 'D:\\khac' }).loi, /Không đổi được "workspace"/); // mục nhạy cảm không đổi được ở đây
  assert.match(kiemCaiDat({ claudeTools: ['Bash'] }).loi, /Không đổi được/);
  assert.match(kiemCaiDat({ maxParallel: 9 }).loi, /từ 1 đến 4/);
  assert.match(kiemCaiDat({ passScore: 85.5 }).loi, /số nguyên/);
  assert.match(kiemCaiDat({ labTools: 'true' }).loi, /bật hoặc tắt/);
  assert.ok(kiemCaiDat({}).loi);
  assert.ok(kiemCaiDat(null).loi);
  // Một mục sai thì không nhận mục nào
  assert.equal(kiemCaiDat({ maxParallel: 2, passScore: 200 }).moi, undefined);
});
