# Brief · Yoga nhẹ cho người đau cổ vai gáy do ngồi máy tính (dau-co-vai-gay)

Thư mục chủ đề: dau-co-vai-gay

Mọi sản phẩm cuối nằm trong `output/dau-co-vai-gay/`; hình nguồn do máy chủ tải nằm trong `output/dau-co-vai-gay/hinh-nguon/`, hình dùng cho slide trong `output/dau-co-vai-gay/hinh/`. Nháp riêng: `agents/<id>/dau-co-vai-gay-*.md`.

> Dự án này **làm tiếp** plan-20261024-225614 (đã dừng vì Gemini Deep Research chưa ra báo cáo). File nguồn `agents/mai/dau-co-vai-gay-nguon.md` (20 nguồn [1]–[20], có câu trích, bảng hình) **đã có và được dùng lại**; Mai chỉ **bổ sung các khoảng trống** (xem "Việc của bước nguồn" bên dưới), không làm lại từ đầu.

## Mục tiêu & người nhận
- **Người xem:** học viên yoga **25–55 tuổi**, không chuyên y, **làm văn phòng, ngồi máy tính nhiều giờ**; nhiều người đang mỏi/đau cổ vai gáy, có người thỉnh thoảng tê tay hoặc đau đầu. Họ cần hiểu cổ vai của mình hoạt động thế nào (nói đơn giản), biết đau cổ vai gáy thường gặp và phần lớn đỡ dần (không hoảng), biết **khi nào phải đi khám ngay**, và mang về được một chuỗi tư thế ngắn tập được ngay tại ghế làm việc.
- **Người dùng sản phẩm:** giảng viên Yoga Lab đọc kịch bản để giảng trọn buổi; người dựng slide (Canva hoặc máy chủ dựng .pptx) dùng `thiet-ke.md` và ảnh trong `hinh/`, **không cần hỏi lại**.
- **Bối cảnh:** workshop trực tiếp **30 phút**, khoảng **20 người**; đạo cụ **chỉ có: ghế, thảm, gạch xốp, chăn, dây tập** (không có bolster: cần đỡ cao thì dùng chăn cuộn).
- **Thông điệp chính:** "Cổ vai cần được vận động nhẹ và nghỉ đúng lúc; y khoa đi trước khi có dấu hiệu lạ, yoga là hỗ trợ."
- **Thế nào là "đạt":** 13 trang nội dung + trang Nguồn đúng Khung trang; giảng viên đọc kịch bản là giảng trọn 30 phút (≥ 13 phút thực hành); trang Dấu hiệu cần đi khám ngay đứng riêng, rõ, có nguồn; mọi ý y khoa có nguồn, câu trích và đã qua An; 5 tư thế giữ cổ trung tính, có bản nhẹ hơn và chống chỉ định; hình giải phẫu có giấy phép (không AI), ảnh tư thế cùng một người mẫu, đủ file trong `hinh/`.

