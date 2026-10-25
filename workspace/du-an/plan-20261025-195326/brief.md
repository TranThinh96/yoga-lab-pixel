# Brief · Thở bụng (thở cơ hoành) để thư giãn (tho-bung-thu-gian)

Thư mục chủ đề: tho-bung-thu-gian

Mọi sản phẩm cuối nằm trong `output/tho-bung-thu-gian/`; hình nguồn do máy chủ tải nằm trong `output/tho-bung-thu-gian/hinh-nguon/`, hình dùng cho slide trong `output/tho-bung-thu-gian/hinh/`. Nháp riêng: `agents/<id>/tho-bung-thu-gian-*.md`.

## Mục tiêu & người nhận
- **Người xem:** học viên yoga **mới bắt đầu**, người lớn khoẻ mạnh, không chuyên y; chưa biết cơ hoành là gì, hay thở ngực nông khi căng thẳng.
- **Người dùng sản phẩm:** giảng viên Yoga Lab đọc kịch bản để giảng trọn **10 phút** (phần mở đầu hoặc thư giãn cuối buổi tập); người dựng slide dùng `thiet-ke.md` + ảnh trong `hinh/` để dựng **không cần hỏi lại**.
- **Bối cảnh:** lớp tập trực tiếp, học viên nằm trên thảm, có gối/bolster, chăn gấp. Học viên tập theo ngay trong buổi và mang bài thở về tự tập ở nhà.
- **Thông điệp chính:** "Thở chậm, êm bằng bụng, không gắng sức: một cách đơn giản để cơ thể dịu lại."
- **Đây là dự án thử nhỏ:** giữ gọn, nhưng đi đủ các bước làm – duyệt như dự án lớn.
- **Thế nào là "đạt":** 4 trang đúng Khung trang, tổng đúng 10 phút; học viên mới nhìn trang 1 hiểu cơ hoành đi xuống khi hít vào, đi lên khi thở ra; tập theo được trang 2 không cần hỏi; trang 4 nói rõ khi nào dừng; mọi ý y khoa có nguồn, có câu trích, đã qua An; hình cơ hoành có giấy phép (không AI); ảnh tư thế cùng một người mẫu, đủ file trong `hinh/`.

## Sản phẩm cần giao
| File | Người làm | Định dạng / nội dung |
|---|---|---|
| `agents/mai/tho-bung-thu-gian-nguon.md` | Mai | Nguồn theo **từng trang của Khung trang**, gộp **một** lượt Deep Research. Mỗi ý: link + mức bằng chứng (Mạnh/Trung bình/Sơ bộ/Ý kiến) + **câu trích nguyên văn tiếng Anh** cạnh ý. Phủ: cơ hoành là cơ hô hấp chính, co–dẹt xuống khi hít vào, giãn–vồng lên khi thở ra (thở ra thường là thụ động); thở cơ hoành/thở chậm và thư giãn (mức bằng chứng thật); cách tập nằm ngửa (một tay ngực một tay bụng, bụng phồng khi hít, nhịp chậm); dấu hiệu dừng (chóng mặt, tê/châm chích, khó thở, đau ngực…); ai cần lưu ý (vd thai kỳ nằm ngửa lâu, bệnh hô hấp/tim mạch đang điều trị) — **chỉ ý có câu trích**. Đánh số [n] để Lam dùng thẳng. Bảng **"## Hình & sơ đồ trong nguồn"** cho tr.1 (cơ hoành khi hít vào – thở ra, ưu tiên OpenStax A&P 2e chương Hô hấp, Wikimedia Commons, Servier): link trang File: + link tải `Special:FilePath` + tác giả + giấy phép + [DÙNG ĐƯỢC]/[KHÔNG] |
| `output/tho-bung-thu-gian/slides.md` | Lam | Kịch bản theo `templates/kich-ban-slide.md`; đầu file có bảng "mục tiêu → trang" và bảng phút; mỗi trang ghi **số phút**; cuối file "Nguồn tham khảo" và "Việc còn mở" |
| `output/tho-bung-thu-gian/thiet-ke.md` | Vy | Thiết kế theo `templates/thiet-ke.md`, mỗi trang ghi "Theo kiểu mẫu tr.x"; prompt ảnh A/B/D (không mã hex); hình C kèm dòng "Dựng" (khung/che nhãn Anh → nhãn Việt); cuối file **"## Danh sách hình"** |
| `output/tho-bung-thu-gian/hinh/*` | Nhi (ảnh AI) + máy chủ (chép hình C) | Đủ mọi hình trong Danh sách hình, tên theo trang (vd `trang-03-nam-ho-tro.png`) |
| Biên bản duyệt trong `agents/an/`, `agents/ha/` | An, Hạ | Danh sách sửa có số trang, mức BẮT BUỘC/NÊN, kết luận ĐẠT/CẦN SỬA |

