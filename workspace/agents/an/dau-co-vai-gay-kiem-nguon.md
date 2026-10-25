# Kiểm nguồn · dau-co-vai-gay (An, 25/10)

Đã đọc brief, bảng, bàn giao Mai và toàn bộ `agents/mai/dau-co-vai-gay-nguon.md`. `hinh-nguon/` chưa có file (máy chủ chưa tải) nên chưa mở hình được; việc duyệt hình để bước duyệt thiết kế (Hạ).

## Cách kiểm
- `kiem_link` 10 link: 9 mở được, [22] HWE bị chặn 403. Rồi đối chiếu nội dung bằng WebFetch/Europe PMC.
- **Đã tự đối chiếu nguyên văn (khớp):** [3] NHS neck pain (bản /symptoms/neck-pain-and-stiff-neck/), [4] whiplash, [5] meningitis, [6] stroke, [7] Cochrane Gross, [9] Hoe, [10] Mahmoud, [11] Cefalì, [12] Matsushita, [8] Kim (chỉ vế "may be beneficial"), [16] [17] IFOMPT, [19] 115, [24] HIOW.
- **Không tự mở được, ghi "đối chiếu qua câu trích":** [1] [2] Mayo (403 với An; Mai đã mở bằng Chrome ở lượt trước), [13]–[15] StatPearls (reCAPTCHA, khớp kiến thức giải phẫu chuẩn), [18] JOSPT PDF (403), [21] Devon (WebFetch báo 410 Gone dù kiem_link báo 200), [22] HWE (403), [23] Dudley (PDF nén, không đọc được; metadata lại nhắc "bone-soft-tissue-sarcoma-recognition-referral" nên **chưa chắc đúng tài liệu đau cổ**).
- Hệ quả: câu của [18] [21] [22] [23] do Gemini chép, **An chưa xác nhận được**. Tôi vẫn cho dùng [22] [21] vì nội dung đúng y khoa và không nguy hiểm, nhưng slide/“Việc còn mở” phải ghi rõ "chưa mở được trang gốc" (xem Chốt 4).

