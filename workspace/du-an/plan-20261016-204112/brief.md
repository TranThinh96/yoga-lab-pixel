# Brief · Workshop "Yoga cân bằng phục hồi cho người suy giáp" (v5)

Thư mục chủ đề: `suy-giap-v5` → mọi sản phẩm cuối nằm trong `output/suy-giap-v5/`, nháp trong `agents/<id>/`.
Bản v4 (`output/suy-giap-v4/`) là bản trước: được đọc để tránh lặp lỗi, **không chép nguyên**; mọi ý dùng lại phải qua kiểm chứng lần này.

## Mục tiêu & người nhận
- **Người dùng trực tiếp:** giáo viên yoga Yoga Lab dựng slide trên Canva và giảng một buổi workshop 60 phút.
- **Người nghe:** học viên yoga, không chuyên y, phần lớn là phụ nữ trung niên. Có thể có người đang uống levothyroxine, người mới chẩn đoán Hashimoto, người cao tuổi, người có bệnh tim mạch hoặc huyết áp, đau cổ, đang mang thai hoặc sau sinh.
- **Bối cảnh:** lớp học trực tiếp. Có phần nói lý thuyết khoảng 25–30 phút, phần còn lại là thực hành nhẹ có đạo cụ (gạch, gối dài, chăn, ghế, dây).
- **Thế nào là "đạt":** học viên ra về hiểu tuyến giáp và suy giáp bằng ngôn ngữ đời thường, biết **thuốc và bác sĩ đi trước, yoga chỉ hỗ trợ**, và tự tập an toàn được 5 tư thế, 1 bài thở, 1 bài thư giãn. Giáo viên dựng được slide mà không cần hỏi lại.

## Sản phẩm cần giao
| File | Người làm | Định dạng / nội dung |
|---|---|---|
| `agents/mai/suy-giap-v5-nguon.md` | Mai | Nguồn theo từng phần ở mục "Tiêu chí 2": mỗi ý có link trực tiếp tới bài (PubMed/PMC/DOI hoặc trang cụ thể của tổ chức y tế), loại nghiên cứu, cỡ mẫu, mức bằng chứng; kèm danh sách hình giải phẫu có giấy phép |
| `agents/an/suy-giap-v5-kiem-chung.md` | An | Từng ý được đánh dấu Đúng/Sửa/Bỏ; danh sách link đã mở thử; 5 tư thế được duyệt kèm chống chỉ định; cảnh báo bắt buộc |
| `output/suy-giap-v5/slides.md` | Lam | Kịch bản slide theo `templates/kich-ban-slide.md`; mỗi trang ghi thêm dòng `- Thời gian: <phút>` |
| `agents/an/suy-giap-v5-kiem-slides.md` | An | Danh sách sửa slides.md theo trang (bắt buộc / nên / cần chuyên gia) |
| `output/suy-giap-v5/thiet-ke.md` | Vy | Thiết kế theo `templates/thiet-ke.md`, bảng màu Xô thơm, mỗi trang một mục |
| `agents/ha/suy-giap-v5-bien-tap.md` | Hạ | Kết quả duyệt thiết kế theo tiêu chí, danh sách lỗi chữ đã sửa trong slides.md |

Mỗi người viết bàn giao ngắn trong `handoff/` và thêm một dòng vào `index.md` khi tạo file.

## Tài liệu mẫu
Không có. `sources/` hiện đang trống. Chuẩn cấu trúc là `templates/kich-ban-slide.md` (mạch bài 10 phần, khuôn mỗi trang) và `templates/thiet-ke.md` (bảng màu, 4 loại hình, quy tắc ảnh AI).

## Tiêu chí hoàn thành
Mỗi tiêu chí trả lời Có hoặc Không. Người làm tự kiểm trước khi bàn giao, người duyệt kiểm lại, Chef nghiệm thu theo đúng danh sách này.

1. **Số trang và thời gian:** slides.md có 24–26 trang. Mỗi trang có dòng "Thời gian", và tổng các dòng cộng lại **đúng 60 phút**.
2. **Phủ đủ 14 phần** của mục tiêu, có bảng "phần → số trang" ở đầu slides.md. 14 phần gồm: (1) khái niệm, (2) tuyến giáp hoạt động thế nào, (3) nguyên nhân (Hashimoto và các nguyên nhân khác), (4) triệu chứng, (5) biến chứng, (6) nhóm nguy cơ, (7) giải pháp y khoa đi trước, yoga hỗ trợ, (8) 5 tư thế có đạo cụ, (9) hơi thở, (10) thư giãn, (11) ăn uống, (12) tinh thần, (13) tóm lược, (14) an toàn và chống chỉ định (bắt buộc theo template).
3. **Nguồn thật, kiểm được:**
   - Mọi nhận định y khoa và số liệu có số [n].
   - Mục "Nguồn tham khảo" ghi link trực tiếp tới bài, không dừng ở trang chủ tổ chức.
   - An đã mở thử từng link và ghi kết quả.
   - Không có link giả, không có một ID (PMC/DOI) bị gán cho hai bài khác nhau.
   - Dòng "Nguồn" trên slide **không** chứa ghi chú nội bộ kiểu "(An, mục C)".
