'use strict';
// Sổ vấn đề: đọc bảng của người duyệt / người sửa, giữ trạng thái từng vấn đề, tìm người phụ trách file.
const { boDau } = require('./van-ban');

const LOAI_LOI = ['thieu-nguon', 'nguon-khong-khop', 'phong-dai', 'an-toan-thieu-ccd', 'lech-hai-file', 'file-khong-ton-tai', 'anh-sai-tu-the',
  'anh-sai-thu-muc', 'chinh-ta-dau-cau', 'qua-chu', 'thieu-muc-brief', 'link-chet', 'bao-cao-sai-su-that', 'khac'];
const khoa = s => boDau(s).replace(/[^a-z0-9]+/g, ' ').trim();

// Bảng Markdown ngay dưới tiêu đề: [{ <tên cột đã bỏ dấu>: giá trị }]. Không có tiêu đề: null.
// Tiêu đề lặp lại (người duyệt ghi nối vòng sau vào cùng file) thì gộp mọi bảng, theo thứ tự trong văn bản.
function docBang(text, tieuDeRe) {
  const lines = String(text || '').normalize('NFC').split(/\r?\n/);
  let thay = false;
  const out = [];
  lines.forEach((dong, i) => {
    if (!tieuDeRe.test(dong.trim())) return;
    thay = true;
    const rows = [];
    for (const l of lines.slice(i + 1)) {
      if (/^#{1,6}\s/.test(l.trim())) break;
      if (!/^\s*\|/.test(l)) { if (rows.length) break; continue; } // chữ trước bảng thì bỏ qua, hết bảng thì dừng
      if (/^\s*\|[\s:|-]+\|\s*$/.test(l)) continue;
      rows.push(l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim()));
    }
    if (rows.length < 2) return;
    const head = rows[0].map(khoa);
    out.push(...rows.slice(1).map(r => Object.fromEntries(head.map((h, k) => [h, r[k] || '']))));
  });
  return thay ? out : null;
}

