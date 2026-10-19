# Thiết kế · Yoga cân bằng phục hồi cho người suy giáp (suy-giap-v5)
- Bảng màu: Xô thơm — nền `#E4ECDF`; thẻ `#FFFFFF`/`#F4F1E8`; tiêu đề/khối đậm `#3E5F45`; phụ `#8A9A5B`, `#E3CFAE`; **đất nung `#C2654F` chỉ một điểm nhấn mỗi trang (cảnh báo)**; chữ thường `#2E3829`.
- Font (2 họ): Lora (tiêu đề 36–48, câu chốt nghiêng 24–28) + Be Vietnam Pro (nội dung 18–24).
- Khổ 16:9, lề rộng, để trống ≥ 1/3 trang. Ảnh tên `trang-NN-<tên>.png` trong `output/suy-giap-v5/hinh/`.
- Quy ước loại hình: A minh hoạ nét mảnh (AI) · B ảnh tư thế (AI) · C giải phẫu có giấy phép (không AI) · D ảnh không khí (AI) · **E sơ đồ/bảng/biểu tượng dựng bằng khối Canva** (không ảnh AI; là "lý do không cần ảnh").
- Dòng ghi nguồn hình: chữ 10–11pt, màu `#2E3829` 70%, góc dưới phải; nguồn y khoa [số] ở góc dưới trái.
- **Người mẫu cố định (chép y nguyên vào 5 prompt B):**
  `the same Vietnamese woman in her early 30s, shoulder-length black hair, sage green sports bra and high-waist shorts`
- **Khung chung ảnh B (chép y nguyên):** prefix `Photorealistic photo of ` + người mẫu + ` practicing <tư thế>, supported by <đạo cụ>, on a dark grey yoga mat, warm beige wall, monstera plants in the background, soft natural window light from the left, <góc nhìn>, full body in frame, calm relaxed face, no text` + `, 16:9`. Tạo cả 5 ảnh trong **cùng một phiên**, cùng seed/ảnh tham chiếu mặt nếu công cụ cho phép.
- Giữ / đổi so với khuôn: không có tài liệu mẫu nên giữ nguyên khuôn `templates/thiet-ke.md`. Học bài v4: tr.4 dùng hình giải phẫu có giấy phép cụ thể; mọi sơ đồ dựng Canva; chữ chỉ thêm trong Canva.

## Trang 1 · Bìa
- Bố cục: chữ trái ~55% (tiêu đề Lora 48 màu đậm, dưới là "Workshop 60 phút · Yoga Lab", dòng giảng viên/ngày giờ `<điền sau>` chữ nhỏ), câu chốt nghiêng ở cuối; ảnh tràn mép phải.
- Hình: D
- Prompt: "Photo of a calm yoga studio corner, folded dark grey mat, round bolster and folded blankets in sage green and beige tones, sage green foam blocks, monstera plant, warm beige wall, soft natural window light from the left, no people, no text, no letters, 16:9"
- Nhãn Canva: toàn bộ chữ bìa. Tên file: `trang-01-bia.png`
- Ghi chú: phủ lớp trắng mờ 60% sau khối chữ cho dễ đọc.

## Trang 2 · Mở đầu: tuyến giáp và suy giáp là gì?
- Bố cục: thẻ chữ bo góc bên trái (4 ý), hình bên phải; câu chốt nghiêng dưới thẻ.
- Hình: C — **không AI** (hình y khoa lấy từ nguồn)
- Nguồn hình: https://commons.wikimedia.org/wiki/File:Diagram_showing_the_position_of_the_thyroid_gland_CRUK_363.svg · tác giả Cancer Research UK · CC BY-SA 4.0. Sơ đồ đơn giản: bóng đầu–cổ màu xám, tuyến giáp màu vàng trước khí quản.
- Dòng ghi nguồn góc slide: "Hình: Cancer Research UK, Wikimedia Commons, CC BY-SA 4.0 (adapted: đổi nhãn sang tiếng Việt)".
- Nhãn Canva: che chữ "Thyroid gland" bằng nhãn "Tuyến giáp"; chữ thẻ; có thể thêm biểu tượng "chân ga" của thư viện Canva cạnh hình. Nguồn y khoa [1], [6] góc trái.
- Ghi chú: đổi từ ảnh AI sang hình có nguồn theo quy tắc "hình y khoa không dùng AI" (17/10/2026). Ảnh AI cũ để trong hinh/cac-ban/, không dùng.

