# Brief · Yoga nhẹ cho người thoái hoá khớp gối (thoai-hoa-khop-goi)

Thư mục chủ đề: thoai-hoa-khop-goi

Mọi sản phẩm cuối nằm trong `output/thoai-hoa-khop-goi/`; hình nguồn do máy chủ tải nằm trong `output/thoai-hoa-khop-goi/hinh-nguon/`. Nháp riêng: `agents/<id>/thoai-hoa-khop-goi-*.md`.

## Mục tiêu & người nhận
- **Người xem:** người **50–70 tuổi** bị thoái hoá khớp gối (đã được chẩn đoán hoặc đau gối khi vận động), không chuyên y, nhiều người ít tập, có thể kèm cao huyết áp, thừa cân, loãng xương, đang dùng thuốc giảm đau; vài người đã tiêm khớp hoặc mổ gối.
- **Người dùng sản phẩm:** giảng viên Yoga Lab đọc kịch bản để giảng; người dựng slide dùng `thiet-ke.md` để dựng trên Canva **không cần hỏi lại**.
- **Bối cảnh:** workshop trực tiếp **30 phút**, khoảng 20 người, có thực hành với **ghế tựa chắc**, thảm, gạch xốp, bolster/chăn cuộn, dây tập. Học viên mang về một chuỗi ngắn tự tập ở nhà.
- **Thông điệp chính:** "Vận động đúng cách là một phần của điều trị; yoga nhẹ hỗ trợ, không thay thế y khoa."
- **Thế nào là "đạt":** 9 trang đúng Khung trang; giảng viên đọc kịch bản là giảng trọn 30 phút (≥ 15 phút thực hành); mọi ý y khoa có nguồn và đã qua An; trang An toàn rõ, có nguồn; mỗi tư thế có chống chỉ định và bản nhẹ hơn; bản thiết kế đủ 9 trang, hình y khoa có giấy phép.

## Sản phẩm cần giao
| File | Người làm | Định dạng / nội dung |
|---|---|---|
| `agents/mai/thoai-hoa-khop-goi-nguon.md` | Mai | Nguồn theo **từng trang của Khung trang** (ưu tiên tr.2–4, 5–8). Mỗi ý: link + mức bằng chứng (Mạnh/Trung bình/Sơ bộ/Ý kiến) + **câu trích nguyên văn** cho mọi định nghĩa, tiêu chí chẩn đoán, số liệu, khuyến cáo tập luyện, dấu hiệu cần khám/dừng tập, chống chỉ định, câu về thuốc. Đánh số [n] đúng như trang Nguồn sẽ dùng. Có bảng **"## Hình & sơ đồ trong nguồn"** cho tr.2 (giải phẫu khớp gối lành/thoái hoá): link trang File: + link tải `Special:FilePath` + tác giả + giấy phép |
| `output/thoai-hoa-khop-goi/slides.md` | Lam | Kịch bản **9 trang** theo `templates/kich-ban-slide.md`; đầu file có bảng "mục tiêu → trang" và bảng phút; mỗi trang ghi **số phút**; cuối file "Nguồn tham khảo" và "Việc còn mở" |
| `agents/an/thoai-hoa-khop-goi-kiem-slides.md` | An | Đã mở link nguồn; kiểm từng ý y khoa trong `slides.md` đối chiếu câu trích của Mai: Đúng / Sửa / Bỏ; ma trận **6 tư thế × chống chỉ định** + Savasana + bài thở; danh sách sửa theo trang (BẮT BUỘC / NÊN / cần chuyên gia); kết luận ĐẠT/CẦN SỬA |
| `output/thoai-hoa-khop-goi/thiet-ke.md` | Vy | Thiết kế 9 trang theo `templates/thiet-ke.md`, mỗi trang ghi "Theo kiểu mẫu tr.x"; prompt ảnh A/B/D; nguồn hình C; cuối file **"## Danh sách hình"** (trang · tên file · loại · prompt hoặc nguồn/giấy phép · trạng thái file) |
| `agents/ha/thoai-hoa-khop-goi-duyet-thiet-ke.md` | Hạ | Biên bản duyệt thiết kế + hình + chữ (đặt cạnh ảnh chụp mẫu tương ứng); lỗi ở `slides.md` ghi rõ số trang để máy chủ giao Lam |

