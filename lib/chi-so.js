'use strict';
// Chỉ số trí não cho trang Báo cáo: tính từ lượt chạy (runs.jsonl), kế hoạch (plans.json) và note trong tri-thuc/.
// Không đọc file: server.js đọc rồi truyền vào.
const { giongNhau, NGUONG_CAU_HOI } = require('./van-ban');

const LOAI_BUOC = ['work', 'review', 'rereview', 'fix', 'dieu-phoi'];
// Giống stepKind trong server.js
const loaiBuoc = s => s.checks ? (s.round ? 'rereview' : 'review') : (s.fixOf || s.kind === 'fix') ? 'fix' : 'work';
const tg = d => new Date(d || 0).getTime() || 0;
const dem = (obj, k, n = 1) => { obj[k] = (obj[k] || 0) + n; return obj; };

// Công cụ một lượt đã gọi: đếm theo tên công cụ, lượt cũ chưa có tools thì đọc diễn biến (describeTool)
function congCuCuaLuot(r) {
  const t = r.tools || {}, acts = (r.acts || []).map(a => a.text || '');
  const theoAct = re => acts.filter(x => re.test(x)).length;
  const coTools = Object.keys(t).length > 0;
  return {
    bash: coTools ? Object.keys(t).some(k => /^(Bash|PowerShell|run_command)$/i.test(k)) : acts.some(x => /^(Dùng công cụ (Bash|PowerShell)|Chạy lệnh)/.test(x)),
    tra_cuu: coTools ? t.mcp__yogalab__tra_cuu || 0 : theoAct(/^Tra bộ não/),
    soat_loi: coTools ? t.mcp__yogalab__soat_loi || 0 : theoAct(/^Máy soát/),
    kiem_link: coTools ? t.mcp__yogalab__kiem_link || 0 : theoAct(/^Kiểm \d+ link/)
  };
}

// Điểm nghiệm thu lần đầu: dòng "Nghiệm thu lần 1: <điểm>/100" trong nhật ký; dự án chưa sửa vòng nào thì lấy điểm hiện có
function diemLanDau(p) {
  for (const l of p.log || []) { const m = /^Nghiệm thu lần 1: (\d+)\/100/.exec(l); if (m) return Number(m[1]); }
  return !p.fixRounds && p.score != null ? p.score : null;
}

// Loại của một lượt trong dự án: theo bước có runId đó; không có thì theo số bước lúc chạy; bước 0 là điều phối
function loaiLuot(p, r, theoRun) {
  if (theoRun.has(r.id)) return loaiBuoc(theoRun.get(r.id));
  if (r.step && p.steps[r.step - 1]) return loaiBuoc(p.steps[r.step - 1]);
  return /^Hỏi nhanh/.test(r.task || '') ? 'hoi-nhanh' : 'dieu-phoi';
}

