'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { taoPptx, zip, crc32, kichThuocAnh, RONG, CAO } = require('../lib/pptx');
const { dungBoSlide, docKichBan, docThietKe, docDongDung, catPhu, tachY } = require('../lib/dung-slide');
const { thuNhoPng, giaiMa, maHoa } = require('../lib/anh');

const readFixture = n => fs.readFileSync(path.join(__dirname, 'fixtures', n), 'utf8');
const KB = readFixture('slides-thoat-vi.md'), TK = readFixture('thiet-ke-thoat-vi.md');
const KT = JSON.parse(readFixture('kich-thuoc-anh-thoat-vi.json'));

// Đọc lại file zip do zip() ghi: { tên: Buffer }
function moZip(buf) {
  const out = {};
  let i = 0;
  while (buf.readUInt32LE(i) === 0x04034b50) {
    const nen = buf.readUInt16LE(i + 8), crc = buf.readUInt32LE(i + 14), len = buf.readUInt32LE(i + 18), nl = buf.readUInt16LE(i + 26);
    const ten = buf.toString('utf8', i + 30, i + 30 + nl), data = buf.subarray(i + 30 + nl, i + 30 + nl + len);
    out[ten] = nen === 8 ? zlib.inflateRawSync(data) : data;
    assert.equal(crc32(out[ten]), crc, `crc của ${ten}`);
    i += 30 + nl + len;
  }
  return out;
}
const pngThu = (w, h, kenh, fill) => maHoa({ w, h, kenh, px: Buffer.from(Array.from({ length: w * h * kenh }, (_, i) => fill(i))) });

test('zip: ghi đúng crc, nén file chữ, giữ nguyên ảnh', () => {
  const png = pngThu(2, 2, 3, () => 7);
  const z = moZip(zip([{ name: 'a.xml', data: '<x>ơ</x>' }, { name: 'b.png', data: png }]));
  assert.equal(z['a.xml'].toString('utf8'), '<x>ơ</x>');
  assert.deepEqual(z['b.png'], png);
});

test('kichThuocAnh đọc PNG và JPEG', () => {
  assert.deepEqual(kichThuocAnh(pngThu(5, 3, 4, () => 255)), { w: 5, h: 3 });
  const jpg = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0, 4, 0, 0, 0xFF, 0xC0, 0, 11, 8, 0x01, 0xD7, 0x03, 0xE8, 3, 0, 0, 0, 0, 0, 0, 0, 0]);
  assert.deepEqual(kichThuocAnh(jpg), { w: 1000, h: 471 });
  assert.equal(kichThuocAnh(Buffer.from('không phải ảnh, chuỗi đủ dài')), null);
});

test('anh: giải mã lại đúng ảnh vừa mã hoá; thu nhỏ lấy trung bình và bỏ alpha toàn đục', () => {
  const a = pngThu(4, 2, 3, i => (i * 13) % 256), d = giaiMa(a);
  assert.equal(d.w, 4); assert.equal(d.h, 2);
  assert.deepEqual([...d.px], Array.from({ length: 24 }, (_, i) => (i * 13) % 256));
  // 4×4 RGBA đục, ô 2×2: điểm (0,0) = trung bình của 4 điểm góc trên trái
  const b = pngThu(4, 4, 4, i => (i % 4 === 3 ? 255 : (Math.floor(i / 4) % 4) * 10));
  const nho = giaiMa(thuNhoPng(b, 2));
  assert.equal(nho.w, 2); assert.equal(nho.kenh, 3);
  assert.deepEqual([...nho.px.subarray(0, 3)], [5, 5, 5]);
  assert.equal(thuNhoPng(b, 10), b, 'ảnh đã đủ nhỏ thì giữ nguyên');
  assert.deepEqual(thuNhoPng(Buffer.from('không phải PNG')), Buffer.from('không phải PNG'), 'không đọc được thì trả nguyên bản');
});

test('docDongDung: khung, che nhãn kèm nhãn Việt, chú thích', () => {
  const d = docDongDung('- Dựng trang-03-mat-cat-chen-re.jpg: khung 0–495, 0–440; che 278–452, 48–102 = Tuỷ sống; che x≈0–87, y≈313–357 = Nhân nhầy; nhãn = Mặt cắt ngang');
  assert.equal(d.ten, 'trang-03-mat-cat-chen-re.jpg');
  assert.deepEqual(d.khung, { x0: 0, x1: 495, y0: 0, y1: 440 });
  assert.deepEqual(d.che.map(c => c.chu), ['Tuỷ sống', 'Nhân nhầy']);
  assert.deepEqual(d.che[1], { x0: 0, x1: 87, y0: 313, y1: 357, chu: 'Nhân nhầy' });
  assert.equal(d.nhan, 'Mặt cắt ngang');
  assert.equal(docDongDung('- Hình: C'), null);
});

