# Brief · Yoga cân bằng phục hồi cho người suy giáp (suy-giap-v6)

Thư mục chủ đề: `suy-giap-v6` → mọi sản phẩm cuối nằm trong `output/suy-giap-v6/`, ảnh trong `output/suy-giap-v6/hinh/`.

## Mục tiêu & người nhận
- **Người xem:** học viên yoga **không chuyên y**, đa số là phụ nữ trung niên; có người đang điều trị suy giáp hoặc có người thân bị suy giáp.
- **Người dùng sản phẩm:** giảng viên Yoga Lab đọc kịch bản để giảng; người dựng slide dùng bản thiết kế + thư mục hình để dựng trên Canva mà **không cần hỏi lại**.
- **Bối cảnh:** workshop trực tiếp **60 phút**, khoảng **25 trang**, có thực hành trên thảm với đạo cụ (gạch, bolster/gối ôm, chăn, ghế, dây).
- **Thông điệp chính:** "Suy giáp được điều trị bằng thuốc theo bác sĩ; yoga hỗ trợ cơ thể cân bằng, phục hồi, dễ chịu hơn — không thay thế thuốc."
- **Thế nào là "đạt":** giảng viên đọc kịch bản là giảng trọn 60 phút; học viên ra về hiểu tuyến giáp làm gì, biết vì sao phải dùng thuốc đều và đi xét nghiệm, tự tập được 5 tư thế có đạo cụ an toàn, nhớ 3 điều mang về. Bộ hình đủ và đúng giấy phép để dựng slide ngay.

## Sản phẩm cần giao
| File | Người làm | Định dạng / nội dung |
|---|---|---|
| `agents/mai/suy-giap-v6-nguon.md` | Mai | Tổng hợp nguồn theo **14 mục nội dung** dưới đây; mỗi ý: nguồn công khai có link + mức bằng chứng (Mạnh/Trung bình/Sơ bộ/Ý kiến) + **câu trích nguyên văn tiếng Anh** cho mọi số liệu và mọi chi tiết về thuốc; đề xuất hình giải phẫu có giấy phép (link trang File:/link ảnh, tác giả, giấy phép) |
| `agents/an/suy-giap-v6-kiem-chung.md` | An | Kiểm từng ý: Đúng / Sửa / Bỏ (đã mở link thật); danh sách ý đã duyệt; cảnh báo an toàn bắt buộc; 5 tư thế + chống chỉ định |
| `output/suy-giap-v6/slides.md` | Lam | Kịch bản 24–26 trang theo `templates/kich-ban-slide.md`; đầu file có **bảng "mục → trang"** và quy ước thời gian; mỗi trang ghi **số phút** |
| `agents/an/suy-giap-v6-kiem-slides.md` | An | Danh sách sửa theo trang (BẮT BUỘC / NÊN / cần chuyên gia), đối chiếu tiêu chí |
| `output/suy-giap-v6/thiet-ke.md` | Vy | Thiết kế từng trang theo `templates/thiet-ke.md`: bố cục, loại hình A/B/C/D (+E = khối Canva nếu dùng, định nghĩa ở đầu file), prompt hoặc nguồn + giấy phép; cuối file có **"Danh sách hình"** (tên file `trang-xx-....png`, loại, prompt/link) |
| `agents/ha/suy-giap-v6-bien-tap.md` | Hạ | Biên bản duyệt thiết kế + hình + biên tập chữ cả `thiet-ke.md` và `slides.md`, bảng đối chiếu tiêu chí |
| `output/suy-giap-v6/hinh/` | Nhi (+ máy chủ) | Ảnh AI loại A/B/D theo prompt trong `thiet-ke.md`; hình có giấy phép (loại C, D) máy chủ tự tải theo link trong Danh sách hình |
| `agents/ha/suy-giap-v6-duyet-anh.md` | Hạ | Nhận xét duyệt ảnh theo trang, so đủ với Danh sách hình |

