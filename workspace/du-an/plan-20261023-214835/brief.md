# Brief · Yoga nhẹ nhàng cho người thoát vị đĩa đệm thắt lưng (thoat-vi-dia-dem)

Thư mục chủ đề: thoat-vi-dia-dem

Mọi sản phẩm cuối nằm trong `output/thoat-vi-dia-dem/`; hình nguồn do máy chủ tải nằm trong `output/thoat-vi-dia-dem/hinh-nguon/`, hình dùng cho slide trong `output/thoat-vi-dia-dem/hinh/`. Nháp riêng: `agents/<id>/thoat-vi-dia-dem-*.md`.

## Mục tiêu & người nhận
- **Người xem:** học viên yoga **30–65 tuổi**, không chuyên y, nhiều người **ngồi văn phòng** lâu; một số đã được chẩn đoán thoát vị đĩa đệm thắt lưng, **có người đang đau lan xuống chân** (đau thần kinh toạ, tê). Họ cần hiểu cột sống của mình, biết khi nào phải đi viện ngay, và tập được vài tư thế nhẹ không làm đau tăng.
- **Người dùng sản phẩm:** giảng viên Yoga Lab đọc kịch bản để giảng trọn buổi; người dựng slide dùng `thiet-ke.md` + ảnh trong `hinh/` để dựng trên Canva **không cần hỏi lại**.
- **Bối cảnh:** workshop trực tiếp **45 phút**, khoảng **20 người**, có **ghế tựa chắc**, thảm, gạch xốp, bolster, chăn, dây tập. Học viên mang về chuỗi 5 tư thế + bài thở + thói quen hằng ngày.
- **Thông điệp chính:** "Y khoa đi trước; vận động nhẹ, đúng cách giúp bạn sống chung và hồi phục, yoga là hỗ trợ."
- **Thế nào là "đạt":** 14 trang nội dung (+ trang Nguồn) đúng Khung trang; giảng viên đọc kịch bản là giảng trọn 45 phút (≥ 18 phút thực hành); trang Dấu hiệu cấp cứu đứng riêng, rõ, có nguồn; mọi ý y khoa có nguồn, có câu trích và đã qua An; mỗi tư thế giữ cột sống trung tính, có bản nhẹ hơn và chống chỉ định; hình giải phẫu có giấy phép, ảnh tư thế cùng một người mẫu, đủ file trong `hinh/`.

## Sản phẩm cần giao
| File | Người làm | Định dạng / nội dung |
|---|---|---|
| `agents/mai/thoat-vi-dia-dem-nguon.md` | Mai | Nguồn theo **từng trang của Khung trang** (gộp một lượt Deep Research). Mỗi ý: link + mức bằng chứng (Mạnh/Trung bình/Sơ bộ/Ý kiến) + **câu trích nguyên văn tiếng Anh** cạnh ý, cho mọi định nghĩa, con số, diễn tiến tự nhiên, khuyến cáo điều trị/vận động, dấu hiệu cấp cứu, quy tắc đau, chống chỉ định, lời khuyên ngồi/nâng đồ. Đánh số [n] đúng như kịch bản sẽ dùng. Bảng **"## Hình & sơ đồ trong nguồn"** cho tr.2, 3, 5 (đốt sống + đĩa đệm có nhân nhầy/vòng sợi; đĩa bình thường – phồng – thoát vị; rễ thần kinh/dây thần kinh toạ): link trang File: + link tải `Special:FilePath` + tác giả + giấy phép + [DÙNG ĐƯỢC]/[KHÔNG] |
| `output/thoat-vi-dia-dem/slides.md` | Lam | Kịch bản theo `templates/kich-ban-slide.md`; đầu file có bảng "mục tiêu → trang" và bảng phút; mỗi trang ghi **số phút**; cuối file "Nguồn tham khảo" và "Việc còn mở" |
| `output/thoat-vi-dia-dem/thiet-ke.md` | Vy | Thiết kế theo `templates/thiet-ke.md`, mỗi trang ghi "Theo kiểu mẫu tr.x"; prompt ảnh A/B/D (không mã hex); nguồn hình C kèm vùng cắt/vùng chữ cần che; cuối file **"## Danh sách hình"** (trang · tên file · loại · prompt hoặc nguồn/giấy phép · trạng thái file) |
| `output/thoat-vi-dia-dem/hinh/*` | Nhi (ảnh AI) + máy chủ (chép hình C từ `hinh-nguon/`) | Đủ mọi hình trong Danh sách hình, đặt tên theo trang (vd `trang-10-cay-cau-co-do.png`) |
| Biên bản duyệt trong `agents/an/`, `agents/ha/` | An, Hạ | Danh sách sửa có số trang, mức BẮT BUỘC/NÊN, kết luận ĐẠT/CẦN SỬA |