Ngoài phạm vi dự án này: tạo ảnh AI (Nhi) — làm sau khi chủ dự án duyệt `thiet-ke.md`. Prompt trong `thiet-ke.md` phải dùng được ngay cho bước đó.

## Tài liệu mẫu
- `sources/slide-mau-suy-giap.md` + ảnh chụp `sources/slide-mau-suy-giap/trang-xx`: slide Canva mẫu của Yoga Lab, **chủ đề khác (suy giáp, 27 trang/60 phút)**. Dùng làm **chuẩn phong cách và kiểu trang**, **không** làm khung nội dung (không chép ý, không chép hình của mẫu). Các yếu tố phải giữ:
  - Bìa ảnh lớn + chữ trái (tr.1); trang định nghĩa một câu chữ thật to + nhãn bo tròn + hình bên phải (tr.2, kiểu tr.4 cho hình giải phẫu có nhãn Việt).
  - Trang y khoa dạng thẻ có tiêu đề đậm, ≤ ~90 chữ; Venn "y khoa ∩ yoga" + câu chốt (tr.15); khối cảnh báo màu đậm dần (tr.12) cho trang An toàn.
  - **Trang tư thế chỉ nhãn tên + ảnh lớn ngang**, hai tư thế chung một trang, 2 ảnh cạnh nhau (tr.22).
  - Trang thư giãn nền đậm + thẻ kính mờ (tr.24); tóm lược ảnh lớn + 3 thẻ (tr.27).
  - Có trang **An toàn & chống chỉ định** và **Nguồn** (như bản suy giáp đã thêm).

