'use strict';
// Gốc của một bước (đánh số từ 1): đi theo checks/fixOf/contOf về bước làm ban đầu
function gocBuoc(steps, k) {
  for (let n = 0; n < 50; n++) { const s = steps[k - 1]; const t = s && (s.checks || s.fixOf || s.contOf); if (!t) return k; k = t; }
  return k;
}
// Bước idx (đánh số từ 0) chạy được chưa: phụ thuộc là bước duyệt thì chỉ cần bước đó xong;
// là bước làm/sửa thì cần bản cuối của sản phẩm đó (mọi bước cùng gốc đứng trước idx đã xong)
function sanSang(steps, idx) {
  const s = steps[idx];
  const deps = new Set([...(s.from && s.from.length ? s.from : idx > 0 ? [idx] : []), ...(s.checks ? [s.checks] : [])]);
  for (const d of deps) {
    const b = steps[d - 1];
    if (!b) continue;
    if (b.checks) { if (b.status !== 'done') return false; continue; }
    const g = gocBuoc(steps, d);
    for (let j = 0; j < idx; j++) if (gocBuoc(steps, j + 1) === g && steps[j].status !== 'done') return false;
  }
  return true;
}
// Chọn các bước bắt đầu ngay. max = 1 giữ đúng cách chạy tuần tự cũ.
function chonBuocChay(steps, { max = 1, dangBan = new Set() } = {}) {
  if (steps.some(s => s.status === 'error')) return [];
  const dangLam = steps.filter(s => s.status === 'working');
  if (max <= 1) {
    if (dangLam.length) return [];
    const idx = steps.findIndex(s => s.status !== 'done');
    return idx >= 0 && steps[idx].status === 'pending' ? [idx] : [];
  }
  const out = [], ban = new Set([...dangBan, ...dangLam.map(s => s.agentId)]);
  for (let idx = 0; idx < steps.length && dangLam.length + out.length < max; idx++) {
    const s = steps[idx];
    if (s.status !== 'pending' || ban.has(s.agentId)) continue;
    if (steps.slice(0, idx).some(x => x.agentId === s.agentId && x.status !== 'done')) continue;
    if (!sanSang(steps, idx)) continue;
    out.push(idx); ban.add(s.agentId);
  }
  return out;
}
// Bước chèn giữa chừng (giao ban) ở chỉ số at (từ 0), k bước: các bước chờ phía sau phải chờ chúng,
// vì chạy song song thì một bước chỉ chờ những bước trong from của nó
function choBuocChen(steps, at, k) {
  const moi = Array.from({ length: k }, (_, i) => at + 1 + i);
  for (const s of steps.slice(at + k)) if (s.status === 'pending') s.from = [...new Set([...(s.from || []), ...moi])];
}
// Agent dùng Gemini trên web ghi "HẾT HẠN MỨC GEMINI: đặt lại lúc 20:01 (Limit resets Oct 25, 8:01 PM)".
// Trả về { dong, at }: at là giờ làm mới + 2 phút dự phòng (null nếu không đọc được giờ). Không có dòng đó: null.
// Giờ vừa qua chưa tới 30 phút (agent ghi chậm) thì chạy lại ngay sau 2 phút, không hẹn sang hôm sau.
function hetHanMucGemini(text, now = new Date()) {
  const m = /HẾT HẠN MỨC GEMINI\s*:?[ \t]*([^\n]*)/iu.exec(String(text || '').normalize('NFC'));
  if (!m) return null;
  const dong = m[1].trim();
  let g = /lúc\s+(\d{1,2})\s*[:hg]\s*(\d{2})/iu.exec(dong), h = null, min = 0;
  if (g) { h = Number(g[1]); min = Number(g[2]); }
  else if ((g = /\b(\d{1,2}):(\d{2})\s*(am|pm)\b/i.exec(dong))) { h = Number(g[1]) % 12 + (/pm/i.test(g[3]) ? 12 : 0); min = Number(g[2]); }
  if (h === null || h > 23 || min > 59) return { dong, at: null };
  const t = new Date(now); t.setHours(h, min, 0, 0);
  if (t <= now) {
    if (now - t < 30 * 60e3) return { dong, at: new Date(now.getTime() + 120e3) };
    t.setDate(t.getDate() + 1);
  }
  return { dong, at: new Date(t.getTime() + 120e3) };
}
// Deep Research nhiều pha: việc tiếp theo sau một lượt, theo dòng "Trạng thái:" của file báo cáo.
// coFileKhac: bước đã ghi file sản phẩm khác file báo cáo (vd file nguồn) thì việc tổng hợp đã làm rồi.
// Hạn chờ tính theo tổng số phút từ lúc khởi chạy (Deep Research có lúc quá 60 phút); mỗi lần kiểm tốn một lượt Chrome
// nên giãn dần 10 → 15 → 20 phút. Hết hạn thì không chạy lại ngay (chỉ thêm một lần kiểm vô ích), để lập lại kế hoạch.
// ghiFileDr: lượt này có ghi file báo cáo không. Pha 1 không ghi thì dòng Trạng thái là của lượt cũ (dự án thử 25/10:
// Mai làm qua Gemini chat, file cũ còn "đang chạy" từ một Deep Research treo, máy chủ chờ nhầm)
function buocSauDr({ pha, trangThai = '', ghiFileDr = true, coFileKhac = false, lanKiem = 0, phutDaCho = 0, choToiDa = 150, tongHopRieng = true }) {
  if (pha === 1 && !ghiFileDr) return coFileKhac ? { loai: 'xong' } : { loai: 'loi', lyDo: 'Deep Research chưa khởi chạy được (không ghi file báo cáo)' };
  const xong = /^xong/i.test(trangThai);
  if (pha !== 3 && /^đang chạy/i.test(trangThai)) {
    if (pha === 1) return { loai: 'cho', pha: 2 };
    if (phutDaCho < choToiDa) return { loai: 'kiem-lai', lanKiem: lanKiem + 1, phut: Math.max(1, Math.min(20, Math.round(choToiDa - phutDaCho), 10 + 5 * lanKiem)) };
    // Chạy lại hay lập lại kế hoạch không làm Gemini nhanh hơn: tạm dừng chờ bạn xem cuộc chat
    return { loai: 'loi', lyDo: `Gemini chưa xong sau ${Math.round(phutDaCho)} phút`, khongChayLai: true, tamDung: true };
  }
  // Pha 1 không khởi chạy được (Gemini lỗi, kẹt ở bước lập kế hoạch): lỗi bước, không chuyển file nguồn chưa có cho người duyệt
  if (pha === 1 && !xong && !coFileKhac) return { loai: 'loi', lyDo: `Deep Research chưa khởi chạy được (Trạng thái: ${(trangThai || 'không ghi').slice(0, 200)})` };
  if (pha !== 3 && tongHopRieng && xong && !coFileKhac) return { loai: 'tong-hop', pha: 3 };
  return { loai: 'xong' };
}
module.exports = { gocBuoc, sanSang, chonBuocChay, choBuocChen, hetHanMucGemini, buocSauDr };
