# Brief · Yoga cân bằng phục hồi cho người suy giáp (suy-giap-v5)

Thư mục chủ đề: `suy-giap-v5` → mọi sản phẩm cuối nằm trong `output/suy-giap-v5/`.

## Mục tiêu & người nhận
- **Người xem:** học viên yoga **không chuyên y** (đa số là phụ nữ trung niên, có người đang điều trị suy giáp hoặc có người thân bị suy giáp).
- **Người dùng sản phẩm:** giảng viên Yoga Lab dùng kịch bản để giảng, người dựng slide dùng bản thiết kế để dựng trên Canva mà **không cần hỏi lại**.
- **Bối cảnh:** workshop trực tiếp **60 phút**, khoảng **25 trang**, có phần thực hành tư thế trên thảm với đạo cụ (gạch, gối ôm/bolster, chăn, ghế, dây).
- **Thông điệp chính:** "Suy giáp điều trị bằng thuốc theo bác sĩ; yoga là hỗ trợ để cơ thể cân bằng, phục hồi, dễ chịu hơn — không thay thế thuốc."
- **Thế nào là "đạt":** một giảng viên yoga đọc kịch bản là giảng được trọn 60 phút; học viên ra về hiểu tuyến giáp làm gì, biết vì sao phải dùng thuốc đều, tự tập được 5 tư thế có đạo cụ an toàn, và nhớ 3 điều mang về.

## Sản phẩm cần giao
| File | Người làm | Định dạng / nội dung |
|---|---|---|
| `agents/mai/suy-giap-v5-nguon.md` | Mai | Nháp tổng hợp nguồn, chia theo **14 mục nội dung** (xem bên dưới), mỗi ý kèm nguồn công khai có link mở được + mức bằng chứng |
| `agents/an/suy-giap-v5-kiem-chung.md` | An | Kiểm từng ý: Đúng / Sửa / Bỏ; danh sách ý đã duyệt; cảnh báo an toàn bắt buộc; 5 tư thế + chống chỉ định |
| `output/suy-giap-v5/slides.md` | Lam | Kịch bản ~25 trang theo `templates/kich-ban-slide.md`, có **thời lượng từng trang** |
| `agents/an/suy-giap-v5-kiem-slides.md` | An | Danh sách sửa theo trang (bắt buộc / nên / cần chuyên gia) |
| `output/suy-giap-v5/thiet-ke.md` | Vy | Thiết kế từng trang theo `templates/thiet-ke.md`: bố cục, loại hình A/B/C/D, prompt hoặc nguồn + giấy phép |
| `agents/ha/suy-giap-v5-bien-tap.md` | Hạ | Biên bản duyệt thiết kế + hình + biên tập chữ, có bảng đối chiếu tiêu chí |

**14 mục nội dung bắt buộc** (thứ tự gợi ý): 1) khái niệm suy giáp · 2) tuyến giáp hoạt động thế nào (trục não – tuyến yên – tuyến giáp, T3/T4/TSH) · 3) nguyên nhân (Hashimoto, sau điều trị/phẫu thuật tuyến giáp, thiếu/thừa i-ốt, thuốc, sau sinh…) · 4) triệu chứng · 5) biến chứng · 6) nhóm nguy cơ · 7) giải pháp y khoa trước (levothyroxine, xét nghiệm định kỳ, cách uống thuốc) · 8) yoga hỗ trợ (bằng chứng ở mức nào) · 9) 5 tư thế có đạo cụ · 10) hơi thở · 11) thư giãn · 12) ăn uống · 13) tinh thần · 14) tóm lược. Cộng thêm: bìa, mục lục, **trang an toàn & chống chỉ định**, nguồn tham khảo.

## Tài liệu mẫu
Không có (sources/ trống). Chuẩn tham chiếu là `templates/kich-ban-slide.md` (mạch bài 10 phần + khuôn từng trang) và `templates/thiet-ke.md` (bảng màu Xô thơm, 4 loại hình A/B/C/D, khuôn file thiết kế).
Tham khảo các lỗi của bản trước tại `output/suy-giap-v4/tong-ket-chef.md` mục 3 để **không lặp lại**.

