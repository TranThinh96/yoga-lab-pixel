# Brief · Yoga phục hồi cho người mất ngủ (mat-ngu-v1)

Thư mục chủ đề: mat-ngu-v1

Mọi sản phẩm cuối nằm trong `output/mat-ngu-v1/`; ảnh trong `output/mat-ngu-v1/hinh/`, hình nguồn do máy chủ tải trong `output/mat-ngu-v1/hinh-nguon/`. Nháp riêng: `agents/<id>/mat-ngu-v1-*.md`.

## Mục tiêu & người nhận
- **Người xem:** học viên yoga **không chuyên y**; một số người đang mất ngủ (vài đêm đến kéo dài), có thể đang dùng thuốc ngủ hoặc có bệnh kèm (lo âu, đau mạn tính, cao huyết áp).
- **Người dùng sản phẩm:** giảng viên Yoga Lab đọc kịch bản để giảng; người dựng slide dùng `thiet-ke.md` + thư mục `hinh/` để dựng trên Canva **không cần hỏi lại**.
- **Bối cảnh:** workshop trực tiếp **30 phút**, khoảng **12 trang**, có thực hành trên thảm với đạo cụ (gạch xốp, bolster/gối ôm, chăn, ghế) cho khoảng 20 người. Học viên mang về một chuỗi ngắn tự tập buổi tối được.
- **Thông điệp chính:** "Yoga không thay thế y khoa, mà phối hợp song song" — mất ngủ kéo dài cần được khám; yoga phục hồi, thở chậm và thư giãn là thói quen hỗ trợ giấc ngủ.
- **Thế nào là "đạt":** 12 trang đúng Khung trang dưới đây, phủ đủ 8 mục của mục tiêu; giảng viên đọc kịch bản là giảng trọn 30 phút (≥ 15 phút thực hành); mọi ý y khoa có nguồn và đã qua An; trang "khi nào gặp bác sĩ" và trang An toàn rõ, có nguồn; mọi hình trong "Danh sách hình" **có file thật** trong `hinh/`.

## Sản phẩm cần giao
| File | Người làm | Định dạng / nội dung |
|---|---|---|
| `agents/mai/mat-ngu-v1-nguon.md` | Mai | Nguồn theo **từng trang của Khung trang** (ưu tiên tr.2–6, 9–10). Mỗi ý: link + mức bằng chứng (Mạnh/Trung bình/Sơ bộ/Ý kiến) + **câu trích nguyên văn** cho mọi định nghĩa, số liệu (vd "3 đêm/tuần, 3 tháng"), dấu hiệu cần khám, khuyến cáo điều trị (CBT-I), thói quen ngủ. Nguồn bằng chứng yoga cho giấc ngủ (tổng quan/phân tích gộp, ghi giới hạn). Nguồn **Bộ Y tế/cơ sở y tế Việt Nam** cho số 115. Đánh số [n] đúng như trang Nguồn sẽ dùng. Bảng **"## Hình & sơ đồ trong nguồn"** cho tr.2–5 (nếu có hình y khoa): link trang File: + link tải `Special:FilePath` + tác giả + giấy phép |
| `agents/an/mat-ngu-v1-kiem-chung.md` | An | Kiểm từng ý của Mai: Đúng / Sửa / Bỏ (đã mở link); ma trận **4 tư thế × chống chỉ định** + bài thở; danh sách ý đã duyệt cho Lam; mở xem hình trong `hinh-nguon/` |
| `output/mat-ngu-v1/slides.md` | Lam | Kịch bản **12 trang** theo `templates/kich-ban-slide.md`; đầu file có bảng "mục tiêu → trang" và bảng phút; mỗi trang ghi **số phút**; cuối file "Nguồn tham khảo" và "Việc còn mở" |
| `agents/an/mat-ngu-v1-kiem-slides.md` | An | Danh sách sửa theo trang (BẮT BUỘC / NÊN / cần chuyên gia), đối chiếu tiêu chí 1–8 |
| `output/mat-ngu-v1/thiet-ke.md` | Vy | Thiết kế 12 trang theo `templates/thiet-ke.md`, mỗi trang ghi "Theo kiểu mẫu tr.x"; prompt ảnh A/B/D; nguồn hình C; cuối file **"## Danh sách hình"** (trang · tên file · loại · nguồn/giấy phép · trạng thái file) |
| `agents/ha/mat-ngu-v1-bien-tap.md` | Hạ | Biên bản duyệt thiết kế + hình + chữ (đặt cạnh ảnh chụp mẫu tương ứng); dòng nào cần Lam sửa thì ghi "CẦN GIAO LAM" |
| `output/mat-ngu-v1/hinh/` | Nhi (+ máy chủ) | Ảnh AI loại A/B/D theo prompt trong `thiet-ke.md`; hình loại C máy chủ tải/chép từ `hinh-nguon/` |
| `agents/ha/mat-ngu-v1-duyet-anh.md` | Hạ | Duyệt ảnh theo trang, **liệt kê file thật có trong `hinh/`** (tên, loại) đối chiếu "Danh sách hình" |