## Sản phẩm cần giao
| File | Người làm | Định dạng / nội dung |
|---|---|---|
| `agents/mai/dau-co-vai-gay-nguon.md` (cập nhật file có sẵn) | Mai | Giữ nguyên số [1]–[20]; nguồn mới đánh tiếp từ [21]. Mỗi ý: link + mức bằng chứng (Mạnh/Trung bình/Sơ bộ/Ý kiến) + **câu trích nguyên văn tiếng Anh** cạnh ý. Thêm mục **"## Bổ sung lượt này"** ghi rõ khoảng trống nào đã lấp (kèm [n], câu trích), khoảng trống nào vẫn còn. Cập nhật mục "Khoảng trống" và bảng "## Hình & sơ đồ trong nguồn" nếu đổi |
| `agents/an/dau-co-vai-gay-kiem-nguon.md`, `agents/an/dau-co-vai-gay-kiem-slides.md` | An | Biên bản duyệt: từng ý Đúng/Sửa/Bỏ, có số trang, mức BẮT BUỘC/NÊN, kết luận ĐẠT/CẦN SỬA |
| `output/dau-co-vai-gay/slides.md` | Lam | Kịch bản theo `templates/kich-ban-slide.md`; đầu file có bảng "mục tiêu → trang", bảng "kiểu trang mẫu → trang mới" và bảng phút; mỗi trang ghi **số phút**; cuối file "Nguồn tham khảo" và "Việc còn mở" |
| `output/dau-co-vai-gay/thiet-ke.md` | Vy | Thiết kế theo `templates/thiet-ke.md`, mỗi trang ghi "Theo kiểu mẫu tr.x"; prompt A/B/D (không mã hex); hình C có dòng "Dựng …" (khung, che nhãn Anh, nhãn Việt); cuối file **"## Danh sách hình"** (trang · tên file · loại · prompt hoặc nguồn/giấy phép · Trạng thái · cột "Có file (máy chủ ghi)" để máy chủ điền) |
| `output/dau-co-vai-gay/hinh/*` | Nhi (ảnh AI) + máy chủ (chép hình C từ `hinh-nguon/`) | Đủ mọi hình trong Danh sách hình, tên theo trang (vd `trang-09-thu-cam-tren-ghe.png`) |
| `agents/ha/dau-co-vai-gay-duyet-thiet-ke.md`, `agents/ha/dau-co-vai-gay-duyet-anh.md` | Hạ | Biên bản duyệt có số trang, mức BẮT BUỘC/NÊN, kết luận ĐẠT/CẦN SỬA |

### Việc của bước nguồn (Mai, chỉ qua Gemini)
1. Mở link Deep Research cũ trong `agents/mai/dau-co-vai-gay-deep-research.md` **một lần**. Nếu báo cáo đã xong: đối chiếu, lấy thêm câu trích cho các khoảng trống dưới đây. **Không chạy Deep Research mới.**
2. Khoảng trống còn thiếu thì **hỏi Gemini chat thường** (gộp một hoặc vài câu hỏi), yêu cầu link và câu trích nguyên văn tiếng Anh:
   - **NICE CKS Neck pain – non-specific**: câu định nghĩa, diễn tiến (cải thiện trong bao lâu, có thể tái lại), dấu hiệu cờ đỏ, khuyến cáo giữ vận động/bài tập.
   - **JOSPT Neck Pain CPG** (bản mới nhất: 2017, và bản cập nhật nếu có): khuyến cáo bài tập/giáo dục người bệnh, kèm mức khuyến cáo (A/B/C).
   - **Tr.6:** câu trích cho "tê/yếu tay **tăng dần**" và cho "chóng mặt, nhìn mờ/nhìn đôi **khi xoay cổ**" (vd khung IFOMPT 2020/2023 về động mạch cổ, hoặc trang bệnh của NHS/Mayo).
   - **Tr.6 tầng "khám sớm"** (đau ban đêm không đỡ, sụt cân không rõ lý do, tiền sử ung thư): có trích thì thêm, không thì giữ là khoảng trống.
   - Các câu đang ghi "(qua tóm tắt)": nhờ Gemini trả lại câu nguyên văn để An đối chiếu.
3. Không tự mở từng nguồn bằng WebFetch/WebSearch. Hình giải phẫu giữ bảng hiện có; chỉ thêm hình nếu Gemini chỉ ra file có giấy phép rõ (kèm link `Special:FilePath`).