### Khung trang (bắt buộc)
| Trang | Tiêu đề | Nội dung phải phủ | Kiểu trang mẫu | Loại hình | Phút |
|---|---|---|---|---|---|
| 1 | Bìa | WORKSHOP · YOGA NHẸ · CHO KHỚP GỐI THOÁI HOÁ; giảng viên, ngày giờ để `[…]` (ghi vào "Việc còn mở") | tr.1 | D người lớn tuổi tập với ghế, ánh sáng ấm (không cảnh đau) | 0,5 |
| 2 | Thoái hoá khớp gối là gì? | 1 câu định nghĩa chữ to (sụn mòn, xương dưới sụn và bao khớp thay đổi); biểu hiện thường gặp (đau khi vận động, cứng khớp buổi sáng ngắn, lạo xạo) theo tiêu chí có nguồn (vd NICE); ẩn dụ đời thường ("lớp đệm" của khớp) | tr.2 + tr.4 | **C** khớp gối lành vs thoái hoá, có giấy phép, nhãn Việt trong Canva | 2 |
| 3 | Vận động là nền tảng | Venn y khoa (khám, thuốc theo bác sĩ, giảm cân nếu thừa cân, vật lý trị liệu) ∩ yoga (vận động nhẹ, sức cơ đùi – mông, thăng bằng, thở – thư giãn); khuyến cáo tập luyện là điều trị cốt lõi (NICE/OARSI/ACR); bằng chứng yoga **ghi đúng mức** (đau, chức năng; nêu giới hạn); câu chốt "Yoga không thay thế y khoa, mà phối hợp song song" | tr.15 | E Venn Canva | 2,5 |
| 4 | An toàn & chống chỉ định | Quy tắc đau khi tập (có nguồn, vd mô hình theo dõi đau; không có thì ghi "kinh nghiệm thực hành"); **không** quỳ dồn lực lên gối, ngồi xổm, kiết già, ngồi lên gót, xoay vặn gối khi chịu lực, nhảy; dấu hiệu dừng tập; **khi nào gặp bác sĩ** (gối sưng nóng đỏ, sốt, kẹt/khoá khớp, khuỵu, không chịu lực được, bắp chân sưng đau); khi nào gọi **115** (nguồn Việt Nam); chống chỉ định chung (mới mổ/thay khớp chưa được phép, mới tiêm khớp, viêm cấp, loãng xương nặng/dễ té); câu nguyên văn "không tự ý dùng, đổi hay ngưng thuốc giảm đau khi chưa hỏi bác sĩ" | tr.12 (khối cảnh báo) | A biểu tượng nét mảnh hoặc E khối Canva | 3 |
| 5 | Ngồi ghế duỗi gối · Ngồi ghế giãn gân kheo | (1) Ngồi ghế, duỗi thẳng một gối, siết cơ đùi trước, giữ vài nhịp thở · (2) Một chân duỗi gót chạm sàn, gối hơi chùng, gập nhẹ từ hông, lưng thẳng | tr.22 | 2 ảnh B cạnh nhau | 5 |
| 6 | Núi vịn ghế · Chiến binh II nhẹ vịn ghế | (1) Tadasana tay vịn lưng ghế + nâng gót chậm · (2) Virabhadrasana II bản nhẹ: tay vịn ghế, gối trước gập **nông**, gối thẳng hướng ngón chân 2–3, không vượt mũi chân | tr.22 | 2 ảnh B cạnh nhau | 5 |
| 7 | Cây cầu có đỡ · Nằm duỗi chân với dây | (1) Salamba Setu Bandhasana: **gạch thấp nhất** dưới xương cùng, bàn chân phẳng rộng bằng hông, cổ trung tính, 1–3 phút · (2) Supta Padangusthasana với dây, chân kia co bàn chân trên sàn, gối chân nâng hơi chùng. Có hướng dẫn **xuống/lên thảm an toàn bằng ghế** (chăn dày dưới gối, không dồn lực lên gối đau) và **bản thay thế ngồi trên ghế** cho người không xuống sàn được | tr.22 | 2 ảnh B cạnh nhau | 5 |
| 8 | Thư giãn & hít thở | Savasana có đỡ (bolster/chăn cuộn dưới khoeo, chăn dưới đầu; bản ngồi ghế) + **một** bài thở chậm (thở ra dài hơn hít vào, không nín thở, chóng mặt thì dừng); đứng dậy chậm (nghiêng người rồi ngồi dậy, vịn ghế) | tr.24 | A người nằm nét mảnh, nền đậm, thẻ kính mờ | 4,5 |
| 9 | Mang về nhà · Nguồn tham khảo | 3 điều mang về (đau gối kéo dài/sưng nóng cần khám · vận động nhẹ đều đặn là nền tảng, yoga hỗ trợ · chuỗi 6 tư thế tự tập, tần suất có nguồn) + danh sách [n] chữ nhỏ. Nếu nguồn > 8 dòng: tách thành trang 10 "Nguồn tham khảo" (0 phút, chiếu lúc hỏi đáp) | tr.27 | D ảnh lớn + 3 thẻ; phần nguồn không hình (ghi lý do) | 2,5 |

Loại hình theo `templates/thiet-ke.md`: A minh hoạ nét AI (không y khoa) · B ảnh tư thế AI · C hình y khoa có giấy phép · D ảnh không khí · E sơ đồ khối Canva. Phút trong bảng là đề xuất; Lam có thể chỉnh nhưng phải giữ tiêu chí 2. Tên tư thế Phạn do Lam ghi theo nguồn; nếu một tư thế ghế không có tên Phạn chuẩn thì ghi "bài tập trên ghế, không có tên Phạn chuẩn".