## Tài liệu mẫu
- `sources/slide-mau-suy-giap.md` + ảnh chụp `sources/slide-mau-suy-giap/trang-xx`: slide Canva mẫu của Yoga Lab, **chủ đề khác (suy giáp, 27 trang/60 phút)**. Dùng làm **chuẩn phong cách và kiểu trang**, **không** làm khung nội dung (không chép ý, không chép hình của mẫu). Các yếu tố phải giữ từ mẫu:
  - Bìa ảnh lớn + chữ trái (tr.1); trang định nghĩa một câu chữ thật to + nhãn bo tròn (tr.2).
  - Trang y khoa dạng infographic chia thẻ tiêu đề đậm, ≤ ~90 chữ (tr.7 lưu đồ ẩn dụ, tr.10 lưới ô, tr.13 vòng biểu tượng, tr.12 khối cảnh báo).
  - Venn "y khoa ∩ yoga" + câu "Yoga không thay thế y khoa…" (tr.15).
  - **Trang tư thế chỉ nhãn tên + ảnh lớn ngang**, hai tư thế chung một trang 2 ảnh cạnh nhau (tr.22).
  - Trang hít thở (tr.23), thư giãn nền đậm + thẻ kính mờ + trăng sao (tr.24), tóm lược ảnh lớn + 3 thẻ (tr.27).
  - Bản suy giáp đã thêm trang **An toàn & chống chỉ định** và trang **Nguồn**: bản này cũng phải có.