## Tiêu chí hoàn thành
1. `slides.md` có **24–26 trang**, phủ đủ **14 mục nội dung** ở trên + bìa, mục lục, trang an toàn, nguồn; mỗi mục ghi rõ ở trang nào.
2. Tổng thời lượng các trang cộng lại **đúng 60 phút** (mỗi trang ghi số phút), phần thực hành (tư thế + hơi thở + thư giãn) chiếm **≥ 20 phút**.
3. Mỗi trang **≤ 5 ý, ≤ ~40 chữ** trên slide; giải thích nằm ở "Lời giảng".
4. Đủ **5 trang tư thế**, mỗi trang có: tên Việt + tên Phạn, đạo cụ cụ thể, cách làm nhẹ hơn, **chống chỉ định**, thời gian giữ/số hơi thở.
5. Có **≥ 1 trang an toàn & chống chỉ định riêng**, gồm: uống thuốc đều theo bác sĩ, không tự giảm/ngưng thuốc, dấu hiệu dừng tập, khi nào gọi cấp cứu 115.
6. **Mọi nhận định y khoa và số liệu có nguồn công khai** ([số] trỏ về mục "Nguồn tham khảo" có tác giả, năm, link). **Không có** ghi chú nội bộ kiểu "(An, mục C)" trong dòng Nguồn; không có link giả/không mở được.
7. Mọi ý y khoa trong `slides.md` đều nằm trong danh sách **An đã duyệt**; bằng chứng về yoga được ghi đúng mức (ví dụ "nghiên cứu nhỏ, sơ bộ").
8. **Không** có từ tuyệt đối hoặc hứa hẹn: "chữa khỏi", "kích thích tuyến giáp", "giảm liều thuốc", "thải độc", "chắc chắn".
9. **Hình:** mỗi trang trong `thiet-ke.md` có hình (ghi loại A/B/C/D) **hoặc ghi lý do không cần hình**. Hình giải phẫu (loại C) **không dùng AI**, có link + tác giả + giấy phép cụ thể (CC BY / CC BY-SA / PD). Ảnh có sẵn (loại D) ghi đủ nguồn + giấy phép.
10. 5 ảnh tư thế dùng **cùng một mô tả người mẫu** chép y nguyên; prompt mô tả đúng vị trí tay chân, đạo cụ; sơ đồ/bảng dựng bằng khối Canva, không dùng ảnh AI; không có chữ trong ảnh AI.
11. Thiết kế theo một bảng màu (Xô thơm), 2 họ chữ, mỗi trang tối đa một điểm nhấn đất nung.
12. Không lỗi chính tả, không lặp từ; mục "Việc còn mở" cuối `slides.md` liệt kê rõ điều cần bác sĩ/giảng viên chính xem lại.

## Ràng buộc
- **Y khoa đi trước, yoga hỗ trợ.** Không khuyên đổi, giảm, ngưng thuốc; không thay chẩn đoán. Lời giảng nhắc học viên hỏi bác sĩ khi có triệu chứng mới.
- **An toàn tư thế:** ưu tiên tư thế phục hồi có đạo cụ, nhẹ, phù hợp người mệt mỏi, tăng cân, đau khớp, chậm nhịp tim. **Không** dùng tư thế chồng đầu, trồng chuối, cây nến không đỡ, gập cổ mạnh; không thở lửa (Kapalabhati) / thở nhanh mạnh. Tư thế đảo ngược nhẹ (vd. chân lên tường) phải ghi chống chỉ định: cao huyết áp chưa kiểm soát, bệnh tim, tăng nhãn áp, đau/thoát vị cổ, mang thai, đang hành kinh (tuỳ người).
- **Không** khẳng định tư thế nào "massage/kích thích tuyến giáp" như sự thật y khoa; nếu nhắc truyền thống yoga thì ghi rõ "theo quan niệm truyền thống, chưa có bằng chứng".
- **Ăn uống:** chỉ nói điều có nguồn (uống thuốc lúc đói, cách xa canxi/sắt/đậu nành/cà phê theo hướng dẫn; i-ốt đủ, không tự bổ sung liều cao; không kiêng cực đoan). Không gợi ý thực phẩm chức năng.
- **Thời lượng:** 60 phút, ~25 trang. **Giọng văn:** tiếng Việt gần gũi, dễ hiểu, dùng ẩn dụ đời thường, không thuật ngữ nếu không giải thích.
- **Hình:** không vẽ máu, vết mổ, cảnh bệnh nặng; không chữ trong ảnh AI; không dùng ảnh scan sách giáo khoa.
- Người duyệt **không sửa hộ**, chỉ ghi danh sách sửa có số trang.

## Quyết định đã chốt
- Chưa có câu trả lời của chủ dự án. Giả định mặc định: bảng màu **Xô thơm**; giảng viên và ngày giờ để trống `<điền sau>` ở trang bìa; workshop không giới hạn giới tính nhưng giọng văn hướng tới phụ nữ trung niên.
