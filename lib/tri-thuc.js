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

// ── Trang tổng hợp: chỉ bảng và link thường, không cần plugin ──
const TT_Y = { 'da-duyet': 'đã duyệt', nhap: 'nháp', 'can-xem-lai': 'cần xem lại', 'bac-bo': 'BÁC BỎ, không dùng' };
const loaiCua = n => n.data.loai || (/\/(menh-de|nguon|tu-the|hinh)\//.exec(n.path) || [])[1] || '';
const maCua = n => n.data.ma || n.path.split('/').pop().replace(/\.md$/, '');
const o = s => String(s == null ? '' : s).replace(/\|/g, '/').replace(/\s+/g, ' ').trim();
// Link trong ô bảng: dấu | của link phải viết \| (Obsidian), không thì vỡ bảng
const lk = (thuMuc, n, ten, trongBang) => `[[${thuMuc}/${maCua(n)}${trongBang ? '\\|' : '|'}${o(ten || maCua(n)).replace(/[[\]]/g, '')}]]`;
const mang = v => Array.isArray(v) ? v : v ? [v] : [];
const quaHan = (n, homNay) => !!n.data.xem_lai_truoc && String(n.data.xem_lai_truoc) < homNay;
function lyDoXem(n, homNay) {
  if (n.data.trang_thai === 'can-xem-lai') return 'đánh dấu cần xem lại';
  if (n.data.trang_thai !== 'da-duyet') return '';
  if (quaHan(n, homNay)) return `quá hạn xem lại (${n.data.xem_lai_truoc})`;
  if (!n.data.trich) return 'đã duyệt nhưng chưa có câu trích';
  return '';
}
const theoChuDe = (notes, chuDe) => notes.filter(n => mang(n.data.chu_de).includes(chuDe));

function vietMocChuDe(chuDe, notes, homNay) {
  const ns = theoChuDe(notes, chuDe), loai = l => ns.filter(n => loaiCua(n) === l);
  const ys = loai('menh-de').filter(n => n.data.trang_thai !== 'bac-bo');
  const duyet = ys.filter(n => n.data.trang_thai === 'da-duyet' && !quaHan(n, homNay)), conLai = ys.filter(n => !duyet.includes(n));
  const L = [`# Chủ đề: ${chuDe}`, '', '> Máy chủ tự sinh file này. Đừng sửa tay: sửa từng note trong menh-de/, nguon/, tu-the/, hinh/ (đánh trang_thai: bac-bo, hoặc khoa: true để máy chủ không sửa).', ''];
  L.push('## Ý đã kiểm chứng');
  if (duyet.length) L.push('| Ý | Mức | Nguồn | Hạn xem lại |', '|---|---|---|---|',
    ...duyet.map(n => `| ${lk('menh-de', n, n.title, true)} | ${o(n.data.muc_bang_chung)} | ${mang(n.data.nguon).map(x => String(x).replace(/\|/g, '\\|')).join(', ')} | ${o(n.data.xem_lai_truoc)} |`));
  else L.push('(chưa có)');
  L.push('', '## Ý nháp hoặc cần xem lại');
  if (conLai.length) L.push('| Ý | Trạng thái | Mức | Lý do |', '|---|---|---|---|',
    ...conLai.map(n => `| ${lk('menh-de', n, n.title, true)} | ${TT_Y[n.data.trang_thai] || o(n.data.trang_thai)} | ${o(n.data.muc_bang_chung)} | ${o(lyDoXem(n, homNay))} |`));
  else L.push('(không có)');
  L.push('', '## Tư thế');
  const tts = loai('tu-the');
  L.push(...(tts.length ? tts.map(n => `- ${lk('tu-the', n, n.data.ten_viet || n.title)}${n.data.ten_phan ? ` (${o(n.data.ten_phan)})` : ''}${mang(n.data.chong_chi_dinh).length ? ' · CCĐ: ' + mang(n.data.chong_chi_dinh).map(o).join(', ') : ''}`) : ['(chưa có)']));
  L.push('', '## Hình');
  const hs = loai('hinh');
  L.push(...(hs.length ? hs.map(n => `- ${lk('hinh', n, n.data.the_hien || n.title)} · ${o(n.data.giay_phep) || 'chưa rõ giấy phép'}`) : ['(chưa có)']));
  L.push('', '## Nguồn');
  const ngs = loai('nguon');
  L.push(...(ngs.length ? ngs.map(n => `- ${lk('nguon', n, n.data.tieu_de || n.title)}${n.data.to_chuc ? ' · ' + o(n.data.to_chuc) : ''} · truy cập: ${o(n.data.truy_cap) || 'chua-kiem'}`) : ['(chưa có)']));
  const duAn = [...new Set(ns.flatMap(n => mang(n.data.dung_trong)))];
  L.push('', '## Dự án đã dùng', ...(duAn.length ? duAn.map(x => `- ${x}`) : ['(chưa có)']));
  return L.join('\n') + '\n';
}

const cacChuDe = notes => [...new Set(notes.flatMap(n => mang(n.data.chu_de)).map(x => String(x || '').trim()).filter(Boolean))].sort();

function vietBanDoTriThuc(notes, homNay) {
  const L = ['# Bản đồ bộ não', '', '> Máy chủ tự sinh file này. Ghi chú của bạn: [[quy-tac-cua-toi]], thư mục ghi-chu-chuyen-mon/, [[thuat-ngu]], [[quyet-dinh]].', '', '## Chủ đề'];
  const cds = cacChuDe(notes);
  if (!cds.length) L.push('(chưa có)');
  for (const c of cds) {
    const ns = theoChuDe(notes, c), dem = l => ns.filter(n => loaiCua(n) === l).length;
    const y = ns.filter(n => loaiCua(n) === 'menh-de' && n.data.trang_thai === 'da-duyet').length;
    L.push(`- [[chu-de/${c}|${c}]] · ${y} ý đã duyệt · ${dem('nguon')} nguồn · ${dem('tu-the')} tư thế · ${dem('hinh')} hình`);
  }
  const xem = notes.filter(n => loaiCua(n) === 'menh-de').map(n => ({ n, ly: lyDoXem(n, homNay) })).filter(x => x.ly);
  L.push('', '## Cần bạn xem');
  if (xem.length) L.push('| Ý | Chủ đề | Lý do |', '|---|---|---|', ...xem.map(({ n, ly }) => `| ${lk('menh-de', n, n.title, true)} | ${mang(n.data.chu_de).map(o).join(', ')} | ${o(ly)} |`));
  else L.push('(không có)');
  const chan = notes.filter(n => loaiCua(n) === 'nguon' && ['chan', 'captcha', 'khong-co'].includes(n.data.truy_cap));
  L.push('', '## Nguồn đang bị chặn', ...(chan.length ? chan.map(n => `- ${lk('nguon', n, n.data.tieu_de || n.title)} · ${n.data.truy_cap}${n.data.kiem_luc ? ' (' + n.data.kiem_luc + ')' : ''}${n.data.cach_mo_khac ? ' · cách mở khác: ' + o(n.data.cach_mo_khac) : ''}`) : ['(không có)']));
  return L.join('\n') + '\n';
}

// ── Tìm trong bộ não (công cụ tra_cuu, gói ngữ cảnh) ──
const THU_TU_TT = ['da-duyet', 'nhap', 'can-xem-lai', 'bac-bo'];
const KHONG_TIM = new Set(['bai-hoc', 'mau-tot']); // gói ngữ cảnh có phần riêng cho hai loại này
// toiThieu: số từ khoá chung tối thiểu thay cho ngưỡng tỉ lệ (câu hỏi dài như cả nhiệm vụ thì tỉ lệ luôn thấp)
function timTriThuc(notes, { tuKhoa: q, loai, chuDe, toiThieu } = {}, max = 10) {
  const Q = tuKhoa(q);
  if (!Q.size) return [];
  const cd = chuDe ? chuDeTriThuc(slug(chuDe)) : null;
  const hang = n => { const i = THU_TU_TT.indexOf(n.data.trang_thai); return i < 0 ? 1 : i; };
  return notes.filter(n => (loai ? loaiCua(n) === loai : !KHONG_TIM.has(loaiCua(n))) && (!cd || mang(n.data.chu_de).includes(cd)))
    .map(n => {
      const W = tuKhoa([n.title, n.para, n.data.ma, n.data.ten_viet, n.data.ten_phan, n.data.to_chuc, ...mang(n.data.chu_de)].join(' '));
      let chung = 0;
      for (const w of Q) if (W.has(w)) chung++;
      return { ...n, loai: loaiCua(n), diem: chung / Q.size, chung };
    })
    .filter(n => toiThieu ? n.chung >= toiThieu : n.diem >= 0.34 || (Q.size <= 2 && n.chung >= 1))
    .sort((a, b) => b.diem - a.diem || hang(a) - hang(b))
    .slice(0, max);
}

// Bối cảnh máy chủ soạn cho mỗi lượt; phần rỗng thì bỏ cả tiêu đề. Dài quá thì cắt phần "Trong bộ não…" trước
const TRAN_GOI = 6000;
// checklist, baiHoc: dòng "[BH-n] nội dung" đã chọn cho bước này. Checklist không bao giờ bị cắt
// viDu: { plan, text } — một mẫu tốt hợp bước (3.8)
function goiNguCanh({ quyTac = '', quyetDinh = [], vanDe = [], lienQuan = [], checklist = [], baiHoc = [], viDu = null, coBanDo = false } = {}) {
  const qt = String(quyTac || '').trim(), qd = quyetDinh.slice(), vd = vanDe.slice(), lq = lienQuan.slice(), bh = baiHoc.slice(), vdu = viDu ? [viDu] : [];
  const dung = tac => {
    const L = [];
    if (tac) L.push('Quy tắc của chủ dự án (ưu tiên cao nhất):', tac);
    if (qd.length) L.push('Quyết định đã chốt:', ...qd.map(x => '- ' + x));
    if (vd.length) L.push('Vấn đề đang mở giao cho bạn:', ...vd.map(x => '- ' + x));
    if (checklist.length) L.push('Checklist bắt buộc (ghi mã kèm "đã kiểm" vào mục Tự kiểm của bàn giao):', ...checklist.map(x => '- ' + x));
    if (bh.length) L.push('Bài học của bạn:', ...bh.map(x => '- ' + x));
    if (vdu.length) L.push(`Ví dụ đạt chuẩn (từ ${vdu[0].plan || 'dự án trước'}):`, vdu[0].text);
    if (lq.length) L.push('Trong bộ não có thể liên quan (Read note nếu cần):', ...lq.map(x => /^- /.test(x) ? x : '- ' + x));
    if (!L.length) return '';
    if (coBanDo) L.push('Bản đồ bộ não: tri-thuc/00-ban-do.md');
    return ['BỐI CẢNH TỪ BỘ NÃO CHUNG (máy chủ soạn cho bước này; đọc trước khi làm):', ...L].join('\n');
  };
  let t = dung(qt);
  for (const ds of [lq, vdu, bh, vd, qd]) while (t.length > TRAN_GOI && ds.length) { ds.pop(); t = dung(qt); }
  if (t.length > TRAN_GOI) t = dung(qt.slice(0, Math.max(200, qt.length - (t.length - TRAN_GOI) - 1)) + '…');
  return t;
}

// ── Mẫu tốt tri-thuc/mau-tot/<kieu>-<n>.md: đoạn sản phẩm đạt chuẩn làm ví dụ cho bước sau ──
const KIEU_MAU = ['trang-slide', 'prompt-anh', 'kiem-chung'];
// "Trang <n>": lấy mục "## Trang <n> …" tới tiêu đề "## " kế tiếp; không thì 1.200 ký tự đầu
function trichMauTot(text, viTri) {
  const t = String(text || '').replace(/\r\n/g, '\n').normalize('NFC'), m = /Trang\s*(\d+)/iu.exec(String(viTri || ''));
  if (m) {
    const lines = t.split('\n'), i = lines.findIndex(l => new RegExp(`^##\\s*Trang\\s*${m[1]}(?!\\d)`, 'iu').test(l.trim()));
    if (i >= 0) {
      let k = i + 1;
      while (k < lines.length && !/^##\s/.test(lines[k])) k++;
      return lines.slice(i, k).join('\n').trim().replace(/\n+-{3,}$/, ''); // dòng kẻ giữa các trang
    }
  }
  return t.slice(0, 1200).trim();
}
function taoMauTot({ kieu, nguon_file, plan, ly_do, trich }) {
  return vietGhiChu({ loai: 'mau-tot', kieu, nguon_file, plan, ly_do: String(ly_do || '').replace(/\s+/g, ' ').trim() }, String(trich || '').slice(0, 1500).trim() + '\n');
}
// Một mẫu hợp nhãn bước (mới nhất), cho phần "Ví dụ đạt chuẩn" của gói ngữ cảnh
function chonMauTot(notes, nhan = []) {
  const kieu = new Set([...(nhan.includes('slides') ? ['trang-slide'] : []), ...(nhan.includes('anh') ? ['prompt-anh'] : []),
    ...(nhan.includes('nguon') || nhan.includes('review') ? ['kiem-chung'] : [])]);
  const so = n => Number((/-(\d+)\.md$/.exec(n.path || '') || [0, 0])[1]);
  return notes.filter(n => n.data.loai === 'mau-tot' && kieu.has(n.data.kieu) && n.noiDung)
    .sort((a, b) => String(b.data.plan || '').localeCompare(String(a.data.plan || '')) || so(b) - so(a))[0] || null;
}

// ── thuat-ngu.md: bạn sửa trong Obsidian, máy soát đọc ──
const sachO = s => String(s || '').replace(/[`"“”*]/g, '').trim();
function docThuatNgu(text) {
  const tuTranh = (docBang(text, /^#{2,3}\s*Từ cần tránh(?![\p{L}\p{N}])/iu) || []).map(r => sachO(r['tu'])).filter(Boolean);
  const cachGoi = (docBang(text, /^#{2,3}\s*Cách gọi thống nhất(?![\p{L}\p{N}])/iu) || [])
    .map(r => [sachO(r['khong dung']), sachO(r['dung'])]).filter(([a, b]) => a && b);
  return { tuTranh, cachGoi };
}
// Lần đầu tạo file: chép danh sách trong config.json vào hai bảng
function dienThuatNgu(mau, tuTranh = [], cachGoi = []) {
  // Chèn ngay sau dòng kẻ |---|---| của bảng dưới tiêu đề mục
  const chen = (t, muc, dongs) => t.replace(new RegExp(`## ${muc}\\n\\|.*\\|\\n\\|[-|: ]+\\|\\n`), m => m + dongs.map(x => x + '\n').join(''));
  return chen(chen(String(mau).replace(/\r\n/g, '\n').normalize('NFC'), 'Từ cần tránh', tuTranh.map(t => `| ${t} | (từ config.json) |`)),
    'Cách gọi thống nhất', cachGoi.filter(c => Array.isArray(c) && c.length === 2).map(([a, b]) => `| ${b} | ${a} |`));
}

module.exports = { KIEU_MAU, trichMauTot, taoMauTot, chonMauTot, goiNguCanh, timTriThuc, loaiCua, docThuatNgu, dienThuatNgu, slug, MUC, LS, TT_Y, chuDeTriThuc, cacChuDe, vietMocChuDe, vietBanDoTriThuc, hopNhatMenhDe, hopNhatNguon, capNhatTruyCap, hopNhatTuThe, maHinh, hopNhatHinh, themVaoMuc, docBangTriThuc };