### Khung trang (bắt buộc)
| Trang | Tiêu đề | Nội dung phải phủ | Kiểu trang mẫu | Loại hình | Phút |
|---|---|---|---|---|---|
| 1 | Bìa | WORKSHOP · YOGA PHỤC HỒI · CHO NGƯỜI MẤT NGỦ; giảng viên, ngày giờ (để chỗ trống `[…]`, ghi vào "Việc còn mở") | tr.1 | D phòng ngủ/ánh đèn dịu, trăng, lá | 0,5 |
| 2 | Mất ngủ là gì? | 1 câu định nghĩa chữ to (khó vào giấc / hay thức giấc / dậy quá sớm, kèm ảnh hưởng ban ngày dù có đủ cơ hội ngủ); ngắn hạn vs mạn tính (mốc có nguồn) | tr.2 | A biểu tượng trăng, gối, đồng hồ nét mảnh (không vẽ cơ thể/não) | 1,5 |
| 3 | Vì sao khó ngủ | Ẩn dụ đời thường: "đồng hồ sinh học", "áp lực buồn ngủ", "hệ báo động" bật (căng thẳng, lo âu); yếu tố thường gặp: ánh sáng/màn hình tối, cà phê/rượu, giờ giấc thất thường, đau/bệnh/thuốc, thói quen nằm trằn trọc | tr.7 + tr.10 | E lưu đồ/lưới ô khối Canva + biểu tượng; hình não/cơ quan nếu có chỉ loại C | 2,5 |
| 4 | Khi nào cần gặp bác sĩ | Mất ngủ kéo dài hoặc ảnh hưởng ban ngày; ngáy to, ngừng thở/ngạt khi ngủ; buồn ngủ ban ngày nguy hiểm (lái xe); chân bồn chồn; buồn chán/lo âu kéo dài; đang phải dùng thuốc ngủ/rượu để ngủ; **ý nghĩ tự hại = khẩn cấp (115)**; điều trị đầu tay là CBT-I (có nguồn); không tự dùng/đổi/ngưng thuốc ngủ | tr.13 + khối cảnh báo tr.12 | E vòng biểu tượng Canva (không AI) | 2,5 |
| 5 | Yoga hỗ trợ ra sao | Venn y khoa (khám, CBT-I, điều trị nguyên nhân) ∩ yoga (thở chậm, thả lỏng, thói quen thư giãn buổi tối); bằng chứng ghi **đúng mức** (cải thiện chất lượng giấc ngủ tự báo cáo, mức sơ bộ–trung bình, nêu giới hạn); câu chốt "Yoga không thay thế y khoa, mà phối hợp song song" | tr.15 | E Venn | 2 |
| 6 | An toàn & chống chỉ định | Nguyên văn "không tự dùng, đổi hay ngưng thuốc ngủ khi chưa hỏi bác sĩ"; tập nhẹ, không đau, không gắng sức; dấu hiệu dừng tập; khi nào gọi **115** (nguồn Việt Nam); chống chỉ định chung (mang thai, đau/thoát vị lưng–cổ, đau gối–háng, mới mổ, huyết áp/tăng nhãn áp với tư thế chân cao hơn đầu); đứng dậy chậm sau khi nằm | thêm (như bản suy giáp) | A hoặc không hình (ghi lý do) | 2 |
| 7 | Em bé có đỡ · Cây cầu có đỡ | Salamba Balasana (ngực tựa bolster, chăn dưới gối/mông, đầu nghiêng) · Salamba Setu Bandhasana (**gạch thấp nhất** dưới xương cùng, bàn chân phẳng, cổ trung tính) | tr.22 | 2 ảnh B cạnh nhau | 5 |
| 8 | Góc cố định nằm có đỡ · Nằm gác chân lên ghế | Salamba Supta Baddha Konasana (bolster/chăn dọc dưới lưng, gạch/gối đỡ dưới đùi, chăn dưới đầu) · bản nhẹ của Viparita Karani: bắp chân gác trọn lên mặt ghế (hoặc bolster), lưng phẳng trên thảm, chăn dưới đầu | tr.22 | 2 ảnh B cạnh nhau | 5 |
| 9 | Hít thở chậm | **Một** bài thở: thở bụng nhẹ, thở ra dài hơn hít vào (số đếm cụ thể có nguồn hoặc ghi mức bằng chứng), vài phút; không nín thở, không ép sâu; dừng khi chóng mặt; làm được trên giường | tr.23 | A sóng nét mảnh | 3 |
| 10 | Thư giãn trước khi ngủ | Savasana có đỡ (gối dưới gối, chăn) + quét cơ thể/thả lỏng từng vùng ngắn (dẫn bằng lời); thói quen trước ngủ có nguồn (giờ ngủ–dậy đều, giảm màn hình/ánh sáng, cà phê/rượu, phòng tối mát, không nằm trằn trọc quá lâu) | tr.24 | A người nằm, trăng sao, nền đậm 3 thẻ kính mờ | 4 |
| 11 | Tóm lược | 3 điều mang về (mất ngủ kéo dài cần khám · yoga/thở/thư giãn là hỗ trợ · chuỗi tối mang về nhà) | tr.27 | D ảnh lớn + 3 thẻ | 1,5 |
| 12 | Nguồn tham khảo & hỏi đáp | Danh sách [n] | thêm | Không hình (ghi lý do) | 0,5 |

