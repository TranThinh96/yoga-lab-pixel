# Đợt 3 · Tự học có phân loại gốc lỗi

Đọc [README.md](README.md) trước. Cần Đợt 0, 1, 2 đã xong: sổ vấn đề (`plan.issues`), bộ não (`lib/ghi-chu.js`, `lib/tri-thuc.js`, `ghiTriThuc`), gói ngữ cảnh.
Nên có ít nhất một dự án đã chạy với sổ vấn đề, để có dữ liệu thật.

**Mục tiêu đợt:**
- Mỗi lỗi được xếp vào một **gốc**, và đi tới đúng nơi sửa:

  | Gốc | Đi tới |
  |---|---|
  | `agent` | bài học |
  | `quy-trinh` | đề xuất sửa quy trình (bạn duyệt) |
  | `cong-cu` | danh sách lỗ hổng cho người phát triển |
  | `moi-truong` | note nguồn, kiểm trước khi chạy |
  | `tri-thuc` | bộ não |
- Bài học có vòng đời và chỉ hiện ở đúng loại bước. Lỗi còn tái phạm thì lên bậc.
- Hướng dẫn vai chỉ đổi khi bạn bấm duyệt.

**Số liệu làm căn cứ** (đã chạy thử luật phân loại ở 3.3 trên 67 bài học hiện có):
- 17/67 bài đã được chữa bằng thay đổi hệ thống ở Đợt 0–2, nên không cần nằm trong lời dặn agent nữa;
- 25/67 bài có gốc không phải lỗi của agent.

| Mục | Việc | File chính |
|---|---|---|
| 3.1 | Danh mục gốc lỗi; gán gốc cho vấn đề | `lib/bai-hoc.js`, `server.js` |
| 3.2 | Bài học thành note có vòng đời; `kinh-nghiem.md` thành bản xem | `lib/bai-hoc.js`, `server.js` |
| 3.3 | Chuyển 67 bài học cũ sang dạng mới | `scripts/chuyen-bai-hoc.js` |
| 3.4 | Gói ngữ cảnh chỉ đưa bài học hợp bước; checklist bậc 2 | `lib/bai-hoc.js`, `server.js` (`buildPrompt`) |
| 3.5 | Đếm tái phạm, lên bậc | `lib/bai-hoc.js`, `server.js` (`finishPlan`) |
| 3.6 | Hồi cứu trong nghiệm thu | `server.js` (`finishPlan`) |
| 3.7 | Đề xuất cải tiến: duyệt, sửa, bỏ, hoàn tác | `server.js`, `public/index.html` |
| 3.8 | Mẫu tốt | `server.js`, `lib/tri-thuc.js` |
| 3.9 | Lỗ hổng hệ thống | `server.js` |
| 3.10 | README.md | `README.md` |

---

## 3.1 Danh mục gốc lỗi; gán gốc cho vấn đề

**Làm**
1. `lib/bai-hoc.js`:
   ```js
   const GOC = ['agent', 'quy-trinh', 'cong-cu', 'moi-truong', 'tri-thuc'];
   // Gốc mặc định theo loại lỗi; điều phối viên có thể sửa lúc hồi cứu
   const GOC_MAC_DINH = { 'lech-hai-file': 'quy-trinh', 'file-khong-ton-tai': 'cong-cu', 'anh-sai-thu-muc': 'cong-cu', 'link-chet': 'moi-truong' };
   const gocCua = loai => GOC_MAC_DINH[loai] || 'agent';
   ```
2. `ganVanDe` (Đợt 1) thêm trường `goc: gocCua(r.loai)`.
   Vấn đề máy chủ tự tạo ở 1.7: `goc` là `agent` nếu lý do có `Commons không có file này` (tên file sai), còn lại `moi-truong`.

---

## 3.2 Bài học thành note có vòng đời

**Note** `tri-thuc/bai-hoc/BH-<n>.md`:
```markdown
---
loai: bai-hoc
ma: BH-17
goc: agent
pham_vi: agent:lam
ap_dung_khi:
  - fix
  - slides
loai_loi: lech-hai-file
bac: 1
lan_tai_pham: 0
lan_hieu_qua: 0
trang_thai: moi
ngay: 2026-10-17
tu_van_de: []
---
Sau khi sửa dòng Hình, mở thiet-ke.md đối chiếu từng trang, không chỉ sửa theo danh sách được giao.
```

