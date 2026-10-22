'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const cs = require('../lib/chi-so');
const { chiSoTriNao, congCuCuaLuot, diemLanDau } = cs;

const NOW = new Date('2026-10-21T12:00:00Z').getTime();
const plan = {
  id: 'p1', goal: 'Thử', status: 'done', createdAt: '2026-10-20T00:00:00Z', endedAt: '2026-10-20T10:00:00Z', checkins: 2, fixRounds: 1, score: 90,
  log: ['Nghiệm thu lần 1: 80/100', 'Nghiệm thu lần 2: 90/100'], baiHocTaiPham: ['BH-3'], tiepNoiTu: 'p0',
  steps: [
    { agentId: 'mai', status: 'done', from: [], runId: 'r1' },
    { agentId: 'an', status: 'done', from: [1], checks: 1, runId: 'r2' },
    { agentId: 'mai', status: 'done', from: [1, 2], fixOf: 1, runId: 'r3' },
    { agentId: 'an', status: 'done', from: [2, 3], checks: 3, round: 1, runId: 'r4' }
  ],
  issues: [
    { id: 'VD-1', level: 'BẮT BUỘC', kind: 'thieu-nguon', goc: 'agent', owner: 'mai' },
    { id: 'VD-2', level: 'BẮT BUỘC', kind: 'link-chet', goc: 'moi-truong', owner: null },
    { id: 'VD-3', level: 'NÊN', kind: 'chinh-ta', goc: 'agent', owner: 'mai' }
  ]
};
const run = (id, agentId, step, extra = {}) => ({ id, agentId, planId: 'p1', step, startedAt: '2026-10-20T01:00:00Z', tokens: 100, ...extra });
const runs = [
  run('r0', 'chef', 0),
  run('r1', 'mai', 1, { tools: { Read: 3, Bash: 1, mcp__yogalab__kiem_link: 2 } }),
  run('r2', 'an', 2, { tools: { mcp__yogalab__tra_cuu: 1, mcp__yogalab__soat_loi: 2 } }),
  run('r3', 'mai', 3, { tools: { Read: 1 } }),
  run('r4', 'an', 4, { acts: [{ text: 'Dùng công cụ Bash' }, { text: 'Kiểm 3 link' }] }),
  run('rx', 'an', 1, { planId: null, startedAt: '2026-01-01T00:00:00Z' }) // ngoài khoảng 7 ngày
];
const notes = [
  { path: 'tri-thuc/bai-hoc/BH-1.md', data: { loai: 'bai-hoc', trang_thai: 'moi' } },
  { path: 'tri-thuc/bai-hoc/BH-3.md', data: { loai: 'bai-hoc', trang_thai: 'khong-hieu-qua' } },
  { path: 'tri-thuc/menh-de/a.md', data: { loai: 'menh-de', trang_thai: 'da-duyet', dung_trong: ['[[du-an/p1/brief|p1]]'] } },
  { path: 'tri-thuc/menh-de/b.md', data: { loai: 'menh-de', trang_thai: 'nhap' } },
  { path: 'tri-thuc/nguon/c.md', data: { loai: 'nguon', truy_cap: 'chan', dung_trong: ['[[du-an/p1/brief|p1]]'] } },
  { path: 'tri-thuc/nguon/d.md', data: { loai: 'nguon', truy_cap: 'ok' } }
];

test('congCuCuaLuot: đếm theo tools, lượt cũ đọc diễn biến', () => {
  assert.deepEqual(congCuCuaLuot(runs[1]), { bash: true, tra_cuu: 0, soat_loi: 0, kiem_link: 2 });
  assert.deepEqual(congCuCuaLuot(runs[4]), { bash: true, tra_cuu: 0, soat_loi: 0, kiem_link: 1 });
});

test('diemLanDau: lấy điểm lần 1 trong nhật ký', () => {
  assert.equal(diemLanDau(plan), 80);
  assert.equal(diemLanDau({ score: 88, fixRounds: 0, log: [] }), 88);
  assert.equal(diemLanDau({ score: 88, fixRounds: 1, log: [] }), null);
});