Loại hình theo `templates/thiet-ke.md`: A minh hoạ nét AI (không y khoa) · B ảnh tư thế AI · C hình y khoa có giấy phép · D ảnh không khí · E sơ đồ khối Canva. Phút trong bảng là đề xuất; Lam có thể chỉnh nhưng phải giữ tiêu chí 2.

## Tiêu chí hoàn thành
1. **Khung:** `slides.md` có **12 trang** đúng thứ tự Khung trang; bảng "mục tiêu → trang" đầu file chứng minh phủ đủ **8 mục**: mất ngủ là gì (tr.2), vì sao khó ngủ (tr.3), khi nào gặp bác sĩ (tr.4), yoga hỗ trợ ra sao (tr.5), 4 tư thế có đạo cụ (tr.7–8), một bài thở chậm (tr.9), thư giãn trước khi ngủ (tr.10), tóm lược (tr.11); cộng trang An toàn (tr.6) và Nguồn (tr.12).
2. **Thời lượng:** tổng phút **đúng 30**; thực hành tr.7–10 **≥ 15 phút**; ở tr.7–8, thời gian giữ 2 tư thế + chuyển đạo cụ ≤ số phút của trang.
3. **Mật độ:** trang lý thuyết (tr.2–6) **≤ ~90 chữ** trên slide, chia thẻ tiêu đề đậm; **trang tư thế chỉ nhãn tên + ảnh**; giải thích để ở Lời giảng.
4. **4 tư thế** đúng danh sách (Em bé có đỡ, Cây cầu có đỡ, Góc cố định nằm có đỡ, Nằm gác chân lên ghế); mỗi tư thế có tên Việt + tên Phạn, đạo cụ và cách đặt, cách vào/ra, bản nhẹ hơn, thời gian giữ, **chống chỉ định** (trong Lời giảng/An toàn). Cây cầu: **gạch thấp nhất, 1–3 phút**. Không có Cái cày, Cây nến, Chồng đầu, trồng chuối, ngửa/gập cổ mạnh.
5. **Gặp bác sĩ & An toàn:** mọi dấu hiệu ở tr.4 có nguồn uy tín (NHS, AASM, NICE, Mayo Clinic, NIH… hoặc cơ sở y tế Việt Nam); tr.6 có nguyên văn câu về thuốc ngủ, dấu hiệu dừng tập, khi nào gọi **115 có nguồn Việt Nam** (không để ở "Việc còn mở"), chống chỉ định chung.
6. **Bài thở:** đúng **một** bài, có cách đếm/thời lượng cụ thể, thở ra dài hơn hít vào, **không nín thở**, có câu dừng khi chóng mặt; có nguồn hoặc ghi rõ "kinh nghiệm thực hành".
7. **Nguồn & mức bằng chứng:** mọi nhận định y khoa, con số có [n] trỏ đúng trang Nguồn và có câu trích nguyên văn trong `agents/mai/mat-ngu-v1-nguon.md`; ý y khoa nằm trong danh sách An đã duyệt; bằng chứng yoga ghi đúng mức (không viết như điều trị).
8. **Không** có: "chữa khỏi", "chữa mất ngủ", "trị dứt", "chắc chắn", "duy nhất", "thần thánh", "thải độc"; không gợi ý thuốc ngủ, melatonin, thực phẩm chức năng, tinh dầu như điều trị; không hướng dẫn giảm/ngưng thuốc.
9. **Hình — mỗi trang:** mỗi trang có hình đúng loại như cột "Loại hình" hoặc ghi lý do không cần; "Danh sách hình" trong `thiet-ke.md` đủ 12 trang; **mọi file trong Danh sách hình có thật trong `hinh/`** khi kết thúc (Hạ liệt kê).
10. **Hình — y khoa:** hình y khoa/giải phẫu (não, cơ quan, cơ chế, triệu chứng) **lấy từ nguồn có giấy phép** (OpenStax, Wikimedia Commons, Servier Medical Art, NIH/NCI) hoặc dựng khối Canva theo nguồn; **không dùng AI**, kể cả biểu tượng ngáy/ngừng thở ở tr.4 (dùng Canva Elements); ghi link + tác giả + giấy phép; nhãn Việt thêm trong Canva.
11. **Hình — ảnh tư thế:** 4 ảnh B cùng một người mẫu (`templates/thiet-ke.md` mục B, chép y nguyên), ảnh ngang thấy trọn người và đạo cụ, **đạo cụ đặt đúng câu mô tả trong kịch bản** (gạch nằm phẳng thấp nhất, bắp chân nằm trọn trên mặt ghế, bolster dọc dưới lưng), cổ trung tính, đủ ngón, không chữ, không logo AI.
12. **Trình bày:** một bảng màu (Oải hương), 2 họ chữ (Lora + Be Vietnam Pro); nhãn bo tròn chữ trắng in hoa cho tiêu đề chương và tư thế; không lỗi chính tả/lặp từ, thống nhất "giảng viên"; dòng "Hình" trong `slides.md` khớp `thiet-ke.md` từng trang; "Việc còn mở" liệt kê điều cần bác sĩ/giảng viên xem lại.