Giá trị các trường:
- `pham_vi`: `nhom` (cả nhóm), `agent:<id>`, hoặc `chu-de:<chủ đề>`.
- `ap_dung_khi`: loại bước (`work`, `review`, `rereview`, `fix`) và loại file (`nguon`, `slides`, `thiet-ke`, `anh`). Rỗng nghĩa là mọi lúc.
- `bac`: 1 bài học, 2 checklist, 3 máy kiểm, 4 đổi quy trình.
- `trang_thai`: `moi`, `hieu-qua`, `khong-hieu-qua`, `da-thang-cap`, `huy`.
- Số `n` trong `ma` tăng dần, lấy số lớn nhất đang có cộng 1.

**Làm**
1. `lib/bai-hoc.js`:
   - `taoBaiHoc({ ma, goc, pham_vi, ap_dung_khi, loai_loi, noi_dung, ngay, trang_thai = 'moi', ghi_chu })` → nội dung note (dùng `vietGhiChu`).
     Có `ghi_chu` thì thêm mục `## Ghi chú` sau nội dung.
   - `docBaiHoc(notes)` → `[{ ma, data, noi_dung }]` từ kết quả `docKhoTriThuc` (mở rộng `docKhoTriThuc` của 2.5 đọc cả `tri-thuc/bai-hoc/`).
2. `server.js` → `vietKinhNghiem(agentId)`: viết lại `agents/<id>/kinh-nghiem.md` thành **bản xem**:
   ```
   # Kinh nghiệm của <Tên>

   > Máy chủ tự sinh từ tri-thuc/bai-hoc/. Sửa bài học trong Obsidian (note BH-…), không sửa ở đây.

   - [BH-17] (checklist) <nội dung>
   - [BH-3] <nội dung>
   ```
   - chỉ lấy bài `trang_thai` khác `huy` và `da-thang-cap`, `pham_vi` là `agent:<id>` hoặc `nhom`;
   - bậc 2 ghi `(checklist)` ngay sau mã;
   - gọi sau mỗi lần bài học đổi.
3. `appendLessons` và `trimLessons` (cũ) không dùng nữa khi `config.brain !== false`. Giữ code cho trường hợp tắt bộ não.

---

## 3.3 Chuyển 67 bài học cũ sang dạng mới

Script chạy **một lần** trên workspace thật. Kết quả là dữ liệu, nên commit riêng: `3.3 dữ liệu: chuyển bài học sang tri-thuc/bai-hoc/`.

**Làm** `scripts/chuyen-bai-hoc.js` (Node, không thư viện; nhận đường dẫn workspace làm tham số):
1. Đọc mọi `workspace/agents/<id>/kinh-nghiem.md`. Mỗi dòng `- …` là một bài:
   - bỏ tiền tố `(…)`;
   - lấy ngày `yyyy-mm-dd` trong tiền tố nếu có, không có thì `2026-10-16`.