4. **Gọn chữ:** mỗi trang tối đa 5 ý và khoảng 40 chữ trên slide (không tính lời giảng). Mỗi trang có lời giảng 2–4 câu.
5. **Đủ 5 trang tư thế,** mỗi tư thế một trang và trang nào cũng có đủ: tên Việt + tên Phạn, đạo cụ cụ thể, cách làm nhẹ hơn, chống chỉ định hoặc thận trọng, dấu hiệu dừng.
6. **Tư thế an toàn:** không có tư thế chồng đầu, chồng vai, cái cày (Sirsasana, Sarvangasana, Halasana). Không gập cổ hay ngửa cổ mạnh. Không có thở lửa hay Kapalabhati.
7. **Có trang an toàn,** gồm:
   - không tự ngưng hay đổi liều thuốc;
   - hỏi bác sĩ trước khi tập nếu bệnh chưa ổn định;
   - dấu hiệu dừng tập;
   - khi nào gọi cấp cứu 115.
   Câu "không tự ngưng hay đổi liều thuốc" được nhắc lại ở trang tóm lược.
8. **Nói đúng mức bằng chứng:**
   - Bằng chứng yoga cho suy giáp ghi rõ "sơ bộ", kèm loại nghiên cứu và cỡ mẫu.
   - Chỉ trích số liệu từ bài An đã đối chiếu với bản gốc hoặc abstract.
   - Không dùng các cụm "chữa khỏi", "kích thích hay massage tuyến giáp", "giảm liều", "thải độc".
9. **Hình, mỗi trang đều có:** mỗi trang trong thiet-ke.md ghi loại hình (A/B/C/D), hoặc ghi lý do trang đó không cần hình.
10. **Hình có sẵn và hình AI đúng quy tắc:**
    - Hình giải phẫu tuyến giáp và sơ đồ trục não–giáp: dùng file cụ thể có link, tác giả và giấy phép (OpenStax, Wikimedia hoặc Servier), hoặc dựng bằng khối trong Canva. Không dùng ảnh AI cho giải phẫu hay sơ đồ.
    - Mọi hình loại C và D lấy sẵn phải ghi đủ nguồn và giấy phép.
11. **Ảnh tư thế:** cùng một người mẫu. Mô tả người mẫu chép y nguyên vào mọi prompt. Prompt ghi đúng đạo cụ như trên trang tư thế. Không có chữ trong ảnh.
12. **Chính tả:** 0 lỗi gõ, không lặp từ, giọng gần gũi. Trang bìa để chỗ trống `[Tên giảng viên]` và `[Ngày giờ]`. Mục "Việc còn mở" liệt kê rõ việc cần bác sĩ nội tiết hoặc giáo viên chính xem lại.

## Ràng buộc
- **An toàn trước hết:**
  - Thông điệp xuyên suốt: "Yoga không thay thế thuốc và bác sĩ, mà đi song song."
  - Không nêu liều thuốc cụ thể.
  - Cách uống levothyroxine (uống lúc đói, giãn cách với canxi, sắt, thuốc dạ dày, cà phê…) chỉ được nêu nếu có nguồn An đã duyệt, và phải kèm câu "làm theo hướng dẫn của bác sĩ".
- **Ăn uống:**
  - Không khuyên bổ sung i-ốt hay tảo biển liều cao.
  - Không khuyên kiêng gluten, đậu nành hay rau họ cải cho mọi người nếu không có nguồn. An kiểm riêng phần này.
- **Đối tượng cần thận trọng (An xác định cho từng tư thế):** bệnh tim, huyết áp chưa ổn định, tăng nhãn áp, đau hay thoái hóa cổ, mang thai, loãng xương, đau khớp, mệt nhiều. Tư thế đảo ngược nhẹ (ví dụ chân lên tường) và gập lưng có đỡ chỉ được giữ nếu An duyệt và ghi rõ điều kiện.
- **Thời lượng:** 60 phút, khoảng 25 trang, chia giờ hợp lý giữa lý thuyết và thực hành.
- **Giọng văn:** tiếng Việt đời thường, có ẩn dụ (nhà máy, chân ga, bộ điều nhiệt…). Thuật ngữ y khoa có giải thích 1 dòng. Không hù dọa.
- **Không được làm:**
  - Bịa nguồn, link hay số liệu.
  - Dùng ảnh scan sách giáo khoa.
  - Dùng ảnh AI có chữ hoặc vẽ giải phẫu có nhãn.
  - Dùng hình máu me hoặc bệnh nặng.
  - Người duyệt sửa hộ nội dung chuyên môn (Hạ chỉ được sửa lỗi chính tả hay lặp từ trong slides.md, không đổi ý y khoa).
- **Lỗi của v4 không được lặp:** link chỉ dừng ở cấp tổ chức, link ResearchGate giả, một PMC bị gán hai nội dung, ghi chú nội bộ trên dòng Nguồn, trang giải phẫu chưa chọn hình, trang quá 70–90 chữ, lỗi gõ.

## Quyết định đã chốt
Chủ dự án chưa trả lời câu nào. Chef chốt các giả định sau và cả nhóm làm theo:
- Bảng màu Xô thơm, font Lora + Be Vietnam Pro, khổ 16:9.
- Sản phẩm v5 là kịch bản và bản thiết kế dạng Markdown, kèm prompt ảnh và nguồn hình. Chưa bắt buộc tạo file ảnh hay dựng Canva trong lượt này.
- Tên giảng viên và ngày giờ để trống cho chủ dự án điền.
- 5 tư thế do Mai đề xuất và An chốt. Ưu tiên tư thế nằm, ngồi, có đỡ (ví dụ: tư thế em bé có gối, vặn mình nằm, góc cố định nằm có gối, chân lên tường hoặc chân lên ghế, gập người ngồi trên ghế).