## Tài liệu mẫu
- `sources/slide-mau-suy-giap.md` + ảnh chụp `sources/slide-mau-suy-giap/trang-xx`: slide Canva mẫu của Yoga Lab, **chủ đề khác (suy giáp, 27 trang/60 phút)**. Dùng làm **chuẩn phong cách và kiểu trang**, **không** làm khung nội dung (không chép ý, không chép hình của mẫu). Các yếu tố phải giữ:
  - Bìa chữ trái + hình lớn phải (tr.1); trang định nghĩa câu chữ to + nhãn bo tròn + hình bên phải (tr.2); hình giải phẫu nhãn Việt kiểu tr.4–5 (hình trung tâm + chú thích có số).
  - Trang y khoa dạng thẻ có tiêu đề đậm, ≤ ~90 chữ; lưới ô có biểu tượng (tr.10/13) cho nguyên nhân – nguy cơ; bản đồ cơ thể chấm nối (tr.11) cho triệu chứng; dòng thời gian (tr.16) cho diễn tiến; **khối cảnh báo đậm dần (tr.12) cho trang cấp cứu**; Venn "y khoa ∩ yoga" (tr.15).
  - **Trang tư thế chỉ nhãn tên + ảnh lớn ngang** (tr.19–22); trang thở kiểu tr.23; thư giãn nền đậm + thẻ kính mờ (tr.24); tóm lược ảnh lớn + 3 thẻ (tr.27).
  - Có trang **An toàn** và **Nguồn** (như bản suy giáp đã thêm).