test('chiSoTriNao: theo dự án, theo agent, bài học, bộ não', () => {
  const k = chiSoTriNao({ runs, plans: [plan], notes, days: 7, now: NOW, nguonIds: ['mai'] });
  const d = k.duAn[0];
  assert.deepEqual(d.token, { 'dieu-phoi': 100, work: 100, review: 100, fix: 100, rereview: 100 });
  assert.equal(d.buocLam, 1); assert.equal(d.vongSua, 1); assert.equal(d.tiLeVong, 1);
  assert.deepEqual(d.batBuoc, { tong: 2, theoLoai: { 'thieu-nguon': 1, 'link-chet': 1 }, theoGoc: { agent: 1, 'moi-truong': 1 } });
  assert.equal(d.khongChu, 1); assert.equal(d.giaoBan, 2); assert.equal(d.diemDau, 80);
  assert.equal(d.tokenNguon, 100); // chỉ bước làm của Mai, không tính bước sửa
  assert.deepEqual(k.tong, { luot: 5, luotBash: 2, tiLeBash: 40, indexDong: null });
  assert.deepEqual(k.agent.find(a => a.id === 'an'), { id: 'an', ten: 'an', luot: 2, luotBash: 1, tra_cuu: 1, soat_loi: 2, kiem_link: 1 });
  assert.deepEqual(k.baiHoc, { tong: 2, theoTrangThai: { moi: 1, 'khong-hieu-qua': 1 }, taiPham30: 1 });
  assert.deepEqual(k.boNao, { y: { 'da-duyet': 1, nhap: 1, 'can-xem-lai': 0 }, nguon: { chan: 1, ok: 1 }, nguonBiChan: 1, duAnGanNhat: 'p1', noteDung: 2 });
});

test('chiSoTriNao: dự án cũ chưa lưu mã bài học tái phạm thì đọc nhật ký', () => {
  const cu = { ...plan, id: 'p2', baiHocTaiPham: undefined, log: ['Bài học: 2 tái phạm, 5 có hiệu quả ở dự án này'] };
  assert.equal(chiSoTriNao({ plans: [plan, cu], now: NOW }).baiHoc.taiPham30, 3);
  assert.equal(chiSoTriNao({ plans: [{ ...cu, endedAt: '2026-08-01T00:00:00Z' }], now: NOW }).baiHoc.taiPham30, 0);
});

test('cauHoiTrung: câu diễn đạt lại câu đã hỏi trong cùng dự án', () => {
  const p = { answers: [
    { q: 'Số cấp cứu 115 chưa có nguồn Việt Nam, đề xuất dẫn Bộ Y tế hoặc ghi vào Việc còn mở', a: 'Đồng ý' },
    { q: 'Biểu tượng Canva trên trang y khoa có được coi là hình có giấy phép không?', a: 'Có' },
    { q: 'Số cấp cứu 115 chưa có nguồn Việt Nam: tìm nguồn Bộ Y tế, chưa có thì ghi Việc còn mở', a: 'Đồng ý' }
  ] };
  assert.equal(cs.cauHoiTrung(p), 1);
  p.answers.push({ q: 'Số cấp cứu 115 chưa có nguồn Việt Nam, đề xuất dẫn Bộ Y tế', a: '(Giống câu đã trả lời: "…" → Đồng ý)' });
  assert.equal(cs.cauHoiTrung(p), 1); // máy chủ tự trả lời: bạn không bị hỏi lại
});

test('linkMoLai: An mở trang người khác đã mở trước', () => {
  const luot = (agentId, startedAt, urls) => ({ agentId, startedAt, acts: urls.map(u => ({ text: 'Mở trang: ' + u })) });
  const rs = [
    luot('an', '2026-10-21T10:00:00Z', ['https://www.nhs.uk/b']), // chạy trước Mai: không tính mở lại
    luot('mai', '2026-10-21T11:00:00Z', ['https://www.nhs.uk/a', 'https://www.nhs.uk/b']),
    luot('an', '2026-10-21T12:00:00Z', ['https://www.nhs.uk/a', 'https://www.nhs.u…', 'https://pmc.ncbi.nlm.nih.gov/x'])
  ];
  assert.deepEqual(cs.linkMoLai(rs, 'an'), { mo: 4, lai: 2, tiLe: 50 });
  assert.deepEqual(cs.linkMoLai(rs.slice(1), 'an'), { mo: 3, lai: 2, tiLe: 66.7 });
});

test('anhNgoaiChuDe', () => {
  const rs = [{ files: ['hinh-moi/a.png', 'output/thu/hinh/b.png', 'output/thu/slides.md'] }];
  assert.equal(cs.anhNgoaiChuDe('thu', [{ images: ['hinh-moi/a.png'] }], rs), 1);
  assert.equal(cs.anhNgoaiChuDe(null, [], rs), null);
});