test('tachY: chỉ phần in đậm có dấu hai chấm mới thành tiêu đề thẻ', () => {
  assert.deepEqual(tachY('**Nhân nhầy:** lõi mềm. [5]'), { tieuDe: 'Nhân nhầy', than: 'lõi mềm. [5]' });
  assert.deepEqual(tachY('**Khám sớm**: sốt'), { tieuDe: 'Khám sớm', than: 'sốt' });
  assert.deepEqual(tachY('**Đau lưng dưới** [1]'), { than: '**Đau lưng dưới** [1]' });
  assert.equal(tachY('(Câu to) Giữa hai đốt sống').to, true);
});

test('catPhu: cắt giữa ảnh cho kín ô, giữ tỉ lệ', () => {
  const c = catPhu({ w: 1600, h: 900 }, { x0: 0, y0: 0, x1: 1600, y1: 900 }, 4, 3);
  assert.ok(Math.abs(c.l - 0.125) < 1e-9 && Math.abs(c.r - 0.125) < 1e-9 && c.t === 0 && c.b === 0);
});

test('đọc kịch bản và thiết kế thoát vị đĩa đệm', () => {
  const kb = docKichBan(KB);
  assert.equal(kb.trang.length, 15);
  assert.equal(kb.trang[6].tieuDe, 'Dấu hiệu cần đi cấp cứu');
  assert.ok(kb.phan['Nguồn tham khảo'].some(l => l.startsWith('[14]')));
  const tk = docThietKe(TK);
  assert.equal(tk.mau.nen, 'E4ECDF'); assert.equal(tk.mau.dam, '3E5F45'); assert.equal(tk.mau.nhan, 'C2654F'); assert.equal(tk.mau.the2, 'F4F1E8');
  assert.equal(tk.fontTieuDe, 'Lora'); assert.equal(tk.fontNoiDung, 'Be Vietnam Pro');
  assert.equal(tk.trang[3].dung.length, 3);
  assert.equal(tk.trang[2].ghiCong, 'Hình: OpenStax College, CC BY 3.0 (adapted)');
  assert.ok(tk.dsHinh.find(h => h.ten === 'trang-11-cay-cau-co-do.png').ai);
});

test('dungBoSlide: 15 trang đúng kiểu, ảnh đúng trang, nhãn Việt trên hình, ghi chú có lời giảng', () => {
  const d = dungBoSlide({ kichBan: KB, thietKe: TK, kichThuoc: KT });
  assert.equal(d.slides.length, 15);
  assert.deepEqual(d.canhBao, []);
  const anh = i => d.slides[i - 1].shapes.filter(s => s.kieu === 'anh').map(s => s.anh);
  const chu = i => d.slides[i - 1].shapes.flatMap(s => (s.doan || []).flatMap(p => (p.chu || []).map(r => r.t))).join(' ');
  assert.deepEqual(anh(1), ['trang-01-bia.png']);
  assert.deepEqual(anh(3), ['trang-03-dia-binh-thuong-va-thoat-vi.png', 'trang-03-dia-binh-thuong-va-thoat-vi.png', 'trang-03-mat-cat-chen-re.jpg']);
  assert.deepEqual(anh(10), ['trang-10-ngoi-ghe-vuon-tay.png', 'trang-10-gap-hong-ngoi-ghe.png']);
  assert.deepEqual(anh(11), ['trang-11-nam-co-goi-truot-got.png', 'trang-11-cay-cau-co-do.png', 'trang-11-cho-chim-ban-nhe.png']);
  assert.deepEqual(anh(7), [], 'trang E không có ảnh');
  assert.ok(!d.media.some(n => /du-phong/.test(n)), 'không dùng hình dự phòng');
  assert.match(chu(2), /① Thân đốt sống/);
  assert.match(chu(7), /CẤP CỨU NGAY \(gọi 115\)/);
  assert.match(chu(10), /GẬP HÔNG NÔNG/);
  assert.match(chu(15), /\[14\] Trung tâm Cấp cứu 115/);
  assert.match(d.slides[9].notes, /Lời giảng:[\s\S]*cổ cùng hàng lưng/);
  // Ảnh Gemini: cắt bỏ mép phải có logo; ảnh tr.10 (2) dùng đúng khung
  const cau = d.slides[10].shapes.find(s => s.anh === 'trang-11-cay-cau-co-do.png');
  assert.ok(cau.cat.r >= 0.07 - 1e-9);
  const ngoi = d.slides[9].shapes.find(s => s.anh === 'trang-10-gap-hong-ngoi-ghe.png');
  assert.ok(Math.abs(ngoi.cat.l - 800 / 2752) < 1e-6 && Math.abs(ngoi.cat.r - (1 - 1960 / 2752)) < 1e-6);
  // Mọi khối nằm trong trang (nhãn trên hình được phép nhô ra một chút; hình trang trí được tràn mép)
  for (const sl of d.slides) for (const s of sl.shapes.filter(x => !x.trangTri)) {
    assert.ok(s.x >= -0.01 && s.y >= -0.01 && s.x + s.w <= RONG + 0.3 && s.y + s.h <= CAO + 0.3, `${s.ten} lọt ra ngoài trang`);
  }
});

