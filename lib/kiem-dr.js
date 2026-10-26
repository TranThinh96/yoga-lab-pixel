'use strict';
// Lượt kiểm Deep Research gọn: máy chủ tự gọi một lượt Claude rất ngắn (chỉ công cụ Chrome, không brief, không bối cảnh,
// không đọc hay ghi file) để xem Gemini xong chưa. Xong thì lượt đó gọi get_page_text một lần; máy chủ bắt nguyên văn kết quả
// công cụ trong luồng stream-json và tự ghi vào file báo cáo, agent không phải chép lại (chép lại tốn token đầu ra).
// Dự án thử 25/10: mỗi lượt kiểm của Mai (đủ hướng dẫn riêng, bối cảnh, đọc brief) tốn ~$0,30–0,39, ~70% là ghi cache.

function promptKiemDr(link) {
  return [
    'Việc rất ngắn, chỉ dùng công cụ Chrome (claude-in-chrome). Không đọc, không ghi file nào. Không chụp màn hình.',
    `1. Gọi tabs_context_mcp với createIfEmpty: true, mở một tab mới bằng tabs_create_mcp rồi navigate tới: ${link}`,
    '2. Dùng find MỘT lần, tìm cả hai loại dấu hiệu. ĐANG CHẠY: dòng tiến độ kiểu "Researching…", "Đang nghiên cứu", nút dừng nghiên cứu. ĐÃ XONG: thẻ báo cáo (tiêu đề báo cáo kèm nút "Open"/"Mở"), nút "Export"/"Xuất"/"Share & Export", hoặc đoạn báo cáo dài có danh sách nguồn. Không gửi tin nhắn mới, không tải lại để chờ.',
    '3. Thấy dấu hiệu đang chạy và không thấy dấu hiệu đã xong: trả lời đúng hai chữ: ĐANG CHẠY',
    '4. Thấy dấu hiệu đã xong: báo cáo nằm trong thẻ thì bấm mở thẻ đó. Rồi gọi get_page_text MỘT lần với max_chars: 200000. Máy chủ tự lưu kết quả công cụ này: KHÔNG chép lại, KHÔNG tóm tắt. Rồi trả lời đúng một chữ: XONG',
    '5. Không thấy dấu hiệu nào: KHÔNG đoán. Gọi get_page_text MỘT lần với max_chars: 200000 để xem trang. Có toàn văn báo cáo: trả lời XONG. Có dấu hiệu đang chạy: ĐANG CHẠY. Vẫn không rõ: trả lời "KHÔNG RÕ: " kèm một câu tả trang đang hiện gì.',
    '6. Trang báo lỗi, đòi đăng nhập, hết hạn mức hay không mở được: trả lời "LỖI: " kèm nguyên văn thông báo.'
  ].join('\n');
}

// Bắt kết quả get_page_text trong luồng stream-json của Claude Code: ghi id của lời gọi, rồi lấy văn bản kết quả khớp id.
// Gọi nhiều lần thì giữ bản dài nhất.
function taoBoBatTrang() {
  const ids = new Set();
  const bo = {
    text: '',
    napGoi(c) { if (c && c.type === 'tool_use' && /get_page_text$/.test(c.name || '')) ids.add(c.id); },
    napKetQua(c) {
      if (!c || c.type !== 'tool_result' || !ids.has(c.tool_use_id) || c.is_error) return;
      const t = Array.isArray(c.content) ? c.content.map(x => x && x.type === 'text' ? x.text : '').join('\n') : String(c.content || '');
      if (t.trim().length > bo.text.length) bo.text = t.trim();
    }
  };
  return bo;
}

// Kết luận của lượt kiểm từ câu trả lời cuối và trang đã bắt được.
// → { loai: 'xong', baoCao } | { loai: 'dang-chay' } | { loai: 'loi', lyDo } | { loai: 'khong-ro', lyDo }
const BAO_CAO_TOI_THIEU = 1500; // ký tự: ngắn hơn thì không phải toàn văn báo cáo (có thể chỉ là khung trang)
function ketLuanKiem(traLoi, trang = '') {
  const t = String(traLoi || '').trim(), dau = t.split('\n')[0].trim();
  if (/^\**\s*LỖI\b/iu.test(dau) || /HẾT HẠN MỨC/iu.test(t)) return { loai: 'loi', lyDo: t.replace(/^\**\s*LỖI\s*:?\s*/iu, '').slice(0, 300) || 'Gemini báo lỗi' };
  if (/^\**\s*ĐANG CHẠY\b/iu.test(dau)) return { loai: 'dang-chay' };
  if (/^\**\s*XONG\b/iu.test(dau)) {
    return String(trang).length >= BAO_CAO_TOI_THIEU ? { loai: 'xong', baoCao: String(trang) }
      : { loai: 'khong-ro', lyDo: trang ? `trang lấy được quá ngắn (${String(trang).length} ký tự)` : 'không lấy được toàn văn báo cáo' };
  }
  return { loai: 'khong-ro', lyDo: t ? `câu trả lời không rõ: ${t.slice(0, 120)}` : 'không có câu trả lời' };
}

// Dòng "Trạng thái:" (agent hay in đậm hoặc gạch đầu dòng); cùng mẫu với trangThaiDr của máy chủ
const DONG_TRANG_THAI = /^([\s>*_-]*Trạng thái[\s*_]*:[\s*_]*)(.*)$/imu;
function capNhatTrangThai(text, giaTri) {
  const t = String(text || '');
  if (DONG_TRANG_THAI.test(t)) return t.replace(DONG_TRANG_THAI, (_, dau) => dau + giaTri);
  const dong = t.split('\n'), i = dong.findIndex(x => /^[\s>*_-]*Link[\s*_]*:/iu.test(x));
  dong.splice(i >= 0 ? i + 1 : 0, 0, `Trạng thái: ${giaTri}`);
  return dong.join('\n');
}

// File báo cáo sau khi lấy được toàn văn: giữ các dòng đầu (Link, Bắt đầu, Model…), đổi trạng thái thành xong, rồi nguyên văn
function ghiBaoCaoDr(cu, baoCao, luc) {
  const dau = String(cu || '').split('\n').filter(x => /^[\s>*_-]*(Link|Bắt đầu|Model|Ngày)[\s*_]*:/iu.test(x)).map(x => x.trim());
  return [...dau, 'Trạng thái: xong', `Lấy báo cáo: ${luc} (máy chủ lưu nguyên văn kết quả get_page_text)`, '', String(baoCao).trim(), ''].join('\n');
}

// Phần thân (bỏ các dòng đầu dạng "Khoá: giá trị"): để biết file đã có toàn văn chưa
const thanBaoCao = text => String(text || '').split('\n').filter(x => !/^[\s>*_-]*(Link|Trạng thái|Bắt đầu|Model|Ngày|Lấy báo cáo)[\s*_]*:/iu.test(x)).join('\n').trim();

module.exports = { promptKiemDr, taoBoBatTrang, ketLuanKiem, capNhatTrangThai, ghiBaoCaoDr, thanBaoCao, BAO_CAO_TOI_THIEU };
