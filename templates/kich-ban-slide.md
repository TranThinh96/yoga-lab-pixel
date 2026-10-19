# Mẫu kịch bản slide

Dùng khi việc được giao là "slide", "bài trình bày" hay "workshop có slide".
Kịch bản ghi vào `output/<chu-de>/slides.md` (tên chủ đề viết thường, không dấu, nối bằng gạch ngang, ví dụ `output/suy-giap/slides.md`).
Đây là bản để người dựng slide làm theo (trong Canva), nên phải đủ để dựng mà không cần hỏi lại.

## Đầu file

```
# <Tên workshop>
- Đối tượng: <ví dụ: học viên yoga, không chuyên y>
- Thời lượng: <ví dụ: 60 phút, khoảng 25 trang>
- Giảng viên: <tên, nếu có>
- Thông điệp chính: <1 câu, ví dụ: "Yoga không thay thế y khoa, mà phối hợp song song">
- Phong cách: theo templates/thiet-ke.md, bảng màu <tên bảng màu>
```

## Có slide mẫu trong sources/ thì mẫu là khung

Nếu `sources/` có slide mẫu (vd `sources/slide-mau-suy-giap.md` + thư mục ảnh chụp từng trang), **mẫu là chuẩn**: giữ đủ số trang, đúng thứ tự, đúng tiêu đề và loại trang của mẫu. Chỉ chèn thêm 2 trang mẫu thiếu: **An toàn & chống chỉ định** và **Nguồn tham khảo**. Đầu file có bảng "trang mẫu → trang mới". Muốn gộp/tách/bỏ trang mẫu thì ghi lý do vào "Việc còn mở", không tự làm.
Số liệu trong mẫu chưa được kiểm: vẫn cần nguồn và An duyệt; không có nguồn thì giữ ý, bỏ con số.

## Mạch bài nên theo (theo slide mẫu suy giáp, sửa cho hợp chủ đề)

1. Bìa: tên workshop, giảng viên, ngày giờ
2. Mở đầu: định nghĩa 1 câu, chữ thật to
3. Nội dung (5 mục)
4. Cơ thể hoạt động thế nào: giải phẫu, cấu trúc ("nhà máy"), chức năng theo từng hệ cơ quan, nguyên lý điều hoà (ẩn dụ: nhà máy, quản lý, chân ga…), phân loại
5. Khi có vấn đề: nguyên nhân chính (1 trang riêng), nguyên nhân khác, biểu hiện toàn thân, biến chứng, ai có nguy cơ, nhóm đặc biệt
6. Giải pháp: Venn "y khoa ∩ yoga", **y khoa đi trước** (các bước), rồi khung yoga (vd "Cân bằng phục hồi 5 điểm")
7. Thực hành theo khung: tập luyện đúng cách → **An toàn & chống chỉ định** (bắt buộc, 1 trang) → mỗi tư thế một trang → hít thở → thư giãn → ăn uống → tinh thần/thiền
8. Tóm lược: 3 điều mang về
9. Nguồn tham khảo

## Mỗi trang viết theo khuôn này

```
## Trang <số> · <Tiêu đề trang>
- Loại: bìa | mục lục | khái niệm | sơ đồ | bảng | so sánh | tư thế | danh sách | trích dẫn | tóm lược
- Ý chính:
  - <tối đa 8 khối/ý; trang y khoa có thể là thẻ "tiêu đề đậm: 1–2 câu" như mẫu>
- Câu chốt: <1 câu ngắn in to, nếu có>
- Hình: <loại hình> · <mô tả ngắn hình cần có> (agent Thiết kế sẽ viết chi tiết)
- Nguồn: <[1], [2] — số thứ tự trong mục Nguồn tham khảo cuối file>
- Lời giảng: <2–4 câu giảng viên nói, giọng gần gũi>
- An toàn: <chống chỉ định / lưu ý, bắt buộc với trang tư thế>
```

## Quy tắc

- **Mật độ chữ theo mẫu:** trang y khoa/infographic tối đa **~90 chữ** trên slide, chia thẻ có tiêu đề in đậm; trang mở đầu, câu trích, tóm lược ngắn hơn. Giải thích thêm để ở "Lời giảng".
- **Trang tư thế:** trên slide **chỉ có tên tư thế + ảnh** (như mẫu), "Ý chính" để "—". Đạo cụ, cách vào/ra, bản nhẹ hơn, thời gian giữ ghi trong "Lời giảng"; chống chỉ định ghi trong "An toàn" (giảng viên nói, và đã có trên trang An toàn chung).
- Tiêu đề trang ngắn, theo mẫu (vd "Hít thở đúng cách"), không đổi thành câu hỏi.
- Mọi số liệu và nhận định y khoa phải có nguồn. Không có nguồn thì bỏ, hoặc ghi rõ "kinh nghiệm thực hành, chưa có nghiên cứu".
- Không dùng từ tuyệt đối kiểu "chữa khỏi", "thần thánh", "chắc chắn". Yoga là **hỗ trợ**.
- Trang tư thế phải có: tên Việt + tên Phạn, đạo cụ (gạch, gối, chăn), cách làm nhẹ hơn, chống chỉ định.
- Tư thế đảo ngược, chồng đầu, gập sâu: ghi rõ ai không nên tập (cao huyết áp, tăng nhãn áp, đau cổ, đang mang thai…).
- **Không dùng Cái cày (Halasana), Cây nến, Chồng đầu** trong workshop phục hồi. Tư thế ngửa cổ (Con cá) chỉ dùng bản **có đỡ** (gạch thấp dưới lưng trên và dưới đầu), có chống chỉ định đau/thoát vị cổ.
- Viết đúng chính tả, không lặp từ ("nồng độ độ", "Nội Nội Môi").

## Cuối file

```
## Nguồn tham khảo
[1] <Tác giả>, <Tên bài>, <Tạp chí/Nơi đăng>, <Năm>. <link>
[2] …

## Việc còn mở
- <điều chưa chắc, cần chuyên gia/giảng viên xem lại>
```

## Ví dụ một trang

```
## Trang 7 · Nguyên lý hoạt động của tuyến giáp
- Loại: sơ đồ
- Ý chính:
  - Vùng dưới đồi tiết TRH
  - Tuyến yên tiết TSH
  - Tuyến giáp sản xuất T3, T4
  - Đủ T3/T4 thì não ra lệnh ngừng (ức chế ngược)
- Câu chốt: Giống như chân ga điều chỉnh tốc độ của cơ thể.
- Hình: sơ đồ dòng chảy · 3 hộp xếp dọc nối bằng mũi tên, một mũi tên vòng ngược lại ghi "ức chế ngược"
- Nguồn: [3]
- Lời giảng: Tuyến giáp không tự làm việc một mình. Nó nhận lệnh từ não qua hai tầng… Suy giáp xảy ra khi vòng này bị đứt ở đâu đó.
- An toàn: —
```
