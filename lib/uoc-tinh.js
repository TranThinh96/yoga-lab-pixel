'use strict';
// Ước tính chi phí kế hoạch nháp từ các dự án trước, để bạn biết trước khi bấm "Chạy kế hoạch".
// Mỗi bước: trung vị chi phí các bước cùng người, cùng loại (cộng mọi lượt của bước: thử lại, các pha Deep Research).
// Cả dự án: hệ số giữa tổng chi phí dự án và các bước đã chia lúc đầu (vòng duyệt–sửa chèn thêm, lập kế hoạch, nghiệm thu).

const loaiBuoc = s => s.checks ? (s.round ? 'rereview' : 'review') : (s.fixOf || s.kind === 'fix') ? 'fix' : 'work';
const buocGoc = s => !s.fixOf && s.kind !== 'fix' && !s.round; // bước điều phối viên chia lúc đầu
const trungVi = a => { if (!a.length) return null; const b = [...a].sort((x, y) => x - y), m = b.length >> 1; return b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2; };
// Mức "trường hợp tốn": 9/10 lần thấp hơn mức này (hạng gần nhất). Deep Research, tạo ảnh có lần gấp nhiều lần trung vị
const phanVi90 = a => { if (!a.length) return null; const b = [...a].sort((x, y) => x - y); return b[Math.min(b.length - 1, Math.ceil(0.9 * b.length) - 1)]; };
const tron = (x, n = 2) => Math.round(x * 10 ** n) / 10 ** n;

// plans: kế hoạch đã lưu; runs: nhật ký lượt chạy (máy chủ giữ 300 lượt gần nhất); trongSo(run): token quy đổi của lượt
function thongKeChiPhi(plans, runs, trongSo = r => r.tokens || 0) {
  const theoBuoc = new Map(), theoDuAn = new Map();
  for (const r of runs || []) {
    if (!r.planId || !(r.costUsd > 0)) continue;
    theoDuAn.set(r.planId, (theoDuAn.get(r.planId) || 0) + r.costUsd);
    if (!r.step) continue;
    const k = `${r.planId}#${r.step}`, x = theoBuoc.get(k) || { usd: 0, wtok: 0 };
    x.usd += r.costUsd; x.wtok += trongSo(r);
    theoBuoc.set(k, x);
  }
  const mau = {}, chung = {}, heSo = [];
  for (const p of plans || []) {
    let gocUsd = 0, du = true;
    (p.steps || []).forEach((s, i) => {
      const x = theoBuoc.get(`${p.id}#${i + 1}`);
      if (s.status !== 'done' || !x) { if (buocGoc(s)) du = false; return; }
      const loai = loaiBuoc(s);
      for (const o of [((mau[s.agentId] = mau[s.agentId] || {})[loai] = mau[s.agentId][loai] || []), (chung[loai] = chung[loai] || [])]) o.push(x);
      if (buocGoc(s)) gocUsd += x.usd;
    });
    // Chỉ dự án xong mà nhật ký còn đủ lượt chạy (tổng các lượt khớp chi phí dự án)
    const tong = theoDuAn.get(p.id);
    if (p.status === 'done' && du && gocUsd > 0 && tong && p.costUsd && Math.abs(tong - p.costUsd) <= 0.1 * p.costUsd) heSo.push(tong / gocUsd);
  }
  const gon = list => ({ usd: tron(trungVi(list.map(x => x.usd))), cao: tron(phanVi90(list.map(x => x.usd))), wtok: Math.round(trungVi(list.map(x => x.wtok))), n: list.length });
  const buoc = {};
  for (const [id, theoLoai] of Object.entries(mau)) { buoc[id] = {}; for (const [loai, list] of Object.entries(theoLoai)) buoc[id][loai] = gon(list); }
  const tatCa = {};
  for (const [loai, list] of Object.entries(chung)) tatCa[loai] = gon(list);
  return { buoc, chung: tatCa, heSo: heSo.length ? tron(trungVi(heSo), 1) : null, soDuAn: heSo.length };
}

// steps: [{ agent | agentId, checks }] của kế hoạch nháp. Thiếu số liệu của người đó thì lấy trung vị cả nhóm cùng loại bước.
function uocTinhKeHoach(steps, tk) {
  if (!tk) return null;
  let usd = 0, cao = 0, wtok = 0, coSo = 0, doan = 0;
  for (const s of steps || []) {
    const loai = s.checks ? 'review' : 'work', rieng = (tk.buoc[s.agent || s.agentId] || {})[loai], x = rieng || tk.chung[loai];
    if (!x) continue;
    usd += x.usd; cao += x.cao; wtok += x.wtok; coSo++;
    if (!rieng) doan++;
  }
  if (!coSo) return null;
  return { usd: tron(usd), cao: tron(cao), wtok, thieu: (steps || []).length - coSo, doan,
    caDuAn: tk.heSo ? { usd: tron(usd * tk.heSo), cao: tron(cao * tk.heSo), wtok: Math.round(wtok * tk.heSo) } : null };
}

module.exports = { thongKeChiPhi, uocTinhKeHoach, loaiBuoc };