## Tài liệu mẫu
- `sources/slide-mau-suy-giap.md` + ảnh chụp `sources/slide-mau-suy-giap/trang-xx`: slide Canva mẫu của Yoga Lab, **chủ đề khác (suy giáp, 27 trang/60 phút)**. Chỉ dùng làm **chuẩn phong cách và kiểu trang**, **không** làm khung nội dung (không giữ 27 trang, không chép ý, không chép hình). Kiểu trang cần dùng lại:
  - Tr.2 mẫu (nhãn bo tròn xanh rêu + câu định nghĩa chữ to + hình bên phải) và tr.4–5 mẫu (hình giải phẫu, chú thích nhãn Việt có số) → **tr.1**.
  - Tr.23 mẫu "Hít thở đúng cách" (thẻ be + thẻ checklist, đường sóng nét mảnh) + quy tắc "Các bước làm theo" trong `templates/thiet-ke.md` → **tr.2**.
  - Tr.22 mẫu (nhãn tên tư thế + ảnh lớn ngang, nằm ngửa bắp chân gác bolster) và tr.24 mẫu (thư giãn) → **tr.3**.
  - Tr.12 mẫu (khối cảnh báo, một điểm nhấn đất nung) + trang Nguồn mà bản suy giáp đã thêm → **tr.4**.

### Khung trang (bắt buộc)
| Trang | Tiêu đề | Nội dung phải phủ | Kiểu mẫu | Loại hình | Phút |
|---|---|---|---|---|---|
| 1 | Thở bụng là gì? | Tên bài + 1 câu định nghĩa chữ to (thở chủ yếu bằng cơ hoành, bụng phồng nhẹ khi hít vào); cơ hoành: cơ hình vòm dưới phổi; **hít vào: co, dẹt xuống, phổi nở, bụng nhô ra**; **thở ra: giãn, vồng lên, bụng xẹp** (thở ra thường không cần gắng); một ẩn dụ đời thường (vd pít-tông, cái ô); vì sao giúp thư giãn — **ghi đúng mức nguồn** | tr.2 + tr.4/5 | **C** cơ hoành hít vào – thở ra, có giấy phép, nhãn Việt | 2,5 |
| 2 | Cách tập khi nằm ngửa | **Các bước** (4–6 bước): nằm ngửa co gối, bàn chân trên thảm; một tay đặt ngực, một tay đặt bụng; hít vào chậm qua mũi, tay trên bụng nâng lên, tay ngực gần như yên; thở ra chậm, bụng hạ; nhịp đếm cụ thể (vd hít ~3, thở ra ~4–5, mỗi nhịp ~1 giây), **thở ra dài hơn hoặc bằng hít vào, không nín thở**; số vòng / thời gian tập (vd 5–10 hơi hoặc vài phút); không cố phình bụng hết cỡ | tr.23 | **B** người nằm ngửa co gối, tay ngực – tay bụng + thẻ bước E | 4 |
| 3 | Nằm thư giãn có đỡ | Nằm ngửa, **gối/bolster dưới gối**, **chăn gấp dưới đầu** (cổ không ngửa ra sau); tay thả hai bên; tiếp tục thở bụng nhẹ; giữ vài phút; **ra khỏi tư thế:** co gối, lăn nghiêng, chống tay ngồi dậy chậm; bản thay thế: nằm nghiêng có gối kẹp giữa hai đầu gối | tr.22 (trang tư thế: nhãn tên + 1 ảnh lớn ngang) | **B** nằm ngửa bolster dưới gối, chăn dưới đầu | 2,5 |
| 4 | An toàn & nguồn tham khảo | **Dừng, thở lại bình thường** khi: chóng mặt/choáng, tê hoặc châm chích tay – môi, khó thở, đau ngực (đau ngực/khó thở nặng: gọi 115 — chỉ ghi nếu có nguồn, số 115 có nguồn Việt Nam); không nín thở, không gắng sức; ai cần hỏi bác sĩ/lưu ý (chỉ ý có câu trích); câu "thở bụng là hỗ trợ thư giãn, không thay điều trị"; dưới cùng: **Nguồn tham khảo [n] chữ nhỏ** | tr.12 (khối) | E khối Canva, không ảnh (lý do: trang chữ an toàn + danh sách nguồn, cần chỗ) | 1 |

