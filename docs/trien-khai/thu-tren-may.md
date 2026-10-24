# Việc chủ dự án làm trên máy sau mỗi đợt

Người triển khai không chạy được Claude Code, Chrome hay Windows trong môi trường viết code. Những phần đó bạn thử trên máy mình, theo từng đợt dưới đây.
Mỗi lần thử: **cập nhật code** (lấy bản mới của repo), **mở lại văn phòng** (đóng cửa sổ đen rồi nhấp đúp `start-windows.bat`), rồi làm theo danh sách.

Gặp lỗi thì ghi lại ba thứ:
- mã lượt chạy (trang Báo cáo → bấm vào lượt đó);
- nguyên văn thông báo lỗi;
- vài dòng "Ghi chú điều phối" trong bảng dự án `du-an/<mã>/bang.md`.

Gửi những thứ đó cho người triển khai, hoặc ghi vào mục "Phát hiện thêm" của file đợt tương ứng.

---

## Sau Đợt 0

1. **Bản đồ mới.** Mở `workspace/index.md`: dưới 30 dòng, có "Dự án gần đây" và "Sản phẩm mới nhất". Bản cũ nằm ở `workspace/luu-tru/index-cu.md`.
2. **Kiểm Chrome trước khi chạy.**
   1. Tắt extension Claude in Chrome.
   2. Giao một dự án nhỏ có bước của Mai.
   3. Khi tới bước của Mai, dự án phải **tạm dừng** với ghi chú "Chrome chưa sẵn sàng…", không chạy cả lượt rồi mới báo.
   4. Bật lại extension, bấm "Chạy tiếp": Mai chạy bình thường.
   5. Lượt kiểm này tốn rất ít token. Muốn tắt hẳn thì đặt `"chromePreflight": false` trong `config.json`.
3. **Thử công cụ của máy chủ (MCP).** Đây là bước quan trọng nhất của Đợt 0.
   1. Trong `config.json`, đặt `"labTools": true`. Mở lại văn phòng.
   2. Giao việc lẻ cho **Lam**, nguyên văn:
      `Gọi công cụ soat_loi cho output/suy-giap-v7/slides.md rồi chép nguyên kết quả vào mục "Đã làm" của bàn giao. Không sửa file nào khác.`
   3. Chạm vào Lam khi đang chạy. Diễn biến phải có dòng **"Máy soát output/suy-giap-v7/slides.md"**, và **không** có "Dùng công cụ Bash".
   4. Bàn giao phải có dòng `Số chữ trên slide (Ý chính + Câu chốt): Trang 1: 31 · Trang 2: 39 · …`.
   5. Nếu Lam báo không có công cụ `soat_loi`, hoặc lượt chạy lỗi:
      - chép thông báo lỗi;
      - đặt lại `"labTools": false` (văn phòng chạy như cũ);
      - báo cho người triển khai. Đợt 1 khi đó sẽ chỉ dùng cách đọc bảng sau lượt.
   6. Thử xong mà ổn thì **giữ** `"labTools": true`.
4. **Câu hỏi.** Ở dự án sau, câu hỏi giống câu bạn đã trả lời trước đây phải hiện sẵn câu trả lời cũ trong ô trả lời. Mọi quyết định nằm trong `workspace/tri-thuc/quyet-dinh.md`.

---

## Sau Đợt 1: dự án thử 1 (chủ đề mới)

1. **Chọn chủ đề mới và giữ dự án nhỏ** để tiết kiệm hạn mức, ví dụ:
   `Làm slide workshop 30 phút: Yoga phục hồi cho người <chủ đề của bạn>, khoảng 12 trang.`
   Nên chọn chủ đề có dùng lại vài tư thế phục hồi quen thuộc, để Đợt 2 đo được phần dùng lại.
2. Trong lúc chạy, xem:
   - **Bảng việc**: thẻ có nhãn "⚑ n vấn đề mở" khi người duyệt báo lỗi;
   - `workspace/du-an/<mã>/van-de.md`: sổ vấn đề, có cột "Người sửa";
   - khi Hạ duyệt thiết kế mà thấy lỗi trong `slides.md`, máy chủ phải **tự chèn bước Lam sửa** (không còn "CẦN GIAO LAM");
   - bước duyệt lại chỉ liệt kê các vấn đề còn mở (xem "Việc được giao" trong ngăn chi tiết của thẻ);
   - diễn biến của Mai, Vy có dòng "Kiểm n link" hoặc "Tải hình …".
3. Sau dự án, ghi lại để so với v6, v7:
   - số lượt chạy có "Dùng công cụ Bash" (trang Báo cáo → từng lượt chạy);
   - token quy đổi của dự án; số vòng sửa; điểm nghiệm thu lần đầu;
   - số lần "Giao ban" trong ghi chú điều phối.
4. Vòng duyệt chạy sai (giao nhầm người, lặp mãi) thì đặt `"issueLedger": false` để quay về cách cũ, rồi báo người triển khai.