### Khung trang (bắt buộc)
| Trang | Tiêu đề | Nội dung phải phủ | Kiểu mẫu | Loại hình | Phút |
|---|---|---|---|---|---|
| 1 | Bìa | WORKSHOP · YOGA NHẸ NHÀNG · CHO NGƯỜI THOÁT VỊ ĐĨA ĐỆM THẮT LƯNG; giảng viên, ngày giờ để `[…]` | tr.1 | D người 40 tuổi ngồi ghế/nằm thảm thư thái, ánh sáng ấm (không cảnh đau) | 0,5 |
| 2 | Cột sống & đĩa đệm | Cột sống thắt lưng: đốt sống, đĩa đệm giữa hai đốt; **nhân nhầy** (lõi mềm) và **vòng sợi** (vòng bao chắc); đĩa đệm chịu lực, giúp cột sống cử động; ẩn dụ đời thường (vd "tấm đệm có lõi gel") | tr.2 + tr.4/5 | **C** đốt sống + đĩa đệm có giấy phép, nhãn Việt | 2,5 |
| 3 | Thoát vị đĩa đệm là gì? | 1 câu định nghĩa chữ to (nhân nhầy thoát qua chỗ rách vòng sợi, có thể chèn ép rễ thần kinh); **so sánh phồng đĩa đệm và thoát vị** (theo danh pháp có nguồn, vd NASS/ASSR); nếu có nguồn: hình ảnh phồng/thoát vị gặp cả ở người không đau | tr.2 + tr.8 (so sánh) | **C** đĩa bình thường – phồng – thoát vị, có giấy phép | 2,5 |
| 4 | Nguyên nhân & yếu tố nguy cơ | Thoái hoá theo tuổi, cử động/nâng vật sai cách, yếu tố nghề nghiệp (ngồi lâu, rung, nâng nặng), hút thuốc, thừa cân, di truyền… **chỉ giữ yếu tố có câu trích** | tr.10 / tr.13 | A biểu tượng nét mảnh hoặc E khối Canva | 2 |
| 5 | Triệu chứng | Đau lưng; **đau thần kinh toạ** (đau lan mông → chân, thường dưới gối); tê, châm chích; có thể yếu cơ; ho/hắt hơi/ngồi lâu đau tăng (nếu có nguồn). Không hướng dẫn tự chẩn đoán | tr.11 | **C** rễ thần kinh/dây thần kinh toạ có giấy phép + chấm nối E | 2 |
| 6 | Diễn tiến tự nhiên | **Nhiều trường hợp đỡ dần sau vài tuần** – nêu đúng mức bằng chứng và nguồn; khối thoát vị có thể nhỏ lại (nếu có nguồn); không hứa khỏi; đau kéo dài/không đỡ → khám lại | tr.16 | E dòng thời gian Canva | 1,5 |
| 7 | Dấu hiệu cần đi cấp cứu | **Trang riêng.** Đi cấp cứu/gọi **115** ngay khi: tê vùng yên ngựa (quanh hậu môn, bộ phận sinh dục, mặt trong đùi), bí tiểu hoặc tiểu/đại tiện không tự chủ, yếu chân tăng dần (hoặc hai chân); có thể thêm tầng "khám sớm" (sốt, sụt cân không rõ lý do, tiền sử ung thư, sau chấn thương, đau ban đêm không đỡ) nếu có nguồn. Nguồn uy tín (NHS, NICE CKS…) + **115 có nguồn Việt Nam** | tr.12 | E khối cảnh báo đậm dần, biểu tượng Canva | 2 |
| 8 | Y khoa đi trước, vận động hỗ trợ | Venn: y khoa (khám, theo dõi, điều trị theo bác sĩ – **chỉ ghi "hỏi bác sĩ"**, không nêu thuốc/tiêm/mổ) ∩ vận động & yoga (giữ hoạt động, tập luyện, thở – thư giãn); khuyến cáo theo **NICE NG59, ACP, NASS**; bằng chứng yoga **ghi đúng mức** (chủ yếu ở đau lưng mạn không đặc hiệu, ít dữ liệu riêng cho thoát vị/đau thần kinh toạ); câu chốt "Yoga không thay thế y khoa, mà phối hợp song song" | tr.15 | E Venn Canva | 2 |
| 9 | Tập an toàn | **Quy tắc đau:** đau lan xuống chân tăng, tê lan xa hơn hay yếu chân → dừng; đau lưng nhẹ tại chỗ, hết nhanh có thể chấp nhận (có nguồn, không có thì ghi "kinh nghiệm thực hành"); **bỏ hẳn:** gập người sâu, xoắn vặn có tải, nâng chân thẳng hai chân, tư thế đảo ngược, nhảy; dấu hiệu dừng tập; chống chỉ định chung (đang có dấu hiệu tr.7, đau cấp dữ dội, mới mổ cột sống chưa được phép); câu "hỏi bác sĩ/vật lý trị liệu nếu đang điều trị" | tr.12 (khối) | A biểu tượng nét mảnh hoặc E | 2,5 |
| 10 | Tư thế với ghế | 2 tư thế (xem danh sách tư thế), ghế áp tường | tr.22 | 2 ảnh B cạnh nhau | 6 |
| 11 | Tư thế trên thảm | 3 tư thế, kèm hướng dẫn **xuống/lên thảm an toàn** (nghiêng người, chống tay, lăn nghiêng khi dậy) và **bản thay thế trên ghế** cho người không xuống thảm được | tr.22 (3 ảnh, ghi lý do khác mẫu) | 3 ảnh B | 8 |
| 12 | Hít thở & thư giãn | **Một** bài thở (thở bụng/cơ hoành ở tư thế nằm co gối hoặc ngồi ghế; thở ra dài hơn hít vào, mỗi nhịp đếm ~1 giây, **không nín thở**, chóng mặt thì dừng) + thư giãn có đỡ (nằm ngửa bolster dưới gối, chăn dưới đầu; hoặc nằm nghiêng gối kẹp giữa hai gối); ngồi dậy bằng cách lăn nghiêng | tr.23 + tr.24 | A người nằm nét mảnh, nền đậm, thẻ kính mờ | 6 |
| 13 | Thói quen hằng ngày | Ngồi (tựa lưng, đứng dậy đi lại định kỳ), đứng, **nâng đồ** (vật sát người, gập hông–gối, không vừa nâng vừa xoắn); **ghi đúng mức**: lời khuyên tư thế giúp dễ chịu, bằng chứng phòng ngừa còn hạn chế (nếu nguồn nói vậy) | tr.13 / tr.10 | A biểu tượng nét mảnh (không vẽ cột sống) | 3 |
| 14 | Tóm lược | 3 điều mang về: nhận biết dấu hiệu cấp cứu · vận động nhẹ đều đặn, y khoa đi trước · chuỗi 5 tư thế + thở, tập theo quy tắc đau | tr.27 | D ảnh lớn + 3 thẻ | 2 |
| 15 | Nguồn tham khảo | Danh sách [n] chữ nhỏ, chiếu lúc hỏi đáp | — | Không hình (ghi lý do) | 0 |