## Trang 3 · Mục lục
- Bố cục: 5 thẻ xếp dọc nửa phải, tiêu đề "Hôm nay mình đi thế này" nửa trái; mỗi thẻ có số trang bên phải.
- Hình: E (khối Canva, biểu tượng nét mảnh có sẵn của Canva; không ảnh AI). Thẻ "Thực hành trên thảm" = điểm nhấn đất nung duy nhất.
- Nhãn Canva: 5 dòng mục lục theo slides.

## Trang 4 · Tuyến giáp nằm ở đâu, làm gì?
- Bố cục: hình giải phẫu giữa-trái (cắt ngang phần tuyến, nền thẻ trắng bo góc), 4 ý bên phải; nhãn chỉ bằng đường dẫn mảnh.
- Hình: C — **không AI**
- Nguồn hình: https://commons.wikimedia.org/wiki/File:1811_The_Thyroid_Gland.jpg · tác giả OpenStax College · CC BY 3.0 (đã mở trang xác nhận 16/10/2026). Phụ (tuỳ chọn, ảnh nhỏ 289×213 nên chỉ làm biểu tượng ≤ 4 cm): https://commons.wikimedia.org/wiki/File:Illu_thyroid_parathyroid.jpg · NCI/SEER, người tải CFCF · Public domain (tác phẩm của chính phủ Mỹ).
- Dòng ghi nguồn góc slide: "Hình: OpenStax College, 'The Thyroid Gland', Wikimedia Commons, CC BY 3.0 (adapted: đã chú thích lại tiếng Việt)".
- Nhãn Canva: "Tuyến giáp", "Khí quản", "Yết hầu (sụn giáp)", "Thùy trái / thùy phải", "Eo tuyến". Nguồn y khoa [1], [2].
- Ghi chú: ảnh gốc dọc 737×1410, cắt lấy phần tuyến + khí quản; kiểm nhãn gốc tiếng Anh đã bị che hết.

