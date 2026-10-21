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

const notesGia = () => [
  { path: 'tri-thuc/menh-de/uong-luc-doi.md', title: 'Uống levothyroxine lúc đói', para: 'Uống levothyroxine lúc đói, trước bữa sáng 30–60 phút.',
    data: { loai: 'menh-de', ma: 'uong-luc-doi', chu_de: ['suy-giap'], muc_bang_chung: 'manh', trang_thai: 'da-duyet', nguon: ['[[nhs-levo]]'], trich: 'before breakfast', xem_lai_truoc: '2027-10-19' } },
  { path: 'tri-thuc/menh-de/i-ot.md', title: 'Bổ sung i-ốt', para: 'Không tự bổ sung i-ốt.',
    data: { loai: 'menh-de', ma: 'i-ot', chu_de: ['suy-giap'], muc_bang_chung: 'vua', trang_thai: 'da-duyet', nguon: [], trich: 'q', xem_lai_truoc: '2026-01-01' } },
  { path: 'tri-thuc/nguon/mayo.md', title: 'Hypothyroidism', para: 'https://mayoclinic.org/x',
    data: { loai: 'nguon', ma: 'mayo', to_chuc: 'Mayo Clinic', tieu_de: 'Hypothyroidism', truy_cap: 'captcha', chu_de: ['suy-giap'] } },
  { path: 'tri-thuc/tu-the/balasana.md', title: 'Tư thế em bé (Balasana)', para: '- p',
    data: { loai: 'tu-the', ma: 'balasana', ten_viet: 'Tư thế em bé', ten_phan: 'Balasana', chong_chi_dinh: ['chấn thương gối'], chu_de: ['suy-giap', 'mat-ngu'], dung_trong: ['[[du-an/plan-1/brief|plan-1]]'] } }
];

test('vietMocChuDe: đủ các mục, ý quá hạn sang mục cần xem', () => {
  const md = tt.vietMocChuDe('suy-giap', notesGia(), '2026-10-20');
  for (const m of ['## Ý đã kiểm chứng', '## Ý nháp hoặc cần xem lại', '## Tư thế', '## Hình', '## Nguồn', '## Dự án đã dùng']) assert.ok(md.includes(m), m);
  const [kiem, nhap] = md.split('## Ý nháp hoặc cần xem lại');
  assert.match(kiem, /\[\[menh-de\/uong-luc-doi\\\|Uống levothyroxine lúc đói\]\]/);
  assert.match(nhap.split('## Tư thế')[0], /i-ot/);
  assert.match(md, /truy cập: captcha/);
  assert.match(md, /du-an\/plan-1/);
});

test('vietBanDoTriThuc: cần bạn xem, nguồn bị chặn', () => {
  const md = tt.vietBanDoTriThuc(notesGia(), '2026-10-20');
  assert.match(md, /\[\[chu-de\/suy-giap\|suy-giap\]\] · 2 ý đã duyệt · 1 nguồn · 1 tư thế · 0 hình/);
  assert.match(md, /\[\[chu-de\/mat-ngu\|mat-ngu\]\]/);
  assert.match(md.split('## Cần bạn xem')[1].split('##')[0], /i-ot.*quá hạn xem lại \(2026-01-01\)/);
  assert.match(md.split('## Nguồn đang bị chặn')[1], /mayo.*captcha/);
});

test('docThuatNgu, dienThuatNgu', () => {
  const mau = require('fs').readFileSync(require('path').join(__dirname, '..', 'templates', 'tri-thuc', 'thuat-ngu.md'), 'utf8');
  const t = tt.dienThuatNgu(mau, ['chữa khỏi', 'thải độc'], [['giáo viên', 'giảng viên'], ['học sinh', 'học viên']]);
  assert.match(t, /\| giảng viên \| giáo viên \|/);
  assert.deepEqual(tt.docThuatNgu(t), { tuTranh: ['chữa khỏi', 'thải độc'], cachGoi: [['giáo viên', 'giảng viên'], ['học sinh', 'học viên']] });
  assert.deepEqual(tt.docThuatNgu(mau), { tuTranh: [], cachGoi: [] });
});