## Tiêu chí hoàn thành
1. **Khung:** `slides.md` có **9 trang** (hoặc 10 nếu tách Nguồn) đúng thứ tự Khung trang; bảng "mục tiêu → trang" đầu file chứng minh phủ đủ: định nghĩa (tr.2), vai trò vận động + Venn (tr.3), An toàn & chống chỉ định (tr.4), 6 tư thế có đạo cụ (tr.5–7), thư giãn + một bài thở (tr.8), mang về + nguồn (tr.9).
2. **Thời lượng:** tổng phút **đúng 30**; thực hành tr.5–8 **≥ 15 phút**; ở tr.5–7, thời gian giữ 2 tư thế + chuyển vị trí/đạo cụ ≤ số phút của trang.
3. **Mật độ:** trang lý thuyết (tr.2–4) **≤ ~90 chữ** trên slide, chia thẻ tiêu đề đậm; **trang tư thế chỉ nhãn tên + ảnh** ("Ý chính: —"); giải thích để ở Lời giảng.
4. **6 tư thế** đúng danh sách; mỗi tư thế có tên Việt + tên Phạn (hoặc ghi không có), đạo cụ và cách đặt, cách vào/ra, bản nhẹ hơn, thời gian giữ/số lần, **chống chỉ định** riêng (trong An toàn của trang). Cây cầu: **gạch thấp nhất, 1–3 phút**. Không có quỳ dồn lực lên gối, ngồi xổm sâu, kiết già, ngồi lên gót (Vajrasana), xoay vặn gối khi chịu lực, Cái cày, Cây nến, Chồng đầu.
5. **An toàn (tr.4):** có quy tắc đau, dấu hiệu dừng tập, danh sách khi nào gặp bác sĩ (mỗi dấu hiệu có nguồn uy tín: NICE, OARSI, ACR, NHS, Mayo Clinic, NIH/NIAMS, Bộ Y tế VN), khi nào gọi **115 có nguồn Việt Nam**, chống chỉ định chung, câu nguyên văn về thuốc giảm đau.
6. **Bài thở:** đúng **một** bài, có cách đếm/thời lượng, thở ra dài hơn hít vào, **không nín thở**, có câu dừng khi chóng mặt; có nguồn hoặc ghi "kinh nghiệm thực hành".
7. **Nguồn & mức bằng chứng:** mọi nhận định y khoa, con số có [n] trỏ đúng trang Nguồn và có câu trích nguyên văn trong `agents/mai/thoai-hoa-khop-goi-nguon.md`; An đã kiểm (Đúng/Sửa/Bỏ) và mọi dòng Sửa/Bỏ đã xử lý trong `slides.md`; bằng chứng yoga ghi đúng mức (không viết như điều trị).
8. **Không** có: "chữa khỏi", "phục hồi sụn", "tái tạo sụn", "trị dứt", "chắc chắn", "duy nhất", "thần thánh"; không gợi ý glucosamine, collagen, thực phẩm chức năng, thuốc, tiêm như lời khuyên; không hướng dẫn giảm/ngưng thuốc.
9. **Hình — mỗi trang:** `thiet-ke.md` đủ 9 trang, mỗi trang có hình đúng loại ở cột "Loại hình" hoặc ghi lý do không cần; "## Danh sách hình" đủ mọi hình, mỗi dòng có prompt (A/B/D) hoặc nguồn + giấy phép (C/D có sẵn).
10. **Hình — y khoa:** hình khớp gối/giải phẫu tr.2 **lấy từ nguồn có giấy phép** (OpenStax, Wikimedia Commons, Servier Medical Art, NIH/NIAMS) hoặc dựng khối Canva theo nguồn; **không dùng AI**; ghi link + tác giả + giấy phép; nhãn Việt thêm trong Canva; Hạ đã mở file trong `hinh-nguon/` (hoặc link) và xác nhận hình đúng nội dung.
11. **Hình — ảnh tư thế:** 6 prompt B dùng **cùng một mô tả người mẫu** chép y nguyên (xem Quyết định đã chốt), ảnh ngang thấy trọn người và đạo cụ; prompt mô tả **đạo cụ đúng câu trong kịch bản** (gạch nằm phẳng thấp nhất; ghế tựa chắc có lưng; gối trước gập nông không vượt mũi chân; dây quanh lòng bàn chân), cổ trung tính, không chữ.
12. **Trình bày:** một bảng màu (Xô thơm), 2 họ chữ (Lora + Be Vietnam Pro); nhãn bo tròn chữ trắng in hoa cho tiêu đề chương và tư thế; chữ trên slide cỡ ≥ 20 (người xem 50–70 tuổi); không lỗi chính tả/lặp từ, thống nhất "giảng viên"; dòng "Hình" trong `slides.md` khớp `thiet-ke.md` từng trang; "Việc còn mở" liệt kê điều cần bác sĩ/giảng viên xem lại.

