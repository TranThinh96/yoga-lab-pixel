# Quy tắc thiết kế slide Yoga Lab

Agent Thiết kế đọc file này cùng `output/<chu-de>/slides.md`, rồi ghi `output/<chu-de>/thiet-ke.md`: mỗi trang một mục, nói rõ bố cục và hình cần dùng.
Mục tiêu là cả bộ slide trông như **một người làm**: một bảng màu, một kiểu chữ, một người mẫu, một phong cách minh hoạ.

**Có slide mẫu trong `sources/` thì phong cách của mẫu là chuẩn.** Mở ảnh chụp từng trang (vd `sources/slide-mau-suy-giap/trang-xx`) và dựng trang mới **cùng bố cục, cùng loại hình, cùng mật độ** với trang mẫu tương ứng; mỗi trang ghi "Theo mẫu tr.x" và chỉ nêu chỗ khác mẫu (kèm lý do). Phong cách mẫu suy giáp tóm ở `sources/slide-mau-suy-giap.md`, mục "Phong cách chung".

## Bảng màu

Chọn **một** bảng cho cả bộ, ghi tên ở đầu file thiết kế.

**Xô thơm (mặc định, hợp chủ đề phục hồi, nội tiết, phụ nữ)**
| Vai trò | Màu |
|---|---|
| Nền chính | `#E4ECDF` (xanh xô thơm nhạt) |
| Nền phụ / thẻ | `#FFFFFF`, `#F4F1E8` |
| Chữ tiêu đề, khối đậm | `#3E5F45` (xanh rêu đậm) |
| Điểm nhấn phụ | `#8A9A5B` (ô liu), `#E3CFAE` (be cát) |
| Cảnh báo, chữ nhấn | `#C2654F` (đất nung) |
| Chữ thường | `#2E3829` |

**Oải hương (hợp chủ đề não bộ, thần kinh, cảm xúc)**
| Vai trò | Màu |
|---|---|
| Nền | `#F3EFF8` |
| Tiêu đề, khối đậm | `#4B2E83` |
| Điểm nhấn | `#B497D6`, `#D9A441` (vàng) |
| Cảnh báo | `#C2654F` |
| Chữ thường | `#2B2440` |

## Kiểu chữ

- Tiêu đề: chữ có chân, mềm (Lora hoặc Playfair Display), cỡ 36–48.
- Nội dung: Be Vietnam Pro (đọc tốt tiếng Việt), cỡ 16–24. Trang y khoa/infographic tối đa **~90 chữ** (như mẫu), chia thẻ có tiêu đề đậm; trang mở đầu, câu trích, tư thế ít chữ.
- Câu chốt / trích dẫn: chữ nghiêng có chân, cỡ 24–28.
- Không dùng quá 2 họ chữ trong cả bộ.

## Bố cục

- Khổ 16:9. Trang chữ ít (mở đầu, câu trích) để nhiều khoảng trống; trang infographic được phủ kín như mẫu.
- Bìa: chữ bên trái (khoảng 55%), hình lớn bên phải tràn mép; có tên giảng viên và ngày giờ.
- Trang mở chương / tiêu đề ngắn: **nhãn bo tròn xanh rêu đậm, chữ trắng in hoa** (như mẫu tr.2, 4, 8).
- Trang khái niệm: thẻ chữ bo góc bên trái, hình minh hoạ bên phải.
- **Trang infographic y khoa** (cấu trúc, chức năng, nguyên nhân, triệu chứng, biến chứng, nguy cơ): nhiều màu, mỗi khối có hình nhỏ + tiêu đề đậm + 1–2 dòng; nhãn tiếng Việt đặt ngay trên hình (thêm trong Canva). Kiểu: lưới thẻ quanh hình trung tâm, bản đồ cơ thể có chấm nối, 3 tầng mũi tên đậm dần, vòng tròn biểu tượng, Venn, dòng thời gian.
- **Trang tư thế: chỉ nhãn tên tư thế (bo tròn, xanh rêu đậm, chữ trắng in hoa) ở trên + 1 ảnh lớn ngang ở dưới**, không chữ khác. Hai tư thế ngắn có thể chung 1 trang, 2 ảnh cạnh nhau (như mẫu tr.22).
- Sơ đồ, bảng, dòng thời gian: **dựng bằng hình khối trong Canva**, không dùng ảnh AI.
- Mỗi trang chỉ một điểm nhấn màu đất nung (thường là cảnh báo).

## Bốn loại hình và cách lấy

### A. Minh hoạ nét mảnh (khái niệm, biểu tượng KHÔNG phải y khoa: năng lượng, nghỉ ngơi, hơi thở…)
Tạo bằng AI. **Không** dùng cho cơ thể, cơ quan, cơ chế bệnh, triệu chứng, thuốc, xét nghiệm: những hình đó là loại C. Prompt tiếng Anh theo khuôn:
```
Minimal fine line illustration of <chủ thể>, thin dark green strokes (#3E5F45) on a soft sage background (#E4ECDF),
subtle beige watercolor accents (#E3CFAE), a few botanical leaves, lots of empty space on the <left/right>,
calm and gentle mood, no text, no letters, no labels, 16:9
```