Tổng = 10 phút. Không làm trang bìa riêng, không trang mục lục (bài 10 phút; tên bài đặt ở tr.1). Loại hình theo `templates/thiet-ke.md`: A nét AI (không y khoa) · B ảnh tư thế AI · C hình y khoa có giấy phép · D ảnh không khí · E khối Canva.

## Tiêu chí hoàn thành
1. **Khung:** `slides.md` có **đúng 4 trang** theo Khung trang, đúng thứ tự; bảng "mục tiêu → trang" đầu file phủ đủ 4 mục của mục tiêu.
2. **Thời lượng:** bảng phút tổng **đúng 10**; tr.2 ≥ 3 phút có thời gian cho học viên tập theo; số vòng thở tr.2 và thời gian giữ tr.3 vừa với số phút trang.
3. **Cơ hoành (tr.1):** nêu đúng chiều chuyển động — hít vào: cơ hoành co, dẹt/hạ xuống; thở ra: giãn, vồng lên — có [n] và câu trích; lợi ích thư giãn ghi đúng mức nguồn ("có thể", "giúp nhiều người"), không con số nào thiếu câu trích.
4. **Các bước (tr.2):** đủ tư thế nằm, vị trí hai tay, hít mũi, nhịp đếm cụ thể, thở ra ≥ hít vào, câu **"không nín thở"**, số vòng/thời gian; nằm trong "Ý chính" (học viên nhìn thấy).
5. **Tư thế hỗ trợ (tr.3):** đúng đạo cụ của mục tiêu (gối/bolster dưới gối, chăn dưới đầu), tên Việt + tên Phạn (vd Savasana có đỡ, hoặc ghi "không có tên Phạn chuẩn"), cách vào/ra (ra bằng lăn nghiêng), bản thay thế nằm nghiêng, thời gian giữ, chống chỉ định riêng trong "An toàn"; slide "Ý chính: —".
6. **An toàn (tr.4):** có dấu hiệu dừng tập (ít nhất chóng mặt, tê/châm chích, khó thở, đau ngực), "không nín thở, không gắng sức", nhóm cần lưu ý, câu "hỗ trợ, không thay điều trị" — trong "Ý chính", mỗi ý có [n] hoặc ghi "kinh nghiệm thực hành".
7. **Nguồn:** mọi nhận định y khoa có [n] ngay sau đúng cụm, trỏ đúng danh sách nguồn ở tr.4/cuối file, có câu trích nguyên văn trong `agents/mai/tho-bung-thu-gian-nguon.md`; An đã kiểm Đúng/Sửa/Bỏ; mọi dòng Sửa/Bỏ đã xử lý.
8. **Lời lẽ & mật độ:** máy soát không lỗi; không "chữa khỏi", "chắc chắn", "thần thánh", "thải độc", "tăng oxy cho não" hay hứa hiệu quả chữa bệnh; tr.1, tr.4 ≤ ~90 chữ trên slide (tr.4 không tính danh sách nguồn chữ nhỏ), tr.2 ≤ ~90 chữ.
9. **Hình — mỗi trang:** `thiet-ke.md` đủ 4 trang, mỗi trang có hình đúng loại ở Khung trang hoặc ghi lý do không cần (tr.4); "## Danh sách hình" đủ mọi hình, mỗi dòng có prompt (A/B/D) hoặc nguồn + tác giả + giấy phép + link tải thẳng (C).
10. **Hình — y khoa:** hình cơ hoành tr.1 **lấy từ nguồn có giấy phép** (OpenStax, Wikimedia Commons, Servier, NIH) hoặc dựng khối Canva theo nguồn; **không dùng AI**; thấy rõ hai trạng thái hít vào/thở ra đúng chiều; nhãn Việt thêm trong Canva, có dòng "Dựng" che nhãn Anh; Hạ đã mở file thật và xác nhận hình khớp câu trên slide.
11. **Hình — ảnh AI & file:** 2 prompt B (tr.2, tr.3) dùng **cùng một mô tả người mẫu** chép y nguyên; ảnh ngang thấy trọn người và đạo cụ; tr.2 thấy rõ một tay ngực, một tay bụng; tr.3 thấy rõ gối/bolster dưới gối và chăn gấp dưới đầu, cổ không ngửa; không chữ; mọi file trong Danh sách hình có trong `hinh/` (cột "Có file" do máy chủ ghi); dòng "Hình" trong `slides.md` khớp `thiet-ke.md` từng trang.

