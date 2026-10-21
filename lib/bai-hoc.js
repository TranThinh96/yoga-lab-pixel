'use strict';
// Tự học: gốc lỗi, bài học có vòng đời, chọn bài hợp bước, đếm tái phạm, áp dụng kết quả hồi cứu.
// Không require tri-thuc.js hay van-de.js: van-de.js cần gocCua lúc nạp, require vòng thì nhận undefined.
const { docGhiChu, vietGhiChu } = require('./ghi-chu');
const { tuKhoa, locBaiHocMoi } = require('./van-ban');

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

// ── Sau dự án: bài học có hiệu quả không ──
// vanDe: vấn đề BẮT BUỘC của dự án; batDau: ngày tạo dự án (yyyy-mm-dd); nhanTheoNguoi: { id: [nhãn các bước người đó đã làm] }.
// Trả về [{ ma, sua, ghi?, loHong?, deXuat? }]: sua là trường frontmatter cần đổi
function danhGiaBaiHoc(baiHoc, vanDe, { batDau, nguoiThamGia = [], nhanTheoNguoi = {} } = {}) {
  const out = [];
  for (const b of baiHoc) {
    const d = b.data;
    if (!HIEU_LUC.includes(d.trang_thai) || !d.loai_loi || d.loai_loi === 'khac' || !(String(d.ngay || '') < String(batDau || ''))) continue;
    const rieng = /^agent:/.test(d.pham_vi) ? d.pham_vi.slice(6) : null; // phạm vi nhóm, chủ đề: tính mọi người
    if (rieng && !nguoiThamGia.includes(rieng)) continue;
    const loi = vanDe.filter(v => v.kind === d.loai_loi && (!rieng || v.owner === rieng));
    const tai = Number(d.lan_tai_pham) || 0, hq = Number(d.lan_hieu_qua) || 0, bac = Number(d.bac) || 1;
    if (loi.length) {
      const r = { ma: b.ma, sua: { lan_tai_pham: tai + 1, trang_thai: 'khong-hieu-qua' } };
      // Mỗi lần tái phạm là một lần xét lên bậc; chỉ 1 → 2 (checklist) là tự động
      if (bac === 1) { r.sua.bac = 2; r.ghi = `Bài học ${b.ma} tái phạm (${d.loai_loi} ×${loi.length}) → lên checklist bắt buộc`; }
      else if (bac === 2) {
        r.loHong = { mo_ta: `Cần luật máy soát cho: ${motDong(b.noi_dung)}`, bang_chung: `${b.ma} tái phạm ${tai + 1} lần dù đã là checklist (${loi.map(v => v.id).join(', ')})` };
        r.deXuat = { loai: 'len-bac', ma: b.ma, ly_do: `${b.ma} vẫn tái phạm khi đã là checklist: cần luật máy soát (đã ghi vào lỗ hổng hệ thống)` };
      } else if (bac === 3) {
        r.deXuat = rieng
          ? { loai: 'sua-huong-dan', agent: rieng, ma: b.ma, cu: '', moi: `Bắt buộc (bài học ${b.ma}, tái phạm ${tai + 1} lần): ${motDong(b.noi_dung)}`, ly_do: `${b.ma} vẫn tái phạm khi đã có máy soát: đưa vào hướng dẫn vai` }
          : { loai: 'quy-trinh', ma: b.ma, ly_do: `${b.ma} vẫn tái phạm khi đã có máy soát: cần đổi quy trình. ${motDong(b.noi_dung)}` };
      }
      out.push(r);
      continue;
    }
    const ad = mang(d.ap_dung_khi), nguoi = rieng ? [rieng] : nguoiThamGia;
    if (!nguoi.some(id => (nhanTheoNguoi[id] || []).some(n => !ad.length || ad.includes(n)))) continue;
    const sua = { lan_hieu_qua: hq + 1 };
    if (hq + 1 >= 2 && tai === 0) sua.trang_thai = 'hieu-qua';
    out.push({ ma: b.ma, sua });
  }
  return out;
}