Dự phòng chuyển chỗ/hỏi đáp: **2,5 phút** (ghi trong bảng phút). Tổng = 45.

### Danh sách tư thế (đề xuất, giữ cột sống trung tính)
1. **Ngồi ghế lưng trung tính, vươn tay** (Tadasana trên ghế): ngồi giữa ghế, bàn chân phẳng, chăn cuộn sau thắt lưng tuỳ chọn, nâng tay khi hít vào, không ưỡn lưng.
2. **Đứng vịn lưng ghế, bản lề hông nông**: gập ở hông biên độ nhỏ, lưng giữ thẳng, gối hơi chùng — nối sang thói quen nâng đồ. **Không** gập sâu.
3. **Nằm ngửa co gối, trượt gót** (bàn chân trên thảm, chăn mỏng dưới đầu; trượt một gót ra – vào, lưng không ưỡn/không ép).
4. **Cây cầu có đỡ** (Salamba Setu Bandhasana): **gạch thấp nhất** nằm phẳng dưới xương cùng, 1–3 phút (quyết định đã chốt); nâng/hạ hông cả khối, không cuộn từng đốt.
5. **Chó–chim bản nhẹ** (bò bốn chân, chăn dưới gối): chỉ trượt/duỗi **một chân** hoặc **một tay**, lưng phẳng; bản thay thế trên ghế.

Lam có thể thay **một** tư thế nếu nguồn hoặc An cho thấy không hợp (ghi lý do vào "Việc còn mở"); tư thế thay vẫn phải ở tư thế nằm/ngồi ghế/vịn ghế, cột sống trung tính, không thuộc danh sách bỏ hẳn. **Không** dùng nâng duỗi chân thẳng với dây (căng dây thần kinh toạ) cho người đang đau lan xuống chân.

Loại hình theo `templates/thiet-ke.md`: A minh hoạ nét AI (không y khoa) · B ảnh tư thế AI · C hình y khoa có giấy phép · D ảnh không khí · E sơ đồ khối Canva. Phút là đề xuất; Lam chỉnh được nhưng phải giữ tiêu chí 2.