**14 mục nội dung bắt buộc** (thứ tự gợi ý): 1) khái niệm suy giáp · 2) tuyến giáp hoạt động thế nào (vị trí, trục vùng dưới đồi – tuyến yên – tuyến giáp, TSH/T4/T3, ức chế ngược) · 3) nguyên nhân (Hashimoto; sau phẫu thuật/iốt phóng xạ; thiếu hoặc thừa i-ốt; thuốc; sau sinh; bẩm sinh) · 4) triệu chứng · 5) biến chứng · 6) nhóm nguy cơ · 7) giải pháp y khoa trước (xét nghiệm TSH/FT4, levothyroxine, cách uống, tái khám) · 8) yoga hỗ trợ — bằng chứng ở mức nào · 9) 5 tư thế phục hồi có đạo cụ · 10) hơi thở · 11) thư giãn · 12) ăn uống · 13) tinh thần · 14) tóm lược (3 điều mang về). Cộng thêm: bìa, mở đầu, mục lục, **trang an toàn & chống chỉ định**, nguồn tham khảo.

## Tài liệu mẫu
Không có (sources/ trống). Chuẩn tham chiếu: `templates/kich-ban-slide.md` (mạch 10 phần + khuôn từng trang) và `templates/thiet-ke.md` (bảng màu Xô thơm, loại hình A/B/C/D, khuôn file thiết kế).
Bản trước để học lỗi, **không chép**: `du-an/plan-20261016-204631/nghiem-thu.md` (suy-giap-v5, 87/100) — các lỗi ở tiêu chí 6 và 12 của bản đó không được lặp lại.

## Tiêu chí hoàn thành
1. `slides.md` có **24–26 trang**, phủ đủ **14 mục** + bìa, mục lục, trang an toàn, nguồn; bảng "mục → trang" ở đầu file khớp nội dung.
2. Tổng phút các trang **đúng 60**; thực hành (tư thế + hơi thở + thư giãn) **≥ 20 phút**; thời gian giữ của mỗi tư thế/bài thở **nhỏ hơn** số phút của trang (cả khi cộng các trang nối nhau), chừa thời gian lấy đạo cụ, vào/ra.
3. Mỗi trang **≤ 5 ý, ≤ ~40 chữ** trên slide; giải thích nằm ở "Lời giảng".
4. Đủ **5 trang tư thế**, mỗi trang có: tên Việt + tên Phạn, đạo cụ cụ thể, cách làm nhẹ hơn, **chống chỉ định** (đối chiếu đủ: huyết áp chưa kiểm soát, bệnh tim, tăng nhãn áp, đau/thoát vị cổ, mang thai, hành kinh — cái nào áp dụng), thời gian giữ/số hơi thở. Savasana/thư giãn cũng có lưu ý.
5. Có **≥ 1 trang an toàn & chống chỉ định riêng**, chứa nguyên văn: "uống thuốc đều theo bác sĩ", "không tự giảm hay ngưng thuốc", dấu hiệu dừng tập, khi nào gọi **115** — và các ý này có nguồn.
6. **Mọi nhận định y khoa, con số, chi tiết dùng thuốc có nguồn công khai đúng** ([n] trỏ về "Nguồn tham khảo" có tác giả/tổ chức, năm, link mở được). Riêng trang thuốc/ăn uống: **từng chi tiết** (khoảng giờ, món cần cách xa) có trong đúng nguồn [n] — kiểm bằng câu trích nguyên văn của Mai. Không ghi chú nội bộ trong dòng Nguồn; không link giả.
7. Mọi ý y khoa trong `slides.md` nằm trong danh sách **An đã duyệt**; bằng chứng yoga ghi đúng mức (vd "nghiên cứu nhỏ, sơ bộ"); quan niệm truyền thống ghi rõ "chưa có bằng chứng".
8. **Không** có: "chữa khỏi", "chữa", "kích thích tuyến giáp", "massage tuyến giáp" (trừ câu bác bỏ), "giảm liều thuốc", "thải độc", "chắc chắn", "duy nhất"; không gợi ý thực phẩm chức năng.
9. **Hình — đủ:** mỗi trang trong `thiet-ke.md` có hình (ghi loại) **hoặc ghi lý do không cần hình**; "Danh sách hình" liệt kê đủ, mọi file trong đó có mặt trong `output/suy-giap-v6/hinh/` khi kết thúc (hoặc ghi rõ lý do thiếu).
10. **Hình — nguồn & an toàn:** hình y khoa/giải phẫu (vị trí tuyến giáp, trục hormone, cơ chế, triệu chứng, thuốc, xét nghiệm) **lấy từ nguồn có giấy phép (OpenStax, Wikimedia Commons CC BY/CC BY-SA/PD, Servier, NIH), không dùng AI**; ghi link + tác giả + giấy phép, ghi "adapted" nếu thêm nhãn Việt / che nhãn Anh. Hình có sẵn khác (loại D) cũng đủ nguồn + giấy phép. Sơ đồ/bảng dựng bằng khối Canva.
11. **Hình — ảnh AI:** 5 ảnh tư thế dùng **cùng một mô tả người mẫu** (xem Quyết định đã chốt) chép y nguyên; prompt đúng vị trí tay chân + đạo cụ (màu đạo cụ ghi rõ), không mã hex, không chữ trong ảnh; ảnh tạo ra đã kiểm: đúng tư thế, cổ trung tính, đủ ngón, không chi thừa.
12. Một bảng màu (Xô thơm), 2 họ chữ, ≤ 1 điểm nhấn đất nung/trang; **không lỗi chính tả, dấu câu kép (",." ".."), lặp từ**; thống nhất dùng "giảng viên"; dòng "Hình" trong `slides.md` khớp `thiet-ke.md`; mục "Việc còn mở" cuối `slides.md` liệt kê điều cần bác sĩ/giảng viên chính xem lại.