// Câu hỏi gửi tới chủ dự án mà giống một câu đã hỏi trước đó trong cùng dự án (máy chủ tự trả lời thì không tính)
function cauHoiTrung(p) {
  const da = []; let n = 0;
  for (const x of p.answers || []) {
    const q = String(x.q || '');
    if (/^\(Giống câu đã trả lời/u.test(String(x.a || '').trim())) continue;
    if (da.some(y => giongNhau(q, y) >= NGUONG_CAU_HOI)) n++;
    da.push(q);
  }
  return n;
}

// Lần người kiểm chứng mở một trang mà người khác đã mở trước đó trong dự án (diễn biến cắt URL bằng "…": so theo phần đầu)
function linkMoLai(rs, nguoiKiem) {
  const truoc = []; let mo = 0, lai = 0;
  for (const r of rs.slice().sort((a, b) => tg(a.startedAt) - tg(b.startedAt))) {
    const urls = (r.acts || []).map(a => /^Mở trang:\s*(https?:\/\/\S+)/.exec(a.text || '')).filter(Boolean).map(m => m[1].replace(/…$/, ''));
    if (r.agentId === nguoiKiem) for (const u of urls) { mo++; if (truoc.some(x => x.startsWith(u) || u.startsWith(x))) lai++; }
    else truoc.push(...urls);
  }
  return { mo, lai, tiLe: mo ? Math.round(lai / mo * 1000) / 10 : null };
}

const ANH = /\.(png|jpe?g|webp|gif)$/i;
// Ảnh dự án ghi ra ngoài output/<chủ đề>/; chưa biết chủ đề thì không đo
function anhNgoaiChuDe(chuDe, steps, rs) {
  if (!chuDe) return null;
  const files = new Set([...rs.flatMap(r => r.files || []), ...steps.flatMap(s => s.images || [])].filter(f => ANH.test(f)));
  return [...files].filter(f => !f.startsWith(`output/${chuDe}/`)).length;
}

// runs, plans: toàn bộ; notes: note trong tri-thuc/ ({ path, data }); quyDoi(run): token quy đổi;
// nguonIds: agent làm bước nguồn (Deep Research), để đo token bước nguồn khi tiếp nối;
// chuDeCua(plan): thư mục chủ đề; nguoiKiem: id người kiểm chứng; indexDong: số dòng index.md hiện tại
function chiSoTriNao({ runs = [], plans = [], notes = [], days = 0, now = Date.now(), quyDoi = r => r.tokens || 0, nguonIds = [],
  chuDeCua = p => p.topic || null, nguoiKiem = null, indexDong = null } = {}) {
  const tu = days ? now - days * 86400000 : 0;
  const luot = runs.filter(r => tg(r.startedAt) >= tu);
  const theoPlan = new Map();
  for (const r of runs) if (r.planId) { if (!theoPlan.has(r.planId)) theoPlan.set(r.planId, []); theoPlan.get(r.planId).push(r); }

  const duAn = plans.filter(p => tg(p.createdAt) >= tu).sort((a, b) => tg(b.createdAt) - tg(a.createdAt)).map(p => {
    const steps = p.steps || [], rs = theoPlan.get(p.id) || [];
    const theoRun = new Map(steps.filter(s => s.runId).map(s => [s.runId, s]));
    const token = {}; let tokenNguon = 0;
    for (const r of rs) {
      const loai = loaiLuot(p, r, theoRun), w = Math.round(quyDoi(r));
      dem(token, loai, w);
      if (loai === 'work' && nguonIds.includes(r.agentId)) tokenNguon += w;
    }
    const buocLam = steps.filter(s => loaiBuoc(s) === 'work').length;
    const vong = steps.filter(s => loaiBuoc(s) === 'rereview').length; // mỗi vòng duyệt–sửa kết thúc bằng một bước duyệt lại
    const bb = (p.issues || []).filter(v => v.level === 'BẮT BUỘC'), theoLoai = {}, theoGoc = {};
    for (const v of bb) { dem(theoLoai, v.kind || 'khac'); dem(theoGoc, v.goc || 'agent'); }
    return {
      id: p.id, goal: p.goal, status: p.status, createdAt: p.createdAt, tiepNoiTu: p.tiepNoiTu || null,
      token, tongToken: Object.values(token).reduce((a, b) => a + b, 0),
      buocLam, vongSua: vong, tiLeVong: buocLam ? Math.round(vong / buocLam * 100) / 100 : null,
      batBuoc: { tong: bb.length, theoLoai, theoGoc },
      khongChu: (p.issues || []).filter(v => !v.owner).length,
      giaoBan: p.checkins || 0, diemDau: diemLanDau(p),
      tokenNguon: p.tiepNoiTu ? tokenNguon : null,
      cauHoiTrung: cauHoiTrung(p), linkMoLai: nguoiKiem ? linkMoLai(rs, nguoiKiem) : null, anhNgoai: anhNgoaiChuDe(chuDeCua(p), steps, rs)
    };
  });

  const agentMap = new Map();
  for (const r of luot) {
    const a = agentMap.get(r.agentId) || { id: r.agentId, ten: r.agentName || r.agentId, luot: 0, luotBash: 0, tra_cuu: 0, soat_loi: 0, kiem_link: 0 };
    const c = congCuCuaLuot(r);
    a.luot++; if (c.bash) a.luotBash++;
    a.tra_cuu += c.tra_cuu; a.soat_loi += c.soat_loi; a.kiem_link += c.kiem_link;
    agentMap.set(r.agentId, a);
  }
  const agent = [...agentMap.values()].sort((a, b) => b.luot - a.luot);
  const luotBash = agent.reduce((s, a) => s + a.luotBash, 0);

  // Bài học: số theo trạng thái; tái phạm trong 30 ngày theo đánh giá sau mỗi dự án
  const loai = n => n.data && n.data.loai;
  const baiHoc = notes.filter(n => loai(n) === 'bai-hoc'), theoTrangThai = {};
  for (const b of baiHoc) dem(theoTrangThai, b.data.trang_thai || 'moi');
  const ma = new Set(); let taiPhamCu = 0;
  for (const p of plans) {
    if (tg(p.endedAt || p.createdAt) < now - 30 * 86400000) continue;
    if (Array.isArray(p.baiHocTaiPham)) { for (const m of p.baiHocTaiPham) ma.add(m); continue; }
    for (const l of p.log || []) { const m = /^Bài học: (\d+) tái phạm/.exec(l); if (m) taiPhamCu += Number(m[1]); } // dự án trước khi lưu mã
  }

  const y = { 'da-duyet': 0, nhap: 0, 'can-xem-lai': 0 }, nguon = {};
  for (const n of notes) {
    if (loai(n) === 'menh-de') dem(y, n.data.trang_thai || 'nhap');
    if (loai(n) === 'nguon') dem(nguon, n.data.truy_cap || 'chua-kiem');
  }
  const ganNhat = plans.slice().sort((a, b) => tg(b.createdAt) - tg(a.createdAt))[0];
  const dungTrong = n => [].concat((n.data && n.data.dung_trong) || []).map(String);
  const noteDung = ganNhat ? notes.filter(n => dungTrong(n).some(x => x.includes(ganNhat.id))).length : 0;

  return {
    days, duAn, agent,
    tong: { luot: luot.length, luotBash, tiLeBash: luot.length ? Math.round(luotBash / luot.length * 1000) / 10 : null, indexDong },
    baiHoc: { tong: baiHoc.length, theoTrangThai, taiPham30: ma.size + taiPhamCu },
    boNao: { y, nguon, nguonBiChan: (nguon.chan || 0) + (nguon.captcha || 0), duAnGanNhat: ganNhat ? ganNhat.id : null, noteDung }
  };
}

module.exports = { chiSoTriNao, congCuCuaLuot, diemLanDau, cauHoiTrung, linkMoLai, anhNgoaiChuDe, LOAI_BUOC };