## Tiêu chí hoàn thành
1. **Khung:** `slides.md` có **14 trang nội dung + trang 15 Nguồn**, đúng thứ tự Khung trang; bảng "mục tiêu → trang" đầu file phủ đủ 14 mục của mục tiêu (cột sống – đĩa đệm, thoát vị vs phồng, nguyên nhân – nguy cơ, triệu chứng, diễn tiến, cấp cứu, điều trị y khoa – vận động, quy tắc đau, 5 tư thế, hơi thở, thư giãn, thói quen, tóm lược).
2. **Thời lượng:** tổng phút **đúng 45**; thực hành tr.10–12 **≥ 18 phút**; mỗi trang tư thế: thời gian giữ + chuyển vị trí/đạo cụ ≤ số phút của trang.
3. **Cấp cứu (tr.7):** trang riêng, có đủ 3 dấu hiệu bắt buộc (tê vùng yên ngựa, rối loạn tiểu tiện/đại tiện, yếu chân tăng dần), mỗi dấu hiệu có [n] nguồn uy tín kèm câu trích; câu "đi cấp cứu ngay / gọi 115" có nguồn Việt Nam cho số 115; nằm ở "Ý chính" (học viên nhìn thấy), không chỉ trong Lời giảng.
4. **Bằng chứng đúng mức:** diễn tiến tự nhiên (tr.6), hiệu quả yoga (tr.8), lời khuyên ngồi/nâng đồ (tr.13) ghi đúng mức nguồn nói ("nhiều người", "có thể"), có câu trích; không con số nào thiếu câu trích; khuyến cáo điều trị dẫn đúng NICE NG59 / ACP / NASS.
5. **Nguồn:** mọi nhận định y khoa có [n] đặt ngay sau đúng cụm, trỏ đúng trang Nguồn và có câu trích nguyên văn trong `agents/mai/thoat-vi-dia-dem-nguon.md`; An đã mở link, kiểm Đúng/Sửa/Bỏ; mọi dòng Sửa/Bỏ đã xử lý.
6. **5 tư thế:** đúng danh sách (hoặc thay 1 có lý do); mỗi tư thế có tên Việt + tên Phạn (hoặc "không có tên Phạn chuẩn"), đạo cụ và cách đặt (ghế: mặt nào sát tường, cái gì chống trượt), cách vào/ra, bản nhẹ hơn, thời gian giữ/số lần, **chống chỉ định riêng**, và câu "đau lan xuống chân tăng thì dừng". Cây cầu: gạch thấp nhất, 1–3 phút. Không có tư thế nào trong danh sách bỏ hẳn.
7. **Quy tắc đau & an toàn (tr.9):** có quy tắc đau (nguồn hoặc ghi "kinh nghiệm thực hành"), danh sách bỏ hẳn, dấu hiệu dừng tập, chống chỉ định chung, nhắc lại "có dấu hiệu tr.7 thì không tập, đi cấp cứu" — tất cả trong "Ý chính".
8. **Thở & thư giãn (tr.12):** đúng một bài thở, có cách đếm (~1 giây/nhịp), thở ra dài hơn, không nín thở, dừng khi chóng mặt; thư giãn có đạo cụ đỡ; ngồi dậy bằng lăn nghiêng.
9. **Lời lẽ & phạm vi:** máy soát không lỗi; không có "chữa khỏi", "hết hẳn", "trị dứt", "chắc chắn", "thần thánh", "nắn lại đĩa đệm", "đẩy đĩa đệm vào"; không nêu tên thuốc, tiêm, mổ ngoài câu "hỏi bác sĩ"; không chẩn đoán hộ; mật độ tr.2–9, 13 ≤ ~90 chữ, trang tư thế "Ý chính: —".
10. **Hình — mỗi trang:** `thiet-ke.md` đủ 15 trang, mỗi trang có hình đúng loại ở Khung trang hoặc ghi lý do không cần; "## Danh sách hình" đủ mọi hình, mỗi dòng có prompt (A/B/D) hoặc nguồn + tác giả + giấy phép + link tải thẳng (C).
11. **Hình — y khoa:** hình tr.2, 3, 5 (đốt sống, đĩa đệm, thoát vị, rễ thần kinh) **lấy từ nguồn có giấy phép** (OpenStax, Wikimedia Commons, Servier Medical Art, NIH) hoặc dựng khối Canva theo nguồn; **không dùng AI**; nhãn Việt thêm trong Canva, ghi vùng chữ Anh cần che; Hạ đã mở file thật và xác nhận hình đúng ý câu trên slide (nhân nhầy/vòng sợi thấy rõ; thoát vị chèn rễ thần kinh).
12. **Hình — ảnh AI & file:** 5 prompt B dùng **cùng một mô tả người mẫu** (Quyết định đã chốt) chép y nguyên, ảnh ngang thấy trọn người và đạo cụ, cột sống trung tính, cổ không gập/ngửa, không chữ, đạo cụ đúng câu trong kịch bản; mọi file trong Danh sách hình **có thật trong `hinh/`** và cột Trạng thái khớp; dòng "Hình" trong `slides.md` khớp `thiet-ke.md` từng trang.