## Ràng buộc
- **Y khoa đi trước, yoga hỗ trợ.** Không khuyên đổi, giảm, ngưng thuốc; không thay chẩn đoán. Lời giảng nhắc hỏi bác sĩ khi có triệu chứng mới.
- **An toàn tư thế:** ưu tiên tư thế phục hồi có đạo cụ, nhẹ, hợp người mệt mỏi, tăng cân, đau khớp, nhịp tim chậm, dễ lạnh. **Không** dùng chồng đầu, trồng chuối, cây nến/cái cày, gập cổ mạnh; không Kapalabhati/thở lửa hay thở nhanh mạnh. Đảo ngược nhẹ (chân lên ghế/tường) phải có đủ chống chỉ định ở tiêu chí 4.
- **Không** khẳng định tư thế nào "massage/kích thích tuyến giáp"; nếu nhắc truyền thống thì ghi "theo quan niệm truyền thống, chưa có bằng chứng".
- **Ăn uống/thuốc:** chỉ nói điều có nguồn trực tiếp (uống lúc đói theo hướng dẫn; tương tác canxi/sắt/đậu nành/cà phê… chỉ khi nguồn nói đúng chi tiết đó; i-ốt đủ, không tự bổ sung liều cao; không kiêng cực đoan). Thiếu nguồn cho con số giờ thì viết "khoảng cách cụ thể hỏi bác sĩ/dược sĩ". Tìm tương tác thuốc trên trang thông tin thuốc chuyên biệt (MedlinePlus Drug Info, tờ hướng dẫn, ATA toàn văn).
- **Thời lượng:** 60 phút, ~25 trang. **Giọng văn:** tiếng Việt gần gũi, ẩn dụ đời thường, giải thích thuật ngữ; dùng từ chừng mực ("có thể giúp", "nhiều người").
- **Hình:** không vẽ máu, vết mổ, cảnh bệnh nặng; không chữ trong ảnh AI; không ảnh scan sách giáo khoa; hình y khoa **không bao giờ** dùng AI (Nhi không tạo hình y khoa).
- Người duyệt **không sửa hộ**, chỉ ghi danh sách sửa có số trang. Nếu lỗi nằm trong file của người khác (vd lỗi `slides.md` phát hiện khi duyệt thiết kế), ghi ngay dòng đầu bàn giao "CẦN GIAO LAM: tr.x".
- Người làm grep lại file của mình cho từng mục báo "đã sửa" trước khi bàn giao; người duyệt mở file thật, không tin bàn giao; link không mở được ghi "chưa tự kiểm".

## Quyết định đã chốt
- Chưa có câu trả lời mới của chủ dự án. Giả định mặc định (theo kinh nghiệm v5):
  - Bảng màu **Xô thơm**; Lora + Be Vietnam Pro. Giảng viên, ngày giờ ở bìa để `<điền sau>`.
  - **Người mẫu ảnh tư thế (đổi so với template, hợp học viên trung niên và chủ đề giữ ấm):** "Vietnamese woman in her late 40s, shoulder-length black hair in a low bun, loose long-sleeve top and long yoga pants in sage green" — chép y nguyên vào cả 5 prompt.
  - Viparita Karani: **bản gác bắp chân lên ghế là chính**, gác tường là tuỳ chọn. Setu Bandhasana có đỡ: **gạch nằm phẳng ở độ cao thấp nhất, giữ 1–3 phút**. Hơi thở: Dirga chính + Bhramari ngắn.
