'use strict';
// Thiết lập chung đổi được trong cửa sổ Dự án → Cài đặt, khỏi sửa tay config.json.
// Chỉ những mục trong danh sách này; mỗi mục có kiểu và khoảng hợp lệ, máy chủ kiểm trước khi ghi.
// key có dấu chấm là mục lồng (vd stepModel.rereview); loai: so (số nguyên), bat (bật/tắt), chon (một trong danh sách, '' = bỏ).

const CAI_DAT = [
  { key: 'planTokenBudget', nhom: 'Dự án', loai: 'so', min: 0, max: 50000000, buoc: 500000, ten: 'Ngân sách mỗi dự án (token quy đổi)', mo: 'Chạm mức này thì dự án tạm dừng chờ bạn cho thêm. 0 = không giới hạn.' },
  { key: 'maxPlanSteps', nhom: 'Dự án', loai: 'so', min: 2, max: 20, ten: 'Kế hoạch dài nhất (bước)', mo: 'Điều phối viên chia việc tối đa bấy nhiêu bước.' },
  { key: 'maxParallel', nhom: 'Dự án', loai: 'so', min: 1, max: 4, ten: 'Số bước chạy cùng lúc', mo: '1 = tuần tự. Từ 2: các bước độc lập chạy song song, chỉ rút ngắn thời gian, không bớt token.' },
  { key: 'maxReviewRounds', nhom: 'Duyệt và nghiệm thu', loai: 'so', min: 0, max: 5, ten: 'Số vòng duyệt–sửa tối đa mỗi sản phẩm', mo: 'Người duyệt trả về "CẦN SỬA" tối đa bấy nhiêu vòng.' },
  { key: 'passScore', nhom: 'Duyệt và nghiệm thu', loai: 'so', min: 50, max: 100, ten: 'Điểm nghiệm thu đạt', mo: 'Dưới điểm này thì giao thêm vòng sửa rồi nghiệm thu lại.' },
  { key: 'maxFixRounds', nhom: 'Duyệt và nghiệm thu', loai: 'so', min: 0, max: 3, ten: 'Số vòng sửa sau nghiệm thu chưa đạt', mo: '' },
  { key: 'lintMaxWords', nhom: 'Duyệt và nghiệm thu', loai: 'so', min: 10, max: 200, ten: 'Số chữ tối đa trên một trang slide', mo: 'Máy soát lỗi báo trang quá số chữ này.' },
  { key: 'machineGate', nhom: 'Duyệt và nghiệm thu', loai: 'bat', ten: 'Cổng soát máy', mo: 'Trang quá chữ hay thiết kế lệch kịch bản thì trả về sửa ngay, trước khi tới người duyệt.' },
  { key: 'deepResearchTwoPhase', nhom: 'Gemini', loai: 'bat', ten: 'Deep Research hai pha', mo: 'Lượt 1 chỉ khởi chạy, máy chủ chờ (không tốn token) rồi gọi lượt sau lấy báo cáo.' },
  { key: 'drChoToiDa', nhom: 'Gemini', loai: 'so', min: 30, max: 600, buoc: 10, ten: 'Chờ Deep Research tối đa (phút)', mo: 'Quá mức này dự án tạm dừng chờ bạn mở cuộc chat Gemini xem.' },
  { key: 'drChiGemini', nhom: 'Gemini', loai: 'bat', ten: 'Agent Deep Research chỉ tìm nguồn qua Gemini', mo: 'Không dùng WebFetch, WebSearch của Claude (tốn token).' },
  { key: 'autoResumeOnLimit', nhom: 'Gemini', loai: 'bat', ten: 'Tự chạy tiếp khi hạn mức làm mới', mo: 'Hết hạn mức mà đọc được giờ làm mới thì tự chạy tiếp lúc đó.' },
  { key: 'labTools', nhom: 'Công cụ', loai: 'bat', ten: 'Công cụ máy chủ cho agent Claude', mo: 'Soát lỗi, kiểm link, tải hình, tra bộ não (qua MCP nội bộ).' },
  { key: 'consultTool', nhom: 'Công cụ', loai: 'bat', ten: 'Hỏi nhanh đồng nghiệp (thử nghiệm)', mo: 'Cần bật công cụ máy chủ. Mỗi dự án tối đa 3 lần.' },
  { key: 'buildSlides', nhom: 'Công cụ', loai: 'bat', ten: 'Tự dựng file .pptx khi dự án xong', mo: 'Không tốn token.' },
  { key: 'stepModel.review', nhom: 'Model và mức suy nghĩ theo loại bước', loai: 'chon', chon: ['', 'haiku', 'sonnet', 'opus'], ten: 'Model cho bước duyệt', mo: '(mặc định): model của người duyệt. Không áp dụng cho agent dùng Chrome.' },
  { key: 'stepModel.rereview', nhom: 'Model và mức suy nghĩ theo loại bước', loai: 'chon', chon: ['', 'haiku', 'sonnet', 'opus'], ten: 'Model cho bước duyệt lại', mo: 'Duyệt lại chỉ kiểm các vấn đề còn mở: haiku thường đủ và rẻ.' },
  { key: 'stepModel.fix', nhom: 'Model và mức suy nghĩ theo loại bước', loai: 'chon', chon: ['', 'haiku', 'sonnet', 'opus'], ten: 'Model cho bước sửa', mo: '(mặc định): model của người sửa.' },
  { key: 'stepEffort.rereview', nhom: 'Model và mức suy nghĩ theo loại bước', loai: 'chon', chon: ['', 'low', 'medium', 'high'], ten: 'Mức suy nghĩ tối đa khi duyệt lại', mo: 'Chỉ hạ, không nâng quá mức của agent. (mặc định): không hạ.' },
  { key: 'stepEffort.fix', nhom: 'Model và mức suy nghĩ theo loại bước', loai: 'chon', chon: ['', 'low', 'medium', 'high'], ten: 'Mức suy nghĩ tối đa khi sửa', mo: 'Chỉ hạ, không nâng quá mức của agent. (mặc định): không hạ.' }
];

