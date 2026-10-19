'use strict';
// Bản đồ workspace (index.md) do máy chủ viết: ngắn, chỉ cấu trúc + dự án gần đây + sản phẩm mới nhất.
// Trước đây agent tự thêm dòng nên file dài mãi, mà lượt nào cũng đọc nó đầu tiên.

// Cùng chữ với PLAN_TXT trong public/index.html
const TRANG_THAI = { planning: 'Đang lập kế hoạch', draft: 'Chờ bạn duyệt', running: 'Đang chạy', replanning: 'Đang lập lại kế hoạch', reviewing: 'Đang nghiệm thu', paused: 'Tạm dừng', asking: 'Chờ bạn trả lời', done: 'Xong', stopped: 'Đã dừng', error: 'Lỗi' };

function vietBanDo({ plans = [], topics = [], coTriThuc = false, coBanCu = false } = {}) {
  const L = ['# Bản đồ Yoga Lab', '',
    '> Máy chủ tự cập nhật file này sau mỗi lượt. Đừng sửa tay: ghi chú của bạn để trong tri-thuc/.', '',
    '## Cấu trúc',
    '- sources/ — tài liệu gốc (chỉ đọc)',
    '- templates/ — mẫu kịch bản slide và quy tắc thiết kế (chỉ đọc)',
    '- handoff/ — bàn giao giữa các agent',
    '- agents/<id>/ — nháp riêng; agents/<id>/kinh-nghiem.md là bài học của người đó',
    '- du-an/<mã>/ — brief.md, bang.md (bảng dự án), nghiem-thu.md',
    '- output/<chủ đề>/ — sản phẩm cuối'];
  if (coTriThuc) L.push('- tri-thuc/ — bộ não chung, bắt đầu từ tri-thuc/00-ban-do.md');
  L.push('', '## Dự án gần đây');
  const ps = plans.slice(0, 3);
  if (!ps.length) L.push('(chưa có)');
  for (const p of ps) {
    const ten = p.topic || String(p.goal || '').replace(/\s+/g, ' ').trim().slice(0, 60);
    const tt = (TRANG_THAI[p.status] || p.status) + (p.score != null ? `, ${p.score}/100` : '');
    const file = p.nghiemThu ? ` · nghiệm thu: ${p.nghiemThu}` : p.brief ? ` · brief: ${p.brief}` : '';
    L.push(`- ${p.id} · ${ten} · ${tt}${file}`);
  }
  L.push('', '## Sản phẩm mới nhất');
  const ts = topics.slice(0, 3);
  if (!ts.length) L.push('(chưa có)');
  for (const t of ts) {
    const files = (t.files || []).slice(0, 6).map(f => `${f.path.split('/').pop()}${f.by ? ` (${f.by})` : ''}`);
    L.push(`- output/${t.ten}/: ${files.join(', ') || '(chưa có file .md)'}`);
  }
  if (coBanCu) L.push('', 'Bản đồ cũ (agent tự ghi trước đây): luu-tru/index-cu.md');
  return L.join('\n') + '\n';
}

module.exports = { vietBanDo, TRANG_THAI };