## Tài liệu mẫu
- `sources/slide-mau-suy-giap.md` + ảnh chụp `sources/slide-mau-suy-giap/trang-xx`: slide Canva mẫu của Yoga Lab, **chủ đề khác (suy giáp, 27 trang/60 phút)**. Dùng làm **chuẩn phong cách và kiểu trang**, **không** làm khung nội dung (bài này 30 phút, khung là "Khung trang" bên dưới; không chép ý, không chép hình của mẫu). Các yếu tố phải giữ:
  - Bìa chữ trái + hình lớn phải (tr.1); trang định nghĩa câu chữ to + nhãn bo tròn xanh rêu chữ trắng in hoa + hình bên phải (tr.2); hình giải phẫu nhãn Việt kiểu tr.4–5 (hình trung tâm + chú thích có số).
  - Trang y khoa dạng thẻ có tiêu đề đậm, ≤ ~90 chữ; lưới ô có biểu tượng (tr.10/13); bản đồ cơ thể chấm nối (tr.11) cho triệu chứng; dòng thời gian (tr.16) cho diễn tiến; **khối cảnh báo đậm dần (tr.12) cho trang đi khám ngay**; Venn "y khoa ∩ yoga" (tr.15).
  - **Trang tư thế chỉ nhãn tên + ảnh lớn ngang** (tr.19–22); trang thở kiểu tr.23; thư giãn nền đậm + thẻ kính mờ (tr.24); tóm lược ảnh lớn + 3 thẻ kính mờ (tr.27).
  - Có trang **An toàn** và **Nguồn** (như bản suy giáp đã thêm).