const lay = (config, key) => key.split('.').reduce((o, k) => o == null ? undefined : o[k], config);

// → [{ ...mục, giaTri }] theo config hiện tại (config đã gộp mặc định)
const docCaiDat = config => CAI_DAT.map(m => { const v = lay(config, m.key); return { ...m, giaTri: m.loai === 'bat' ? v !== false : m.loai === 'chon' ? v || '' : Number(v) }; });

// patch: { key: giá trị }. → { moi: { key: giá trị đã chuẩn hoá } } hoặc { loi }
function kiemCaiDat(patch) {
  if (!patch || typeof patch !== 'object' || Array.isArray(patch)) return { loi: 'Thiếu thiết lập cần đổi' };
  const moi = {};
  for (const [k, v] of Object.entries(patch)) {
    const m = CAI_DAT.find(x => x.key === k);
    if (!m) return { loi: `Không đổi được "${k}" ở đây` };
    if (m.loai === 'bat') {
      if (typeof v !== 'boolean') return { loi: `${m.ten}: cần bật hoặc tắt` };
      moi[k] = v;
    } else if (m.loai === 'chon') {
      if (!m.chon.includes(v)) return { loi: `${m.ten}: chọn một trong ${m.chon.filter(Boolean).join(', ')} hoặc để trống` };
      moi[k] = v;
    } else {
      const n = Number(v);
      if (!Number.isFinite(n) || !Number.isInteger(n) || n < m.min || n > m.max) return { loi: `${m.ten}: cần số nguyên từ ${m.min} đến ${m.max}` };
      moi[k] = n;
    }
  }
  return Object.keys(moi).length ? { moi } : { loi: 'Thiếu thiết lập cần đổi' };
}

// Ghi các giá trị đã kiểm vào config. Mục lồng: chép object con rồi đổi một khoá; '' thì bỏ khoá đó
function datCaiDat(config, moi) {
  for (const [k, v] of Object.entries(moi)) {
    const [a, b] = k.split('.');
    if (!b) { config[a] = v; continue; }
    const con = { ...(config[a] || {}) };
    if (v === '') delete con[b]; else con[b] = v;
    config[a] = con;
  }
  return config;
}

module.exports = { CAI_DAT, docCaiDat, kiemCaiDat, datCaiDat };