## Từng ý theo trang (Đúng / Sửa / Bỏ)
**Tr.2 · Cổ & vai**
- 7 đốt, đỡ đầu, cho đầu cử động [13] — Đúng. C2 là trục xoay [20] — Đúng (OpenStax CC BY-NC-SA: chỉ dùng chữ, không dùng hình).
- Cơ thang [14] — Đúng. Cơ nâng vai nâng bả vai [15] — Đúng; điểm bám "từ các đốt cổ trên xuống bờ trong xương bả vai, gần góc trên" — Đúng (khớp giải phẫu, trích qua Gemini); không ghi số C1–C4 trên slide.
- Khối lượng đầu — **Bỏ** (không có trích).
**Tr.3 · Không đặc hiệu & triệu chứng**
- Định nghĩa: "đau cổ không kèm dấu hiệu chèn ép thần kinh (tê, yếu tay)" [21] — Đúng nội dung, nguồn chưa mở (410). Ghép với "Phần lớn không phải dấu hiệu bệnh nặng" [1] — Đúng. Không ghi NICE.
- Triệu chứng đau mỏi, cứng, khó xoay, căng, đau đầu [1] — Đúng. Tê/châm chích tay → nối tr.6 [3] [1] — Đúng ([3] xác nhận: "pins and needles or a cold arm – this could be something more serious").
- Nguyên nhân "bad posture – sitting at a desk for a long time" [3] — Đúng (đã mở).
**Tr.4 · Vì sao ngồi lâu**
- Ngồi >6 giờ/ngày hay dùng máy tính liên quan đau cổ [1] — Đúng, nói "nhiều người… dễ đau hơn" (nghiên cứu quan sát); không nêu con số 6 giờ nếu không cần.
- Căng thẳng, lặp động tác [1] — Đúng, mức Ý kiến.
- Tư thế [10] — **Đúng, chốt cách nói:** "ở người lớn đang đau cổ, đầu nhô ra trước hay gặp hơn; chỉ là liên quan, chưa chứng minh là nguyên nhân". Dùng câu [10] bản Europe PMC ("most of neck pain measures in adolescents"); **bản Gemini ở dòng 129 ("neck pain in adolescents except…") khác chữ — Sửa: dùng bản Europe PMC.**
- Ngủ kém, "cổ chịu x kg" — **Bỏ**.
**Tr.5 · Diễn tiến**
- "Phần lớn chỉ kéo dài vài tuần" [3] — Đúng. Lưu ý [24] (đã mở): "Most neck pain problems get a lot better within three months" → slide nói "thường đỡ dần sau vài tuần, có người lâu hơn (đến vài tháng)"; không viết "hết hẳn".
- Tái lại: [24] "Around 50 per cent of people with neck pain will experience a recurrence" — Đúng (đã mở); **chốt: ghi "nhiều người có thể bị lại", bỏ số 50%** (trang tự chăm sóc, không nêu nghiên cứu).
- Giữ cổ cử động [3] — Đúng. Không đỡ sau vài tuần → đi khám [3] — Đúng (đã mở).
**Tr.6 · Dấu hiệu đi khám ngay** (chốt ở mục dưới)
**Tr.7 · Vận động**
- Cochrane [7] — Đúng (đã mở). Giữ cả hai vế: bằng chứng vừa cho tập sức mạnh ở đau cổ **mạn**; "acute: no evidence"; chỉ giãn cơ thì không kỳ vọng lợi ích; không có bằng chứng chất lượng cao. Yoga nhẹ không phải bài tăng cường chuyên biệt → không viết "Cochrane ủng hộ yoga".
- Yoga [8] — Đúng, Sơ bộ ("may be beneficial", chất lượng thấp, 3 RCT).
- JOSPT [18] — xem tiêu chí 5. Giữ cổ cử động/không nằm yên [21] [3] — Đúng; bỏ vế "không đeo đai cổ", manipulation.
**Tr.8 · Tập an toàn**
- Quy tắc đau, mỏi nhẹ chấp nhận được, 5 mục bỏ hẳn, chống chỉ định chung — **Giữ là "kinh nghiệm thực hành của Yoga Lab"**, không gán nguồn (Mai làm đúng). Dừng khi chóng mặt/nhìn mờ/tê lan tay bám dấu hiệu tr.6.
- [12] 63,8% nhẹ, ~30% có biến cố — Đúng nhưng là khảo sát cắt ngang tự khai ở lớp yoga nói chung, không riêng đau cổ → Sơ bộ; nếu dùng, không suy ra "yoga cho cổ an toàn".
- [8] "Minor adverse effect…vertigo" — Đúng theo toàn văn nhưng không có trong abstract; **không dùng trên slide**, dùng [12].
**Tr.9–10 · Tư thế** — không có nguồn riêng từng tư thế: Đúng khi ghi "hướng dẫn thực hành của Yoga Lab".
**Tr.11 · Thở** — [11] "significant short-term effects… certainty is low" Đúng, Sơ bộ; [7] "low evidence" (không thống nhất) → câu chốt "bằng chứng còn hạn chế, thở giúp thư giãn". Kỹ thuật (1 giây/nhịp, thở ra dài hơn…) = kinh nghiệm thực hành.
**Tr.12 · Thói quen** — [1] "Take regular breaks / adjust desk" Ý kiến; [9] Hoe "very low-quality evidence" cho nghỉ giải lao, "no effect" cho chỉnh bàn/đứng-ngồi — Đúng; **Sửa nhãn Mai "Trung bình–thấp" thành Sơ bộ (rất thấp)**. "Mỗi 30 phút": không có trích → "kinh nghiệm thực hành" hoặc bỏ số.