### Khung trang (bắt buộc)
| Trang | Tiêu đề | Nội dung phải phủ | Kiểu mẫu | Loại hình | Phút |
|---|---|---|---|---|---|
| 1 | Bìa | WORKSHOP · YOGA NHẸ · CHO CỔ VAI GÁY KHI NGỒI MÁY TÍNH; giảng viên, ngày giờ để `[…]` | tr.1 | D người ~35–40 tuổi ngồi ghế thư thái cạnh bàn làm việc, ánh sáng ấm (không cảnh đau, không ôm cổ nhăn nhó) | 0,5 |
| 2 | Cổ & vai của bạn | Nói đơn giản: **7 đốt sống cổ** đỡ đầu, cho cổ cúi–ngửa–xoay; **cơ thang** (phủ gáy–vai–lưng trên, nâng và giữ bả vai); **cơ nâng vai** (từ cổ xuống góc bả vai, "nhún vai"); ẩn dụ đời thường (vd "cột đỡ + dây néo"); con số (vd khối lượng đầu) **chỉ khi có câu trích** | tr.4/5 (hình trung tâm + chú thích số) | **C** đốt sống cổ + cơ thang + cơ nâng vai có giấy phép, nhãn Việt | 2 |
| 3 | Đau cổ vai gáy không đặc hiệu | 1 câu định nghĩa chữ to (đau vùng cổ–vai không do một bệnh cụ thể/tổn thương nặng; theo NICE CKS nếu có trích, không thì theo NHS/Mayo); **triệu chứng thường gặp**: đau mỏi, cứng cổ, khó xoay, căng vai gáy, đau đầu (theo [1]); tê/châm chích tay nối sang tr.6. Không hướng dẫn tự chẩn đoán | tr.2 + tr.11 | **C** vùng cổ–vai có giấy phép (hoặc E bóng người Canva) + chấm nối E | 2 |
| 4 | Vì sao ngồi lâu dễ đau | Yếu tố hay đi kèm: ngồi lâu một tư thế, ít đổi tư thế/ít vận động, lặp lại một động tác, căng thẳng… **chỉ giữ yếu tố có câu trích**. **Tư thế: nêu đúng mức** (có liên quan ở người lớn, nghiên cứu cắt ngang, chưa chứng minh là nguyên nhân, theo [10]); không dọa, không có "cổ chịu x kg khi cúi" | tr.10 / tr.13 | A biểu tượng nét mảnh (người ngồi máy tính, đồng hồ, không vẽ cột sống/cơ) hoặc E | 1,5 |
| 5 | Diễn tiến | **Phần lớn đỡ dần**, mốc thời gian đúng như nguồn ("vài tuần" [3]); **có thể tái lại** chỉ khi có trích; không hứa khỏi; đau kéo dài/không đỡ → đi khám | tr.16 | E dòng thời gian Canva | 1 |
| 6 | Dấu hiệu cần đi khám ngay | **Trang riêng.** Bắt buộc 4 nhóm: **tê, yếu tay tăng dần** (hoặc vụng tay, đi đứng loạng choạng); **đau sau chấn thương** (ngã, va chạm, tai nạn xe); **sốt kèm cứng cổ** (kèm đau đầu dữ dội/sợ ánh sáng); **chóng mặt, nhìn mờ/nhìn đôi khi xoay cổ**. Chữ trên slide bám đúng câu trích (nếu không có trích cho "tăng dần"/"khi xoay cổ" thì dùng cách nói của nguồn, An quyết định). Tầng "gọi 115/cấp cứu ngay" chỉ cho dấu hiệu nguồn ghi là cấp cứu, **115 có nguồn Việt Nam** [19]; tầng "khám sớm" chỉ khi có trích | tr.12 | E khối cảnh báo đậm dần, biểu tượng Canva | 1,5 |
| 7 | Vận động là trợ thủ | Venn: y khoa (khám, theo dõi; điều trị **chỉ ghi "hỏi bác sĩ/vật lý trị liệu"**, không nêu thuốc/tiêm/nắn chỉnh) ∩ vận động & yoga (giữ hoạt động, bài tập cổ–vai–bả vai, kéo giãn nhẹ, thở – thư giãn); khuyến cáo theo **NICE CKS, hướng dẫn JOSPT về đau cổ, Cochrane (bài tập cho đau cổ)**, nguồn nào chưa có trích thì không dẫn tên trên slide, ghi vào "Việc còn mở"; bằng chứng yoga **ghi đúng mức** (sơ bộ [8]); câu chốt "Yoga không thay thế y khoa, mà phối hợp song song" | tr.15 | E Venn Canva | 1,5 |
| 8 | Tập an toàn | **Quy tắc đau:** tê/châm chích lan xuống tay, chóng mặt, nhìn mờ → **dừng**; đau tăng rõ hoặc kéo dài sau tập → làm nhẹ hơn; mỏi nhẹ tại chỗ, hết nhanh có thể chấp nhận (có nguồn, không có thì ghi "kinh nghiệm thực hành"); **bỏ hẳn:** trồng chuối đầu, cây nến, cái cày, xoay cổ vòng tròn mạnh, kéo cổ bằng tay; dấu hiệu dừng tập; chống chỉ định chung (đang có dấu hiệu tr.6, mới chấn thương/phẫu thuật cổ chưa được phép); "đang điều trị? hỏi bác sĩ hoặc vật lý trị liệu" | tr.12 (khối) | A biểu tượng nét mảnh hoặc E | 1,5 |
| 9 | Tư thế trên ghế | 3 tư thế ghế (xem Danh sách tư thế), ghế áp tường | tr.22 (3 ảnh, ghi lý do khác mẫu) | 3 ảnh B | 6 |
| 10 | Tư thế nằm | 2 tư thế nằm, kèm hướng dẫn **xuống/lên thảm an toàn** (lăn nghiêng, chống tay) và **bản thay thế trên ghế** | tr.22 | 2 ảnh B cạnh nhau | 5 |
| 11 | Hít thở & thư giãn | **Một** bài thở (thở bụng/cơ hoành, ngồi ghế hoặc nằm; **vai không nhô lên khi hít**; thở ra dài hơn hít vào, đếm ~1 giây/nhịp, **không nín thở**, chóng mặt thì dừng) + thư giãn ngắn có đỡ (nằm ngửa, chăn gấp dưới đầu cho cổ trung tính, chăn cuộn dưới gối); ngồi dậy bằng lăn nghiêng. Bằng chứng thở ghi đúng mức ([11] thấp, [7] không thống nhất) | tr.23 + tr.24 | A người thở/nằm nét mảnh, nền đậm, thẻ kính mờ | 3 |
| 12 | Thói quen khi ngồi máy tính | Đổi tư thế và **nghỉ giải lao ngắn định kỳ** (đứng dậy, đi lại, vài động tác tr.9); chỉnh ghế–màn hình–bàn phím cho dễ chịu; **ghi đúng mức**: bằng chứng phòng ngừa của chỉnh chỗ ngồi/nghỉ giải lao còn hạn chế [9]; con số (vd "mỗi 30 phút") **chỉ khi có câu trích**, không thì ghi "kinh nghiệm thực hành" | tr.13 / tr.10 | A biểu tượng nét mảnh (không vẽ cột sống) | 2 |
| 13 | Tóm lược | 3 điều mang về: biết dấu hiệu cần đi khám ngay · vận động nhẹ đều đặn, ngồi lâu nhớ nghỉ · chuỗi 5 tư thế + thở, tập theo quy tắc đau | tr.27 | D ảnh lớn + 3 thẻ | 1 |
| 14 | Nguồn tham khảo | Danh sách [n] chữ nhỏ, chiếu lúc hỏi đáp | — | Không hình (ghi lý do) | 0 |