test('timTriThuc', () => {
  const ns = [...notesGia(),
    { path: 'tri-thuc/menh-de/uong-luc-doi-cu.md', title: 'Uống levothyroxine lúc đói', para: 'Bản cũ.',
      data: { loai: 'menh-de', ma: 'uong-luc-doi-cu', chu_de: ['suy-giap'], trang_thai: 'bac-bo' } }];
  const r = tt.timTriThuc(ns, { tuKhoa: 'levothyroxine lúc đói' });
  assert.equal(r[0].path, 'tri-thuc/menh-de/uong-luc-doi.md');
  const i = r.findIndex(x => x.path.endsWith('uong-luc-doi-cu.md'));
  assert.ok(i > 0 && r[i].diem === r[0].diem); // bác bỏ vẫn có mặt, nhưng đứng sau ý đã duyệt cùng điểm
  assert.deepEqual(tt.timTriThuc(ns, { tuKhoa: 'hypothyroidism mayo', loai: 'nguon' }).map(x => x.loai), ['nguon']);
  assert.deepEqual(tt.timTriThuc(ns, { tuKhoa: 'em bé', chuDe: 'mat-ngu-v2' }).map(x => x.path), ['tri-thuc/tu-the/balasana.md']);
  assert.deepEqual(tt.timTriThuc(ns, { tuKhoa: 'và của' }), []);
  const bh = { path: 'tri-thuc/bai-hoc/BH-1.md', title: 'BH-1', para: 'Kiểm levothyroxine lúc đói.', data: { loai: 'bai-hoc', ma: 'BH-1' } };
  assert.ok(!tt.timTriThuc([...ns, bh], { tuKhoa: 'levothyroxine lúc đói' }).some(x => x.loai === 'bai-hoc')); // bài học có phần riêng trong gói
});

test('goiNguCanh', () => {
  assert.equal(tt.goiNguCanh({}), '');
  const g = tt.goiNguCanh({ quyetDinh: ['Q1 → A1'], coBanDo: true });
  assert.ok(g.startsWith('BỐI CẢNH TỪ BỘ NÃO CHUNG'));
  assert.ok(!g.includes('Quy tắc của chủ dự án') && !g.includes('Vấn đề đang mở') && !g.includes('Trong bộ não có thể liên quan'));
  assert.ok(g.includes('- Q1 → A1') && g.endsWith('Bản đồ bộ não: tri-thuc/00-ban-do.md'));
  const dai = tt.goiNguCanh({ quyTac: '- Không dạy đảo ngược cho người tăng nhãn áp.', quyetDinh: Array(8).fill('x'.repeat(300)),
    vanDe: Array(8).fill('y'.repeat(200)), lienQuan: Array(8).fill('- ' + 'z'.repeat(400)), coBanDo: true });
  assert.ok(dai.length < 6000, String(dai.length));
  assert.ok(dai.includes('Quy tắc của chủ dự án (ưu tiên cao nhất):\n- Không dạy đảo ngược'));
  const dem = c => dai.split('\n').filter(l => l.includes(c.repeat(10))).length;
  assert.deepEqual([dem('x'), dem('y')], [8, 8]); // cắt phần "Trong bộ não…" trước
  assert.ok(dem('z') < 8);
  assert.ok(tt.goiNguCanh({ quyTac: 'q'.repeat(9000) }).length <= 6000);
});

test('goiNguCanh: checklist và bài học đứng trước phần bộ não', () => {
  const g = tt.goiNguCanh({ checklist: ['[BH-17] Kiểm dòng Hình'], baiHoc: ['[BH-3] Đếm chữ'], lienQuan: ['menh-de/x · ý'] });
  const L = g.split('\n');
  const i = k => L.findIndex(l => l.startsWith(k));
  assert.equal(L[i('Checklist bắt buộc') + 1], '- [BH-17] Kiểm dòng Hình');
  assert.equal(L[i('Bài học của bạn:') + 1], '- [BH-3] Đếm chữ');
  assert.ok(i('Checklist bắt buộc') < i('Bài học của bạn:') && i('Bài học của bạn:') < i('Trong bộ não'));
  const dai = tt.goiNguCanh({ checklist: ['[BH-1] c'], baiHoc: Array(40).fill('b'.repeat(300)), lienQuan: Array(8).fill('l'.repeat(300)) });
  assert.ok(dai.length <= 6000 && dai.includes('[BH-1] c') && !dai.includes('Trong bộ não'));
});