2. Phân loại bằng hàm thuần `phanLoaiBaiHoc(text)` trong `lib/bai-hoc.js`. Bản dưới đã chạy thử trên 67 bài thật:
   ```js
   // Loại lỗi đoán theo từ khoá (khớp luật đầu tiên)
   const LOAI_THEO_TU = [
     [/dấu câu|chính tả|lặp từ|câu cụt|tân ngữ|trọn nghĩa/iu, 'chinh-ta-dau-cau'],
     [/đếm chữ|quá chữ|ngưỡng ~?\d+/iu, 'qua-chu'],
     [/hinh-moi|thư mục ảnh|vị trí file|nằm đúng|giờ sửa file/iu, 'anh-sai-thu-muc'],
     [/dòng hình|đối chiếu chéo|khớp với|lệch|cần giao lam/iu, 'lech-hai-file'],
     [/đã sửa|tự khai|100%|báo đã/iu, 'bao-cao-sai-su-that'],
     [/\b404\b|\b403\b|captcha|recaptcha|mở link|link thật/iu, 'link-chet'],
     [/chống chỉ định|ccđ|cấp cứu|115|an toàn/iu, 'an-toan-thieu-ccd'],
     [/phóng đại|tuyệt đối|hứa hẹn|"chữa"|khẳng định/iu, 'phong-dai'],
     [/đạo cụ|tư thế|gạch|ghế|chăn|prompt|ngón|người mẫu/iu, 'anh-sai-tu-the'],
     [/nguồn|trích|gán|pmc|pubmed|mức bằng chứng/iu, 'nguon-khong-khop'],
     [/brief|mục lục|thiếu mục/iu, 'thieu-muc-brief']
   ];
   // Bài học mà Đợt 0–2 đã chữa bằng thay đổi hệ thống: đổi gốc và đánh dấu đã thăng cấp
   const DOI_GOC = [
     [/hinh-moi|vị trí file trong output|giờ sửa file/iu, 'cong-cu', 'Máy chủ đặt ảnh sai thư mục (sửa ở 0.4)'],
     [/cần giao lam/iu, 'quy-trinh', 'Đã thành luật giao sửa theo chủ file (1.3)'],
     [/115/u, 'tri-thuc', 'Là một sự thật: đưa vào bộ não thành ý có nguồn'],
     [/đếm chữ từng trang bằng tay/iu, 'cong-cu', 'Đã có soat_loi đếm chữ (0.13)'],
     [/grep chính file vừa sửa|đối chiếu bàn giao với file thật|báo "đã sửa" khi file chưa đổi|báo đã sửa/iu, 'cong-cu', 'Máy chủ đối chiếu file đã ghi (0.8, 1.4)'],
     [/statpearls|nih ods|captcha|recaptcha/iu, 'moi-truong', 'Tình trạng truy cập ghi trong note nguồn (1.9, 2.4)']
   ];
   function phanLoaiBaiHoc(text) {
     const t = String(text || '').normalize('NFC');
     const loai = (LOAI_THEO_TU.find(([re]) => re.test(t)) || [null, 'khac'])[1];
     const doi = DOI_GOC.find(([re]) => re.test(t));
     return doi ? { loai_loi: loai, goc: doi[1], trang_thai: 'da-thang-cap', ghi_chu: doi[2] }
       : { loai_loi: loai, goc: gocCua(loai), trang_thai: 'moi', ghi_chu: '' };
   }
   ```
   (`\b404\b`, `\b403\b` đứng sau chữ số ASCII nên dùng `\b` được.)
3. `ap_dung_khi` đoán theo từ khoá (gộp mọi luật khớp):
   - `/duyệt/` → `review`;
   - `/sửa|bước sửa/` → `fix`;
   - `/ảnh|prompt|tư thế|người mẫu/` → `anh`;
   - `/nguồn|link|trích/` → `nguon`;
   - `/slide|dòng hình|mục lục|kịch bản/` → `slides`;
   - `/thiết kế|thiet-ke|danh sách hình/` → `thiet-ke`.
4. `pham_vi: agent:<id>`, `bac: 1`.
   Bỏ bài trùng trong cùng agent bằng `locBaiHocMoi` (0.2); khi trùng, giữ bản mới hơn.
5. Ghi note `BH-1`… theo thứ tự agent rồi thứ tự dòng. Gọi `vietKinhNghiem` cho mọi agent.
6. Ghi báo cáo `tri-thuc/he-thong/chuyen-bai-hoc.md`: bảng `| Mã | Agent | Loại | Gốc | Trạng thái | Ghi chú | Nội dung (60 ký tự) |`, để bạn xem lại cách phân loại.

**Kiểm thử** `phanLoaiBaiHoc` với các câu thật (chép nguyên văn từ `kinh-nghiem.md` hiện tại):

| Câu bắt đầu bằng | Kết quả |
|---|---|
| Hạ: "Khi có thư mục ảnh tạm (hinh-moi/)…" | `goc: cong-cu`, `da-thang-cap` |
| Chef: "Bàn giao nào có dòng 'CẦN GIAO LAM'…" | `goc: quy-trinh`, `da-thang-cap` |
| Mai: "Tìm nguồn Việt Nam (Bộ Y tế) cho số cấp cứu 115…" | `goc: tri-thuc`, `da-thang-cap` |
| Lam: "Đếm chữ từng trang bằng tay khi viết…" | `goc: cong-cu`, `da-thang-cap` |
| An: "Khi duyệt kịch bản, rà cả những câu an toàn do chính mình viết…" | `loai_loi: an-toan-thieu-ccd`, `goc: agent`, `moi` |
| Lam: "Đọc lại từng ý trên slide như một câu trọn nghĩa…" | `loai_loi: chinh-ta-dau-cau`, `goc: agent` |