Dự phòng chuyển chỗ/hỏi đáp: **1,5 phút** (ghi trong bảng phút). Tổng = 30.

### Danh sách tư thế (đề xuất; cổ trung tính, biên độ nhỏ, chậm)
**Trên ghế** (ghế tựa chắc, không bánh xe, áp tường; ngồi giữa ghế, bàn chân phẳng; chăn gấp dưới chân nếu chân không chạm sàn):
1. **Ngồi ghế thu cằm nhẹ** (kéo dài gáy): đầu trượt nhẹ ra sau như "gật đầu thật nhỏ", không cúi, không ngửa; giữ vài nhịp thở, lặp lại.
2. **Mèo – bò trên ghế** (tay đặt trên đùi): cong – duỗi lưng trên theo hơi thở, **đầu đi theo lưng**, cổ không gập/ngửa quá phần lưng.
3. **Ngồi ghế mở ngực với dây tập**: hai tay cầm dây rộng hơn vai, đưa ra trước ngang ngực, kéo nhẹ hai đầu dây ra ngoài, bả vai khép về sau – xuống; vai không nhún lên tai.

**Nằm** (thảm, chăn gấp dưới đầu cho cổ trung tính):
4. **Nằm ngửa mở ngực có đỡ**: co gối, chăn cuộn **thấp** dọc hoặc ngang dưới lưng trên, chăn gấp dưới đầu cao vừa đủ để **cằm không ngửa**; tay dang thấp chữ "W" hoặc đặt trên bụng. Không làm Con cá ngửa cổ.
5. **Nằm nghiêng mở sách**: nằm nghiêng co gối, chăn/gạch kê đầu để cổ thẳng hàng, chăn kẹp giữa hai gối; mở tay trên ra sau trong biên độ dễ chịu, đầu nằm yên trên đỡ.

Lam có thể thay **một** tư thế nếu nguồn hoặc An cho thấy không hợp (ghi lý do vào "Việc còn mở"); tư thế thay vẫn phải ngồi ghế hoặc nằm, cổ trung tính, chỉ dùng đạo cụ có sẵn, không thuộc danh sách bỏ hẳn. **Không** dùng nghiêng/xoay đầu có tay kéo, không xoay cổ vòng tròn. Các tư thế không có nguồn riêng thì ghi "hướng dẫn thực hành của Yoga Lab", không gán mức bằng chứng.

Loại hình theo `templates/thiet-ke.md`: A minh hoạ nét AI (không y khoa) · B ảnh tư thế AI · C hình y khoa có giấy phép · D ảnh không khí · E sơ đồ khối Canva. Phút là đề xuất; Lam chỉnh được nhưng phải giữ tiêu chí 2.