## Ràng buộc
- **Y khoa đi trước, yoga hỗ trợ.** Không chẩn đoán, không hứa khỏi/hết đau; không bàn thuốc, tiêm, mổ, nắn chỉnh, đai lưng ngoài câu "hỏi bác sĩ".
- **Bỏ hẳn:** gập người sâu, xoắn vặn có tải, nâng chân thẳng hai chân, tư thế đảo ngược, nhảy; cũng không Cái cày, Cây nến, Chồng đầu, không ngửa/gập cổ mạnh, không nín thở gắng sức.
- **An toàn tư thế:** ưu tiên nằm và ngồi ghế; cột sống trung tính; biên độ nhỏ, chậm; người đang đau lan xuống chân luôn có bản nhẹ hơn hoặc ở lại trên ghế; chuyển ngồi → nằm → dậy chậm, lăn nghiêng, có vịn. Ghế tựa chắc, không bánh xe, áp tường.
- **Đối tượng 30–65, dân văn phòng:** ví dụ đời thường (ngồi máy tính, bê thùng nước, bế con), không làm người nghe sợ vận động; chữ trên slide cỡ ≥ 20.
- **Giọng văn:** tiếng Việt gần gũi, ẩn dụ đời thường như mẫu; từ chừng mực ("có thể", "nhiều người", "thường"); thống nhất "giảng viên".
- **Hình:** không chữ trong ảnh AI; **hình y khoa/giải phẫu (cột sống, đĩa đệm, rễ thần kinh) lấy từ nguồn có giấy phép, không dùng AI**; AI chỉ cho ảnh tư thế (B), minh hoạ nét không y khoa (A) và ảnh không khí (D); không chép hình của mẫu; không ảnh MRI/X-quang/mổ/máu/thuốc; không mã hex trong prompt.
- **Người duyệt không sửa hộ:** mở file thật (nguồn, ảnh chụp mẫu, ảnh trong `hinh-nguon/` và `hinh/`), ghi danh sách sửa có số trang và mức BẮT BUỘC/NÊN; lỗi nằm ở file của người khác thì ghi rõ file + trang để máy chủ giao đúng người; kết luận ĐẠT/CẦN SỬA.
- Bàn giao ghi rõ file đã tạo và việc còn mở.

## Quyết định đã chốt
- (plan-20261016-204631) **Setu Bandhasana có đỡ: giữ với gạch thấp nhất 1–3 phút** → áp dụng cho tư thế 4.
- (plan-20261020-220605, áp dụng nguyên tắc) Ý nào **không có câu trích nguyên văn thì bỏ hẳn**, giữ các ý đã có trích.
- (plan-20261020-220605, áp dụng nguyên tắc) Báo cáo Gemini chậm: Mai lấy toàn văn từ link chat đã có, không chạy lại Deep Research; vẫn không ra thì mở từng nguồn bằng WebFetch.
- (plan-20261020-220605, áp dụng nguyên tắc) Ảnh tư thế AI khó vẽ: thiết kế ghi sẵn phương án dự phòng (đổi đạo cụ hoặc chụp ảnh thật); tạo lại tối đa 2 lần rồi báo.
- (plan-20261022-203403, áp dụng nguyên tắc) Khi phải chọn giữa giữ biên độ lớn và đúng mốc an toàn của brief, chọn bản **biên độ nông** cho đúng brief.

Giả định của Chef (chủ dự án có thể đổi; ghi vào "Việc còn mở" nếu thấy cần):
- 14 trang nội dung + 1 trang Nguồn (0 phút). 5 tư thế xếp thành 2 trang (2 ghế + 3 thảm) theo thứ tự ghế → thảm → thư giãn để ít chuyển chỗ; không có trang mục lục (bài 45 phút).
- **Người mẫu ảnh tư thế hợp đối tượng (BH-2), khác template mục B:** "Photorealistic photo of the same Vietnamese woman in her early 40s, shoulder-length black hair tied back, sage green short-sleeve fitted t-shirt and dark grey full-length leggings"; giữ phần còn lại của khuôn B (thảm xám đậm, tường be, monstera, ánh sáng cửa sổ trái, ảnh ngang thấy trọn người), bỏ mã hex. Đạo cụ: ghế gỗ tựa lưng chắc, gạch xốp, bolster tròn, chăn gấp màu kem.
- Bảng màu **Xô thơm**; Lora + Be Vietnam Pro.
- Bìa: giảng viên và ngày giờ để chỗ trống, chủ dự án điền sau.