Chạy cả 67 bài: đúng **17** bài `da-thang-cap`.

---

## 3.4 Gói ngữ cảnh chỉ đưa bài học hợp bước; checklist bậc 2

**Làm**
1. `lib/bai-hoc.js` → `nhanBuoc({ kind, task, files, agent })`: nhãn của bước =
   - loại bước (`work` khi không có);
   - `slides` nếu nhiệm vụ hoặc file có `slides.md`;
   - `thiet-ke` nếu có `thiet-ke.md`;
   - `nguon` nếu có `-nguon.md`, hoặc agent dùng Deep Research;
   - `anh` nếu agent tạo ảnh (`geminiWeb.mode === 'image'`, engine `antigravity`), hoặc có `/hinh/`.
2. `chonBaiHoc(baiHoc, { agentId, nhan, chuDe }, max = 12)`:
   - giữ bài `trang_thai` là `moi`, `hieu-qua` hoặc `khong-hieu-qua`;
   - giữ bài có `pham_vi` là `nhom`, `agent:<agentId>` hoặc `chu-de:<chuDe>`;
   - giữ bài có `ap_dung_khi` rỗng hoặc có nhãn chung với `nhan`;
   - sắp xếp: `bac` giảm dần, rồi `lan_tai_pham` giảm dần, rồi `ngay` mới trước; cắt `max`.
3. `goiNguCanh` (2.8) thêm hai phần, đặt **trước** phần "Trong bộ não…":
   ```
   Checklist bắt buộc (ghi mã kèm "đã kiểm" vào mục Tự kiểm của bàn giao):
   - [BH-17] <nội dung>
   Bài học của bạn:
   - [BH-3] <nội dung>
   ```
4. `buildPrompt`, khi `config.brain !== false`: thay dòng
   `` `B. Đọc agents/${agent.id}/kinh-nghiem.md (bài học của chính bạn từ dự án trước) và áp dụng.`, ``
   bằng
   `` `B. Áp dụng bài học và checklist trong phần BỐI CẢNH (máy chủ đã chọn đúng những bài hợp với bước này). Checklist bắt buộc: ghi mã [BH-…] kèm "đã kiểm" vào mục "Tự kiểm theo brief" của bàn giao.`, ``
5. Sau mỗi bước: nếu gói có checklist mà mục "Tự kiểm" của bàn giao không nhắc mã `[BH-n]` nào trong số đó, ghi `plan.log`: `Bước <n>: chưa ghi checklist <mã>`.
   Không chặn bước. Số lần này được đếm cho hồi cứu.
6. Kiểm thử `chonBaiHoc`:
   - bài `ap_dung_khi: ['anh']` không ra cho bước `slides`;
   - bài `pham_vi: agent:an` không ra cho Lam;
   - bài bậc 2 đứng đầu;
   - bài `da-thang-cap` không ra.

---

## 3.5 Đếm tái phạm, lên bậc

**Làm** `lib/bai-hoc.js` → `danhGiaBaiHoc(baiHoc, vanDe, { batDau, nguoiThamGia, nhanTheoNguoi })` → danh sách thay đổi `{ ma, sua: {…}, deXuat? }`. Đầu vào:
- `vanDe`: các vấn đề BẮT BUỘC của dự án;
- `batDau`: ngày tạo dự án;
- `nhanTheoNguoi`: nhãn các bước mỗi người đã làm.

Cách tính:
- Với mỗi bài đang hiệu lực, có `loai_loi` khác `khac`, và có ngày **trước** `batDau`:
  - đếm vấn đề cùng `kind` do người trong phạm vi bài gây ra (`owner` là người đó, hoặc bất kỳ ai nếu `pham_vi: nhom`);
  - có ít nhất 1 → `lan_tai_pham + 1`, `trang_thai: khong-hieu-qua`;
  - không có, mà người đó đã làm bước có nhãn khớp `ap_dung_khi` → `lan_hieu_qua + 1`. Khi `lan_hieu_qua >= 2` và `lan_tai_pham === 0` thì `trang_thai: hieu-qua`.