## Tiêu chí hoàn thành
1. **Khung:** `slides.md` có **13 trang nội dung + trang 14 Nguồn**, đúng thứ tự Khung trang; bảng "mục tiêu → trang" đầu file phủ đủ 12 mục của mục tiêu (cổ & vai, đau không đặc hiệu, vì sao ngồi lâu, triệu chứng, diễn tiến, đi khám ngay, vận động hỗ trợ, quy tắc đau, 5 tư thế, hơi thở, thói quen ngồi máy tính & nghỉ giải lao, tóm lược).
2. **Thời lượng:** tổng phút **đúng 30**; thực hành tr.9–11 **≥ 13 phút**; mỗi trang tư thế: thời gian giữ/số lần + chuyển chỗ/đạo cụ ≤ số phút của trang.
3. **Đi khám ngay (tr.6):** trang riêng, đủ 4 nhóm dấu hiệu bắt buộc (tê yếu tay tăng dần · đau sau chấn thương · sốt kèm cứng cổ · chóng mặt/rối loạn thị giác khi xoay cổ), mỗi nhóm có [n] nguồn uy tín kèm câu trích (chữ trên slide không vượt câu trích); nếu có "gọi 115" thì có nguồn Việt Nam; nằm ở "Ý chính" (học viên nhìn thấy), không chỉ trong Lời giảng.
4. **Bằng chứng đúng mức:** vai trò tư thế (tr.4), diễn tiến (tr.5), hiệu quả bài tập/yoga/thở (tr.7, tr.11), lời khuyên ngồi/nghỉ giải lao (tr.12) ghi đúng mức nguồn nói ("nhiều người", "có thể", "bằng chứng còn hạn chế"), có câu trích; không con số nào thiếu câu trích.
5. **NICE CKS / JOSPT / Cochrane:** tr.7 dẫn đúng Cochrane [7]; NICE CKS và JOSPT được dẫn trên slide **chỉ khi** file nguồn có câu trích khuyến cáo; nguồn nào chưa có thì ghi rõ trong "Việc còn mở" của `slides.md` (không dẫn tên suông).
6. **Nguồn:** mọi nhận định y khoa có [n] ngay sau đúng cụm, trỏ đúng trang Nguồn và có câu trích nguyên văn trong `agents/mai/dau-co-vai-gay-nguon.md`; An đã kiểm Đúng/Sửa/Bỏ (mở link, hoặc ghi rõ đối chiếu qua câu trích khi trang chặn); mọi dòng Sửa/Bỏ đã xử lý.
7. **5 tư thế:** đúng danh sách (hoặc thay 1 có lý do); mỗi tư thế có tên Việt + tên Phạn (hoặc "không có tên Phạn chuẩn"), đạo cụ và cách đặt (chỉ ghế, thảm, gạch xốp, chăn, dây tập), cách vào/ra, bản nhẹ hơn, thời gian giữ/số lần, **chống chỉ định riêng**, câu "tê lan xuống tay, chóng mặt thì dừng"; cổ trung tính được nói rõ; không tư thế nào thuộc danh sách bỏ hẳn; tr.10 có xuống/lên thảm và bản thay thế trên ghế.
8. **Tập an toàn (tr.8) và thở (tr.11):** tr.8 có quy tắc đau (nguồn hoặc "kinh nghiệm thực hành"), đủ 5 mục bỏ hẳn, dấu hiệu dừng tập, chống chỉ định chung, "có dấu hiệu tr.6 thì không tập, đi khám" — tất cả trong "Ý chính"; tr.11 đúng một bài thở, ~1 giây/nhịp, thở ra dài hơn, vai không nhô, không nín thở, dừng khi chóng mặt; thư giãn có chăn đỡ đầu; ngồi dậy lăn nghiêng.
9. **Lời lẽ & phạm vi:** máy soát không lỗi; không có "chữa khỏi", "hết hẳn", "trị dứt", "chắc chắn", "thần thánh", "nắn lại đốt sống", "chỉnh lại cổ", "text neck"/"cổ chịu x kg" kiểu dọa; không nêu tên thuốc, tiêm, nắn chỉnh/manipulation ngoài câu "hỏi bác sĩ"; không chẩn đoán hộ; mật độ tr.2–8, 12 ≤ ~90 chữ; trang tư thế "Ý chính: —".
10. **Hình — mỗi trang:** `thiet-ke.md` đủ 14 trang, mỗi trang có hình đúng loại ở Khung trang hoặc ghi lý do không cần; "## Danh sách hình" đủ mọi hình, mỗi dòng có prompt (A/B/D) hoặc nguồn + tác giả + giấy phép + link tải thẳng (C); dòng "Hình" trong `slides.md` khớp `thiet-ke.md` từng trang.
11. **Hình — y khoa:** hình tr.2, tr.3 (đốt sống cổ, cơ thang, cơ nâng vai, vùng cổ–vai) **lấy từ nguồn có giấy phép** (OpenStax, Wikimedia Commons, Servier Medical Art, NIH) hoặc dựng khối Canva theo nguồn; **không dùng AI**; giấy phép CC BY-SA ghi đủ tác giả; có dòng "Dựng …" che/cắt nhãn Anh, nhãn Việt; Hạ đã mở file thật và xác nhận hình đúng ý câu trên slide (thấy rõ đốt sống cổ, cơ thang, cơ nâng vai).
12. **Hình — ảnh AI & file:** 5 prompt B dùng **cùng một mô tả người mẫu** (xem Giả định) chép y nguyên; ảnh ngang thấy trọn người và đạo cụ, **cổ trung tính (không cúi/ngửa/xoay gắt)**, vai không nhún, không chữ, đạo cụ đúng câu trong kịch bản và chỉ có đạo cụ có sẵn (không bolster); ảnh ghế: ghế không bánh xe, áp tường; mọi file trong Danh sách hình có cột "Có file" = có.