// tri-thuc/he-thong/lo-hong.md: máy chủ chỉ thêm dòng, không sửa dòng cũ; mô tả đã có (chưa đánh dấu) thì không thêm lại
const DAU_LO_HONG = '# Lỗ hổng hệ thống\n\n> Máy chủ ghi những lỗi không phải của agent: lỗi máy chủ, thiếu công cụ, cần luật soát mới. Người phát triển đọc và sửa; sửa xong thì đánh dấu [x].\n\n';
function themLoHong(cu, ds, { ngay, planId } = {}) {
  let t = String(cu || '').trim() ? String(cu).replace(/\s*$/, '\n') : DAU_LO_HONG;
  for (const x of ds) {
    const mo = motDong(x.mo_ta);
    if (!mo || t.split('\n').some(l => /^- \[ \]/.test(l) && l.includes(') ' + mo))) continue;
    t += `- [ ] (${ngay}${planId ? ', ' + planId : ''}) ${mo}${x.bang_chung ? ' — ' + motDong(x.bang_chung) : ''}\n`;
  }
  return t;
}
const demLoHongMo = text => String(text || '').split(/\r?\n/).filter(l => /^\s*- \[ \]/.test(l)).length;

// ── Hồi cứu trong nghiệm thu ──
const laTuQuyet = a => /^\((Chủ dự án để nhóm tự quyết|Đã hỏi đủ số lần|Giống câu đã trả lời)/u.test(String(a || '').normalize('NFC').trim());
// Câu chủ dự án tự trả lời mà nội dung khác phần "Đề xuất" của câu hỏi (không ghi đề xuất thì so với cả câu hỏi)
function traLoiKhacDeXuat(answers = []) {
  return answers.filter(x => x && x.a && !laTuQuyet(x.a)).filter(x => {
    const q = String(x.q || '').normalize('NFC'), m = /đề xuất\s*[:：]\s*([\s\S]+)$/iu.exec(q);
    const A = tuKhoa(x.a), D = tuKhoa(m ? m[1] : q);
    if (!A.size) return false;
    let chung = 0;
    for (const w of A) if (D.has(w)) chung++;
    return chung / A.size < 0.5;
  }).map(x => `${motDong(x.q).slice(0, 160)} → ${motDong(x.a).slice(0, 160)}`);
}

// Khối số liệu máy chủ tổng hợp cho điều phối viên trước khi rút kinh nghiệm. ten(id) → tên người
function thongKeHoc(plan, runs = [], baiHoc = [], ten = id => id) {
  const bb = (plan.issues || []).filter(v => v.level === 'BẮT BUỘC');
  const theoNguoi = new Map();
  for (const v of bb) {
    const k = v.owner || '';
    const m = theoNguoi.get(k) || new Map();
    m.set(v.kind, (m.get(v.kind) || 0) + 1); theoNguoi.set(k, m);
  }
  const nguoi = [...theoNguoi].map(([id, m]) => `${id ? ten(id) : '(chưa rõ người)'}: ${[...m].map(([k, n]) => `${k} ×${n}`).join(', ')}`);
  const goc = Object.fromEntries(GOC.map(g => [g, 0]));
  for (const v of bb) { const g = v.goc || gocCua(v.kind); goc[g] = (goc[g] || 0) + 1; }
  const thamGia = [...new Set((plan.steps || []).map(s => s.agentId))];
  const theoMa = new Map(baiHoc.map(b => [b.ma, b]));
  const taiPham = danhGiaBaiHoc(baiHoc, bb, { batDau: String(plan.createdAt || '').slice(0, 10), nguoiThamGia: thamGia })
    .filter(r => r.sua.trang_thai === 'khong-hieu-qua').map(r => {
      const d = theoMa.get(r.ma).data;
      return `[${r.ma}] (${/^agent:/.test(d.pham_vi) ? ten(d.pham_vi.slice(6)) : 'cả nhóm'}, ${d.loai_loi})`;
    });
  const chan = new Map();
  for (const r of runs) for (const [t, n] of Object.entries(r.tools || {})) if (/^(Bash|PowerShell)$/.test(t)) {
    const k = `${ten(r.agentId)} gọi ${t}`; chan.set(k, (chan.get(k) || 0) + n);
  }
  const khac = traLoiKhacDeXuat(plan.answers).slice(0, 5);
  const coGi = (ds, sep = ', ') => ds.length ? ds.join(sep) : '(không có)';
  return ['SỐ LIỆU ĐỂ RÚT KINH NGHIỆM (máy chủ tổng hợp):',
    `- Vấn đề BẮT BUỘC theo người và loại: ${coGi(nguoi, '; ')}`,
    `- Theo gốc mặc định: ${Object.entries(goc).map(([g, n]) => `${g} ${n}`).join(', ')}`,
    `- Bài học tái phạm (có từ trước, vẫn lỗi cùng loại): ${coGi(taiPham)}`,
    `- Công cụ bị chặn: ${coGi([...chan].map(([k, n]) => `${k} ${n} lần`))}`,
    `- Checklist chưa ghi: ${plan.checklistThieu || 0} lần`,
    `- Câu trả lời của chủ dự án khác phương án nhóm đề xuất: ${khac.length ? '\n' + khac.map(x => '    - ' + x).join('\n') : '(không có)'}`].join('\n');
}

const NHAN = ['work', 'review', 'rereview', 'fix', 'nguon', 'slides', 'thiet-ke', 'anh'];
// Mục "hoc" của JSON nghiệm thu; JSON kiểu cũ chỉ có "lessons": { id: [câu] } thì đổi sang bai_hoc_moi
function hocTuJson(j, agentIds = []) {
  if (j && j.hoc && typeof j.hoc === 'object' && !Array.isArray(j.hoc)) return j.hoc;
  const ls = j && j.lessons && typeof j.lessons === 'object' && !Array.isArray(j.lessons) ? j.lessons : {};
  return { bai_hoc_moi: Object.entries(ls).filter(([id, l]) => agentIds.includes(id) && Array.isArray(l))
    .flatMap(([id, l]) => l.map(noi_dung => ({ pham_vi: `agent:${id}`, goc: 'agent', loai_loi: 'khac', ap_dung_khi: [], noi_dung }))) };
}

// Kết quả hồi cứu → việc máy chủ cần làm (hàm thuần; máy chủ ghi file)
function apDungHoc(hoc, { baiHoc = [], agentIds = [], ngay, planId, loaiLoi = [] } = {}) {
  const ds = x => Array.isArray(x) ? x.filter(y => y && typeof y === 'object') : [];
  const out = { moi: [], sua: [], loHong: [], deXuat: [], yNhap: [], mauTot: ds(hoc && hoc.mau_tot), boQua: [] };
  const hopLe = pv => pv === 'nhom' || (/^agent:/.test(pv) && agentIds.includes(pv.slice(6))) || /^chu-de:[a-z0-9-]+$/.test(pv);
  let ma = maMoi(baiHoc), demTheoPv = {};
  const tiep = () => { const m = ma; ma = `BH-${soMa(ma) + 1}`; return m; };
  for (const x of ds(hoc && hoc.bai_hoc_moi)) {
    const noi_dung = motDong(x.noi_dung).slice(0, 400), goc = GOC.includes(x.goc) ? x.goc : 'agent';
    if (!noi_dung) continue;
    if (goc === 'tri-thuc') { out.yNhap.push({ y: noi_dung }); continue; }
    if (goc !== 'agent') { out.loHong.push({ mo_ta: `(${goc}) ${noi_dung}`, bang_chung: `điều phối viên rút ra lúc nghiệm thu${x.pham_vi ? ', ' + x.pham_vi : ''}` }); continue; }
    const pham_vi = hopLe(String(x.pham_vi || '')) ? String(x.pham_vi) : null;
    if (!pham_vi) { out.boQua.push(`bài học có phạm vi không hợp lệ: ${x.pham_vi || '(trống)'}`); continue; }
    if ((demTheoPv[pham_vi] = (demTheoPv[pham_vi] || 0) + 1) > 3) continue; // mỗi người tối đa 3 bài
    const cu = [...baiHoc.filter(b => b.data.pham_vi === pham_vi && b.data.trang_thai !== 'huy').map(b => b.noi_dung), ...out.moi.filter(m => m.pham_vi === pham_vi).map(m => m.noi_dung)];
    if (!locBaiHocMoi([noi_dung], cu).length) { out.boQua.push(`trùng bài cũ: ${noi_dung.slice(0, 60)}`); continue; }
    const m = tiep(), loai_loi = loaiLoi.includes(x.loai_loi) ? x.loai_loi : 'khac';
    const ap = mang(x.ap_dung_khi).filter(n => NHAN.includes(n));
    out.moi.push({ ma: m, pham_vi, noi_dung, text: taoBaiHoc({ ma: m, goc, pham_vi, ap_dung_khi: ap, loai_loi, noi_dung, ngay, ghi_chu: planId ? `Rút ra khi nghiệm thu ${planId}` : '' }) });
  }
  const theoMa = new Map(baiHoc.map(b => [b.ma, b]));
  for (const g of ds(hoc && hoc.gop)) {
    const bo = mang(g.bo).filter(m => theoMa.has(m) && m !== g.giu);
    if (!theoMa.has(g.giu) || !bo.length) { out.boQua.push(`gộp không hợp lệ: ${g.giu || '?'}`); continue; }
    out.sua.push({ ma: g.giu, sua: {}, opts: { noi_dung: motDong(g.noi_dung) || theoMa.get(g.giu).noi_dung, ghi_chu: `gộp ${bo.join(', ')} vào đây (${ngay})` } });
    for (const m of bo) out.sua.push({ ma: m, sua: { trang_thai: 'huy' }, opts: { ghi_chu: `gộp vào ${g.giu}` } });
  }
  for (const s of ds(hoc && hoc.sua_huong_dan)) {
    if (!agentIds.includes(s.agent) || !String(s.cu || '').trim() || !String(s.moi || '').trim()) { out.boQua.push(`đề xuất sửa hướng dẫn thiếu agent, đoạn cũ hoặc đoạn mới`); continue; }
    out.deXuat.push({ loai: 'sua-huong-dan', agent: s.agent, cu: String(s.cu), moi: String(s.moi), ly_do: motDong(s.ly_do) });
  }
  for (const l of ds(hoc && hoc.lo_hong)) if (motDong(l.mo_ta)) out.loHong.push({ mo_ta: motDong(l.mo_ta), bang_chung: motDong(l.bang_chung) });
  return out;
}

// ── Đề xuất sửa hướng dẫn vai (chỉ áp dụng khi bạn duyệt) ──
// cu rỗng (đề xuất khi bài học lên bậc 4): thêm moi vào cuối hướng dẫn
function apDungSuaHuongDan(instructions, cu, moi) {
  const t = String(instructions || '');
  if (!String(cu || '')) return t.replace(/\s*$/, '') + (t.trim() ? '\n' : '') + moi;
  const n = t.split(cu).length - 1;
  if (!n) return { loi: 'Không tìm thấy đoạn cũ trong hướng dẫn (có thể đã đổi).' };
  if (n > 1) return { loi: 'Đoạn cũ xuất hiện nhiều lần; sửa tay.' };
  return t.replace(cu, () => moi);
}
// Hoàn tác: áp dụng ngược, khi moi còn nguyên trong hướng dẫn
function hoanTacSuaHuongDan(instructions, cu, moi) {
  const t = String(instructions || '');
  if (String(cu || '')) return apDungSuaHuongDan(t, moi, cu);
  const n = t.split(moi).length - 1;
  if (n !== 1) return { loi: n ? 'Đoạn mới xuất hiện nhiều lần; sửa tay.' : 'Không tìm thấy đoạn đã thêm trong hướng dẫn (có thể đã đổi).' };
  return t.includes('\n' + moi) ? t.replace('\n' + moi, () => '') : t.replace(moi, () => '');
}
// Thêm một dòng vào cuối bảng "Từ cần tránh" của thuat-ngu.md; từ đã có thì giữ nguyên
function themTuTranh(text, tu, lyDo = '') {
  const lines = String(text || '').replace(/\r\n/g, '\n').normalize('NFC').split('\n'), o = s => String(s || '').replace(/\|/g, '/').trim();
  const i = lines.findIndex(l => /^#{2,3}\s*Từ cần tránh(?![\p{L}\p{N}])/iu.test(l.trim()));
  const dau = i < 0 ? -1 : lines.findIndex((l, k) => k > i && /^\s*\|/.test(l));
  if (dau < 0) return { loi: 'Không thấy bảng "Từ cần tránh" trong thuat-ngu.md' };
  let cuoi = dau;
  while (cuoi + 1 < lines.length && /^\s*\|/.test(lines[cuoi + 1])) cuoi++;
  const co = lines.slice(dau + 2, cuoi + 1).map(l => o((l.split('|')[1] || '').replace(/[`"“”*]/g, '')).toLowerCase());
  if (co.includes(o(tu).toLowerCase())) return lines.join('\n');
  lines.splice(cuoi + 1, 0, `| ${o(tu)} | ${o(lyDo)} |`);
  return lines.join('\n');
}

// Mã [BH-n] trong một đoạn chữ (mục Tự kiểm của bàn giao)
const maTrong = text => [...String(text || '').matchAll(/\[(BH-\d+)\]/g)].map(m => m[1]);

module.exports = { GOC, GOC_MAC_DINH, gocCua, phanLoaiBaiHoc, doanApDungKhi, HIEU_LUC, soMa, maMoi, taoBaiHoc, noiDungBaiHoc, docBaiHoc, suaBaiHoc, banXemKinhNghiem,
  nhanBuoc, chonBaiHoc, maTrong, danhGiaBaiHoc, themLoHong, demLoHongMo, traLoiKhacDeXuat, thongKeHoc, hocTuJson, apDungHoc,
  apDungSuaHuongDan, hoanTacSuaHuongDan, themTuTranh };