## Chốt cách nói 4 nhóm tr.6 (tiêu chí 3)
| Nhóm | Chữ trên slide (Ý chính) | Nguồn / câu trích | Mức |
|---|---|---|---|
| 1 Tê, yếu tay | "Tê, yếu tay hoặc chân, nhất là **nặng dần**; vụng tay, đi loạng choạng" | [22] "severe or progressive motor weakness, or severe or progressive sensory loss" (chưa mở được); [2] "Lack of coordination and difficulty walking"; [3] "pins and needles or a cold arm" (đã mở); [4] "your hands, arms or legs feel weak" (đã mở) | Ý kiến chuyên gia |
| 2 Đau sau chấn thương | "Đau cổ nặng sau ngã, va chạm, tai nạn xe" (có thể xuất hiện sau vài giờ) | [1] "Get emergency medical care if you have severe neck pain after an injury…"; [4] "It can take several hours for the symptoms to start" (đã mở) | Vừa |
| 3 Sốt kèm cứng cổ | "Sốt cao kèm cứng cổ, đau đầu dữ dội, sợ ánh sáng" | [5] "a high temperature (fever)… a stiff neck… a severe headache" + "Call 999 or go to A&E" (đã mở) | Mạnh (cổng y tế quốc gia) |
| 4 Chóng mặt, thị giác | Tách **hai vế**: "Chóng mặt, choáng khi cử động cổ, nhất là ngửa cổ nhìn lên" [22]; "Nhìn mờ hoặc mất thị lực một hay hai mắt, chóng mặt, ngã" [6] | [22] "dizziness and blackouts on movement, especially extension of the neck when gazing upwards" (chưa mở được); [6] "blurred vision or loss of sight in 1 or both eyes", "feeling dizzy or falling over" (đã mở) | Ý kiến / Mạnh |

- **Quyết định (An): KHÔNG viết "nhìn đôi" và KHÔNG viết "khi xoay cổ"**: không nguồn nào nói (đã kiểm [6] không có double vision; [16] [17] không có triệu chứng cụ thể). Không ghép "nhìn mờ" vào "khi ngửa cổ" vì [6] là dấu hiệu đột quỵ chung. [16] [17] chỉ dùng cho câu chung "ít gặp nhưng nghiêm trọng".
- Gọi 115 chỉ cho: nghi đột quỵ (mặt–tay–nói, nhìn mờ/mất thị lực, chóng mặt, ngã [6]), sốt + cứng cổ + sợ ánh sáng [5], đau cổ nặng sau chấn thương [1]. 115: [19] "Để gọi cấp cứu, nhấn số 115 trên điện thoại" (đã mở). Tê/yếu nặng dần, mất kiểm soát tiểu–đại tiện [2]: "đi khám/cấp cứu ngay" theo [2] "Seek medical attention"; nếu có mất kiểm soát tiểu tiện thì cấp cứu.
- Tầng "khám sớm": có thể giữ — đau dữ dội/không đỡ sau vài ngày [1]; đau tăng dần, đau làm mất ngủ, sụt cân không rõ lý do, tiền sử ung thư [22] [21] (chưa mở được). **Không dẫn [23]** (chưa chắc đúng tài liệu).

## Tiêu chí 4 · Mức bằng chứng (chốt)
| Nội dung | Mức | Cách nói |
|---|---|---|
| Tư thế–đau cổ [10] | Sơ bộ | "liên quan ở người lớn; chưa chứng minh là nguyên nhân" |
| Ngồi lâu/máy tính [1] | Sơ bộ | "nhiều người ngồi lâu dễ đau hơn" |
| Diễn tiến [3] [21] [24] | Ý kiến (hướng dẫn người bệnh) | "thường đỡ dần sau vài tuần, có thể lâu hơn" |
| Tái lại [24] | Sơ bộ | "nhiều người có thể bị lại", không nêu 50% |
| Bài tập cổ–vai [7] | Vừa (chỉ đau mạn) | nêu rõ không có bằng chứng cho đau cấp |
| Yoga [8] | Sơ bộ | "có thể có lợi, nghiên cứu còn ít và chất lượng thấp" |
| Thở [11] [7] | Sơ bộ | "bằng chứng còn hạn chế" |
| Nghỉ giải lao/chỉnh chỗ ngồi [9] | Sơ bộ (rất thấp) | "được khuyên, bằng chứng phòng ngừa còn hạn chế" |