test('trichMauTot, taoMauTot, chonMauTot', () => {
  const s = '# Slides\n\n## Trang 1 · Mở đầu\n- Ý chính: a\n\n---\n\n## Trang 12 · Thở\n- Ý chính: thở bụng\n- Lời giảng: chậm\n\n---\n\n## Trang 13 · Kết\n- x\n';
  assert.equal(tt.trichMauTot(s, 'Trang 12'), '## Trang 12 · Thở\n- Ý chính: thở bụng\n- Lời giảng: chậm');
  assert.equal(tt.trichMauTot(s, 'Trang 1'), '## Trang 1 · Mở đầu\n- Ý chính: a');
  assert.equal(tt.trichMauTot('x'.repeat(2000), 'mục 3').length, 1200);
  const n = tt.taoMauTot({ kieu: 'trang-slide', nguon_file: 'output/x/slides.md · Trang 12', plan: 'plan-2', ly_do: 'gọn', trich: 'y'.repeat(2000) });
  const g = docGhiChu(n);
  assert.deepEqual([g.data.loai, g.data.kieu, g.data.plan], ['mau-tot', 'trang-slide', 'plan-2']);
  assert.equal(g.body.trim().length, 1500);
  const ns = [{ path: 'tri-thuc/mau-tot/trang-slide-1.md', data: { loai: 'mau-tot', kieu: 'trang-slide', plan: 'plan-1' }, noiDung: 'cũ' },
    { path: 'tri-thuc/mau-tot/trang-slide-2.md', data: { loai: 'mau-tot', kieu: 'trang-slide', plan: 'plan-2' }, noiDung: 'mới' },
    { path: 'tri-thuc/mau-tot/kiem-chung-1.md', data: { loai: 'mau-tot', kieu: 'kiem-chung', plan: 'plan-1' }, noiDung: 'kc' }];
  assert.equal(tt.chonMauTot(ns, ['work', 'slides']).noiDung, 'mới');
  assert.equal(tt.chonMauTot(ns, ['review']).noiDung, 'kc');
  assert.equal(tt.chonMauTot(ns, ['work', 'anh']), null);
  const goi = tt.goiNguCanh({ viDu: { plan: 'plan-2', text: '## Trang 12 · Thở' } });
  assert.match(goi, /Ví dụ đạt chuẩn \(từ plan-2\):\n## Trang 12 · Thở/);
});

test('vietBanDoTriThuc: link lỗ hổng hệ thống khi đã có file', () => {
  assert.ok(!/he-thong\/lo-hong/.test(tt.vietBanDoTriThuc([], '2026-11-02')));
  assert.match(tt.vietBanDoTriThuc([], '2026-11-02', { loHongMo: 3 }), /\n## Hệ thống\n- \[\[he-thong\/lo-hong\|Lỗ hổng hệ thống\]\] · 3 việc chưa sửa/);
});

test('docBangTriThuc: mã giữ chỗ "(chưa kiểm)" không gộp các nguồn vào một note', () => {
  // Chép từ agents/mai/thoai-hoa-khop-goi-nguon.md (dự án thử 2026-10-21)
  const t = ['## Danh sách nguồn', '| Mã nguồn | [n] | Tổ chức | Tiêu đề | Link | Loại nguồn |', '|---|---|---|---|---|---|',
    '| nice-ng226 | [1] | NICE | Osteoarthritis in over 16s: diagnosis and management (NG226) | https://www.nice.org.uk/guidance/ng226 | hướng dẫn quốc gia |',
    '| (chưa kiểm) | — | Hunter & Felson (BMJ) | Osteoarthritis | https://pmc.ncbi.nlm.nih.gov/articles/PMC1403209/ | tổng quan lâm sàng |',
    '| (chưa kiểm) | — | Mayo Clinic | Knee pain; Leg swelling | bị chặn 403 | cơ quan y tế |',
    '| — | | WHO | Arthritis | https://www.who.int/x | cơ quan y tế |',
    '', '## Danh sách đã duyệt', '| Mã | Ý | Mức bằng chứng | Nguồn | Câu trích | Ghi chú |', '|---|---|---|---|---|---|',
    '| (chưa có) | Tập luyện là điều trị cốt lõi. | Mạnh | 1, (chưa kiểm) | | |'].join('\n');
  const { nguon, menhDe } = tt.docBangTriThuc(t);
  assert.deepEqual(nguon.map(r => r.ma), ['nice-ng226', 'hunter-felson-bmj-osteoarthritis', 'mayo-clinic-knee-pain-leg-swelling', 'who-arthritis']);
  assert.equal(menhDe[0].ma, 'tap-luyen-la-dieu-tri-cot-loi');
  assert.equal(menhDe[0].nguon, 'nice-ng226');
});