## Trang 5 · Ai ra lệnh cho tuyến giáp?
- Bố cục: 3 hộp xếp dọc giữa trang bằng mũi tên (Não → Tuyến yên → Tuyến giáp), mũi tên vòng ngược bên phải; câu chốt "bộ điều nhiệt" nghiêng bên trái.
- Hình: E (sơ đồ khối Canva, vẽ lại theo bố cục Thyroid_system.svg — Mikael Häggström, CC0: https://commons.wikimedia.org/wiki/File:Thyroid_system.svg; CC0 nên không bắt buộc ghi nguồn, vẫn ghi cho minh bạch).
- Nhãn Canva: "Não (vùng dưới đồi)", "Tuyến yên", "TSH", "Tuyến giáp", "T4, T3", "Đủ hormone: giảm tín hiệu". Nguồn [2].
- Ghi chú: không dùng AI cho sơ đồ; có thể thêm biểu tượng nhiệt kế nhỏ cạnh câu chốt.

## Trang 6 · Vì sao tuyến giáp yếu đi?
- Bố cục: lưới 5 thẻ (thẻ Hashimoto to nhất, chiếm 2 ô), biểu tượng nhỏ phía trên mỗi thẻ.
- Hình: E — khiên miễn dịch, dao mổ nét mảnh (không máu), giọt i-ốt, viên thuốc, em bé: lấy biểu tượng nét mảnh trong thư viện Canva; nếu thiếu, KHÔNG tạo bằng AI (brief: biểu tượng không AI) — giảng viên chọn biểu tượng thay thế.
- Điểm nhấn đất nung: không (trang không cảnh báo trên slide; câu "An toàn" chỉ ở lời giảng). Nguồn [1], [3], [4], [6], [7], [18].

## Trang 7 · Cơ thể "chạy chậm" trông thế nào?
- Bố cục: hình người đường nét ở giữa, 5 thẻ chữ bo góc xếp hai bên từ đầu xuống chân; câu chốt ở dải dưới (nhấn đất nung — duy nhất).
- Hình: E (vẽ lại bố cục triệu chứng theo ý tưởng của NIDDK, không sao chép ảnh); hình người dựng bằng khối/đường Canva.
- Nhãn Canva: 5 triệu chứng. Nguồn [9], [6].

## Trang 8 · Nếu không điều trị
- Bố cục: 4 thẻ tông trung tính 2×2, câu chốt nghiêng phía dưới.
- Hình: E — biểu tượng nhỏ (tim, bà bầu, xương, trăng/ngủ lịm); tuyệt đối không hình bệnh nặng, máu. Không đất nung trên slide (cảnh báo 115 ở lời giảng).
- Nguồn [10], [5].

## Trang 9 · Ai nên để ý hơn?
- Bố cục: 5 vòng tròn biểu tượng hàng ngang, nhãn ngắn dưới mỗi vòng; câu chốt dải dưới.
- Hình: E (biểu tượng tròn Canva: người nữ, 60+, hồ sơ bệnh, khiên miễn dịch, em bé). Nguồn [6], [1], [4].

## Trang 10 · Y khoa đi trước
- Bố cục: vòng tròn 4 bước ở giữa; ý chính ngắn ở trái; câu chốt giữa vòng.
- Hình: E — vòng 4 bước (Uống thuốc đều → Xét nghiệm 6–8 tuần → Bác sĩ quyết liều → Tái khám 6–12 tháng). Điểm nhấn đất nung: bước "Bác sĩ quyết liều".
- Nguồn [13], [12], [6], [11].

## Trang 11 · Uống thuốc sao cho đúng?
- Bố cục: đường thời gian ngang chiếm 2/3 trang; 4 thẻ cách xa nằm phía dưới.
- Hình: E — mốc "Thuốc giáp + nước lọc" (xanh đậm) → "30–60 phút" → "Ăn sáng, cà phê"; thẻ canxi, sắt, thuốc trung hoà acid, đậu nành/chất xơ đặt xa mốc. Không đất nung (hoặc chỉ khoảng trống "cách xa").
- Ghi chú: sát ngưỡng chữ (đếm lại theo slides.md mới nhất); nếu chật, gộp ý 3–4 thành thẻ trong sơ đồ (không thêm chữ).

## Trang 12 · Yoga hỗ trợ: bằng chứng ở mức nào?
- Bố cục: bậc thang 3 nấc bên trái (dấu mốc ở "sơ bộ"), 2 thẻ số liệu bên phải, câu chốt dưới.
- Hình: E. Nấc "sơ bộ" = điểm nhấn đất nung. Nguồn [14], [15].

## Trang 13 · An toàn (1): thuốc và hỏi bác sĩ
- Bố cục: 4 thẻ 2×2, biểu tượng khiên/viên thuốc/bác sĩ/lá; thẻ đầu "Uống thuốc đều theo bác sĩ" nhấn đất nung (duy nhất).
- Hình: E. Nguồn [12], [8].
- Ghi chú: sát ngưỡng chữ (đếm lại theo slides.md mới nhất); dòng "Hỏi bác sĩ trước nếu có…" dài nhất, cho vào thẻ thứ ba, chữ 18.

## Trang 14 · An toàn (2): khi nào dừng, khi nào gọi 115
- Bố cục: chia đôi: trái khối "Dừng và nghỉ" nền be vàng `#E3CFAE` (3 dấu hiệu), phải khối "GỌI 115" nền đất nung chữ trắng.
- Hình: E (khối). Không biểu tượng đáng sợ; một biểu tượng điện thoại nhỏ.
- Ghi chú: đất nung chỉ dùng ở khối 115.

## Trang 15 · Chuẩn bị và nguyên tắc tập
- Bố cục: trái là danh sách 5 ý; phải là sơ đồ so sánh hai hình người nằm đường nét.
- Hình: E — hai hình người nằm đường nét: trái đầu cao, cằm gập vào ngực, dấu ✗ (nhấn đất nung duy nhất); phải có chăn gấp dưới đầu, cổ thẳng, dấu ✓ (xanh rêu). Không số đo góc.
- Nguồn [16]. Ghi chú: đây là hướng dẫn cho tr.16–22, nên giữ rõ nét.

## Trang 16 · Góc cố định nằm ngửa có đỡ (Supta Baddha Konasana)
- Bố cục: nhãn bo tròn đậm ở trên (tên Việt + Phạn); ảnh lớn giữa; 3 dòng dưới (đạo cụ/giữ 2 phút; nhẹ hơn; dải "Không tập" nền đất nung nhạt chữ đậm).
- Hình: B (góc nhìn three-quarter view from the feet side, hoặc side view)
- Prompt: "Photorealistic photo of the same Vietnamese woman in her early 30s, shoulder-length black hair, sage green sports bra and high-waist shorts, practicing reclining bound angle pose lying on her back with a round bolster lengthwise under her spine, a folded blanket under her head and neck so the neck stays neutral and the chin is level, the soles of her feet touching with knees dropped open to the sides, each thigh resting on a sage green foam yoga block, both arms relaxed at her sides palms up, a light blanket covering her torso, supported by a round bolster, folded blankets and two sage green foam yoga blocks, on a dark grey yoga mat, warm beige wall, monstera plants in the background, soft natural window light from the left, three-quarter view, full body in frame, calm relaxed face, no text, 16:9"
- Nhãn Canva: "Supta Baddha Konasana", "Góc cố định nằm ngửa có đỡ", "Giữ 2 phút", dải "Không tập: …". Tên file: `trang-16-supta-baddha-konasana.png`
- Kiểm ảnh: cổ trung tính (chăn dưới đầu), gối không vặn, gạch đỡ đùi đúng chỗ, đủ ngón chân.

## Trang 17 · Gác bắp chân lên ghế có đỡ (biến thể nhẹ của Viparita Karani)
- Bố cục: như tr.16; thêm ghi chú nhỏ "Gác tường: tuỳ chọn, cần ý kiến bác sĩ".
- Hình: B (side view)
- Prompt: "Photorealistic photo of the same Vietnamese woman in her early 30s, shoulder-length black hair, sage green sports bra and high-waist shorts, practicing a gentle legs-on-chair resting pose lying flat on her back with her hips and lower back flat on the mat, both calves resting on the padded seat of a wooden chair with knees bent about 90 degrees, a thin folded blanket under her head and neck so the neck stays neutral, a light blanket over her torso, both arms relaxed at her sides palms up, supported by a wooden chair with a folded blanket on the seat, on a dark grey yoga mat, warm beige wall, monstera plants in the background, soft natural window light from the left, side view, full body in frame, calm relaxed face, no text, 16:9"
- Nhãn Canva: "Viparita Karani (biến thể ghế)", "Giữ 3 phút", "Không tập: …". Tên file: `trang-17-viparita-karani-ghe.png`
- Kiểm ảnh: hông phẳng trên thảm (không kê cao, không chân dựng tường), bắp chân trên ghế, cằm không gập.

## Trang 18 · Cây cầu có đỡ (Setu Bandhasana)
- Bố cục: như tr.16; thêm biểu tượng "cổ tự do ✓" cạnh ảnh.
- Hình: B (side view)
- Prompt: "Photorealistic photo of the same Vietnamese woman in her early 30s, shoulder-length black hair, sage green sports bra and high-waist shorts, practicing a gentle supported bridge pose lying on her back with knees bent and feet flat hip-width apart, hips lifted only slightly and resting on one sage green foam yoga block placed at its lowest flat height under the sacrum, shoulders on the mat, a thin folded blanket under her head and neck, face looking straight up at the ceiling, arms relaxed at her sides palms up, supported by one sage green foam yoga block at the lowest height and a thin folded blanket, on a dark grey yoga mat, warm beige wall, monstera plants in the background, soft natural window light from the left, side view, full body in frame, calm relaxed face, no text, 16:9"
- Nhãn Canva: "Setu Bandhasana", "Giữ 1–2 phút", "Không tập: …". Nguồn [16]. Tên file: `trang-18-setu-bandhasana.png`
- Kiểm ảnh: AI hay vẽ cầu quá cao — hông chỉ nâng thấp, gạch nằm bẹt; vai và đầu chạm thảm/chăn, cổ không xoay. Nếu không đạt, tạo lại hoặc nhờ giảng viên chụp ảnh thật.

## Trang 19 · Đứa trẻ có đỡ (Balasana)
- Bố cục: như tr.16; ý "đổi bên má" ghi chú nhỏ cạnh ảnh.
- Hình: B (three-quarter view from the side)
- Prompt: "Photorealistic photo of the same Vietnamese woman in her early 30s, shoulder-length black hair, sage green sports bra and high-waist shorts, practicing a supported child's pose kneeling with knees wide apart, a round bolster placed lengthwise between her thighs, her torso resting forward on the bolster with one cheek turned to the side on a folded blanket, both arms relaxed on the mat beside the bolster, a thin blanket over her back, supported by a round bolster and a folded blanket, on a dark grey yoga mat, warm beige wall, monstera plants in the background, soft natural window light from the left, three-quarter view, full body in frame, calm relaxed face, no text, 16:9"
- Nhãn Canva: "Balasana", "Đứa trẻ có đỡ", "Giữ 2 phút", "Không tập: …". Tên file: `trang-19-balasana.png`
- Kiểm ảnh: cổ không vặn quá, bụng không bị ép, gối mở rộng. Ghi chú: sát ngưỡng chữ (đếm lại theo slides.md mới nhất), rút dòng "Không tập" bằng cách bỏ câu "Thai kỳ…" khỏi slide nếu Lam đồng ý (còn trong lời giảng).

## Trang 20 · Hơi thở: chậm và êm
- Bố cục: trái 5 ý; phải hai thanh ngang ("hít" ngắn 4, "thở ra" dài 6) lặp 2 nhịp.
- Hình: E (khối Canva, không số đo y khoa). Không đất nung (hoặc chỉ dòng "không thở nhanh mạnh").
- Ghi chú: không ảnh người thở để tránh gợi ý kỹ thuật sai.

## Trang 21 · Nằm thư giãn có đỡ, giữ ấm (Savasana)
- Bố cục: như tr.16; nền ảnh ấm hơn không cần.
- Hình: B (three-quarter view)
- Prompt: "Photorealistic photo of the same Vietnamese woman in her early 30s, shoulder-length black hair, sage green sports bra and high-waist shorts, practicing supported relaxation pose lying on her back with a round bolster under both knees, a thin folded blanket under her head and neck so the neck stays neutral, her eyes gently closed and her face fully visible, no eye pillow, a warm sage green blanket covering her from shoulders to feet, warm socks, both arms relaxed at her sides palms up, supported by a round bolster and folded blankets, on a dark grey yoga mat, warm beige wall, monstera plants in the background, soft natural window light from the left, three-quarter view, full body in frame, calm relaxed face, no text, 16:9"
- Nhãn Canva: "Savasana có đỡ", "Giữ khoảng 6 phút cùng phần thư giãn", "Nhẹ hơn…". Tên file: `trang-21-savasana.png`
- Ghi chú: đã dùng sẵn phương án "mắt nhắm, không khăn che mắt" để giữ nhận diện người mẫu; khăn che mắt (nếu muốn) thêm ở Canva hoặc để giảng viên demo thật.

## Trang 22 · Thư giãn: quét cơ thể và giữ ấm
- Bố cục: hình người nằm đường nét ngang giữa (vòng sáng di chuyển từ chân lên đầu, chăn là dải xô thơm), 4 ý bên dưới.
- Hình: E. Không dùng lại ảnh tr.21 để khỏi lặp.
- Ghi chú: ý 1 "Quét cơ thể 5 phút" nên sửa "~4 phút" theo gợi ý NÊN-C của An (việc của Lam, không sửa ở đây).

## Trang 23 · Ăn uống: đủ, cân bằng, không cực đoan
- Bố cục: 4 thẻ biểu tượng thực phẩm (muối, cá, trứng, sữa) hàng ngang; thẻ riêng nền khác "Hỏi bác sĩ trước" cho viên bổ sung (đất nung duy nhất).
- Hình: E (biểu tượng Canva; không ảnh món ăn để khỏi gợi ý thực phẩm chức năng). Nguồn [1], [17], [18], [12].

## Trang 24 · Tinh thần: bạn không lười
- Bố cục: ảnh bán phần bên phải (tràn mép), thẻ chữ trái; câu chốt "Bạn không lười." nghiêng 28.
- Hình: D
- Prompt: "Photo of a woman's hands holding a warm ceramic cup of tea, wrapped in a soft sage green knitted blanket, warm beige tones, soft natural window light from the left, shallow depth of field, no face visible, no text, no letters, 16:9"
- Nhãn Canva: chữ. Tên file: `trang-24-tay-om-coc-tra.png`. Nguồn [9], [6].
- Ghi chú: đất nung ở dòng "Ý nghĩ tự hại: 115" (duy nhất).

## Trang 25 · Ba điều mang về
- Bố cục: ảnh nền toàn trang phủ mờ nhẹ; 3 thẻ số 1–2–3 xếp ngang; câu chốt nghiêng dưới.
- Hình: D
- Prompt: "Photo of a neatly folded dark grey yoga mat with a round bolster and folded sage green blankets beside a window, warm beige wall, monstera plant, soft golden natural light, calm and gentle mood, no people, no text, no letters, 16:9"
- Nhãn Canva: 3 thẻ số. Tên file: `trang-25-mang-ve.png`. Nguồn [12], [14], [15]. Thẻ số 1 nhấn đất nung (duy nhất).

## Trang 26 · Nguồn tham khảo và hỏi đáp
- Bố cục: danh sách 5 nhóm nguồn chữ nhỏ bên trái; mã QR (tạo trong Canva, trỏ tới tài liệu phát tay có link đầy đủ) bên phải.
- Hình: E — trang chữ/nguồn, không cần ảnh minh hoạ; QR do giảng viên cung cấp link. Không đất nung.
- Ghi chú: gồm cả dòng ghi nguồn hình: "Hình tr.4: OpenStax College, CC BY 3.0, adapted".

## Danh sách hình
| Trang | Tên file dự kiến (hinh/) | Nguồn | Giấy phép | Trạng thái |
|---|---|---|---|---|
| 1 | trang-01-bia.png | AI (D) | — | cần tạo |
| 2 | trang-02-vi-tri-tuyen-giap.png | https://commons.wikimedia.org/wiki/File:Diagram_showing_the_position_of_the_thyroid_gland_CRUK_363.svg · Cancer Research UK | CC BY-SA 4.0 | có link |
| 3, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 20, 22, 23, 26 | (dựng trong Canva, loại E) | Canva + biểu tượng thư viện Canva | theo giấy phép Canva | cần vẽ |
| 4 | trang-04-tuyen-giap-openstax.jpg | https://commons.wikimedia.org/wiki/File:1811_The_Thyroid_Gland.jpg · OpenStax College | CC BY 3.0 | có link (đã mở xác nhận) |
| 4 (phụ) | trang-04-phu-seer.jpg | https://commons.wikimedia.org/wiki/File:Illu_thyroid_parathyroid.jpg · NCI/SEER (CFCF tải lên) | PD (Mỹ) | có link, tuỳ chọn |
| 5 | (sơ đồ Canva vẽ lại theo Thyroid_system.svg) | https://commons.wikimedia.org/wiki/File:Thyroid_system.svg · Mikael Häggström | CC0 | cần vẽ |
| 16 | trang-16-supta-baddha-konasana.png | AI (B) | — | cần tạo |
| 17 | trang-17-viparita-karani-ghe.png | AI (B) | — | cần tạo |
| 18 | trang-18-setu-bandhasana.png | AI (B) | — | cần tạo |
| 19 | trang-19-balasana.png | AI (B) | — | cần tạo |
| 21 | trang-21-savasana.png | AI (B) | — | cần tạo |
| 24 | trang-24-tay-om-coc-tra.png | AI (D) | — | cần tạo |
| 25 | trang-25-mang-ve.png | AI (D) | — | cần tạo |

## Kiểm tra cả bộ
- [x] Trang nào quá 5 ý hoặc quá ~40 chữ: không trang nào quá 5 ý. Sát ngưỡng: tr.13, tr.19, tr.11 (số chữ theo slides.md mới nhất); đã ghi cách xử lý ở từng trang, không chặn.
- [x] Trang tư thế nào thiếu chống chỉ định: không thiếu — tr.16–19, 21 đều có dải "Không tập" trên slide; danh sách đầy đủ ở lời giảng/An toàn của Lam.
- [x] Hình nào chưa có nguồn hoặc giấy phép: không. Hình C (tr.4) có link, tác giả, CC BY 3.0 (đã mở xác nhận); tr.5 CC0. Tr.2 CC BY-SA 4.0 (Cancer Research UK). Ảnh AI chỉ còn B/D (tư thế, không khí), không có hình y khoa AI.
- [x] Ảnh tư thế có cùng một người mẫu không: có — 5 prompt (tr.16, 17, 18, 19, 21) chép y nguyên mô tả người mẫu và khung chung; tạo cùng một phiên.
- [x] Trang nào cũng có hình hoặc lý do: 26/26 (B: 5; C: 2; D: 3; E: 16 trang dựng khối Canva, đó là lý do không cần ảnh AI).
- [x] Một bảng màu Xô thơm, 2 họ chữ, ≤ 1 đất nung/trang (đã chỉ định ở từng trang).
- [x] Không chữ trong ảnh AI; sơ đồ/bảng không dùng AI; không hình máu, vết mổ, cảnh bệnh nặng.
- [x] An toàn tư thế: cổ trung tính có chăn (tr.16–18, 21), Setu gạch thấp nhất và cổ tự do, Viparita bản ghế hông phẳng, Balasana có gối ôm và gối mở rộng; không đảo ngược, không chồng đầu.
- Còn mở: người có chuyên môn xem lại 5 ảnh sau khi tạo; chưa tạo ảnh/chưa dựng Canva ở bước này.