### B. Ảnh tư thế yoga (người thật)
Tạo bằng AI, **dùng cùng một người mẫu cho cả bộ**. Mô tả người mẫu viết một lần ở đầu file thiết kế rồi chép y nguyên vào mọi prompt:
```
Photorealistic photo of the same Vietnamese woman in her early 30s, shoulder-length black hair,
sage green sports bra and high-waist shorts (#9FB49A), practicing <tư thế, mô tả vị trí tay chân>,
supported by <teal foam yoga blocks / a round bolster / folded blankets>, on a dark grey yoga mat,
warm beige wall, monstera plants in the background, soft natural window light from the left,
<side view / three-quarter view>, full body in frame, calm relaxed face, no text, 16:9
```
Kiểm tra trước khi dùng: đúng tư thế, khớp gối và cổ không bị vặn sai, đủ ngón tay chân, đạo cụ đặt hợp lý.
Mô tả người mẫu trên **khớp người mẫu trong slide mẫu suy giáp**: không đổi tuổi hay trang phục (vd sang áo dài tay, người trung niên) trừ khi chủ dự án yêu cầu. Ảnh tư thế là ảnh ngang, thấy trọn người và đạo cụ, đặt như mẫu (tr.19–22).

### C. Hình y khoa và giải phẫu (cơ quan, tuyến, vị trí trên cơ thể, cơ chế hormone/bệnh, triệu chứng, thuốc, xét nghiệm)
**Không bao giờ dùng AI**, kể cả hình đơn giản hay biểu tượng: AI hay vẽ sai cấu trúc, và người học dễ tin là hình y khoa thật. Dùng nguồn có giấy phép, ghi tác giả và giấy phép ở góc ảnh. Không tìm được hình phù hợp thì dựng sơ đồ khối Canva theo nguồn (loại E), không viết prompt AI:
- OpenStax Anatomy & Physiology 2e (CC BY 4.0): https://openstax.org/details/books/anatomy-and-physiology-2e
- Wikimedia Commons (lọc giấy phép CC BY / CC BY-SA / Public domain): https://commons.wikimedia.org
- Servier Medical Art (CC BY 4.0): https://smart.servier.com
- Cancer Research UK diagrams trên Wikimedia Commons (CC BY-SA 4.0), NIH/NCI (Public domain)
**Thư viện hình thật:** lúc research, Mai ghi bảng "## Hình & sơ đồ trong nguồn" và máy chủ tải sẵn các hình [DÙNG ĐƯỢC] vào `output/<chu-de>/hinh-nguon/` (kèm `danh-sach.md`: link gốc, tác giả, giấy phép). Chọn hình từ đây trước, mở hình bằng Read để xem nhãn cần che.
Trong "Danh sách hình" (tiêu đề đúng `## Danh sách hình`, mỗi dòng một file, ô tên file bắt đầu bằng tên file): ghi `hinh-nguon/<tên file>` kèm link gốc, máy chủ chép sang `hinh/` với tên trang; hình chưa có trong thư viện thì ghi link trang File: của Commons hoặc link thẳng tới file .jpg/.png để máy chủ tải.
Nhãn tiếng Việt thêm bằng chữ trong Canva. **Không dùng ảnh scan từ sách giáo khoa**.
Để đạt độ màu và độ "infographic" như mẫu: ưu tiên Servier Medical Art (minh hoạ màu, tách được từng cơ quan/tế bào) và hình OpenStax màu; ghép nhiều hình nhỏ có giấy phép với khối Canva, nhãn Việt; tham khảo bố cục trang mẫu nhưng **không chép hình của mẫu**.

### D. Ảnh không khí (bìa, trang tóm lược, cảm xúc)
Ảnh AI hoặc ảnh có giấy phép miễn phí (Unsplash, Pexels). Tông ấm, ánh sáng tự nhiên, khớp bảng màu.

## Quy tắc chung cho ảnh AI

- **Không có chữ trong ảnh** (AI viết sai tiếng Việt). Mọi chữ thêm trong Canva.
- Cùng ánh sáng, cùng góc nhìn, cùng phông nền trong một loạt ảnh tư thế.
- Không vẽ máu, vết mổ, cảnh bệnh nặng gây sợ. Diễn tả bệnh bằng biểu tượng hoặc nét mặt mệt mỏi nhẹ.
- Tên file gợi ý: `trang-07-truc-giap.png`, để trong `output/<chu-de>/hinh/`.

## Khuôn file thiết kế (`output/<chu-de>/thiet-ke.md`)

```
# Thiết kế · <Tên workshop>
- Bảng màu: Xô thơm
- Font: Lora (tiêu đề) + Be Vietnam Pro (nội dung)
- Người mẫu: <mô tả cố định, chép vào mọi prompt ảnh tư thế>

## Trang 1 · <Tiêu đề>
- Bố cục: <mô tả vị trí chữ, hình, khối màu>
- Hình (A/B/C/D): <loại>
- Prompt: "<prompt tiếng Anh>"      ← với loại A, B, D tạo bằng AI
- Nguồn hình: <link · tác giả · giấy phép>   ← với loại C, D lấy sẵn
- Nhãn thêm trong Canva: <các nhãn tiếng Việt, nếu có>
- Ghi chú: <ví dụ: trang quá nhiều chữ, đề nghị tách đôi>

## Kiểm tra cả bộ
- [ ] Mỗi trang mẫu có trang tương ứng, đúng thứ tự, cùng bố cục (ghi "Theo mẫu tr.x")
- [ ] Trang nào quá ~90 chữ
- [ ] Trang tư thế chỉ có nhãn tên + ảnh; chống chỉ định nằm ở kịch bản và trang An toàn
- [ ] Hình nào chưa có nguồn hoặc giấy phép
- [ ] Ảnh tư thế có cùng một người mẫu không
```