// "## Danh sách vấn đề" của người duyệt. Không có bảng: null (để biết người duyệt không theo mẫu)
function docVanDe(text) {
  const rows = docBang(text, /^#{2,3}\s*Danh sách vấn đề(?![\p{L}\p{N}])/iu);
  if (!rows) return null;
  return rows.map((r, k) => {
    const loai = boDau(r['loai']).trim().replace(/\s+/g, '-').replace(/[^a-z-]/g, '');
    return { ma: r['ma'] || `V${k + 1}`, file: (r['file'] || '').replace(/`/g, '').trim(), viTri: r['vi tri'] || '',
      muc: /bat buoc/.test(khoa(r['muc'])) ? 'BẮT BUỘC' : 'NÊN', loai: LOAI_LOI.includes(loai) ? loai : 'khac',
      moTa: r['van de'] || '', deXuat: r['de xuat'] || '' };
  }).filter(v => v.moTa || v.file);
}

// "## Đã xử lý" của người sửa
function docDaXuLy(text) {
  const rows = docBang(text, /^#{2,3}\s*Đã xử lý(?![\p{L}\p{N}])/iu);
  return (rows || []).filter(r => r['ma']).map(r => ({ ma: r['ma'].trim(), ketQua: /khong/.test(khoa(r['ket qua'])) ? 'khong-sua' : 'da-sua', ghiChu: r['ghi chu'] || '' }));
}

// "## Kết quả duyệt lại" của người duyệt lại
function docDuyetLai(text) {
  const rows = docBang(text, /^#{2,3}\s*Kết quả duyệt lại(?![\p{L}\p{N}])/iu);
  return (rows || []).filter(r => r['ma']).map(r => ({ ma: r['ma'].trim(), dong: !/con loi/.test(khoa(r['ket luan'])) && /dong/.test(khoa(r['ket luan'])), ghiChu: r['ghi chu'] || '' }));
}

function mucTrong(text, tieuDeRe) {
  const lines = String(text || '').normalize('NFC').split(/\r?\n/), i = lines.findIndex(l => tieuDeRe.test(l.trim()));
  if (i < 0) return [];
  const out = [];
  for (const l of lines.slice(i + 1)) { if (/^#{1,6}\s/.test(l.trim())) break; out.push(l); }
  return out;
}

// "## Gửi đồng đội" (dòng "@id: nội dung") và "## Cho cả nhóm biết" (mỗi dòng một ý)
function docTinNhan(text) {
  const gui = mucTrong(text, /^#{2,3}\s*Gửi đồng đội(?![\p{L}\p{N}])/iu)
    .map(l => /^\s*(?:[-*•]\s*)?@([\p{L}\p{N}_-]+)\s*[:：]\s*(.+)$/u.exec(l)).filter(Boolean)
    .map(m => ({ to: m[1], text: m[2].trim().slice(0, 400) }));
  const chung = mucTrong(text, /^#{2,3}\s*Cho cả nhóm biết(?![\p{L}\p{N}])/iu).map(l => l.replace(/^\s*[-*•]\s*/, '').trim())
    .filter(s => s && !/^\(?\s*(không|không có|chưa có)\s*[.)]?$/iu.test(s)).map(s => s.slice(0, 400));
  return { gui: gui.slice(0, 5), chung: chung.slice(0, 5) };
}

// Đường dẫn người duyệt ghi ("slides.md", "`output/x/slides.md:120`") về dạng đầy đủ trong workspace
function chuanHoaFile(file, chuDe) {
  let f = String(file || '').replace(/`/g, '').trim().replace(/\\/g, '/').replace(/^\.\//, '').replace(/:\d+(-\d+)?$/, '');
  if (!f) return '';
  if (chuDe && f.startsWith(chuDe + '/')) return 'output/' + f;
  if (chuDe && !f.includes('/')) return `output/${chuDe}/${f}`;
  return f;
}

// Chủ của một file: người làm bước gần nhất (trước vị trí beforeIdx, đánh số từ 0) đã ghi file đó; bước duyệt không tính.
// Ảnh trong .../hinh/: người gần nhất đã đưa ảnh vào thư mục đó.
function chuFile(steps, file, beforeIdx) {
  for (let i = beforeIdx - 1; i >= 0; i--) {
    const s = steps[i];
    if (s.status === 'done' && !s.checks && [...(s.files || []), ...(s.images || [])].includes(file)) return { agentId: s.agentId, step: i + 1 };
  }
  const dir = file.replace(/[^/]+$/, '');
  if (/\/hinh\/$/.test(dir)) for (let i = beforeIdx - 1; i >= 0; i--) {
    const s = steps[i];
    if (s.status === 'done' && (s.images || []).some(f => f.startsWith(dir))) return { agentId: s.agentId, step: i + 1 };
  }
  return null;
}

// Vấn đề mới từ bảng của người duyệt; mã chung VD-<n> trong cả dự án (state = kế hoạch)
function ganVanDe(state, rows, { buoc, tu, chuDe, chuFileFn }) {
  state.issues = state.issues || []; state.issueSeq = state.issueSeq || 0;
  // Bảng cũ còn nằm trong file (vòng trước) thì không ghi lại: trùng file và nội dung với vấn đề đã có
  const daCo = new Set(state.issues.map(v => `${khoa(v.file || '')}|${khoa(v.text || '')}`));
  rows = rows.filter(r => {
    const k = `${khoa(chuanHoaFile(r.file, chuDe) || '')}|${khoa(r.moTa || '')}`;
    if (daCo.has(k)) return false;
    daCo.add(k); return true;
  });
  const moi = rows.map(r => {
    const file = chuanHoaFile(r.file, chuDe), chu = file ? chuFileFn(file) : null;
    return { id: `VD-${++state.issueSeq}`, maGoc: r.ma, file, where: r.viTri, level: r.muc, kind: r.loai, text: r.moTa, fix: r.deXuat,
      from: tu, owner: chu ? chu.agentId : null, ownerStep: chu ? chu.step : null, status: 'mo', note: '', round: 0, lastStep: buoc, fixStep: null };
  });
  state.issues.push(...moi);
  return moi;
}

// Nhóm vấn đề theo chủ file; step = bước mới nhất của chủ đó có liên quan
function nhomTheoChu(issues) {
  const nhom = new Map(), khongChu = [];
  for (const v of issues) {
    if (!v.owner) { khongChu.push(v); continue; }
    const g = nhom.get(v.owner) || { step: 0, issues: [] };
    g.step = Math.max(g.step, v.ownerStep || 0); g.issues.push(v); nhom.set(v.owner, g);
  }
  return { nhom, khongChu };
}

// Sau bước sửa: báo "Đã sửa" mà file không đổi thì vấn đề vẫn mở
function capNhatTuSua(issues, rows, runFiles, issueIds) {
  const byId = new Map(rows.map(r => [r.ma, r]));
  for (const v of issues) {
    if (!issueIds.includes(v.id)) continue;
    const r = byId.get(v.id);
    if (!r) { v.note = 'người sửa không báo'; continue; }
    if (r.ketQua === 'khong-sua') { v.status = 'khong-sua'; v.note = r.ghiChu; continue; }
    if (runFiles.includes(v.file)) { v.status = 'da-sua'; v.note = r.ghiChu; }
    else v.note = 'báo đã sửa nhưng file không đổi';
  }
}

// Sau bước duyệt lại: "Đóng" / "Còn lỗi"; vấn đề đã sửa mà người duyệt không nhắc thì coi như đóng; còn mở thì gắn vào bước này
function capNhatTuDuyetLai(issues, rows, ids, buoc) {
  const byId = new Map(rows.map(r => [r.ma, r]));
  for (const v of issues) {
    if (!ids.includes(v.id)) continue;
    const r = byId.get(v.id);
    if (r) { v.status = r.dong ? 'dong' : 'mo'; if (r.ghiChu) v.note = r.ghiChu; }
    else if (v.status === 'da-sua') v.status = 'dong';
    if (v.status === 'mo') v.lastStep = buoc;
  }
}

const TRANG_THAI = { mo: 'Mở', 'da-sua': 'Đã sửa, chờ duyệt lại', 'khong-sua': 'Không sửa', dong: 'Đóng' };
// Bản xem trong Obsidian: du-an/<mã>/van-de.md
function vietSoVanDe(plan, ten) {
  const cell = s => String(s || '').replace(/\|/g, '/').replace(/\s+/g, ' ').trim();
  const L = [`# Sổ vấn đề · ${plan.id}`, '', '> Máy chủ tự sinh từ các bảng "Danh sách vấn đề", "Đã xử lý", "Kết quả duyệt lại". Đừng sửa tay.', '',
    '| Mã | Trạng thái | Mức | Loại | File · vị trí | Vấn đề | Người sửa | Ghi chú |', '|---|---|---|---|---|---|---|---|'];
  for (const v of plan.issues || []) L.push(`| ${v.id} | ${TRANG_THAI[v.status] || v.status} | ${v.level} | ${v.kind} | ${cell(v.file)}${v.where ? ' · ' + cell(v.where) : ''} | ${cell(v.text)} | ${v.owner ? cell(ten(v.owner)) : '(chưa rõ)'} | ${cell(v.note)} |`);
  return L.join('\n') + '\n';
}

module.exports = { LOAI_LOI, TRANG_THAI, docBang, mucTrong, docVanDe, docDaXuLy, docDuyetLai, docTinNhan, chuanHoaFile, chuFile,
  ganVanDe, nhomTheoChu, capNhatTuSua, capNhatTuDuyetLai, vietSoVanDe };