- Lên bậc khi `trang_thai` vừa thành `khong-hieu-qua`:
  - bậc 1 → 2: **tự động** (checklist rủi ro thấp); ghi `plan.log`;
  - bậc 2 → 3: không tự đổi. Thêm một dòng vào lỗ hổng (3.9): `Cần luật máy soát cho: <nội dung bài>`, kèm một đề xuất loại `len-bac` (3.7) để bạn biết;
  - bậc 3 → 4: đề xuất loại `sua-huong-dan` hoặc `quy-trinh`, chờ bạn duyệt.

Gọi trong `finishPlan` sau khi xử lý JSON nghiệm thu, rồi ghi lại các note bài học (`ghiTriThuc`) và `vietKinhNghiem`.

**Kiểm thử:**
- bài `lech-hai-file` của Lam, có từ trước dự án; dự án có 2 vấn đề `lech-hai-file` của Lam → `lan_tai_pham: 1`, `bac: 2`;
- cùng bài mà dự án không có vấn đề loại đó, Lam đã làm bước `slides` → `lan_hieu_qua + 1`.

---

## 3.6 Hồi cứu trong nghiệm thu

Thay phần "lessons" của nghiệm thu. Gộp vào **cùng lượt nghiệm thu** của điều phối viên để khỏi tốn thêm một lượt.

**Làm** trong `finishPlan`:
1. Máy chủ tính khối số liệu (hàm thuần `thongKeHoc(plan, runsCuaDuAn, baiHoc)` trong `lib/bai-hoc.js`):
   ```
   SỐ LIỆU ĐỂ RÚT KINH NGHIỆM (máy chủ tổng hợp):
   - Vấn đề BẮT BUỘC theo người và loại: <Tên>: <loai> ×<n>, …
   - Theo gốc mặc định: agent <n>, quy-trinh <n>, cong-cu <n>, moi-truong <n>, tri-thuc <n>
   - Bài học tái phạm (có từ trước, vẫn lỗi cùng loại): [BH-17] (<Tên>, <loai>) …
   - Công cụ bị chặn: <Tên> gọi Bash <n> lần, …   (đếm act "Dùng công cụ Bash/PowerShell" trong các lượt của dự án)
   - Checklist chưa ghi: <n> lần (3.4)
   - Câu trả lời của chủ dự án khác phương án nhóm đề xuất: <các câu, tối đa 5>
   ```
   Dòng cuối là tín hiệu mạnh nhất. Lấy những câu trả lời không `tuQuyet` trong `plan.answers` mà nội dung khác phần "Đề xuất" của câu hỏi.
2. Trong việc giao cho điều phối viên, thay bước 4 hiện tại (`4. Rút 1–3 bài học cụ thể…`) bằng:
   ```
   4. Đọc SỐ LIỆU ĐỂ RÚT KINH NGHIỆM ở trên. Với mỗi lỗi lặp lại, tự hỏi gốc ở đâu: agent làm sai (bài học), thiếu bước hay giao sai người (quy trình), máy chủ hay công cụ lỗi (lỗ hổng), trang web hay tài khoản (môi trường), hay thiếu một sự thật (tri thức). Ghi vào mục "hoc" của khối JSON; KHÔNG tự sửa kinh-nghiem.md hay tri-thuc/.
   ```
3. Khối JSON cuối cùng thêm mục `hoc` (giữ `score`, `fixes`):
   ```json
   {"score": 0, "fixes": [], "hoc": {
     "bai_hoc_moi": [{"pham_vi": "agent:lam", "ap_dung_khi": ["fix", "slides"], "loai_loi": "lech-hai-file", "goc": "agent", "noi_dung": "…"}],
     "gop": [{"giu": "BH-3", "bo": ["BH-9"], "noi_dung": "…"}],
     "sua_huong_dan": [{"agent": "lam", "cu": "<đoạn nguyên văn đang có trong hướng dẫn>", "moi": "<đoạn thay thế>", "ly_do": "…"}],
     "lo_hong": [{"mo_ta": "…", "bang_chung": "…"}],
     "mau_tot": [{"file": "output/<chu-de>/slides.md", "vi_tri": "Trang 12", "kieu": "trang-slide", "ly_do": "…"}]
   }}
   ```
   Câu dặn trong việc giao ghi rõ: `bai_hoc_moi` chỉ cho gốc `agent`; gốc khác thì đưa vào `lo_hong` hoặc `sua_huong_dan`; mỗi người tối đa 3 bài.
