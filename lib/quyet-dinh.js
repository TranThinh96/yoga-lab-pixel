'use strict';
// Sổ quyết định của chủ dự án qua các dự án: để điều phối viên không hỏi lại điều đã quyết,
// và để ô trả lời gợi ý sẵn câu trả lời cũ khi câu hỏi giống câu đã hỏi.
const { giongNhau, NGUONG_CAU_HOI } = require('./van-ban');

// Câu trả lời máy chủ tự điền (bạn không trả lời): nhóm tự quyết theo phương án đề xuất
const laTuQuyet = a => /^\((Chủ dự án để nhóm tự quyết|Đã hỏi đủ số lần)/u.test(String(a || '').normalize('NFC').trim());
const soId = d => Number((/^QD-(\d+)$/.exec(d.id || '') || [])[1]) || 0;
const thoiGian = d => new Date(d.at || 0).getTime() || 0;

// Ghi các quyết định mới; câu giống câu đã có (cùng chủ đề) thì thay bằng bản mới, giữ id cũ
function ghiQuyetDinh(list, moi) {
  const out = (list || []).slice();
  for (const x of Array.isArray(moi) ? moi : [moi]) {
    if (!x || !x.q || /^\(Giống câu đã trả lời/u.test(String(x.a || '').trim())) continue; // bản sao của câu đã có
    const d = { ...x, topic: x.topic || null, tuQuyet: laTuQuyet(x.a) };
    const i = out.findIndex(y => (y.topic || null) === d.topic && giongNhau(y.q, d.q) >= NGUONG_CAU_HOI);
    if (i >= 0) out[i] = { ...d, id: out[i].id };
    else out.push({ id: `QD-${Math.max(0, ...out.map(soId)) + 1}`, ...d });
  }
  return out;
}

// Quyết định giống câu hỏi nhất: ưu tiên cùng chủ đề, rồi bạn trả lời (không tự quyết), rồi mới hơn
function goiYChoCauHoi(list, q, topic) {
  const ung = (list || []).map(d => ({ d, g: giongNhau(d.q, q) })).filter(x => x.g >= NGUONG_CAU_HOI);
  ung.sort((x, y) => (!!topic && y.d.topic === topic) - (!!topic && x.d.topic === topic)
    || (x.d.tuQuyet ? 1 : 0) - (y.d.tuQuyet ? 1 : 0) || thoiGian(y.d) - thoiGian(x.d) || y.g - x.g);
  return ung.length ? ung[0].d : null;
}

// Quyết định đưa vào lúc lập kế hoạch: của bạn ở mọi chủ đề, cộng quyết định tự quyết cùng chủ đề
function quyetDinhChoKeHoach(list, topic, max = 10) {
  const cung = d => !!topic && d.topic === topic;
  return (list || []).filter(d => !d.tuQuyet || cung(d))
    .sort((x, y) => cung(y) - cung(x) || (x.tuQuyet ? 1 : 0) - (y.tuQuyet ? 1 : 0) || thoiGian(y) - thoiGian(x))
    .slice(0, max);
}

// Bản Markdown để xem trong Obsidian, nhóm theo chủ đề (chủ đề có quyết định mới nhất lên trước)
function vietSoQuyetDinh(list) {
  const mot = s => String(s || '').replace(/\s+/g, ' ').trim();
  const nhom = new Map();
  for (const d of list || []) {
    const k = d.topic || 'Chung';
    if (!nhom.has(k)) nhom.set(k, []);
    nhom.get(k).push(d);
  }
  const moiNhat = ds => Math.max(...ds.map(thoiGian));
  const L = ['# Sổ quyết định', '', '> Máy chủ tự sinh từ .yogalab/quyet-dinh.json. Sửa câu trả lời trong giao diện Yoga Lab, không sửa ở đây.'];
  if (!nhom.size) L.push('', '(chưa có)');
  for (const [k, ds] of [...nhom].sort((a, b) => moiNhat(b[1]) - moiNhat(a[1]))) {
    L.push('', `## ${k}`);
    for (const d of ds.slice().sort((a, b) => soId(a) - soId(b))) {
      L.push(`- **${d.id}** (${d.planId || '?'}, ${String(d.at || '').slice(0, 10)}) ${d.tuQuyet ? '*nhóm tự quyết*' : 'bạn trả lời'}`,
        `  - Hỏi: ${mot(d.q)}`, `  - Trả lời: ${mot(d.a)}`);
    }
  }
  return L.join('\n') + '\n';
}

module.exports = { ghiQuyetDinh, goiYChoCauHoi, quyetDinhChoKeHoach, vietSoQuyetDinh, laTuQuyet };
