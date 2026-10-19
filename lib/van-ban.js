'use strict';
// Xử lý chữ tiếng Việt dùng chung: bỏ dấu, so độ giống giữa hai câu, tìm chủ đề trong đường dẫn.

// Từ nối bỏ qua khi so độ giống (đã bỏ dấu)
const STOP = new Set('va la cua cho co khong nhung thi de duoc mot cac nay do khi hay hoac voi trong tren duoi theo neu se da dang rat cung ve ra vao tu den nguoi nhom phai can bi lai con chi moi nhu sau truoc thay'.split(' '));
const NGUONG_BAI_HOC = 0.6;  // đo trên kinh-nghiem.md thật: cặp trùng ≥ 0,60, cặp khác ≤ 0,57
const NGUONG_CAU_HOI = 0.65; // đo trên 27 câu hỏi thật: cặp trùng ≥ 0,67, cặp khác ≤ 0,53

const boDau = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();

// Tập từ khoá: bỏ dấu, bỏ ngày trong ngoặc "(2026-10-17, …)", bỏ từ một ký tự và từ nối
function tuKhoa(s) {
  const t = boDau(s).replace(/\([^)]*\d{4}-\d{2}-\d{2}[^)]*\)/g, ' ').replace(/[^a-z0-9]+/g, ' ');
  return new Set(t.split(' ').filter(w => w.length >= 2 && !STOP.has(w)));
}

// Độ giống 0–1 = số từ khoá chung / số từ khoá của câu ngắn hơn.
// Câu quá ngắn (dưới 6 từ khoá) chỉ coi là giống khi trùng hẳn.
function giongNhau(a, b) {
  const A = tuKhoa(a), B = tuKhoa(b), min = Math.min(A.size, B.size);
  if (min < 6) return boDau(a).replace(/\s+/g, ' ').trim() === boDau(b).replace(/\s+/g, ' ').trim() ? 1 : 0;
  let chung = 0;
  for (const w of A) if (B.has(w)) chung++;
  return chung / min;
}

// Vị trí phần tử đầu tiên của list giống s từ ngưỡng trở lên; không có thì -1
const timGiong = (s, list, nguong) => list.findIndex(x => giongNhau(s, x) >= nguong);

// Chủ đề từ đường dẫn output/<chủ đề>/ đầu tiên trong đoạn chữ ("output/<chu-de>/" mẫu thì không tính)
function chuDeTu(text) {
  const m = /output\/([\p{L}\p{N}_.-]+)\//u.exec(String(text || '').normalize('NFC'));
  return m ? m[1] : null;
}

// Bài học mới không trùng bài cũ, cũng không trùng nhau trong cùng đợt
function locBaiHocMoi(list, cu, nguong = NGUONG_BAI_HOC) {
  const da = [...cu], out = [];
  for (const x of list) if (timGiong(x, da, nguong) < 0) { out.push(x); da.push(x); }
  return out;
}

// Chia câu hỏi trong bàn giao: giống câu đã trả lời (kèm vị trí câu đó), giống câu đang chờ (bỏ), hay thật sự mới
function phanLoaiCauHoi(list, daTraLoi, dangCho, nguong = NGUONG_CAU_HOI) {
  const moi = [], trung = [];
  for (const q of list) {
    const i = timGiong(q, daTraLoi, nguong);
    if (i >= 0) { trung.push({ q, i }); continue; }
    if (timGiong(q, [...dangCho, ...moi], nguong) >= 0) continue;
    moi.push(q);
  }
  return { moi, trung };
}

module.exports = { boDau, tuKhoa, giongNhau, timGiong, chuDeTu, locBaiHocMoi, phanLoaiCauHoi, NGUONG_BAI_HOC, NGUONG_CAU_HOI };