## Tiêu chí 5 · NICE CKS / JOSPT / Cochrane
- **Cochrane [7]: dẫn được** (đã mở), kèm giới hạn ở trên.
- **NICE CKS: KHÔNG dẫn tên** trên slide; "Việc còn mở" ghi "NICE CKS chưa đối chiếu được nguyên văn". [21] [22] là hướng dẫn NHS địa phương, ghi đúng như vậy.
- **JOSPT [18]: được dẫn tên**, ở mức chung ("hướng dẫn thực hành lâm sàng JOSPT 2017 khuyến khích giáo dục người bệnh, duy trì hoạt động và bài tập sức bền cổ–vai"), **không ghi chữ B/C**, không ghi "đã đối chiếu": PDF 403 với cả An và Mai, câu và grade chỉ có từ Gemini, và khuyến cáo JOSPT gắn với nhóm "đau cổ có hạn chế vận động". "Việc còn mở": "JOSPT chưa mở được PDF; grade chưa xác nhận". Nếu sau này có người mở PDF xác nhận thì mới thêm grade.

## Danh sách vấn đề
| Mã | File | Vị trí | Mức | Loại | Vấn đề | Đề xuất |
|---|---|---|---|---|---|---|
| V1 | agents/mai/dau-co-vai-gay-nguon.md | Mục 1 (dòng 8–9), tr.5 dòng 50, tr.6 dòng 58, 68, 70, tr.7 dòng 82–83, "Khoảng trống" | NÊN | khac | Nhiều dòng cũ vẫn ghi "chưa có trích" (NICE/JOSPT, tăng dần, khám sớm, tái lại) trái với mục "Bổ sung lượt này" | Thêm "(đã thay, xem Bổ sung)" vào từng dòng cũ để người viết không đọc nhầm |
| V2 | agents/mai/dau-co-vai-gay-nguon.md | tr.6 dòng 68 | NÊN | nguon-khong-khop | Gợi ý lời slide "nhìn mờ/nhìn đôi, nhất là khi đổi tư thế đầu cổ" không có nguồn cho "nhìn đôi" và ghép sai | Xoá gợi ý, trỏ tới bảng 4 nhóm của An |
| V3 | agents/mai/dau-co-vai-gay-nguon.md | tr.4 dòng 40 và dòng 129 | NÊN | nguon-khong-khop | Hai bản câu trích [10] khác chữ (dòng 129 là bản Gemini, có thêm "except for lifetime prevalence…") | Giữ bản dòng 40 (khớp Europe PMC), bỏ bản dòng 129 |
| V4 | agents/mai/dau-co-vai-gay-nguon.md | dòng 102 và 129 (máy soát) | NÊN | chinh-ta-dau-cau | Dấu câu đôi nằm trong câu trích có dấu lược; không lên slide | Thay bằng "[…]" cho máy hết cờ |
| V5 | agents/mai/dau-co-vai-gay-nguon.md | Bảng nguồn [23] | NÊN | nguon-khong-khop | PDF Dudley không đọc được, metadata nhắc tài liệu sarcoma; chưa chắc là lộ trình đau cổ | Ghi "chưa xác nhận tài liệu", không dùng làm nguồn trên slide |
| V6 | agents/mai/dau-co-vai-gay-nguon.md | Bảng nguồn [3] [5] | NÊN | nguon-khong-khop | Link bảng ([3] /conditions/neck-pain/, [5] /symptoms/) khác trang chứa câu trích đã đối chiếu | Ghi link /symptoms/neck-pain-and-stiff-neck/ cho [3] và /conditions/meningitis/ cho [5] |
| V7 | agents/mai/dau-co-vai-gay-nguon.md | tr.12 dòng 108; tr.8 dòng 89 | NÊN | khac | Nhãn mức "Trung bình–thấp" cho [9] quá cao; [12] là khảo sát tự khai | [9] ghi Sơ bộ (rất thấp); [12] ghi Sơ bộ |
| V8 | output/dau-co-vai-gay/slides.md | tr.6, tr.7, Việc còn mở (cho Lam, bước 3) | NÊN | khac | Lam cần áp dụng 4 chốt của An: không "nhìn đôi/khi xoay cổ"; JOSPT không ghi grade; không dẫn NICE CKS và [23]; ghi nguồn chưa mở được (JOSPT, [21], [22]) | Đưa các chốt vào slides.md và "Việc còn mở" |

