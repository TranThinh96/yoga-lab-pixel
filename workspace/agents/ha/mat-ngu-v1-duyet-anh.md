# Duyệt ảnh · mat-ngu-v1 (bước 15)

Đã mở brief, Danh sách hình trong thiet-ke.md, bàn giao Nhi, slides.md (kiểm V1–V3), và mở từng ảnh trong hinh/ (2752x1536, 16:9).

## File thật trong output/mat-ngu-v1/hinh/ (8 file) đối chiếu Danh sách hình
| Trang | File trong Danh sách hình | Loại | Có thật? | Nhận xét |
|---|---|---|---|---|
| 1 | trang-01-bia.png | D | Có | Phòng ngủ đèn dịu, trăng, lá bạc hà; trái trống cho chữ. Đạt |
| 2 | trang-02-bieu-tuong-giac-ngu.png | A | Có | Trăng, gối, đồng hồ nét mảnh, không cơ thể. Đạt |
| 3 | trang-03-dong-ho-sinh-hoc.png | C | KHÔNG (chỉ có hinh-nguon/dong-ho-sinh-hoc-nguoi.png, đã duyệt ở bước 10) | Thiếu ở hinh/ |
| 4, 5, 6, 12 | không hình (Canva/không cần) | E / — | Không cần file | Đúng brief |
| 7 | trang-07-em-be.png | B | Có | Bolster dưới ngực, chăn dưới cẳng chân và gối, đầu nghiêng, cổ trung tính, tay đủ ngón. Đạt |
| 7 | trang-07-cay-cau.png | B | Có | Một gạch phẳng thấp nhất dưới xương cùng, bàn chân phẳng, cổ trung tính, đủ ngón. Đạt |
| 8 | trang-08-goc-co-dinh.png | B | Có | Chăn dưới đầu, hai gạch đỡ đùi, cổ hơi ngả. Bolster chỉ từ lưng trên đến thắt lưng (xem V3) |
| 8 | trang-08-gac-chan-ghe.png | B | KHÔNG có | Nhi tạo 3 lần chưa đạt, không tải |
| 9 | trang-09-song-tho.png | A | Có | Sóng nét mảnh, trống phía trên phải cho chữ. Đạt |
| 10 | trang-10-nguoi-nam-trang-sao.png | A | Có | Nền đậm, người nằm nét vẽ, trăng sao; không chữ. Đạt |
| 11 | trang-11-tom-luoc.png | D | Có | Thảm, bolster, chăn, ghế, giường tím; chỗ trống cho 3 thẻ. Đạt |

Thừa/lạ trong hinh/: không. Ảnh đủ 8/10 file ảnh phải có (thiếu tr.3 và tr.8 gác chân).

## Kiểm TC10–11
- TC10: không ảnh AI nào vẽ cơ quan/cơ chế y khoa; tr.3 dùng loại C có nguồn, tr.4 Canva. Đạt.
- TC11: cùng một người mẫu, đồ xanh xô thơm, cùng phòng ở 3 ảnh tư thế: đạt. Không chữ: đạt. Đủ ngón: tay thấy đủ ở cả 3 ảnh. Đạo cụ Em bé và Cây cầu đúng kịch bản. Chưa đủ 4 ảnh (thiếu Gác chân lên ghế). Cả 8 ảnh có logo ngôi sao Gemini ở góc dưới phải (cần cắt/che).

## Các sửa CẦN GIAO LAM (bước 10)
V1 (tách "- An toàn:" ở tr.10): đã vào slides.md (dòng An toàn riêng). V2 ("dù có đủ cơ hội ngủ" tr.2, nguồn NHLBI): đã vào. V3 (dòng Hình tr.6 khớp Canva Elements): đã vào. Cả ba xong.

## Danh sách vấn đề
| Mã | File | Vị trí | Mức | Loại | Vấn đề | Đề xuất |
|---|---|---|---|---|---|---|
| V1 | output/mat-ngu-v1/hinh/trang-08-gac-chan-ghe.png | Trang 8, ảnh Gác chân lên ghế | BẮT BUỘC | file-khong-ton-tai | Thiếu ảnh thứ 4, Gemini 3 lần vẫn vẽ bàn chân tì lên lưng ghế, bắp chân chéo | Tạo lại ở chat mới bằng prompt dự phòng: hai bắp chân đặt trọn lên bolster hoặc mặt ghế, lưng phẳng trên thảm, chăn dưới đầu |
| V2 | output/mat-ngu-v1/thiet-ke.md | Danh sách hình, tr.3 | BẮT BUỘC | file-khong-ton-tai | trang-03-dong-ho-sinh-hoc.png chưa có trong hinh/ dù TC9 đòi mọi file trong danh sách có thật | Máy chủ chép hinh-nguon/dong-ho-sinh-hoc-nguoi.png thành tên đó, hoặc sửa cột tên file thành đường dẫn hinh-nguon thật |
| V3 | output/mat-ngu-v1/hinh/trang-08-goc-co-dinh.png | Trang 8, ảnh Góc cố định | NÊN | anh-sai-tu-the | Bolster ngắn, hông nằm trên thảm, kịch bản nói bolster dọc dưới lưng | Chấp nhận được; nếu tạo lại thì thêm "full-length bolster from sacrum to head" |
| V4 | output/mat-ngu-v1/thiet-ke.md | Ghi chú hình, mọi ảnh AI | BẮT BUỘC | khac | Cả 8 ảnh có logo ngôi sao Gemini ở góc dưới phải, TC11 đòi không logo AI, thiet-ke chưa ghi cách xử lý | Ghi vào thiet-ke.md: cắt hoặc che góc dưới phải (khoảng 3% chiều rộng) mọi ảnh khi dựng Canva |

## Câu hỏi cho chủ dự án
Ảnh Gác chân lên ghế: tạo lại bằng bolster dưới bắp chân (đề xuất) hay dựng bằng ảnh nguồn có giấy phép/Canva? Đề xuất: tạo lại hai lần trong chat mới với bolster; không đạt thì chụp ảnh thật trong buổi tập.

KẾT LUẬN: CẦN SỬA
