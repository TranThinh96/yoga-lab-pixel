# Bản đồ Yoga Lab

File này là thứ đầu tiên mọi agent đọc. Giữ nó NGẮN — mỗi dòng một file quan trọng.

## Cấu trúc
- sources/   — tài liệu gốc (chỉ đọc)
- templates/ — mẫu kịch bản slide và quy tắc thiết kế (chỉ đọc)
- handoff/   — bản bàn giao ngắn giữa các agent
- agents/<tên>/ — nháp riêng của từng agent
- output/    — sản phẩm cuối (bài workshop, outline slide…)

## File quan trọng
(agent tự thêm một dòng khi tạo file đáng chú ý)
- agents/lam/suy-giap-v2-nguon.md — Lam: nháp tổng hợp nguồn suy giáp (10 mục, có link, ⚠ = chờ An kiểm chứng)
- agents/an/suy-giap-v2-kiem-chung.md — An: kiểm chứng từng ý (Đúng/Sửa/Bỏ), mức bằng chứng yoga, danh sách an toàn
- handoff/suy-giap-v2-an.md — An: ý đã duyệt + lưu ý an toàn bắt buộc cho slide
- output/suy-giap-v2/slides.md — Lam: kịch bản 25 trang workshop 60 phút suy giáp (chỉ dùng ý An đã duyệt)
- handoff/suy-giap-v2-lam-slides.md — Lam: bàn giao bước 3/6 (kịch bản slide)
- agents/an/suy-giap-v2-kiem-slides.md — An: danh sách sửa slides.md theo trang (bắt buộc/nên/chuyên gia)
- handoff/suy-giap-v2-an-slides.md — An: bàn giao bước 4/6 (kiểm slides)
- output/suy-giap-v2/thiet-ke.md — Vy: thiết kế 25 trang (Xô thơm, người mẫu cố định, prompt ảnh, nguồn hình tr.4)
- handoff/suy-giap-v2-vy.md — Vy: bàn giao bước 5/6 (thiết kế)
- handoff/suy-giap-v2-ha.md — Hạ: bàn giao bước 6/6 (biên tập lần cuối)
- output/suy-giap-v2/tong-ket.md — Chef: tổng kết dự án, các sửa còn sót, việc cần chuyên gia
- agents/mai/suy-giap-v4-nguon.md — Mai: nháp tổng hợp nguồn y khoa & bằng chứng yoga suy giáp v4 (12 mục, kèm link, mức bằng chứng, an toàn thuốc & cổ)
- handoff/20261016-170329-mai.md — Mai: bàn giao bước 1/6 (tổng hợp nguồn suy-giap-v4)
- agents/an/suy-giap-v4-kiem-chung.md — An: kiểm chứng suy giáp v4 (ý đã duyệt, cảnh báo bắt buộc, 5 tư thế + chống chỉ định, link cần xác minh)
- handoff/20261016-170941-an.md — An: bàn giao bước 2/6 (kiểm chứng suy-giap-v4)
- output/suy-giap-v4/slides.md — Lam: kịch bản 25 trang workshop 60 phút suy giáp v4 (chỉ dùng ý An đã duyệt, có thời gian từng trang)
- handoff/20261016-171207-lam.md — Lam: bàn giao bước 3/6 (kịch bản slide suy-giap-v4)
- agents/an/suy-giap-v4-review-slides.md — An: review slides.md v4 (danh sách sửa theo trang, việc cần chuyên gia)
- handoff/20261016-171403-an.md — An: bàn giao bước 4/6 (kiểm slides suy-giap-v4)
- output/suy-giap-v4/thiet-ke.md — Vy: thiết kế 25 trang suy-giap-v4 (Xô thơm, người mẫu cố định, prompt ảnh, nguồn hình giải phẫu tr.4)
- handoff/20261016-171526-vy.md — Vy: bàn giao bước 5/6 (thiết kế suy-giap-v4)
- output/suy-giap-v4/tong-ket.md — Hạ: tóm kết dự án, điều chắc chắn (nội dung y khoa, cảnh báo an toàn), điều cần kiểm tra (hình, ảnh, [8][9])
- handoff/20261016-171826-ha.md — Hạ: bàn giao bước 6/6 (biên tập lần cuối suy-giap-v4)
- output/suy-giap-v4/tong-ket-chef.md — Chef: tổng kết dự án suy-giap-v4 (đạt tới đâu, file chính, việc cần bác sĩ/giáo viên kiểm, bước tiếp)
- handoff/20261016-172155-chef.md — Chef: bàn giao tổng kết suy-giap-v4
- agents/mai/suy-giap-v5-nguon.md — Mai: nháp tổng hợp nguồn y khoa & bằng chứng yoga suy giáp v5 (14 mục, link xác minh, mức bằng chứng, 5 tư thế phục hồi, hình giải phẫu có giấy phép)
- handoff/20261016-204757-mai.md — Mai: bàn giao bước 1/6 (tổng hợp nguồn suy-giap-v5)
- agents/an/suy-giap-v5-kiem-chung.md — An: kiểm chứng suy giáp v5 (ý đã duyệt, mức bằng chứng yoga, cảnh báo an toàn, 5 tư thế + CCĐ, kết quả mở link; KẾT LUẬN: CẦN SỬA)
- handoff/20261016-205428-an.md — An: bàn giao bước 2/6 (duyệt nguồn suy-giap-v5)
- handoff/20261016-212131-mai.md — Mai: bàn giao bước 3/8 (sửa nguồn suy-giap-v5 theo nhận xét của An)
- agents/an/suy-giap-v5-kiem-chung-vong1.md — An: duyệt lại nguồn suy-giap-v5 vòng 1 (16/16 nhận xét cũ đã xử lý; còn 6 lỗi BẮT BUỘC, 13 NÊN)
- handoff/20261016-212734-an.md — An: bàn giao bước 4/8 (duyệt lại vòng 1; KẾT LUẬN: CẦN SỬA)
- handoff/20261016-212943-mai.md — Mai: bàn giao bước 5/8 (sửa toàn bộ 19 lỗi vòng 1: 6 bắt buộc, 13 nên theo nhận xét của An)
- output/suy-giap-v5/slides.md — Lam: kịch bản slide workshop suy giáp v5 (26 trang, 60 phút, bảng mục→trang, nguồn [n], việc còn mở)
- agents/an/suy-giap-v5-kiem-chung-vong2.md — An: duyệt lại nguồn suy-giap-v5 vòng 2 (19/19 nhận xét cũ đã xử lý; còn 1 BẮT BUỘC ở Gaps #2/#4, 6 NÊN)
- handoff/20261016-213525-an.md — An: bàn giao bước 6/10 (duyệt vòng 2; KẾT LUẬN: CẦN SỬA)
- agents/an/suy-giap-v5-kiem-slides.md — An: duyệt slides suy-giap-v5 (đối chiếu TC 1–8, 12 theo trang; 5 BẮT BUỘC, 13 NÊN; KẾT LUẬN: CẦN SỬA)
- handoff/20261016-223126-an.md — An: bàn giao bước 8/10 (duyệt slides suy-giap-v5)
- agents/an/suy-giap-v5-duyet-lai-slides.md — An: duyệt lại slides suy-giap-v5 vòng 1 (5 BB + 13 NÊN đã xử lý; 3 NÊN nhỏ; KẾT LUẬN: ĐẠT)
- handoff/20261016-224020-an.md — An: bàn giao bước 10/12 (duyệt lại slides suy-giap-v5)
- output/suy-giap-v5/thiet-ke.md — thiết kế 26 trang suy-giap-v5 (Xô thơm, người mẫu chung, prompt ảnh, nguồn hình, danh sách hình)
- agents/ha/suy-giap-v5-bien-tap.md — Hạ: biên bản duyệt thiết kế + hình + biên tập suy-giap-v5, bảng 12 tiêu chí (CẦN SỬA: 1 lỗi chính tả tr.4)
- du-an/plan-20261016-204631/nghiem-thu.md — Chef: nghiệm thu suy-giap-v5 (87/100; bảng 12 tiêu chí có bằng chứng, 3 việc hoàn thiện, việc cần bác sĩ/giảng viên kiểm)
- handoff/20261016-224748-chef.md — Chef: bàn giao nghiệm thu suy-giap-v5
- handoff/20261016-231634-nhi.md — Nhi: bàn giao tạo ảnh AI suy-giap-v5 (7/9 ảnh đạt: 5 ảnh tư thế chuẩn an toàn, đồng nhất người mẫu; tr.24 & 25 chờ reset quota)
- agents/ha/suy-giap-v5-duyet-anh.md — nhận xét duyệt ảnh suy-giap-v5 theo trang (KẾT LUẬN: CẦN SỬA, thiếu tr.24/25)
- handoff/20261017-150039-nhi.md — Nhi: bàn giao tạo lại ảnh tr.16, 17, 18 và tạo mới tr.24, 25 suy-giap-v5 (100% đạt chuẩn an toàn, đồng nhất người mẫu)

- agents/mai/thu-deep-research-deep-research.md — báo cáo Gemini Deep Research về Viparita Karani (chép lại, nguồn chưa kiểm)
- agents/mai/thu-deep-research-nguon.md — tổng hợp gọn nguồn/mức bằng chứng Viparita Karani (chạy thử)
- agents/mai/suy-giap-v6-nguon.md — Mai: nguồn 14 mục suy giáp v6 (câu trích, đánh dấu ✔ đã mở/◐ chưa kiểm/✘ sai, hình giấy phép mở, khoảng trống); kèm suy-giap-v6-deep-research.md (link chat Gemini)
- agents/an/suy-giap-v6-kiem-chung.md — An: kiểm chứng nguồn suy-giap-v6 (link đã mở, chấm Đúng/Sửa/Bỏ, cảnh báo an toàn, ma trận CCĐ 5 tư thế, danh sách đã duyệt cho Lam; KẾT LUẬN: CẦN SỬA)
- agents/an/suy-giap-v6-duyet-lai-1.md — An duyệt lại vòng 1 nguồn suy-giap-v6 (ĐẠT, còn 2 lỗi NÊN)
- output/suy-giap-v6/slides.md — Lam: kịch bản 26 trang/60 phút suy-giap-v6 (bảng mục→trang, phút từng trang, nguồn [1]–[14], Việc còn mở); dàn ý: agents/lam/suy-giap-v6-dan-y.md
- agents/an/suy-giap-v6-kiem-slides.md — An: duyệt kịch bản suy-giap-v6 (danh sách sửa theo trang, đối chiếu TC1–8/12, kiểm chi tiết trang thuốc; KẾT LUẬN: CẦN SỬA, 3 lỗi BẮT BUỘC tr.3/14/22)
- agents/an/suy-giap-v6-duyet-lai-slides.md — An duyệt lại slides.md vòng 1 (bước 8): ĐẠT
- output/suy-giap-v6/thiet-ke.md - thiết kế 26 trang suy-giap-v6 (Vy): bảng màu, người mẫu, prompt ảnh, hình C có giấy phép, Danh sách hình
- agents/ha/suy-giap-v6-bien-tap.md — Hạ: biên bản duyệt thiết kế + biên tập chữ suy-giap-v6 (CẦN SỬA)
- agents/ha/suy-giap-v6-duyet-lai-1.md: duyệt lại vòng 1 suy-giap-v6 (còn 4 chỗ slides.md của Lam)
- handoff/20261017-184007-nhi.md — Nhi: bàn giao 11 ảnh AI suy-giap-v6 (đạt 11/11; lưu ý tr.17, 18; link chat Gemini)
- agents/ha/suy-giap-v6-duyet-anh.md: Hạ duyệt ảnh suy-giap-v6 (11 ảnh AI đạt, thiếu hình tr.4, 5; kết luận CẦN SỬA).
- du-an/plan-20261017-170653/nghiem-thu.md — Chef: nghiệm thu suy-giap-v6, 80/100 (nội dung đạt; thiếu hình tr.4, 5, ảnh tr.17/18 sai đạo cụ, slides lệch thiết kế tr.7/9/14/26; 4 việc sửa)
- agents/ha/suy-giap-v6-duyet-cuoi.md — Hạ: duyệt cuối suy-giap-v6 (hình tr.4/5 chưa có file, ảnh tr.17 chưa đạt, tr.18 đạt, dòng Hình 26 trang khớp; KẾT LUẬN: CẦN SỬA)
- du-an/plan-20261017-170653/nghiem-thu.md (lần 2, cuối) — Chef: 83/100; TC12 đã đạt; còn thiếu hình C tr.4/5, ảnh tr.17 sai, tr.21 chưa chép vào hinh/, 115 chưa có nguồn (làm tay trước khi dựng)
- sources/slide-mau-suy-giap.md — CHUẨN THAM CHIẾU workshop suy giáp: slide Canva 27 trang (nội dung, bố cục, phong cách, điểm cần kiểm); ảnh chụp từng trang trong sources/slide-mau-suy-giap/
- output/suy-giap-v6/so-sanh-canva.md — so sánh suy-giap-v6 với slide Canva mẫu theo từng trang
- du-an/plan-20261017-170653/brief.md — brief đã cập nhật theo slide Canva mẫu (29 trang); bản cũ: brief-truoc-canva.md
- agents/mai/suy-giap-v7-nguon.md — Mai: nguồn suy-giap-v7 theo 29 trang, [1]-[26] đánh số cho trang Nguồn (bước sửa: thêm lithium, thứ phát, sàng lọc sơ sinh), số liệu mẫu (99%→95%, 24h→2–3 tháng…), 115 có nguồn VN, bảng hình Commons đã kiểm giấy phép
- agents/mai/suy-giap-v7-deep-research.md — Mai: link chat Gemini Deep Research suy-giap-v7 + tóm tắt (bản đầy đủ ở link chat)
- agents/an/suy-giap-v7-kiem-chung.md — An: duyệt nguồn suy-giap-v7 (bảng Đúng/Sửa/Bỏ, hình hinh-nguon, ma trận 5 tư thế × CCĐ, danh sách đã duyệt cho Lam; KẾT LUẬN CẦN SỬA)
- agents/an/suy-giap-v7-duyet-lai.md — An duyệt lại vòng 1 nguồn suy-giap-v7 (ĐẠT, còn vài mục NÊN)
- output/suy-giap-v7/slides.md — Lam: kịch bản 29 trang/60 phút suy-giap-v7 (bảng mẫu→mới, bảng phút, thực hành 21,5 phút, Nguồn [1]–[26], Việc còn mở); bàn giao handoff/20261019-204736-lam.md
