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

// ── Phân loại bài học cũ (kinh-nghiem.md trước Đợt 3) ──
// Loại lỗi đoán theo từ khoá (khớp luật đầu tiên)
const LOAI_THEO_TU = [
  [/dấu câu|chính tả|lặp từ|câu cụt|tân ngữ|trọn nghĩa/iu, 'chinh-ta-dau-cau'],
  [/đếm chữ|quá chữ|ngưỡng ~?\d+/iu, 'qua-chu'],
  [/hinh-moi|thư mục ảnh|vị trí file|nằm đúng|giờ sửa file/iu, 'anh-sai-thu-muc'],
  [/dòng hình|đối chiếu chéo|khớp với|lệch|cần giao lam/iu, 'lech-hai-file'],
  [/đã sửa|tự khai|100%|báo đã/iu, 'bao-cao-sai-su-that'],
  [/\b404\b|\b403\b|captcha|recaptcha|mở link|link thật/iu, 'link-chet'],
  [/chống chỉ định|ccđ|cấp cứu|115|an toàn/iu, 'an-toan-thieu-ccd'],
  [/phóng đại|tuyệt đối|hứa hẹn|"chữa"|khẳng định/iu, 'phong-dai'],
  [/đạo cụ|tư thế|gạch|ghế|chăn|prompt|ngón|người mẫu/iu, 'anh-sai-tu-the'],
  [/nguồn|trích|gán|pmc|pubmed|mức bằng chứng/iu, 'nguon-khong-khop'],
  [/brief|mục lục|thiếu mục/iu, 'thieu-muc-brief']
];
// Bài học mà Đợt 0–2 đã chữa bằng thay đổi hệ thống: đổi gốc và đánh dấu đã thăng cấp
const DOI_GOC = [
  [/hinh-moi|vị trí file trong output|giờ sửa file/iu, 'cong-cu', 'Máy chủ đặt ảnh sai thư mục (sửa ở 0.4)'],
  [/cần giao lam/iu, 'quy-trinh', 'Đã thành luật giao sửa theo chủ file (1.3)'],
  [/115/u, 'tri-thuc', 'Là một sự thật: đưa vào bộ não thành ý có nguồn'],
  [/đếm chữ từng trang bằng tay/iu, 'cong-cu', 'Đã có soat_loi đếm chữ (0.13)'],
  [/grep chính file vừa sửa|đối chiếu bàn giao với file thật|báo "đã sửa" khi file chưa đổi|báo đã sửa/iu, 'cong-cu', 'Máy chủ đối chiếu file đã ghi (0.8, 1.4)'],
  [/statpearls|nih ods|captcha|recaptcha/iu, 'moi-truong', 'Tình trạng truy cập ghi trong note nguồn (1.9, 2.4)']
];
function phanLoaiBaiHoc(text) {
  const t = String(text || '').normalize('NFC');
  const loai = (LOAI_THEO_TU.find(([re]) => re.test(t)) || [null, 'khac'])[1];
  const doi = DOI_GOC.find(([re]) => re.test(t));
  return doi ? { loai_loi: loai, goc: doi[1], trang_thai: 'da-thang-cap', ghi_chu: doi[2] }
    : { loai_loi: loai, goc: gocCua(loai), trang_thai: 'moi', ghi_chu: '' };
}
// Loại bước, loại file mà bài cũ nói tới (gộp mọi luật khớp)
const AP_DUNG_THEO_TU = [[/duyệt/iu, 'review'], [/sửa|bước sửa/iu, 'fix'], [/ảnh|prompt|tư thế|người mẫu/iu, 'anh'], [/nguồn|link|trích/iu, 'nguon'],
  [/slide|dòng hình|mục lục|kịch bản/iu, 'slides'], [/thiết kế|thiet-ke|danh sách hình/iu, 'thiet-ke']];
const doanApDungKhi = text => AP_DUNG_THEO_TU.filter(([re]) => re.test(String(text || '').normalize('NFC'))).map(([, n]) => n);

const HIEU_LUC = ['moi', 'hieu-qua', 'khong-hieu-qua'];
// Bản xem agents/<id>/kinh-nghiem.md: bài còn hiệu lực của người đó và của cả nhóm, bậc cao trước
function banXemKinhNghiem(ten, agentId, baiHoc) {
  const ds = baiHoc.filter(b => !['huy', 'da-thang-cap'].includes(b.data.trang_thai) && [`agent:${agentId}`, 'nhom'].includes(b.data.pham_vi))
    .sort((a, b) => (Number(b.data.bac) || 1) - (Number(a.data.bac) || 1) || soMa(a.ma) - soMa(b.ma));
  return [`# Kinh nghiệm của ${ten}`, '', '> Máy chủ tự sinh từ tri-thuc/bai-hoc/. Sửa bài học trong Obsidian (note BH-…), không sửa ở đây.', '',
    ...(ds.length ? ds.map(b => `- [${b.ma}] ${Number(b.data.bac) === 2 ? '(checklist) ' : ''}${motDong(b.noi_dung)}`) : ['(chưa có)'])].join('\n') + '\n';
}

// ── Chọn bài học cho một bước ──
// Nhãn của bước: loại bước + loại file nó đụng tới (khớp với ap_dung_khi của bài học)
function nhanBuoc({ kind, task = '', files = [], agent = {} } = {}) {
  const t = [task, ...files].join('\n');
  const g = (agent.engine === 'claude' && agent.geminiWeb && agent.geminiWeb.mode) || '';
  const nhan = [kind || 'work'];
  if (/slides\.md/.test(t)) nhan.push('slides');
  if (/thiet-ke\.md/.test(t)) nhan.push('thiet-ke');
  if (/-nguon\.md/.test(t) || g === 'deep-research') nhan.push('nguon');
  if (g === 'image' || agent.engine === 'antigravity' || /\/hinh\//.test(t)) nhan.push('anh');
  return nhan;
}

function chonBaiHoc(baiHoc, { agentId, nhan = [], chuDe } = {}, max = 12) {
  const pv = new Set(['nhom', `agent:${agentId}`, ...(chuDe ? [`chu-de:${chuDe}`] : [])]);
  return baiHoc.filter(b => HIEU_LUC.includes(b.data.trang_thai) && pv.has(b.data.pham_vi)
    && (!mang(b.data.ap_dung_khi).length || mang(b.data.ap_dung_khi).some(x => nhan.includes(x))))
    .sort((a, b) => (Number(b.data.bac) || 1) - (Number(a.data.bac) || 1) || (Number(b.data.lan_tai_pham) || 0) - (Number(a.data.lan_tai_pham) || 0)
      || String(b.data.ngay || '').localeCompare(String(a.data.ngay || '')))
    .slice(0, max);
}

// Mã [BH-n] trong một đoạn chữ (mục Tự kiểm của bàn giao)
const maTrong = text => [...String(text || '').matchAll(/\[(BH-\d+)\]/g)].map(m => m[1]);

module.exports = { GOC, GOC_MAC_DINH, gocCua, phanLoaiBaiHoc, doanApDungKhi, HIEU_LUC, soMa, maMoi, taoBaiHoc, noiDungBaiHoc, docBaiHoc, suaBaiHoc, banXemKinhNghiem,
  nhanBuoc, chonBaiHoc, maTrong };