## Ràng buộc
- **Y khoa đi trước, yoga hỗ trợ.** Không chẩn đoán, không hứa hẹn; không khuyên dùng, đổi, giảm, ngưng thuốc; mất ngủ kéo dài → khám; CBT-I nêu là hướng điều trị đầu tay theo nguồn, không hướng dẫn CBT-I thay bác sĩ.
- **An toàn tư thế:** chỉ tư thế phục hồi nằm/quỳ có đạo cụ, nhẹ, không đau. Không đảo ngược thật (chồng đầu, trồng chuối, cây nến, cái cày), không ngửa/gập cổ mạnh, không thở nhanh mạnh, không nín thở. Nhắc đứng dậy chậm (nghiêng người rồi ngồi dậy) sau tư thế nằm.
- **Sức khoẻ tinh thần:** nhắc ý nghĩ tự hại bằng giọng bình tĩnh, kèm hướng dẫn tìm trợ giúp ngay (115/cơ sở y tế gần nhất), có nguồn.
- **Giọng văn:** tiếng Việt gần gũi, ẩn dụ đời thường như mẫu ("đồng hồ sinh học", "hệ báo động", "sạc lại pin"); câu chừng mực ("có thể giúp", "thường"); không làm người mất ngủ lo thêm.
- **Hình:** không chữ trong ảnh AI; **hình y khoa/giải phẫu không dùng AI**; không chép hình của mẫu; không cảnh bệnh nặng, không ảnh thuốc viên.
- **Người duyệt không sửa hộ:** mở file thật (và ảnh chụp mẫu, ảnh trong `hinh/`), ghi danh sách sửa có số trang và mức BẮT BUỘC/NÊN, kết luận ĐẠT/CẦN SỬA.
- Bàn giao ghi rõ file đã tạo và việc còn mở.

## Quyết định đã chốt
- (plan-20261016-204631) **Setu Bandhasana có đỡ: giữ với gạch thấp nhất 1–3 phút** (không thay bằng nằm nghiêng co gối).

Giả định của Chef (chủ dự án có thể đổi; ghi vào "Việc còn mở" nếu thấy cần):
- 12 trang = 10 trang nội dung theo mục tiêu + trang An toàn + trang Nguồn; 4 tư thế xếp 2 tư thế/trang (kiểu mẫu tr.22) để giữ 12 trang. Không có trang mục lục (bài 30 phút).
- Bảng màu **Oải hương** (template: hợp chủ đề thần kinh, cảm xúc, giấc ngủ); Lora + Be Vietnam Pro; phong cách bố cục theo mẫu suy giáp.
- Người mẫu ảnh tư thế theo `templates/thiet-ke.md` mục B (khớp mẫu), không đổi.
- Bìa: giảng viên và ngày giờ để chỗ trống, chủ dự án điền sau.
