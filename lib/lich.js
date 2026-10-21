'use strict';
// Gốc của một bước (đánh số từ 1): đi theo checks/fixOf về bước làm ban đầu
function gocBuoc(steps, k) {
  for (let n = 0; n < 50; n++) { const s = steps[k - 1]; const t = s && (s.checks || s.fixOf); if (!t) return k; k = t; }
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
module.exports = { gocBuoc, sanSang, chonBuocChay };