## Ràng buộc
- **Y khoa đi trước, yoga hỗ trợ.** Không chẩn đoán, không hứa hẹn "hết đau"; không khuyên dùng, đổi, giảm, ngưng thuốc; không bàn tiêm/mổ ngoài câu "hỏi bác sĩ".
- **An toàn tư thế:** chỉ tư thế nhẹ, có ghế/đạo cụ, không đau tăng rõ; gập gối nông; không dồn lực lên gối đau; không đảo ngược thật, không ngửa/gập cổ mạnh, không nín thở. Mọi chuyển tư thế (ngồi → đứng → xuống thảm → lên) phải chậm, có vịn, có bản thay thế trên ghế.
- **Đối tượng 50–70 tuổi:** chú ý té ngã (ghế áp tường/chống trượt), huyết áp (đứng dậy chậm), loãng xương (không gập xoắn mạnh cột sống).
- **Giọng văn:** tiếng Việt gần gũi, ẩn dụ đời thường như mẫu; câu chừng mực ("có thể giúp", "thường"); không làm người bệnh sợ vận động.
- **Hình:** không chữ trong ảnh AI; **hình y khoa/giải phẫu không dùng AI**; không chép hình của mẫu; không ảnh X-quang/mổ/máu, không ảnh thuốc viên.
- **Người duyệt không sửa hộ:** mở file thật (và nguồn, ảnh chụp mẫu, ảnh trong `hinh-nguon/`), ghi danh sách sửa có số trang và mức BẮT BUỘC/NÊN, kết luận ĐẠT/CẦN SỬA.
- Bàn giao ghi rõ file đã tạo và việc còn mở.

## Quyết định đã chốt
- (plan-20261016-204631) **Setu Bandhasana có đỡ: giữ với gạch thấp nhất 1–3 phút** (không thay bằng nằm nghiêng co gối).
- (plan-20261020-220605, áp dụng nguyên tắc) Ý nào không có câu trích nguyên văn thì **bỏ hẳn**, giữ các ý đã có trích.
- (plan-20261020-220605, áp dụng nguyên tắc) Nếu báo cáo Gemini chậm: Mai lấy toàn văn từ link chat cũ, không chạy lại Deep Research; vẫn không ra thì mở từng nguồn bằng WebFetch.

Giả định của Chef (chủ dự án có thể đổi; ghi vào "Việc còn mở" nếu thấy cần):
- 9 trang = 7 trang nội dung theo mục tiêu + trang An toàn + trang Mang về/Nguồn; 6 tư thế xếp 2 tư thế/trang (kiểu mẫu tr.22), theo thứ tự ghế → đứng vịn ghế → thảm để ít chuyển vị trí. Không có trang mục lục (bài 30 phút).
- **Người mẫu ảnh tư thế hợp đối tượng (theo bài học BH-2), khác template mục B:** "Photorealistic photo of the same Vietnamese woman in her late 50s, short black hair with a few grey strands, sage green short-sleeve t-shirt and dark grey full-length leggings (#9FB49A top)"; giữ nguyên phần còn lại của khuôn B (thảm xám đậm, tường be, monstera, ánh sáng cửa sổ trái, ảnh ngang thấy trọn người). Đạo cụ thêm: ghế gỗ tựa lưng chắc, dây tập màu be.
- Bảng màu **Xô thơm** (mặc định, hợp phục hồi); Lora + Be Vietnam Pro.
- Bìa: giảng viên và ngày giờ để chỗ trống, chủ dự án điền sau.
- Tạo ảnh AI (Nhi) để dự án sau, khi `thiet-ke.md` đã duyệt.