## Ràng buộc
- **Y khoa đi trước, yoga hỗ trợ.** Không chẩn đoán, không hứa khỏi/hết đau; không bàn thuốc, tiêm, nắn chỉnh (kể cả manipulation/mobilization trong JOSPT), gối/đai cổ ngoài câu "hỏi bác sĩ/vật lý trị liệu".
- **Bỏ hẳn:** trồng chuối đầu, cây nến, cái cày, xoay cổ vòng tròn mạnh, kéo cổ bằng tay; cũng không ngửa cổ ra sau (Con cá không đỡ, Rắn hổ mang cao), không chống/tì trọng lượng lên đầu, không nín thở gắng sức.
- **An toàn tư thế:** ưu tiên ngồi ghế và nằm; cổ trung tính, đầu đi theo lưng; biên độ nhỏ, chậm; người đang tê tay luôn có bản nhẹ hơn; chuyển ghế → thảm → dậy chậm, lăn nghiêng. Ghế tựa chắc, không bánh xe, áp tường.
- **Đối tượng 25–55, dân văn phòng:** ví dụ đời thường (ngồi máy tính, họp online, xem điện thoại, đeo túi một bên); **không dọa** ("text neck", "cổ chịu 27 kg", "thoái hoá sớm"); chữ trên slide cỡ ≥ 20.
- **Giọng văn:** tiếng Việt gần gũi, ẩn dụ đời thường như mẫu; từ chừng mực ("có thể", "nhiều người", "thường"); thống nhất "giảng viên".
- **Nguồn:** Mai chỉ tìm qua Gemini (link Deep Research cũ, Gemini chat thường); không WebFetch/WebSearch, không chạy Deep Research mới. Không gán nguồn cho ý nguồn không trực tiếp nói; ý không có câu trích thì bỏ hoặc ghi "kinh nghiệm thực hành".
- **Hình:** không chữ trong ảnh AI; **hình y khoa/giải phẫu (đốt sống cổ, cơ thang, cơ nâng vai, bản đồ triệu chứng) lấy từ nguồn có giấy phép, không dùng AI**; AI chỉ cho ảnh tư thế (B), ảnh không khí (D) và minh hoạ nét không y khoa (A); không chép hình của mẫu; không ảnh MRI/X-quang/máu/thuốc/kim tiêm; không mã hex trong prompt.
- **Người duyệt không sửa hộ:** mở file thật (nguồn, ảnh chụp mẫu, ảnh trong `hinh-nguon/` và `hinh/`), ghi danh sách sửa có số trang và mức BẮT BUỘC/NÊN; lỗi nằm ở file của người khác thì ghi rõ file + trang để máy chủ giao đúng người; kết luận ĐẠT/CẦN SỬA. Tin cột "Có file (máy chủ ghi)", không tự kết luận file có/chưa.
- Bàn giao ghi rõ file đã tạo và việc còn mở.

