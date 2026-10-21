'use strict';
// Tự học: gốc lỗi, bài học có vòng đời, chọn bài hợp bước, đếm tái phạm, áp dụng kết quả hồi cứu.

const GOC = ['agent', 'quy-trinh', 'cong-cu', 'moi-truong', 'tri-thuc'];
// Gốc mặc định theo loại lỗi; điều phối viên có thể sửa lúc hồi cứu
const GOC_MAC_DINH = { 'lech-hai-file': 'quy-trinh', 'file-khong-ton-tai': 'cong-cu', 'anh-sai-thu-muc': 'cong-cu', 'link-chet': 'moi-truong' };
const gocCua = loai => GOC_MAC_DINH[loai] || 'agent';

module.exports = { GOC, GOC_MAC_DINH, gocCua };
