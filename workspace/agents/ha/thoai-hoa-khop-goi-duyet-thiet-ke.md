# Biên bản duyệt thiết kế · thoai-hoa-khop-goi (Hạ, bước 8)

Đã đọc: brief, `thiet-ke.md` (cả file), `slides.md` tr.2–9 (dòng Hình, đạo cụ, thời gian), mở bằng Read hai hình C trong `hinh-nguon/`, kiểm link Commons bằng kiem_link. Máy soát `thiet-ke.md`: không lỗi.

## Hình C tr.2 (tiêu chí 10)
- `khop-goi-lanh-giai-phau.png` (Mysid, Public domain): đúng nội dung (khớp gối lành, nhìn nghiêng), không AI. Link trang File mở được, giấy phép khớp. Vị trí 5 nhãn Việt Vy nêu (xương đùi 695,232 · bánh chè 1260,459 · sụn khớp 975,690 · sụn chêm 1270,932 · xương chày 970,1687) đúng với các chấm đỏ trong ảnh. Nhưng ảnh gốc có **14 chấm đỏ**, không phải 5 (xem V1).
- `khop-goi-thoai-hoa-minh-hoa.jpg` (Injurymap, CC BY 4.0): đúng nội dung (khe khớp, sụn mỏng, gai xương nhỏ), không chữ, màu mềm, không đáng sợ. Link mở được, giấy phép khớp. Vùng cắt x 640–1270 giữ trọn chân, bỏ nền trắng; vị trí hai nhãn "Sụn mỏng, mòn" (vòng sụn mờ ở khe khớp) và "Gai xương" (các chấm nhỏ ở mép khe) đúng với ảnh.
- Hai hình khác góc nhìn: đã được ghi chú, chấp nhận (không xoay là đúng).

## Danh sách vấn đề
| Mã | File | Vị trí | Mức | Loại | Vấn đề | Đề xuất |
|---|---|---|---|---|---|---|
| V1 | output/thoai-hoa-khop-goi/thiet-ke.md | Trang 2, mục Nhãn thêm trong Canva (hình lành) | BẮT BUỘC | khac | Ảnh lành còn 14 chấm đỏ cùng đường dẫn (gân cơ tứ đầu, dây chằng chéo, bên, gân bánh chè, xương mác...) mà chỉ 5 chấm được gắn nhãn Việt, nên sau khi cắt sẽ còn nhiều chấm và đường đỏ không nhãn gây rối cho người xem 50–70 tuổi. | Ghi rõ: che các chấm và đường đỏ không dùng bằng hình chữ nhật cùng màu nền (trắng) hoặc bỏ chúng trong Canva, chỉ giữ 5 chấm có nhãn; sửa câu "có sẵn 5 chấm đỏ" thành đúng số thực. |
| V2 | output/thoai-hoa-khop-goi/thiet-ke.md | Trang 4, Ghi chú và bố cục | BẮT BUỘC | qua-chu | Trang An toàn khoảng 105 chữ, vượt ngưỡng ~90 của tiêu chí 3 (Vy đã tự ghi nhận). | Áp dụng luôn cách rút trong ghi chú: bỏ cụm "[n]" thành chỉ số nhỏ, rút "Tránh" còn một dòng "quỳ, ngồi xổm, kiết già, ngồi lên gót, xoay gối, nhảy", giữ mọi ý an toàn; ghi lại số chữ sau rút (≤ ~90). |
| V3 | output/thoai-hoa-khop-goi/thiet-ke.md | Trang 7, prompt (1) và (2) | NÊN | lech-hai-file | Cả hai prompt thêm "chăn kem gấp mỏng dưới đầu", nhưng kịch bản tr.7 không nói chăn dưới đầu (chỉ gạch và dây); chăn chỉ có ở Savasana tr.8. | Bỏ cụm chăn dưới đầu khỏi hai prompt tr.7 (giữ "neutral neck"), hoặc nhờ Lam thêm "chăn mỏng dưới đầu nếu cổ ngửa" vào lời giảng tr.7. |
| V4 | output/thoai-hoa-khop-goi/slides.md | Trang 2 và Trang 4, dòng Hình | NÊN | lech-hai-file | Tr.2 ghi "Vy/Hạ cắt, xoay hoặc đặt cùng tỷ lệ" còn thiết kế ghi "không xoay"; tr.4 ghi khối "vàng nhạt → cam → đỏ đất" và "A hoặc E" còn thiết kế dùng be cát → đất nung nhạt → đất nung, chọn E. | Sửa dòng Hình hai trang cho khớp thiết kế: bỏ "xoay"; tr.4 ghi "E · ba tầng be cát → đất nung nhạt → đất nung + biểu tượng cảnh báo/điện thoại". |
| V5 | output/thoai-hoa-khop-goi/thiet-ke.md | Trang 2, bố cục hai hình | NÊN | khac | Tỷ lệ khung ghi "~3:5" nhưng vùng cắt thực tế khoảng 980×1750 (≈0,56) với hình lành và 630×1300 (≈0,48) với hình thoái hoá; hai hình sẽ lệch dáng. | Ghi một tỷ lệ khung chung (vd 1:2) và vùng cắt tương ứng (hình lành mở rộng chiều ngang hoặc hình thoái hoá nới x 600–1310). |

## Chấm tiêu chí
- 9 (hình mỗi trang): đạt. Đủ 9 trang + tr.10 có lý do không hình; Danh sách hình đủ 14 dòng, có prompt hoặc nguồn + giấy phép.
- 10 (hình y khoa): đạt có điều kiện: nguồn, tác giả, giấy phép, link đúng, không AI, đã mở file; còn V1 về chấm đỏ thừa.
- 11 (6 prompt B): đạt. Cùng một chuỗi người mẫu y nguyên; ảnh ngang thấy trọn người; gạch phẳng thấp nhất; gối trước gập nông không vượt mũi chân; ghế tựa chắc (tr.6 ghế quay mặt vào tường đúng kịch bản); dây quanh lòng bàn chân; cổ trung tính; không chữ. Chỉ lệch nhỏ V3 (chăn dưới đầu).
- 12 (trình bày): đạt trừ mật độ tr.4 (V2). Một bảng màu Xô thơm, Lora + Be Vietnam Pro, nhãn bo tròn chữ trắng in hoa, cỡ chữ nội dung ≥ 20 (ngoại lệ chữ nguồn hình và tr.10 nhỏ là hợp lý); dòng Hình hai file khớp trừ V4.
- Hình y khoa dùng AI: không có (tr.4, tr.8 hình A chỉ biểu tượng cảnh báo và tư thế nghỉ).

## Câu hỏi cho chủ dự án
Không

KẾT LUẬN: CẦN SỬA