## Quyết định đã chốt
- (plan-20261020-220605, áp dụng nguyên tắc) Ý nào **không có câu trích nguyên văn thì bỏ hẳn**, giữ các ý đã có trích.
- (plan-20261020-220605, áp dụng nguyên tắc, cập nhật theo quy định mới) Báo cáo Gemini chậm: Mai lấy toàn văn từ link chat đã có, **không chạy lại Deep Research**; vẫn không ra thì **hỏi Gemini chat thường** (không còn mở từng nguồn bằng WebFetch).
- (plan-20261020-220605, áp dụng nguyên tắc) Ảnh tư thế AI khó vẽ: `thiet-ke.md` ghi sẵn phương án dự phòng (đổi đạo cụ/góc chụp, không dùng bolster vì bài này không có); tạo lại tối đa 2 lần rồi báo.
- (plan-20261022-203403, áp dụng nguyên tắc) Khi phải chọn giữa biên độ lớn và đúng mốc an toàn của brief, chọn bản **biên độ nông** cho đúng brief.
- (plan-20261016-204631) Cây cầu có đỡ (gạch thấp nhất 1–3 phút) không thuộc danh sách bài này; nếu Lam thay một tư thế bằng Cây cầu thì áp dụng đúng mốc đó và không để cằm ép ngực.

Giả định của Chef (chủ dự án có thể đổi; ghi vào "Việc còn mở" nếu thấy cần):
- Mục tiêu ghi "khoảng 12 trang": chốt **13 trang nội dung + 1 trang Nguồn (0 phút, chỉ chiếu lúc hỏi đáp)**; triệu chứng gộp vào trang định nghĩa (tr.3); 5 tư thế xếp 2 trang (3 ghế + 2 nằm) theo thứ tự ghế → thảm → thở/thư giãn để ít chuyển chỗ; không có trang mục lục (bài 30 phút).
- NICE CKS và JOSPT bị chặn khi mở trực tiếp: nếu Gemini cũng không cho được câu trích, slide dẫn NHS/Mayo/Cochrane cho cùng ý và ghi "NICE CKS / JOSPT chưa đối chiếu được nguyên văn" trong "Việc còn mở" (không dừng dự án vì việc này).
- **Người mẫu ảnh tư thế (BH-2), khác template mục B:** "Photorealistic photo of the same Vietnamese woman in her late 30s, shoulder-length black hair tied back, sage green short-sleeve fitted t-shirt and dark grey full-length leggings"; giữ phần còn lại của khuôn B (thảm xám đậm, tường be, monstera, ánh sáng cửa sổ trái, ảnh ngang thấy trọn người), bỏ mã hex. Đạo cụ: ghế gỗ tựa lưng chắc không bánh xe, gạch xốp, chăn gấp màu kem, dây tập vải màu be.
- Bảng màu **Xô thơm**; Lora + Be Vietnam Pro.
- Bìa: giảng viên và ngày giờ để chỗ trống, chủ dự án điền sau.
