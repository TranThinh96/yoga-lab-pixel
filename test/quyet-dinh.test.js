'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const qd = require('../lib/quyet-dinh');

const TL = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'trung-lap.json'), 'utf8').normalize('NFC'));
const [c1, c2] = TL.cau_hoi.giong[0];
const TU = '(Chủ dự án để nhóm tự quyết theo phương án đề xuất)';

test('ghiQuyetDinh: câu giống nhau cùng chủ đề giữ một, mang câu trả lời mới', () => {
  let list = qd.ghiQuyetDinh([], { q: c1, a: 'cũ', planId: 'p1', topic: 't', at: '2026-10-01T00:00:00Z' });
  list = qd.ghiQuyetDinh(list, [{ q: c2, a: 'mới', planId: 'p2', topic: 't', at: '2026-10-02T00:00:00Z' }]);
  assert.equal(list.length, 1);
  assert.equal(list[0].a, 'mới');
  assert.equal(list[0].id, 'QD-1');
  list = qd.ghiQuyetDinh(list, { q: c2, a: 'khác chủ đề', planId: 'p3', topic: 'u', at: '2026-10-03T00:00:00Z' });
  assert.equal(list.length, 2);
  assert.equal(list[1].id, 'QD-2');
  assert.equal(qd.ghiQuyetDinh(list, { q: 'x', a: '(Giống câu đã trả lời: "…" → có)' }).length, 2);
});

test('ghiQuyetDinh: câu trả lời tự điền là tuQuyet', () => {
  const [d] = qd.ghiQuyetDinh([], { q: c1, a: TU, topic: 't' });
  assert.equal(d.tuQuyet, true);
  const [e] = qd.ghiQuyetDinh([], { q: c1, a: '(Đã hỏi đủ số lần cho phép: nhóm tự quyết theo phương án đề xuất)' });
  assert.equal(e.tuQuyet, true);
  const [f] = qd.ghiQuyetDinh([], { q: c1, a: 'Có' });
  assert.equal(f.tuQuyet, false);
});

test('goiYChoCauHoi: chọn quyết định của bạn khi có cả tự quyết', () => {
  const list = [
    { id: 'QD-1', q: c1, a: TU, topic: 'a', tuQuyet: true, at: '2026-10-05T00:00:00Z' },
    { id: 'QD-2', q: c1, a: 'Bạn trả lời', topic: 'b', tuQuyet: false, at: '2026-10-01T00:00:00Z' }
  ];
  assert.equal(qd.goiYChoCauHoi(list, c2, 'moi').id, 'QD-2');
  assert.equal(qd.goiYChoCauHoi(list, 'Một câu hỏi hoàn toàn khác về chuyện khác hẳn nhau', 'moi'), null);
});

test('quyetDinhChoKeHoach: không lấy tự quyết của chủ đề khác', () => {
  const list = [
    { id: 'QD-1', q: 'a', a: TU, topic: 'cu', tuQuyet: true, at: '2026-10-05T00:00:00Z' },
    { id: 'QD-2', q: 'b', a: 'Có', topic: 'cu', tuQuyet: false, at: '2026-10-01T00:00:00Z' },
    { id: 'QD-3', q: 'c', a: TU, topic: 'moi', tuQuyet: true, at: '2026-10-02T00:00:00Z' }
  ];
  assert.deepEqual(qd.quyetDinhChoKeHoach(list, 'moi').map(d => d.id), ['QD-3', 'QD-2']);
  assert.deepEqual(qd.quyetDinhChoKeHoach(list, null).map(d => d.id), ['QD-2']);
});

test('vietSoQuyetDinh', () => {
  const md = qd.vietSoQuyetDinh([
    { id: 'QD-1', q: 'Hỏi gì', a: 'Đáp', planId: 'p1', topic: null, tuQuyet: false, at: '2026-10-01T00:00:00Z' },
    { id: 'QD-2', q: 'Hỏi nữa', a: TU, planId: 'p2', topic: 't', tuQuyet: true, at: '2026-10-02T00:00:00Z' }
  ]);
  assert.match(md, /^# Sổ quyết định/);
  assert.match(md, /## Chung\n- \*\*QD-1\*\* \(p1, 2026-10-01\) bạn trả lời\n {2}- Hỏi: Hỏi gì\n {2}- Trả lời: Đáp/);
  assert.match(md, /\*\*QD-2\*\* \(p2, 2026-10-02\) \*nhóm tự quyết\*/);
});