---

## Sau Đợt 2: bộ não

1. **Mở vault.** Trong Obsidian chọn **Open folder as vault** → chọn thư mục `workspace/`. Tên vault mặc định là "workspace".
   Muốn tên "Yoga Lab" thì đổi tên thư mục hoặc đặt `"obsidianVault"` trong `config.json` cho khớp tên vault.
2. **Nhập tri thức suy giáp v7.** Giao việc lẻ cho **An**, nguyên văn:
   ```
   Chuẩn hoá kết quả kiểm chứng suy giáp v7 cho bộ não chung. Dòng đầu file ghi: Chủ đề: suy-giap. Đọc agents/an/suy-giap-v7-kiem-chung.md và agents/an/suy-giap-v7-duyet-lai.md; với bảng nguồn và câu trích, dùng Grep trong agents/mai/suy-giap-v7-nguon.md (không đọc cả file); với lỗi AI hay vẽ sai ở ảnh tư thế, đọc agents/nhi/kinh-nghiem.md. Ghi file agents/an/nhap-tri-thuc-suy-giap.md gồm 3 bảng đúng mẫu: "## Danh sách nguồn" (| Mã nguồn | [n] | Tổ chức | Tiêu đề | Link | Loại nguồn |), "## Danh sách đã duyệt" (| Mã | Ý | Mức bằng chứng | Nguồn | Câu trích | Ghi chú |) và "## Tư thế" (| Mã | Tên Việt | Tên Phạn | Đạo cụ | Chống chỉ định | Mức bằng chứng CCĐ | Prompt ảnh đã đạt | Lỗi AI hay vẽ sai |). Chỉ đưa ý đã duyệt xong, bỏ ý còn ghi chờ. Mã viết thường, không dấu, nối gạch ngang. Cột Nguồn ghi Mã nguồn, cách nhau dấu phẩy. Câu trích để trống nếu file không có. Không mở web, không sửa file khác.
   ```
   Xong lượt, kiểm:
   - `workspace/tri-thuc/menh-de/`, `nguon/`, `tu-the/` có note mới;
   - `tri-thuc/chu-de/suy-giap.md` và `tri-thuc/00-ban-do.md` đã có;
   - mở vài note trong Obsidian; Graph view lọc theo `path:tri-thuc` thấy ý nối với nguồn.
3. **Viết vài quy tắc** vào `tri-thuc/quy-tac-cua-toi.md` (mỗi dòng một quy tắc, xoá dòng ví dụ). Từ lượt sau, agent sẽ thấy chúng ở đầu phần "BỐI CẢNH".
4. **Thử bác bỏ.**
   1. Chọn một ý trong `menh-de/`, đổi `trang_thai` thành `bac-bo`.
   2. Giao việc lẻ cho An: `Dùng tra_cuu tìm "<vài chữ của ý đó>" rồi chép kết quả vào bàn giao.`
   3. Kết quả phải có nhãn "BÁC BỎ, không dùng".
5. **Dự án thử 2.** Chạy thêm một dự án (chủ đề mới khác, hoặc mở rộng chủ đề của dự án thử 1). Xem:
   - diễn biến của Mai có "Tra bộ não…" trước khi tìm web;
   - An không mở lại link mà note nguồn đã ghi `truy_cap: ok` gần đây;
   - note tư thế, nguồn cũ có thêm dự án mới trong `dung_trong`.
6. Tuỳ thích: bật plugin lõi **Bases** để tạo bảng lọc, ví dụ ý có `trang_thai` là `can-xem-lai`, hay nguồn có `truy_cap` là `chan`.

---

## Sau Đợt 3: tự học

1. Mở `tri-thuc/he-thong/chuyen-bai-hoc.md`: bảng phân loại 81 bài học cũ. Bài nào xếp sai thì mở note `BH-…` trong Obsidian và sửa `goc`, `trang_thai`.
2. Chạy một dự án. Khi xong, mở cửa sổ **Dự án**:
   - khối **Đề xuất cải tiến**: đọc từng đề xuất sửa hướng dẫn vai (cũ → mới), bấm Duyệt, Sửa rồi duyệt, hoặc Bỏ;
   - thử **Hoàn tác** một đề xuất vừa duyệt.
3. Mở `tri-thuc/he-thong/lo-hong.md`: đây là việc của người phát triển, không phải của agent. Gửi danh sách này khi muốn sửa tiếp hệ thống.
4. Bài học hợp bước: bấm nút **Bối cảnh** của lượt đó để xem bài học và checklist đã giao (có từ Đợt 5). Ở bước có bài bậc 2, mục "Tự kiểm theo brief" phải có mã `[BH-…]` kèm "đã kiểm"; thiếu thì bảng dự án có dòng "chưa ghi checklist".

---

## Sau Đợt 4: tối ưu (bật từng cái một)

