'use strict';
// Tự học: gốc lỗi, bài học có vòng đời, chọn bài hợp bước, đếm tái phạm, áp dụng kết quả hồi cứu.
// Không require tri-thuc.js hay van-de.js: van-de.js cần gocCua lúc nạp, require vòng thì nhận undefined.
const { docGhiChu, vietGhiChu } = require('./ghi-chu');

const GOC = ['agent', 'quy-trinh', 'cong-cu', 'moi-truong', 'tri-thuc'];
// Gốc mặc định theo loại lỗi; điều phối viên có thể sửa lúc hồi cứu
const GOC_MAC_DINH = { 'lech-hai-file': 'quy-trinh', 'file-khong-ton-tai': 'cong-cu', 'anh-sai-thu-muc': 'cong-cu', 'link-chet': 'moi-truong' };
const gocCua = loai => GOC_MAC_DINH[loai] || 'agent';

// ── Note bài học tri-thuc/bai-hoc/BH-<n>.md ──
const mang = v => Array.isArray(v) ? v : v ? [v] : [];
const soMa = ma => Number((/\d+/.exec(String(ma || '')) || [0])[0]);
const maMoi = baiHoc => `BH-${baiHoc.reduce((m, b) => Math.max(m, soMa(b.ma)), 0) + 1}`;
const motDong = s => String(s || '').replace(/\s+/g, ' ').trim();

function taoBaiHoc({ ma, goc = 'agent', pham_vi = 'nhom', ap_dung_khi = [], loai_loi = 'khac', noi_dung, ngay, trang_thai = 'moi', ghi_chu = '', bac = 1, tu_van_de = [] }) {
  const data = { loai: 'bai-hoc', ma, goc, pham_vi, ap_dung_khi: mang(ap_dung_khi), loai_loi, bac, lan_tai_pham: 0, lan_hieu_qua: 0, trang_thai, ngay, tu_van_de: mang(tu_van_de) };
  return vietGhiChu(data, motDong(noi_dung) + '\n' + (ghi_chu ? `\n## Ghi chú\n${ghi_chu}\n` : ''));
}

// Nội dung bài = phần thân trước mục "## …" đầu tiên (bỏ dòng tiêu đề "# …" nếu bạn thêm trong Obsidian)
function noiDungBaiHoc(body) {
  const out = [];
  for (const l of String(body || '').split(/\r?\n/)) { if (/^#{2,6}\s/.test(l)) break; if (!/^#\s/.test(l)) out.push(l); }
  return motDong(out.join(' '));
}

// Từ kết quả docKhoTriThuc: chỉ note bài học
const docBaiHoc = notes => notes.filter(n => n.data.loai === 'bai-hoc' || /^tri-thuc\/bai-hoc\//.test(n.path || ''))
  .map(n => ({ ma: n.data.ma || String(n.path || '').split('/').pop().replace(/\.md$/, ''), data: n.data, noi_dung: n.noiDung != null ? n.noiDung : n.para || '', path: n.path }));

// Sửa trường frontmatter (và nội dung, ghi chú) của một note bài học; note khoá thì bỏ qua
function suaBaiHoc(cu, sua = {}, { noi_dung, ghi_chu } = {}) {
  if (!cu) return { boQua: 'chưa có note' };
  const { data, body } = docGhiChu(cu);
  if (data.khoa === true) return { boQua: 'note đã khoá' };
  let b = body;
  if (noi_dung) { const i = b.search(/^#{2,6}\s/m); b = motDong(noi_dung) + '\n' + (i >= 0 ? '\n' + b.slice(i) : ''); }
  if (ghi_chu) b = /^## Ghi chú\s*$/m.test(b) ? b.replace(/\s*$/, '\n') + '- ' + ghi_chu + '\n' : b.replace(/\s*$/, '\n\n') + '## Ghi chú\n- ' + ghi_chu + '\n';
  return vietGhiChu({ ...data, ...sua }, b);
}

const HIEU_LUC = ['moi', 'hieu-qua', 'khong-hieu-qua'];
// Bản xem agents/<id>/kinh-nghiem.md: bài còn hiệu lực của người đó và của cả nhóm, bậc cao trước
function banXemKinhNghiem(ten, agentId, baiHoc) {
  const ds = baiHoc.filter(b => !['huy', 'da-thang-cap'].includes(b.data.trang_thai) && [`agent:${agentId}`, 'nhom'].includes(b.data.pham_vi))
    .sort((a, b) => (Number(b.data.bac) || 1) - (Number(a.data.bac) || 1) || soMa(a.ma) - soMa(b.ma));
  return [`# Kinh nghiệm của ${ten}`, '', '> Máy chủ tự sinh từ tri-thuc/bai-hoc/. Sửa bài học trong Obsidian (note BH-…), không sửa ở đây.', '',
    ...(ds.length ? ds.map(b => `- [${b.ma}] ${Number(b.data.bac) === 2 ? '(checklist) ' : ''}${motDong(b.noi_dung)}`) : ['(chưa có)'])].join('\n') + '\n';
}

module.exports = { GOC, GOC_MAC_DINH, gocCua, HIEU_LUC, soMa, maMoi, taoBaiHoc, noiDungBaiHoc, docBaiHoc, suaBaiHoc, banXemKinhNghiem };