4. Máy chủ áp dụng (hàm `apDungHoc(hoc, …)`):
   - `bai_hoc_moi`:
     - lọc trùng với bài cùng phạm vi bằng `locBaiHocMoi`;
     - ghi note mới, `bac: 1`;
     - bài có `goc` khác `agent` thì **không** ghi thành bài học, mà chuyển sang `lo_hong` (cong-cu, quy-trinh) hoặc một note ý nháp trong bộ não (tri-thuc);
   - `gop`: cập nhật nội dung bài `giu`, đặt bài `bo` thành `huy` kèm ghi chú `gộp vào <giu>`. Không cần duyệt (sửa lại được trong Obsidian);
   - `sua_huong_dan`: thành đề xuất (3.7), **chờ bạn duyệt**;
   - `lo_hong`: ghi vào lỗ hổng (3.9);
   - `mau_tot`: 3.8.
5. Vẫn nhận kiểu cũ: JSON có `lessons` mà không có `hoc` thì coi mỗi bài là `bai_hoc_moi` với `pham_vi: agent:<id>`, `goc: agent`, `loai_loi: khac`.
6. Kiểm thử `apDungHoc` với một `hoc` mẫu đủ 5 mục: đúng số note bài học mới (bỏ bài trùng); bài gốc `cong-cu` vào lỗ hổng; `sua_huong_dan` thành đề xuất chờ duyệt.

---

## 3.7 Đề xuất cải tiến: duyệt, sửa, bỏ, hoàn tác

**Dữ liệu** `.yogalab/de-xuat.json`:
```json
[{ "id": "DX-1", "loai": "sua-huong-dan", "agent": "lam", "cu": "…", "moi": "…", "ly_do": "…", "planId": "…", "at": "…", "trang_thai": "cho" }]
```
- `loai`: `sua-huong-dan`, `len-bac`, `tu-tranh` (thêm từ cần tránh vào `thuat-ngu.md`).
- `trang_thai`: `cho`, `duyet`, `bo`, `hoan-tac`.

**Làm**
1. Hàm thuần `lib/bai-hoc.js` → `apDungSuaHuongDan(instructions, cu, moi)`:
   - trả về chuỗi mới khi `cu` xuất hiện **đúng một lần** trong `instructions`;
   - không có thì `{ loi: 'Không tìm thấy đoạn cũ trong hướng dẫn (có thể đã đổi).' }`;
   - xuất hiện nhiều lần thì `{ loi: 'Đoạn cũ xuất hiện nhiều lần; sửa tay.' }`.
2. API (`server.js`):
   - `GET /api/de-xuat` → danh sách.
   - `POST /api/de-xuat` với `{ id, hanhDong: 'duyet' | 'bo' | 'sua' | 'hoan-tac', moi? }`:
     - `duyet` hoặc `sua`, loại `sua-huong-dan`: chép `config.json` vào `.yogalab/config-cu/<stamp>.json` trước, rồi `apDungSuaHuongDan`, `saveConfig()`, `broadcast({ type: 'agents', … })`;
     - `duyet`, loại `tu-tranh`: thêm dòng vào bảng "Từ cần tránh" của `thuat-ngu.md`. Bạn đã duyệt nên máy chủ được ghi;
     - `duyet`, loại `len-bac`: chỉ đánh dấu đã xem (việc đã nằm ở lỗ hổng);
     - `hoan-tac`: áp dụng ngược (`moi` → `cu`) nếu `moi` còn nguyên trong hướng dẫn;
   - phát sự kiện SSE `{ type: 'de-xuat', list }` sau mỗi lần đổi.