1. `"deepResearchTwoPhase": true`, rồi chạy dự án có bước nghiên cứu của Mai. Xem:
   - ghi chú "máy chủ chờ tới <giờ>";
   - Mai chạy hai lượt ngắn;
   - token quy đổi của bước nguồn so với v7 (2,14 triệu).
2. `"stepModel": { "rereview": "haiku" }`: bước duyệt lại chạy Haiku (xem cột model ở trang Báo cáo). Thấy duyệt lại bỏ sót lỗi thì xoá dòng này.
3. `"maxParallel": 2`: sau một lần duyệt có lỗi của nhiều người, các bước sửa của những người đó chạy cùng lúc.
4. Chế độ tiếp nối: khi làm lại một chủ đề (vd suy giáp v8), chọn "Tiếp nối từ dự án…" lúc tạo dự án.
   Xem `output/<chủ đề>-v<n>/` đã có sản phẩm cũ, và token bước nguồn của Mai ở khối Trí não (mục tiêu dưới 0,8 triệu).
5. Trang Báo cáo → khối **Trí não**: so các chỉ số với mục tiêu.
6. `"consultTool": true` (cần `"labTools": true`): khi agent gọi `hoi_dong_nghiep`, nhật ký dự án có dòng "Hỏi nhanh: A hỏi B".
   Mở lượt của người được hỏi ở trang Báo cáo: chỉ có thao tác Đọc/Tìm, không có Ghi hay Sửa. Thấy lượt đó ghi được file thì tắt ngay và báo người phát triển.

---

## Sau Đợt 5: lấp chỗ hở

1. **Vấn đề NÊN.** Ở dự án sau, khi người duyệt kết luận CẦN SỬA và nêu vấn đề NÊN trong file của người khác (vd Hạ duyệt thiết kế, thấy `slides.md` lệch), máy chủ phải chèn cả bước sửa cho chủ file đó. Xem `du-an/<mã>/van-de.md`: không còn vấn đề NÊN nào "Mở" tới nghiệm thu chỉ vì không ai được giao.
2. **Đếm chữ thiết kế.** Giao việc lẻ cho **Vy**, nguyên văn:
   `Gọi công cụ soat_loi cho output/thoai-hoa-khop-goi/thiet-ke.md rồi chép nguyên kết quả vào mục "Đã làm" của bàn giao. Không sửa file nào khác.`
   Bàn giao phải có dòng `Số chữ trên slide theo thiết kế (ước lượng…): Trang 1: 12 · Trang 2: 45 · … · Trang 4: 88 · …`.
3. **Vòng sửa sau nghiệm thu.** Khi nghiệm thu giao việc sửa, ghi chú dự án hiện "Chờ hồi cứu xong rồi giao vòng sửa" vài giây tới tối đa 2 phút. Bấm nút **Bối cảnh** của bước sửa: bài học vừa lên checklist ở dự án này phải có trong đó.
4. **Bối cảnh.** Bấm vào một thẻ bất kỳ trong dự án → nút **Bối cảnh** cạnh "Bàn giao": mở được file `du-an/<mã>/boi-canh/…` có quy tắc của bạn, quyết định, bài học, checklist.
5. **Trí não.** Trang Báo cáo → khối Trí não có thêm cột "Câu hỏi trùng", "An mở lại", "Ảnh ngoài thư mục" và thẻ "`index.md`: n dòng". Dự án suy giáp v6 phải hiện 6 câu hỏi trùng và 2 ảnh ngoài thư mục.
6. **BH-48.** Mở `tri-thuc/bai-hoc/BH-48.md`: `loai_loi` là `anh-sai-tu-the`, `trang_thai` là `moi`. Không đồng ý thì sửa lại trong Obsidian.

---

## Slide hoàn thiện (.pptx)

1. **Mở file đã dựng.** `workspace/output/thoat-vi-dia-dem/thoat-vi-dia-dem.pptx` (15 trang) bằng PowerPoint. Nếu PowerPoint báo "cần sửa chữa" thì ghi lại nguyên văn và báo người phát triển. Cài font Lora và Be Vietnam Pro trước để chữ đúng như bản xem trước.
2. **Xem từng trang:** chữ không tràn thẻ; tr.2, tr.3 nhãn tiếng Anh trên hình đã bị che, thay bằng nhãn Việt (tr.3 mặt cắt: số ①–⑤, chú thích dưới hình); ảnh Gemini không còn logo ngôi sao; ghi chú người nói của mỗi trang có lời giảng và lưu ý an toàn.
3. **Nút trong Dự án:** mở dự án thoát vị đĩa đệm → **Dựng lại slide** → nhật ký có dòng "Đã dựng slide hoàn thiện: … (15 trang)", rồi **⬇ Tải slide** tải được file.
4. **Dự án sau:** khi dự án xong, nhật ký tự có dòng "Đã dựng slide hoàn thiện". Có dòng "Dựng slide, cần xem: Trang n: …" nghĩa là trang đó cần ảnh mà `hinh/` chưa có.
