'use strict';
// Bộ não chung tri-thuc/: gộp bảng của agent vào note (chỉ sửa phần của máy chủ), tìm kiếm, dựng bản đồ.
const { docGhiChu, vietGhiChu } = require('./ghi-chu');
const { boDau, tuKhoa } = require('./van-ban');
const { docBang } = require('./van-de');

const slug = s => boDau(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
const MUC = s => { const k = boDau(s).replace(/[^a-z]+/g, ' ').trim(); return /^manh/.test(k) ? 'manh' : /^vua|trung binh/.test(k) ? 'vua' : /^so bo/.test(k) ? 'so-bo' : 'y-kien'; };
const hop = (a, b) => [...new Set([...(Array.isArray(a) ? a : a ? [a] : []), ...b])];
const LS = '## Lịch sử (máy chủ ghi)';
// Dòng lịch sử y hệt đã có (bảng cũ nhập lại trong cùng lượt, cùng ngày) thì không thêm, để note không dài mãi
function themLichSu(body, dong) {
  if (body.includes(LS) && body.includes('\n- ' + dong + '\n')) return body;
  if (!body.includes(LS)) return body.replace(/\s*$/, '\n\n') + LS + '\n- ' + dong + '\n';
  return body.replace(/\s*$/, '\n') + '- ' + dong + '\n';
}
const tieuDe = y => { const c = String(y).split(/(?<=[.!?;])\s/)[0]; return c.length > 80 ? c.slice(0, 77) + '…' : c; };
const lienKetDuAn = planId => planId ? [`[[du-an/${planId}/brief|${planId}]]`] : [];
const chuDeTriThuc = topic => String(topic || '').replace(/-v\d+$/, '') || null;
const lichSu = ({ ngay, planId, tacGia }, viec) => `${ngay} · ${planId || 'lượt lẻ'} · ${tacGia || 'máy chủ'} ${viec}`;
const ds = s => String(s || '').split(/[;,]/).map(x => x.trim()).filter(Boolean);
const dongRieng = s => String(s || '').split(/\s*(?:;|<br\s*\/?>)\s*/i).map(x => x.trim()).filter(x => x && !/^[-—–]$/.test(x));

// Gộp một dòng "Danh sách đã duyệt" vào note ý. cu: nội dung note cũ hoặc null. Trả về nội dung mới, hoặc { boQua: lý do }
function hopNhatMenhDe(cu, row, { chuDe, duyet, tacGia, ngay, planId }) {
  const nguon = String(row.nguon || '').split(/[,;]/).map(s => slug(s.replace(/[\[\]]/g, ''))).filter(Boolean).map(s => `[[${s}]]`);
  const hanXem = ngay.replace(/^(\d{4})/, (_, y) => String(Number(y) + 1));
  const lichSu = `${ngay} · ${planId || 'lượt lẻ'} · ${tacGia} ${duyet ? 'duyệt' : 'ghi nháp'} (${MUC(row.muc)})`;
  if (cu) {
    const { data, body } = docGhiChu(cu);
    if (data.khoa === true) return { boQua: 'note đã khoá' };
    if (data.trang_thai === 'bac-bo') return { boQua: 'chủ dự án đã bác bỏ ý này' };
    const giu = !duyet && data.trang_thai === 'da-duyet'; // người không có quyền duyệt không đổi mức, câu trích của ý đã duyệt
    const d = { ...data, chu_de: hop(data.chu_de, [chuDe]), muc_bang_chung: giu ? data.muc_bang_chung : MUC(row.muc), nguon: hop(data.nguon, nguon),
      trich: giu ? (data.trich || '') : (row.trich || data.trich || ''), trang_thai: duyet ? 'da-duyet' : (data.trang_thai || 'nhap'),
      ...(duyet ? { duyet_boi: tacGia, ngay_duyet: ngay, xem_lai_truoc: hanXem } : {}),
      dung_trong: hop(data.dung_trong, lienKetDuAn(planId)) };
    return vietGhiChu(d, themLichSu(body, lichSu));
  }
  const data = { loai: 'menh-de', ma: row.ma, chu_de: [chuDe], muc_bang_chung: MUC(row.muc), trang_thai: duyet ? 'da-duyet' : 'nhap', nguon, trich: row.trich || '',
    ...(duyet ? { duyet_boi: tacGia, ngay_duyet: ngay, xem_lai_truoc: hanXem } : {}), dung_trong: lienKetDuAn(planId) };
  const body = `# ${tieuDe(row.y)}\n\n${row.y}\n` + (row.ghiChu ? `\n## Ghi chú\n${row.ghiChu}\n` : '');
  return vietGhiChu(data, themLichSu(body, lichSu));
}

// Thêm dòng "- x" vào cuối mục "## …" của thân note (chưa có mục thì tạo, đặt trước phần lịch sử); dòng đã có y hệt thì bỏ qua
function themVaoMuc(body, muc, dongs) {
  const lines = body.replace(/\s*$/, '').split('\n');
  let i = lines.findIndex(l => l.trim() === muc);
  if (i < 0) {
    let at = lines.findIndex(l => l.trim() === LS);
    if (at < 0) at = lines.length;
    while (at > 0 && !lines[at - 1].trim()) at--;
    lines.splice(at, 0, '', muc, ...(at < lines.length ? [''] : []));
    i = at + 1;
  }
  let k = i + 1;
  while (k < lines.length && !/^#{1,6}\s/.test(lines[k])) k++;
  const co = new Set(lines.slice(i + 1, k).map(l => l.replace(/^\s*[-*•]\s*/, '').trim()));
  const moi = [...new Set(dongs)].filter(x => !co.has(x));
  if (!moi.length) return lines.join('\n') + '\n';
  let cuoi = k;
  while (cuoi > i + 1 && !lines[cuoi - 1].trim()) cuoi--;
  lines.splice(cuoi, 0, ...moi.map(x => '- ' + x));
  return lines.join('\n') + '\n';
}

// Một dòng "Danh sách nguồn" → note nguồn. Link đã có thì giữ, link khác chỉ ghi vào lịch sử để bạn xem
function hopNhatNguon(cu, row, meta) {
  const url = (/https?:\/\/[^\s|)<>\]`]+/.exec(row.link || '') || [])[0] || '';
  const ma = row.ma || slug(`${row.toChuc || ''} ${row.tieuDe || ''}`) || slug(url.replace(/^https?:\/\//, ''));
  const chung = data => ({ chu_de: hop(data.chu_de, meta.chuDe ? [meta.chuDe] : []), dung_trong: hop(data.dung_trong, lienKetDuAn(meta.planId)) });
  if (cu) {
    const { data, body } = docGhiChu(cu);
    if (data.khoa === true) return { boQua: 'note đã khoá' };
    const khacLink = url && data.url && data.url !== url;
    const d = { ...data, loai: 'nguon', ma: data.ma || ma, to_chuc: row.toChuc || data.to_chuc || '', tieu_de: row.tieuDe || data.tieu_de || '',
      url: data.url || url, loai_nguon: row.loaiNguon ? slug(row.loaiNguon) : (data.loai_nguon || ''),
      truy_cap: data.truy_cap || 'chua-kiem', kiem_luc: data.kiem_luc || '', cach_mo_khac: data.cach_mo_khac || '', ...chung(data) };
    let b = themLichSu(body, lichSu(meta, 'ghi nguồn'));
    if (khacLink) b = themLichSu(b, lichSu(meta, `đề xuất link khác: ${url}`));
    return vietGhiChu(d, b);
  }
  const data = { loai: 'nguon', ma, to_chuc: row.toChuc || '', tieu_de: row.tieuDe || '', url, loai_nguon: slug(row.loaiNguon || ''),
    truy_cap: 'chua-kiem', kiem_luc: '', cach_mo_khac: '', ...chung({}) };
  const body = `# ${row.tieuDe || ma}\n\n${url}\n\n## Câu trích đã dùng\n`;
  return vietGhiChu(data, themLichSu(body, lichSu(meta, 'ghi nguồn')));
}

// Kết quả máy chủ mở thử link (ok, chan, captcha, khong-co, loi)
function capNhatTruyCap(cu, ket, ngay) {
  if (!cu) return { boQua: 'chưa có note nguồn' };
  const { data, body } = docGhiChu(cu);
  if (data.khoa === true) return { boQua: 'note đã khoá' };
  const doi = data.truy_cap !== ket;
  return vietGhiChu({ ...data, truy_cap: ket, kiem_luc: ngay }, doi ? themLichSu(body, `${ngay} · máy chủ kiểm link: ${ket}`) : body);
}

// Một dòng bảng "Tư thế" (chỉ người có quyền duyệt). Prompt đã đạt, lỗi AI: chỉ thêm dòng mới, không xoá dòng cũ
function hopNhatTuThe(cu, row, meta) {
  if (!meta.duyet) return { boQua: 'chỉ người duyệt được ghi tư thế' };
  const P = '## Prompt ảnh đã đạt', E = '## Lỗi AI hay vẽ sai';
  let data = {}, body;
  if (cu) {
    ({ data, body } = docGhiChu(cu));
    if (data.khoa === true) return { boQua: 'note đã khoá' };
  } else body = `# ${row.tenViet || row.ma}${row.tenPhan ? ` (${row.tenPhan})` : ''}\n\n${P}\n\n${E}\n`;
  const d = { ...data, loai: 'tu-the', ma: data.ma || row.ma, ten_viet: row.tenViet || data.ten_viet || '', ten_phan: row.tenPhan || data.ten_phan || '',
    dao_cu: hop(data.dao_cu, ds(row.daoCu)), chong_chi_dinh: hop(data.chong_chi_dinh, ds(row.ccd)),
    muc_bang_chung_ccd: row.mucCcd ? MUC(row.mucCcd) : (data.muc_bang_chung_ccd || 'y-kien'),
    chu_de: hop(data.chu_de, meta.chuDe ? [meta.chuDe] : []), dung_trong: hop(data.dung_trong, lienKetDuAn(meta.planId)) };
  body = themVaoMuc(themVaoMuc(body, P, dongRieng(row.prompt)), E, dongRieng(row.loiAi));
  return vietGhiChu(d, themLichSu(body, lichSu(meta, 'ghi tư thế')));
}

// Mã note hình: tên file không đuôi; trùng tên với hình khác (chủ đề khác) thì thêm chủ đề. docNote(ma) → nội dung note cũ hoặc ''
function maHinh(file, chuDe, docNote) {
  const ma = slug(String(file).split('/').pop().replace(/\.[a-z0-9]+$/i, '')) || 'hinh';
  const cu = docNote(ma);
  return cu && docGhiChu(cu).data.file && docGhiChu(cu).data.file !== file ? `${ma}-${slug(chuDe || 'khac')}` : ma;
}

// Hình đã tải: chỉ điền trường còn trống, không ghi đè
function hopNhatHinh(cu, info, meta) {
  const ma = info.ma || slug(String(info.file).split('/').pop().replace(/\.[a-z0-9]+$/i, ''));
  const moi = { loai: 'hinh', ma, file: info.file || '', link: info.link || '', tac_gia: info.tacGia || '', giay_phep: info.giayPhep || '', the_hien: info.theHien || '' };
  let data = {}, body;
  if (cu) {
    ({ data, body } = docGhiChu(cu));
    if (data.khoa === true) return { boQua: 'note đã khoá' };
  } else body = `# ${info.theHien || ma}\n\n![[${info.file}]]\n`;
  const d = { ...data };
  for (const [k, v] of Object.entries(moi)) if (d[k] === undefined || d[k] === '' || d[k] === null) d[k] = v;
  d.chu_de = hop(data.chu_de, meta.chuDe ? [meta.chuDe] : []);
  return vietGhiChu(d, themLichSu(body, lichSu(meta, 'ghi hình')));
}

// Ba bảng agent viết cho bộ não, đã chuẩn hoá. Ý còn "chờ" thì bỏ (chưa duyệt xong).
// Ô Nguồn ghi số [n] thay Mã nguồn: đổi theo bảng nguồn cùng văn bản, không có thì bỏ (không tạo link [[1]])
function docBangTriThuc(text) {
  const nguon = (docBang(text, /^#{2,3}\s*Danh sách nguồn(?![\p{L}\p{N}])/iu) || [])
    .map(r => ({ ma: slug(String(r['ma nguon'] || '').replace(/[\[\]`]/g, '')), n: String(r['n'] || '').replace(/[^\d]/g, ''), toChuc: r['to chuc'] || '',
      tieuDe: r['tieu de'] || '', link: r['link'] || '', loaiNguon: r['loai nguon'] || '' }))
    .map(r => ({ ...r, ma: r.ma || slug(`${r.toChuc} ${r.tieuDe}`) || slug(((/https?:\/\/(\S+)/.exec(r.link) || [])[1] || '')) }))
    .filter(r => r.ma);
  const theoSo = new Map(nguon.filter(r => r.n && r.ma).map(r => [r.n, r.ma]));
  const doiNguon = s => String(s || '').split(/[,;]/).map(x => x.replace(/[\[\]`]/g, '').trim()).filter(Boolean)
    .map(x => /^\d+$/.test(x) ? theoSo.get(x) || '' : x).filter(Boolean).join(', ');
  const menhDe = (docBang(text, /^#{2,3}\s*Danh sách đã duyệt(?![\p{L}\p{N}])/iu) || [])
    .filter(r => r['y'] && !/chờ/iu.test(r['y']))
    .map(r => ({ ma: slug(r['ma'] || '') || slug(String(r['y']).split(/\s+/).slice(0, 8).join(' ')), y: r['y'], muc: r['muc bang chung'] || '',
      nguon: doiNguon(r['nguon']), trich: String(r['cau trich'] || '').replace(/^["“]|["”]$/g, '').trim(), ghiChu: r['ghi chu'] || '' }));
  const tuThe = (docBang(text, /^#{2,3}\s*Tư thế(?![\p{L}\p{N}])/iu) || [])
    .map(r => ({ ma: slug(r['ma'] || r['ten phan'] || r['ten viet'] || ''), tenViet: r['ten viet'] || '', tenPhan: r['ten phan'] || '', daoCu: r['dao cu'] || '',
      ccd: r['chong chi dinh'] || '', mucCcd: r['muc bang chung ccd'] || '', prompt: r['prompt anh da dat'] || '', loiAi: r['loi ai hay ve sai'] || '' }))
    .filter(r => r.ma);
  return { nguon, menhDe, tuThe };
}

module.exports = { slug, MUC, LS, chuDeTriThuc, hopNhatMenhDe, hopNhatNguon, capNhatTruyCap, hopNhatTuThe, maHinh, hopNhatHinh, themVaoMuc, docBangTriThuc };