## Danh sách đã duyệt
| Mã | Ý | Mức bằng chứng | Nguồn | Câu trích | Ghi chú |
|---|---|---|---|---|---|
| co-7-dot-song | Cột sống cổ có 7 đốt sống, đỡ đầu và cho đầu cử động | Mạnh | statpearls-cervical-vertebrae | The cervical spine has 7 articulating vertebrae | Chưa tự mở lại (reCAPTCHA); khớp giải phẫu chuẩn |
| co-thang-chuc-nang | Cơ thang là cơ lưng nông lớn; phần trên nâng và xoay bả vai | Mạnh | statpearls-trapezius | The upper fibers can elevate and upwardly rotate the scapula and extend the neck. | Như trên |
| co-nang-vai-chuc-nang | Cơ nâng vai nằm nông phía sau, chủ yếu nâng bả vai | Mạnh | statpearls-levator-scapulae | primarily function to elevate the scapulae | Không ghi số đốt C1–C4 trên slide |
| dau-co-khong-dac-hieu-dinh-nghia | Đau cổ không đặc hiệu: đau cổ không kèm dấu hiệu chèn ép thần kinh; phần lớn không phải bệnh nặng | Ý kiến | nhs-devon-cervical, mayo-neck-pain | Non-specific neck pain - neck pain without radicular / myelopathic symptoms. | [21] chưa mở được (410); không ghi NICE |
| ngoi-lau-lien-quan-dau-co | Nhiều người ngồi lâu, nhất là dùng máy tính hay điện thoại, dễ đau cổ hơn | Sơ bộ | mayo-neck-pain | people who sit still for more than six hours a day are more likely to have neck pain | Nghiên cứu quan sát; Mayo 403 với An |
| tu-the-dau-ra-truoc-lien-quan | Ở người lớn đau cổ, tư thế đầu nhô ra trước hay gặp hơn; chỉ là liên quan, chưa chứng minh nguyên nhân | Sơ bộ | mahmoud-2019-fhp | adults with neck pain show increased FHP when compared to asymptomatic adults | Đã mở. Không áp cho thanh thiếu niên |
| dau-co-dien-tien-vai-tuan | Phần lớn đau cổ chỉ kéo dài vài tuần; không đỡ thì đi khám | Ý kiến | nhs-neck-pain, nhs-hiow-neck | Most neck pain only lasts a few weeks. | Đã mở. [24] nói "within three months": ghi "có thể lâu hơn" |
| dau-co-tai-lai | Nhiều người đau cổ có thể bị lại | Sơ bộ | nhs-hiow-neck | Around 50 per cent of people with neck pain will experience a recurrence of their problem. | Đã mở; bỏ số 50% trên slide |
| giu-co-van-dong | Giữ cổ cử động nhẹ tốt hơn bất động | Ý kiến | nhs-neck-pain | it's better to keep your neck moving | Đã mở; bỏ vế đai cổ |
| co-bai-tap-suc-manh-dau-co-man | Với đau cổ mạn, có bằng chứng mức vừa cho bài tập tăng sức mạnh cổ–bả vai; đau cấp thì chưa có bằng chứng; chỉ giãn cơ thì không kỳ vọng lợi ích | Vừa | cochrane-gross-2015 | For acute neck pain only, no evidence was found. | Đã mở; yoga nhẹ không phải bài tăng cường chuyên biệt |
| yoga-dau-co-man-so-bo | Yoga có thể có lợi cho đau cổ mạn, bằng chứng còn ít và chất lượng thấp | Sơ bộ | kim-2016-yoga-neck | Evidence from the 3 randomly controlled trials shows that yoga may be beneficial for chronic neck pain. | Đã mở abstract |
| tho-dau-co-so-bo | Bài tập thở có thể giảm đau ngắn hạn nhưng độ chắc chắn thấp | Sơ bộ | cefali-2025-breathing, cochrane-gross-2015 | However, the evidence certainty is low. | Đã mở |
| nghi-giai-lao-bang-chung-han-che | Nghỉ giải lao, chỉnh chỗ ngồi được khuyên dùng nhưng bằng chứng phòng ngừa còn hạn chế | Sơ bộ | cochrane-hoe-2018, mayo-neck-pain | there is very low-quality evidence of an effect on upper limb discomfort | [9] đã mở; lời khuyên Mayo là Ý kiến |
| dau-hieu-te-yeu-tay-nang-dan | Tê, yếu tay hoặc chân nặng dần, vụng tay, đi loạng choạng cần đi khám ngay | Ý kiến | nhs-hwe-neck, mayo-cervical-spondylosis, nhs-neck-pain | Seek immediate specialist advice if the person has severe or progressive motor weakness, or severe or progressive sensory loss. | [22] chưa mở được (403) |
| dau-hieu-sau-chan-thuong | Đau cổ nặng sau ngã, va chạm, tai nạn xe cần chăm sóc y tế ngay; triệu chứng có thể đến sau vài giờ | Vừa | mayo-neck-pain, nhs-whiplash | It can take several hours for the symptoms to start after you injure your neck. | [4] đã mở; Mayo 403 với An |
| dau-hieu-sot-cung-co | Sốt kèm cứng cổ, đau đầu dữ dội, sợ ánh sáng cần cấp cứu | Mạnh | nhs-meningitis | The symptoms of meningitis develop suddenly and can include | Đã mở; gọi 115 theo [19] |
| dau-hieu-chong-mat-ngua-co | Chóng mặt, choáng khi cử động cổ, nhất là ngửa cổ nhìn lên, cần đi khám | Ý kiến | nhs-hwe-neck | dizziness and blackouts on movement, especially extension of the neck when gazing upwards | Chưa mở được trang gốc; không nói "khi xoay cổ", "nhìn đôi" |
| dau-hieu-dot-quy-nhin-mo | Nhìn mờ hoặc mất thị lực một/hai mắt, chóng mặt, ngã có thể là dấu hiệu đột quỵ: gọi cấp cứu | Mạnh | nhs-stroke | blurred vision or loss of sight in 1 or both eyes | Đã mở; ghép riêng, không ghép vào "khi xoay cổ" |
| goi-115-viet-nam | Số cấp cứu tại Việt Nam là 115 | Mạnh | ttcc115-hcm | Để gọi cấp cứu, nhấn số 115 trên điện thoại | Đã mở |
| kham-som-dau-dem-sut-can | Đau tăng dần, đau làm mất ngủ, sụt cân không rõ lý do, tiền sử ung thư nên đi khám sớm | Ý kiến | nhs-hwe-neck, nhs-devon-cervical | pain that is increasing, unremitting, or disturbs sleep | Chưa mở được [21] [22]; không dùng [23] |

## Câu hỏi cho chủ dự án
1. Slide có chấp nhận dẫn [21] [22] và JOSPT khi An chưa mở được trang gốc (câu trích do Gemini chép, nội dung đúng y khoa), kèm dòng "chưa mở được trang gốc" trong "Việc còn mở"? Đề xuất: **chấp nhận**, và nhờ người có VPN Anh/Chrome mở lại 3 link này sau; nếu không chấp nhận thì tr.6 dùng "tê, yếu tay hoặc chân" (bỏ "nặng dần") và bỏ tầng "khám sớm" ngoài ý Mayo.

KẾT LUẬN: ĐẠT