3. `public/index.html`, cửa sổ **Dự án** (`renderPlan`): nếu có đề xuất `cho`, hiện khối ở đầu:
   ```html
   <div class="plan-note"><b>Đề xuất cải tiến (<n>)</b>
     <div class="dx"> <!-- mỗi đề xuất -->
       <p><b>DX-1</b> · <Tên agent> · <lý do></p>
       <p class="muted">Cũ: <cu></p><p>Mới: <textarea data-dx-moi="DX-1">moi</textarea></p>
       <button class="btn sm primary" data-dx="duyet:DX-1">Duyệt</button>
       <button class="btn sm" data-dx="sua:DX-1">Sửa rồi duyệt</button>
       <button class="btn sm" data-dx="bo:DX-1">Bỏ</button>
     </div>
   </div>
   ```
   Đề xuất `duyet` trong 7 ngày gần nhất hiện nút "Hoàn tác". Mọi giá trị qua `esc()`. Nút **Dự án** ở thanh dưới có dấu `!` khi có đề xuất chờ (giống dấu của Bảng việc).
4. Kiểm thử `apDungSuaHuongDan`: đủ ba trường hợp.

---

## 3.8 Mẫu tốt

**Làm**
1. Khi áp dụng `hoc.mau_tot` (tối đa 2 mỗi dự án, chỉ khi điểm nghiệm thu `>= passScore`):
   - đọc file; nếu `vi_tri` có dạng `Trang <n>` thì lấy mục `## Trang <n> …` tới tiêu đề `## ` kế tiếp, không thì lấy 1.200 ký tự đầu;
   - ghi `tri-thuc/mau-tot/<kieu>-<n>.md`, frontmatter `{ loai: mau-tot, kieu, nguon_file, plan, ly_do }`, thân là đoạn trích (cắt 1.500 ký tự).
2. `goiNguCanh` thêm phần `Ví dụ đạt chuẩn (từ <plan>):` với **một** mẫu có `kieu` khớp nhãn bước:
   - `slides` → `trang-slide`;
   - `anh` → `prompt-anh`;
   - `nguon` hoặc `review` → `kiem-chung`.

   Không có thì bỏ phần này.

---

## 3.9 Lỗ hổng hệ thống

**Làm** `tri-thuc/he-thong/lo-hong.md` (máy chủ chỉ **thêm dòng**, không sửa dòng cũ):
```markdown
# Lỗ hổng hệ thống

> Máy chủ ghi những lỗi không phải của agent: lỗi máy chủ, thiếu công cụ, cần luật soát mới. Người phát triển đọc và sửa; sửa xong thì đánh dấu [x].

- [ ] (2026-11-02, plan-…) <mô tả> — <bằng chứng>
```
Nguồn ghi: `hoc.lo_hong`, bài học gốc `cong-cu`/`quy-trinh` (3.6), lên bậc 2→3 (3.5).
Thêm `[[he-thong/lo-hong]]` vào bản đồ bộ não (2.5), kèm số dòng chưa đánh dấu.

---

## 3.10 Cập nhật README.md

Thêm mục **"Nhóm tự học thế nào"**:
1. Lỗi trong sổ vấn đề có loại và gốc. Chỉ lỗi gốc `agent` mới thành bài học; gốc khác đi vào lỗ hổng hệ thống, bộ não hoặc đề xuất sửa quy trình.
2. Bài học nằm trong `tri-thuc/bai-hoc/`. Agent chỉ thấy bài hợp với bước đang làm. Lỗi còn lặp lại thì bài học thành checklist bắt buộc.
3. Đề xuất sửa hướng dẫn vai hiện ở cửa sổ Dự án; chỉ áp dụng khi bạn bấm Duyệt, và hoàn tác được.
4. `agents/<id>/kinh-nghiem.md` giờ do máy chủ sinh để xem; sửa bài học trong Obsidian.

---

## Xong Đợt 3 khi

- `npm test` qua hết, `node --check server.js` không lỗi, thử khởi động không lỗi.
- Đã chạy `scripts/chuyen-bai-hoc.js` trên workspace thật: 17 bài `da-thang-cap`, báo cáo `chuyen-bai-hoc.md` đã có.
- Chủ dự án làm phần **Đợt 3** trong [thu-tren-may.md](thu-tren-may.md).

## Phát hiện thêm

(Người triển khai ghi vào đây.)