test('dungBoSlide theo phong cách slide mẫu: tiêu đề chữ có chân, nền đổi luân phiên, trang trí, sơ đồ', () => {
  const d = dungBoSlide({ kichBan: KB, thietKe: TK, kichThuoc: KT });
  const sl = i => d.slides[i - 1], ten = (i, n) => sl(i).shapes.filter(s => s.ten === n);
  assert.equal(ten(2, 'Tiêu đề trang')[0].font, 'Lora');
  assert.notEqual(sl(2).bg, sl(3).bg, 'hai trang nội dung liền nhau khác nền');
  assert.equal(sl(12).bg, '3E5F45', 'trang "nền đậm" giữ nền xanh đậm');
  for (const i of [2, 3, 4, 5, 6, 7, 8, 9, 12, 13]) assert.ok(sl(i).shapes.some(s => s.trangTri && s.kieu === 've'), `trang ${i} có trang trí`);
  assert.equal(ten(4, 'Thanh 1').length, 1, 'tr.4 danh sách ngắn thành thanh đánh số');
  assert.equal(ten(7, 'Mũi tên').length, 1, 'tr.7 có mũi tên giữa hai tầng');
  assert.equal(ten(8, 'Phần giao').length, 1, 'tr.8 Venn có phần giao');
  assert.match(ten(8, 'Tên phần giao')[0].doan[0].chu[0].t, /Giao nhau/);
  assert.equal(sl(10).bg, 'FFFFFF', 'trang tư thế nền trắng');
  assert.ok(sl(10).shapes.filter(s => s.kieu === 'anh').every(s => s.dang === 'bo' && s.bong), 'ảnh tư thế bo góc, đổ bóng');
  const z = moZip(taoPptx({ ...d, media: d.media.map(n => ({ name: n, data: pngThu(2, 2, 3, () => 1) })) }));
  const s8 = z['ppt/slides/slide8.xml'].toString();
  assert.match(s8, /<a:custGeom>[\s\S]*<a:cubicBezTo>/);
  assert.match(z['ppt/slides/slide7.xml'].toString(), /prst="downArrow"/);
  assert.match(z['ppt/slides/slide10.xml'].toString(), /<p:pic>[\s\S]*prst="roundRect"[\s\S]*<a:outerShdw/);
});

test('dungBoSlide báo khi trang cần ảnh mà hinh/ chưa có', () => {
  const kt = { ...KT }; delete kt['trang-05-day-than-kinh-toa.png'];
  const d = dungBoSlide({ kichBan: KB, thietKe: TK, kichThuoc: kt });
  assert.ok(d.canhBao.some(c => /^Trang 5:/.test(c)));
});

test('taoPptx: đủ phần của gói PowerPoint, mỗi trang có ghi chú và ảnh trỏ đúng', () => {
  const d = dungBoSlide({ kichBan: KB, thietKe: TK, kichThuoc: KT });
  const png = pngThu(2, 2, 3, () => 100);
  const z = moZip(taoPptx({ ...d, media: d.media.map(n => ({ name: n, data: png })) }));
  for (const n of ['[Content_Types].xml', '_rels/.rels', 'ppt/presentation.xml', 'ppt/slideMasters/slideMaster1.xml', 'ppt/slideLayouts/slideLayout1.xml',
    'ppt/theme/theme1.xml', 'ppt/notesMasters/notesMaster1.xml', 'ppt/slides/slide15.xml', 'ppt/notesSlides/notesSlide15.xml', 'docProps/core.xml']) assert.ok(z[n], n);
  const pres = z['ppt/presentation.xml'].toString();
  assert.equal((pres.match(/<p:sldId /g) || []).length, 15);
  assert.match(pres, /<p:sldSz cx="12192000" cy="6858000"\/>/);
  const types = z['[Content_Types].xml'].toString();
  for (let i = 1; i <= 15; i++) assert.ok(types.includes(`/ppt/slides/slide${i}.xml`));
  const rels = z['ppt/slides/_rels/slide2.xml.rels'].toString(), s2 = z['ppt/slides/slide2.xml'].toString();
  const rid = /r:embed="(rId\d+)"/.exec(s2)[1];
  const target = new RegExp(`Id="${rid}"[^>]*Target="\\.\\./media/([^"]+)"`).exec(rels)[1];
  assert.ok(z['ppt/media/' + target], 'ảnh được nhúng');
  assert.match(s2, /Thân đốt sống/);
  assert.match(z['ppt/notesSlides/notesSlide7.xml'].toString(), /Lời giảng:/);
  assert.ok(!/[\u0000-\u0008]/.test(s2));
});