## Ràng buộc
- **Thở êm, không gắng sức:** không nín thở, không thở dồn/thở nhanh, không ép bụng phình hết cỡ; không kỹ thuật pranayama nâng cao (kapalabhati, bhastrika, nín thở kumbhaka) trong bài này.
- **Y khoa hỗ trợ, không thay thế:** không chẩn đoán, không hứa chữa bệnh (lo âu, huyết áp, hen…); lợi ích thư giãn ghi đúng mức bằng chứng; người đang điều trị bệnh hô hấp/tim mạch, đang mang thai thì "hỏi bác sĩ" (chỉ ghi nhóm có câu trích).
- **Tư thế:** chỉ nằm ngửa (và bản nằm nghiêng thay thế); cổ trung tính, có chăn dưới đầu; ra khỏi tư thế bằng lăn nghiêng, ngồi dậy chậm.
- **Ý nào không có câu trích nguyên văn thì bỏ hẳn**, hoặc ghi rõ "kinh nghiệm thực hành" nếu là hướng dẫn kỹ thuật tập.
- **Giọng văn:** tiếng Việt gần gũi cho người mới, câu ngắn, ẩn dụ đời thường; từ chừng mực ("có thể", "nhiều người"); thống nhất "giảng viên", "học viên"; chữ trên slide cỡ ≥ 20.
- **Hình:** không chữ trong ảnh AI; **hình cơ hoành/phổi/giải phẫu lấy từ nguồn có giấy phép, không dùng AI**; AI chỉ cho ảnh tư thế (B), minh hoạ nét không y khoa (A); không chép hình của mẫu; không mã hex trong prompt.
- **Mai:** nghiên cứu qua Gemini Deep Research, gộp **một** lượt cho cả 4 trang; không tự WebFetch/WebSearch.
- **Người duyệt không sửa hộ:** mở file thật (nguồn, ảnh mẫu, ảnh trong `hinh-nguon/` và `hinh/`), ghi danh sách sửa có số trang và mức BẮT BUỘC/NÊN; lỗi nằm ở file của người khác thì ghi rõ file + trang; kết luận ĐẠT/CẦN SỬA.
- Bàn giao ghi rõ file đã tạo và việc còn mở. Dự án nhỏ: không thêm trang, không mở rộng phạm vi.

## Quyết định đã chốt
- (plan-20261020-220605, áp dụng nguyên tắc) Ý nào **không có câu trích nguyên văn thì bỏ hẳn**, giữ các ý đã có trích.
- (plan-20261020-220605, áp dụng nguyên tắc) Báo cáo Gemini chậm: Mai lấy toàn văn từ link chat đã có, **không chạy lại Deep Research**; vẫn không ra thì báo lại trong bàn giao (Mai không tự WebFetch).
- (plan-20261020-220605, áp dụng nguyên tắc) Ảnh tư thế AI khó vẽ: thiết kế ghi sẵn phương án dự phòng (vd đổi bolster thành gối gấp, đổi góc chụp); tạo lại tối đa 2 lần rồi báo.
- (plan-20261022-203403, áp dụng nguyên tắc) Khi phải chọn giữa làm "sâu/nhiều" hơn và đúng mốc an toàn của brief, chọn bản **nhẹ, nông** cho đúng brief (ở đây: nhịp thở êm, không ép thở sâu).
- (plan-20261023-214835, bài thở đã duyệt) Nhịp đếm tham khảo **~1 giây/nhịp, hít 3 – thở ra 5**, không nín thở, chóng mặt thì dừng; tư thế thư giãn bolster dưới gối, chăn dưới đầu, ngồi dậy bằng lăn nghiêng. Lam dùng lại nếu nguồn mới không cho thấy cần đổi.

Giả định của Chef (chủ dự án có thể đổi; ghi vào "Việc còn mở" nếu thấy cần):
- 4 trang, không bìa riêng, nguồn chữ nhỏ ở cuối tr.4 (gộp an toàn + nguồn như mục tiêu ghi).
- **Người mẫu ảnh tư thế** theo khuôn B của `templates/thiet-ke.md` (phụ nữ Việt đầu 30 tuổi, khớp mẫu suy giáp, hợp học viên mới), bỏ mã hex; đạo cụ: bolster tròn, chăn gấp màu kem, thảm xám đậm.
- Bảng màu **Xô thơm**; Lora + Be Vietnam Pro.
