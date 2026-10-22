# Đợt 5 · Lấp chỗ hở

Đọc [README.md](README.md) trước. Cần Đợt 0–4 đã xong, và chủ dự án đã chạy phần **Đợt 4** trong [thu-tren-may.md](thu-tren-may.md).
Đợt này không thêm tính năng lớn. Nó sửa những chỗ hở mà các đợt trước đã ghi lại nhưng chưa sửa:
hai lỗ hổng trong `tri-thuc/he-thong/lo-hong.md`, các mục "Phát hiện thêm" số 19, 20, 21 của Đợt 3, và bốn chỉ số mà khối Trí não (4.6) còn bỏ trống.

Mỗi mục **độc lập**, làm theo thứ tự nào cũng được. Mục nào là sửa lỗi thì không có công tắc.

| Mục | Việc | Nguồn | Công tắc |
|---|---|---|---|
| 5.1 | Vấn đề NÊN của người không có vấn đề BẮT BUỘC cũng được giao sửa | lo-hong.md dòng 1 | (không) |
| 5.2 | `soat_loi` đếm chữ từng trang cho `thiet-ke.md` | lo-hong.md dòng 2 | (không) |
| 5.3 | Vòng sửa sau nghiệm thu chờ hồi cứu xong | dot-3.md số 19 | (không) |
| 5.4 | Lưu phần BỐI CẢNH của từng lượt để xem lại | dot-3.md số 20 | (luôn bật khi `brain` bật) |
| 5.5 | Bốn chỉ số còn thiếu ở khối Trí não | dot-4.md số 14 | (luôn bật) |
| 5.6 | Phân loại bài học: "trang An toàn" không phải lỗi an toàn | dot-3.md số 21 | (không) |
| 5.7 | Dọn hai chỗ chữ lỗi thời | dot-0.md, dot-3.md số 16 | (không) |

---

## 5.1 Giao vấn đề NÊN cho đúng chủ file

Dự án `plan-20261021-195355`: Hạ duyệt thiết kế, kết luận CẦN SỬA, nêu VD-17 (NÊN, lệch hai file, người sửa Lam).
`handleReview` chỉ cho vấn đề NÊN đi kèm người **đã có** vấn đề BẮT BUỘC, nên vòng sửa chỉ giao Vy. VD-17 treo tới nghiệm thu.

**Làm**
1. `lib/van-de.js`, thêm và xuất (đã chạy thử với 3 tình huống ở bước 3):
   ```js
   // Nhóm vấn đề mở của một bước duyệt CẦN SỬA theo chủ file: BẮT BUỘC trước; NÊN đi kèm chủ đã có nhóm,
   // chủ chỉ có NÊN thì thành nhóm riêng (trước đây vấn đề này treo tới nghiệm thu)
   function nhomSua(mo) {
     const { nhom, khongChu } = nhomTheoChu(mo.filter(x => x.level === 'BẮT BUỘC'));
     const nen = mo.filter(x => x.level !== 'BẮT BUỘC' && x.owner);
     for (const x of nen) if (nhom.has(x.owner)) nhom.get(x.owner).issues.push(x);
     const rieng = nhomTheoChu(nen.filter(x => !nhom.has(x.owner))).nhom;
     for (const [a, g] of rieng) nhom.set(a, g);
     return { nhom, khongChu };
   }
   ```
2. `handleReview`: thay hai dòng
   ```js
   const { nhom, khongChu } = nhomTheoChu(mo.filter(x => x.level === 'BẮT BUỘC'));
   for (const x of mo.filter(x => x.level !== 'BẮT BUỘC' && nhom.has(x.owner))) nhom.get(x.owner).issues.push(x);
   ```
   bằng `const { nhom, khongChu } = nhomSua(mo);`. Sửa chú thích ngay trên cho khớp. Phần còn lại giữ nguyên:
   - chỉ chạy khi kết luận là CẦN SỬA (`s.verdict === 'fix'`), nên kết luận ĐẠT với vài vấn đề NÊN vẫn không chèn bước;
   - vẫn chịu `maxReviewRounds` và `maxTotalSteps` như cũ.
3. Kiểm thử trong `test/van-de.test.js`, vấn đề dạng `{ id, level, owner, ownerStep, status: 'mo' }`, đọc kết quả thành `[người, step, [mã]]`:
   - BB Vy (bước 7), NÊN Vy (7), NÊN Lam (4), NÊN không chủ → `[["vy", 7, ["VD-14", "VD-15"]], ["lam", 4, ["VD-17"]]]`;
   - chỉ có NÊN Lam (4), NÊN Vy (7) → `[["lam", 4, ["VD-1"]], ["vy", 7, ["VD-2"]]]`;
   - một BB không chủ → nhóm rỗng, `khongChu.length === 1`.
4. Đổi hành vi cần biết: bước duyệt CẦN SỬA mà chỉ có vấn đề NÊN, trước đây trả về người làm với lời giao chung chung; nay giao theo chủ file của từng vấn đề, kèm danh sách mã.
5. Xong thì đánh dấu `[x]` dòng 1 trong `workspace/tri-thuc/he-thong/lo-hong.md` (commit riêng, tiêu đề `5.1 dữ liệu: …`).

---

## 5.2 `soat_loi` đếm chữ cho `thiet-ke.md`

`soChuTungTrang` chỉ đếm "Ý chính" và "Câu chốt" của `slides.md`. Gọi cho `thiet-ke.md` thì mọi trang ra 0 chữ, nên Vy không kiểm máy được mật độ chữ sau khi rút.
Ở `thiet-ke.md`, chữ trên slide nằm trong dòng `- Bố cục:` (và các dòng thụt vào dưới nó): chữ trong ngoặc kép, và nhãn in đậm kèm phần chữ sau nhãn.

**Làm**
1. `lib/soat-loi.js`, thêm và xuất (đã chạy thử trên dữ liệu thật, kết quả ở bước 3):
   ```js
   // Số chữ trên slide theo thiet-ke.md (ước lượng): trong dòng "- Bố cục:" và các dòng thụt dưới nó,
   // đếm chữ trong ngoặc kép, **nhãn:** kèm phần chữ sau nhãn tới dấu · kế tiếp, và **chữ đậm**
   function soChuThietKe(txt) {
     const out = [], count = t => (t.match(/[\p{L}\p{N}]+/gu) || []).length;
     let trang = 0, trongBoCuc = false, chu = 0, inCode = false;
     const flush = () => { if (trang) out.push({ trang, chu }); chu = 0; trongBoCuc = false; };
     for (const l of String(txt || '').normalize('NFC').split(/\r?\n/)) {
       if (/^\s*```/.test(l)) { inCode = !inCode; continue; }
       if (inCode) continue;
       const h = /^#{1,3}\s+Trang\s+(\d+)/i.exec(l);
       if (h) { flush(); trang = Number(h[1]); continue; }
       if (/^#{1,3}\s/.test(l)) { flush(); trang = 0; continue; }
       if (!trang) continue;
       if (/^- [^:]{1,30}:/.test(l)) trongBoCuc = /^- Bố cục\s*:/i.test(l);
       if (!trongBoCuc) continue;
       // Bỏ mã màu, ghi chú trong ngoặc, số nguồn [n] và chỉ số trên: không phải chữ người xem đọc
       const t = l.replace(/`[^`]*`/g, ' ').replace(/\[[\d,\s–-]+\]|[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, ' ').replace(/\([^()"“”*]*\)/g, ' ');
       for (const m of t.matchAll(/"([^"]+)"|“([^”]+)”|\*\*([^*]+:)\*\*([^·*"“]*)|\*\*([^*]+)\*\*/g))
         chu += count(m[1] || m[2] || ((m[3] || '') + ' ' + (m[4] || '')) || m[5]);
     }
     flush();
     return out;
   }
   ```
2. `lib/cong-cu.js`, `soatLoi`: file tên `thiet-ke.md` thì dùng `soChuThietKe` thay `soChuTungTrang`, và đổi nhãn dòng kết quả thành
   `Số chữ trên slide theo thiết kế (ước lượng: chữ trong ngoặc kép và nhãn đậm ở dòng Bố cục): Trang 1: 12 · …`.
   File khác giữ nguyên. Không thêm ngưỡng cảnh báo cho `thiet-ke.md` (`lintMaxWords` đo theo slides.md, hai cách đếm khác nhau).
3. Kiểm thử `test/soat-loi.test.js`. Chép `workspace/output/thoai-hoa-khop-goi/thiet-ke.md` sang `test/fixtures/thiet-ke-khop-goi.md`. Kết quả mong đợi:
   ```
   1:12 2:45 3:66 4:88 5:9 6:9 7:9 8:69 9:74 10:3
   ```
   Trang 4 ra 88, đúng số Vy tự ghi sau khi rút ("≈ 88"). Thêm một ca nhỏ: dòng `- Prompt: "…"` không được đếm; mã màu `` `#3E5F45` `` và `[3][6]` không được đếm.
4. README, phần công cụ `soat_loi`: thêm một câu "Với thiet-ke.md, số chữ là ước lượng từ dòng Bố cục."
5. Xong thì đánh dấu `[x]` dòng 2 trong `lo-hong.md` (cùng commit dữ liệu với 5.1 nếu làm liền).

---

## 5.3 Vòng sửa sau nghiệm thu chờ hồi cứu xong

Hồi cứu (bài học, lên bậc checklist) chạy nền trong `lessonsDone`. Khi nghiệm thu giao việc sửa, `finishPlan` gọi `pumpPlan` ngay,
nên hai bước sửa nhanh ở dự án thoái hoá khớp gối bắt đầu trước khi BH-37, BH-48, BH-49 lên checklist.

**Làm**
1. `finishPlan`, trong `onDone`, nhánh `if (fixes)`: thay
   ```js
   emitPlan(plan);
   return pumpPlan(plan);
   ```
   bằng
   ```js
   if (!tuHoc) { emitPlan(plan); return pumpPlan(plan); }
   // Hồi cứu đang chạy nền: chờ xong (tối đa 2 phút) để bước sửa nhận checklist vừa lên bậc
   const cho = 'Chờ hồi cứu xong rồi giao vòng sửa';
   plan.note = cho; emitPlan(plan);
   return Promise.race([lessonsDone, new Promise(r => setTimeout(r, 120000))])
     .then(() => { if (plan.note === cho) { plan.note = ''; emitPlan(plan); } pumpPlan(plan); });
   ```
2. Nhánh có câu hỏi (`askOwner`) giữ nguyên: lúc bạn trả lời xong, hồi cứu thường đã xong.
3. Kiểm: đọc code. `lessonsDone` đã có `.catch` nên không bao giờ treo vì lỗi; trường hợp xấu nhất là chờ 2 phút.

---

## 5.4 Lưu phần BỐI CẢNH của từng lượt

Ngăn "Việc được giao" chỉ hiện `run.task`. Gói ngữ cảnh (`goiChoLuot`: quy tắc của bạn, quyết định, vấn đề mở, bài học, checklist) chỉ nằm trong prompt, nên không xem lại được bài học nào đã tới bước nào.

**Làm**
1. `startRun`: khi có `goi` và lượt thuộc một dự án (`opts.planId`), ghi `goi` vào `du-an/<planId>/boi-canh/<run.id>.md`:
   - dòng đầu `# Bối cảnh lượt <run.id>`, dòng hai `> Máy chủ tự sinh file này. Đừng sửa tay: đây là bản chép phần BỐI CẢNH đã gửi cho agent.`, rồi một dòng trống và nguyên văn `goi`;
   - ghi không chờ (`fsp.mkdir` rồi `fsp.writeFile`, lỗi thì `console.error`, không làm hỏng lượt chạy);
   - đặt `run.boiCanh = '<đường dẫn đó>'` (chỉ đường dẫn, không chép nội dung vào `runs.jsonl`).
   Lượt lẻ (không thuộc dự án) không ghi.
2. `startStep`, chỗ `.then(run => { s.runId = run.id; … })`: thêm `s.boiCanh = run.boiCanh || null;`, để bảng việc và cửa sổ Dự án có đường dẫn mà không phải tìm lượt chạy.
3. Giao diện: thêm nút `Bối cảnh` ngay sau nút "Bàn giao", cùng kiểu `data-view`, ở ba chỗ đang có nút "Bàn giao":
   - ngăn chi tiết thẻ dự án (từng bước `x`, dùng `x.boiCanh`);
   - ngăn chi tiết lượt chạy (`r.boiCanh`);
   - cửa sổ Dự án, danh sách bước (`x.boiCanh`).
4. `thu-tren-may.md`, mục **Sau Đợt 3**, bước 4: thay câu "ngăn Việc được giao chưa hiện phần BỐI CẢNH…" bằng "bấm nút **Bối cảnh** của lượt đó để xem bài học và checklist đã giao".
5. README: một câu trong phần bộ não, nói file bối cảnh nằm ở `du-an/<mã>/boi-canh/`.

---

## 5.5 Bốn chỉ số còn thiếu ở khối Trí não

4.6 đã bỏ qua 4 chỉ số ở mục 5 của kế hoạch vì "chưa có dữ liệu máy đọc được". Thật ra cả bốn đều đọc được từ dữ liệu sẵn có.

| Chỉ số | Đo bằng | Mục tiêu |
|---|---|---|
| Câu hỏi trùng trong một dự án | `plan.answers`: câu giống một câu đã hỏi trước trong cùng dự án (`giongNhau` ≥ `NGUONG_CAU_HOI`); câu máy chủ tự trả lời "(Giống câu đã trả lời…" không tính | 0 |
| Link An mở lại | diễn biến "Mở trang: <url>" của người kiểm chứng, url mà người khác đã mở trước đó trong dự án | dưới 10% |
| `index.md` | số dòng của `workspace/index.md` hiện tại | dưới 30 dòng |
| Ảnh ngoài thư mục chủ đề | file ảnh trong `run.files` và `step.images` của dự án, không nằm trong `output/<chủ đề>/` | 0 |

**Làm**
1. `lib/chi-so.js`, thêm (đã chạy thử trên `runs.jsonl`, `plans.json` thật, kết quả ở bước 4):
   ```js
   const { giongNhau, NGUONG_CAU_HOI } = require('./van-ban');
   // Câu hỏi gửi tới chủ dự án mà giống một câu đã hỏi trước đó trong cùng dự án (máy chủ tự trả lời thì không tính)
   function cauHoiTrung(p) {
     const da = []; let n = 0;
     for (const x of p.answers || []) {
       const q = String(x.q || '');
       if (/^\(Giống câu đã trả lời/u.test(String(x.a || '').trim())) continue;
       if (da.some(y => giongNhau(q, y) >= NGUONG_CAU_HOI)) n++;
       da.push(q);
     }
     return n;
   }
   // Lần người kiểm chứng mở một trang mà người khác đã mở trước đó trong dự án (diễn biến cắt URL bằng "…": so theo phần đầu)
   function linkMoLai(rs, nguoiKiem) {
     const truoc = []; let mo = 0, lai = 0;
     for (const r of rs.slice().sort((a, b) => tg(a.startedAt) - tg(b.startedAt))) {
       const urls = (r.acts || []).map(a => /^Mở trang:\s*(https?:\/\/\S+)/.exec(a.text || '')).filter(Boolean).map(m => m[1].replace(/…$/, ''));
       if (r.agentId === nguoiKiem) for (const u of urls) { mo++; if (truoc.some(x => x.startsWith(u) || u.startsWith(x))) lai++; }
       else truoc.push(...urls);
     }
     return { mo, lai, tiLe: mo ? Math.round(lai / mo * 1000) / 10 : null };
   }
   const ANH = /\.(png|jpe?g|webp|gif)$/i;
   // Ảnh dự án ghi ra ngoài output/<chủ đề>/; chưa biết chủ đề thì không đo
   function anhNgoaiChuDe(chuDe, steps, rs) {
     if (!chuDe) return null;
     const files = new Set([...rs.flatMap(r => r.files || []), ...steps.flatMap(s => s.images || [])].filter(f => ANH.test(f)));
     return [...files].filter(f => !f.startsWith(`output/${chuDe}/`)).length;
   }
   ```
2. `chiSoTriNao` nhận thêm tham số `chuDeCua = p => p.topic || null`, `nguoiKiem = null`, `indexDong = null`:
   - mỗi dự án thêm `cauHoiTrung`, `linkMoLai` (chỉ khi có `nguoiKiem`, không thì `null`), `anhNgoai`;
   - kết quả thêm `tong.indexDong = indexDong`.
   Xuất thêm `cauHoiTrung`, `linkMoLai`, `anhNgoaiChuDe`.
3. `server.js`, `GET /api/tri-nao`: truyền `chuDeCua: planTopic`, `indexDong` (số dòng `readWs('index.md')`, không có file thì `null`), và `nguoiKiem`:
   agent đầu tiên có id `an`; không có thì agent đầu tiên có `role` chứa "kiểm chứng"; không có nữa thì `null`.
4. Kiểm thử `test/chi-so.test.js` bằng dữ liệu tự dựng nhỏ (không dùng `runs.jsonl` thật):
   - `cauHoiTrung`: 3 câu, câu 3 diễn đạt lại câu 1 (đủ 6 từ khoá chung) → 1; thêm câu có `a` "(Giống câu đã trả lời: …)" → vẫn 1;
   - `linkMoLai`: Mai mở `https://www.nhs.uk/a`, An mở `https://www.nhs.uk/a`, `https://www.nhs.u` (đã cắt) và `https://pmc.ncbi.nlm.nih.gov/x` → `{ mo: 3, lai: 2, tiLe: 66.7 }`;
     một lượt An chạy **trước** lượt Mai thì không tính lại;
   - `anhNgoaiChuDe('thu', [], [{ files: ['hinh-moi/a.png', 'output/thu/hinh/b.png', 'output/thu/slides.md'] }])` → 1; chủ đề `null` → `null`.
   Đối chiếu tay trên dữ liệu thật (không đưa vào kiểm thử) phải ra:

   | Dự án | Câu hỏi trùng | An mở lại | Ảnh ngoài |
   |---|---|---|---|
   | `plan-20261016-204631` (v5) | 0 | 19/56 = 33,9% | (không có chủ đề) |
   | `plan-20261017-170653` (v6) | 6 | 16/26 = 61,5% | 2 (`hinh-moi/`) |
   | `plan-20261019-193827` (v7) | 0 | 9/25 = 36% | 0 |
   | `plan-20261021-195355` (khớp gối) | 0 | 3/15 = 20% | 0 |

   Số v6 và v7 khớp mục 1.3, 1.5 của kế hoạch (115 hỏi 4 lần + Canva 3 lần; mở lại 36–43%).
5. Giao diện, khối "Trí não":
   - bảng theo dự án thêm 3 cột "Câu hỏi trùng", "An mở lại", "Ảnh ngoài thư mục" (`—` khi `null`);
   - dòng thẻ số thêm thẻ "`index.md`: n dòng";
   - mục tiêu và tô xanh như 4.6, số lấy đúng bảng ở đầu mục này.
6. `docs/trien-khai/dot-4.md`, "Phát hiện thêm" số 14: thêm dòng "Bốn chỉ số bỏ qua đã có ở 5.5."

---

## 5.6 Phân loại bài học: "trang An toàn"

BH-48 ("Khi đạo cụ trong ảnh tư thế đổi… sửa mọi chỗ nhắc tên tư thế trong slides.md: bảng mục tiêu, trang An toàn, …") bị xếp `an-toan-thieu-ccd` chỉ vì tên trang "An toàn".
Ở dự án khớp gối, Lam có 2 vấn đề BẮT BUỘC loại an toàn (VD-3, VD-5), nên BH-48 bị tính tái phạm và lên checklist dù không liên quan.

**Làm**
1. `lib/bai-hoc.js`, `LOAI_THEO_TU`: luật `an-toan-thieu-ccd` đổi `an toàn` thành `(?<!trang )an toàn` (giữ cờ `iu`).
2. Kiểm thử thêm vào `phanLoaiBaiHoc với câu thật`: câu BH-48 ở trên → `anh-sai-tu-the` (luật "đạo cụ", đã chạy thử); câu "Ghi lưu ý an toàn cho từng tư thế" → vẫn `an-toan-thieu-ccd`.
3. **Commit dữ liệu riêng** (`5.6 dữ liệu: BH-48 đổi loại lỗi`), sửa frontmatter `workspace/tri-thuc/bai-hoc/BH-48.md`:
   `loai_loi: anh-sai-tu-the` (đúng kết quả luật mới), `bac: 1`, `lan_tai_pham: 0`, `trang_thai: moi`. Thêm vào mục "## Ghi chú": `- Sửa tay ở Đợt 5: bị xếp nhầm loại an toàn vì tên "trang An toàn"; lần tái phạm ở plan-20261021-195355 không tính.`
   Luật mới không chạy lại cho 81 bài cũ (`chuyen-bai-hoc.js` chỉ chạy một lần), nên các bài khác giữ nguyên.

---

## 5.7 Dọn hai chỗ chữ lỗi thời

1. `DEFAULT_CONFIG`: chú thích `// máy soát: số chữ tối đa trên một trang slide (Ý chính + Câu chốt)` đang nằm cuối dòng `agyBrainDir`. Dời về cuối dòng `lintMaxWords: 40,`.
2. `buildPrompt`, quy tắc tiết kiệm số 3: bỏ ví dụ đã lỗi thời. Câu mới, nguyên văn:
   `3. Không sửa file nháp của agent khác (trừ khi nhiệm vụ yêu cầu rõ).`
   Lý do: từ Đợt 3, máy chủ ghi bài học vào `tri-thuc/bai-hoc/`, không agent nào ghi `kinh-nghiem.md` nữa.

---

## Xong Đợt 5 khi

- `npm test` qua hết, `node --check server.js` không lỗi, thử khởi động không lỗi.
- Hai dòng trong `lo-hong.md` đã `[x]`.
- `GET /api/tri-nao` trên workspace thật trả đủ ba cột mới cho từng dự án và `tong.indexDong` (hiện là 24).
- Chủ dự án làm phần **Đợt 5** trong [thu-tren-may.md](thu-tren-may.md).

---

## Phát hiện thêm

(Người triển khai ghi vào đây.)

Lựa chọn khi đặc tả chưa nói rõ (chủ dự án xem lại):

1. **5.4 Tên file bối cảnh** là đúng mã lượt chạy (`<giờ>-<id>.md`). Mọi lượt thuộc dự án có gói ngữ cảnh đều được ghi, kể cả lượt nghiệm thu và giao ban của điều phối viên (bước 0); những lượt này chưa có nút trong giao diện, xem trong thư mục `du-an/<mã>/boi-canh/` hoặc ở ngăn chi tiết lượt chạy. Lượt hỏi nhanh (4.5) dùng prompt riêng nên không có file.
2. **5.5 Chủ đề** lấy bằng `planTopic` như phần còn lại của máy chủ, nên dự án cũ chưa có `plan.topic` (vd v5 `plan-20261016-204631`) vẫn đo được ảnh ngoài thư mục (ra 0), không phải "không có chủ đề" như bảng ở bước 4.
3. **5.6 Bản xem `agents/lam/kinh-nghiem.md` và `tri-thuc/00-ban-do.md`** được dựng lại bằng chính máy chủ (trên bản sao workspace) rồi chép vào commit dữ liệu: BH-48 không còn là checklist của Lam, bản đồ ghi 0 lỗ hổng chưa sửa. `index.md` không chép vì bản sao làm sai thứ tự giờ sửa (giống dot-0.md).

Đã thử trên bản sao workspace:

4. **5.4** với một lệnh `claude` giả: dự án một bước của Lam ghi `du-an/<mã>/boi-canh/<mã lượt>.md` có đủ quyết định, bài học, note liên quan; bước có `boiCanh` trỏ đúng file.
5. **5.5** `GET /api/tri-nao` ra đúng bảng ở bước 4 (v6: 6 câu hỏi trùng, 16/26 = 61,5%, 2 ảnh; `index.md` 24 dòng). Khối Trí não kiểm bằng cách chạy riêng hàm dựng HTML trên kết quả đó.
6. **5.1, 5.3** chỉ kiểm bằng kiểm thử và đọc code; cần một dự án thật để thấy (xem thu-tren-may.md, Đợt 5).

Thử trên máy (2026-10-22, cùng dự án thử với dot-4.md số 16–23, `plan-20261022-203403`, đang tạm dừng ở bước 14/16):

7. **Đạt 5.1:** Hạ duyệt thiết kế (bước 11) CẦN SỬA; Lam chỉ có VD-19 (NÊN, `slides.md`) và vẫn được giao bước 13, chạy song song với Vy.
8. **Đạt 5.2:** việc lẻ của Vy gọi `soat_loi` cho `output/thoai-hoa-khop-goi/thiet-ke.md`, bàn giao có đúng dòng `Số chữ trên slide theo thiết kế (ước lượng…): Trang 1: 12 · Trang 2: 45 · Trang 3: 66 · Trang 4: 88 · …`, không gọi Bash.
9. **Đạt 5.4:** mọi lượt của dự án có file `du-an/plan-20261022-203403/boi-canh/<mã lượt>.md`; nút **Bối cảnh** trong ngăn chi tiết thẻ mở đúng file. Cửa sổ xem file ghi "Chưa rõ agent nào tạo file này" (file do máy chủ sinh), không ảnh hưởng.
10. **Đạt 5.5, 5.6:** khối Trí não có 3 cột mới và thẻ `index.md`: 24 dòng; v6 ra 6 câu hỏi trùng, 2 ảnh ngoài thư mục, An mở lại 16/26 = 61,5%. `BH-48` có `loai_loi: anh-sai-tu-the`, `trang_thai: moi`.
11. **5.3 đạt phần chính** (chạy tiếp ngày 2026-10-22, 22:00): nghiệm thu lần 1 được 85/100 và giao 2 việc sửa nhanh. Hồi cứu xong trước khi các bước sửa chạy, và bối cảnh bước sửa của Vy có `[BH-57]`, bài vừa lên checklist ở chính lần hồi cứu này. Nghiệm thu có kèm 2 câu hỏi nên máy chủ đi nhánh `askOwner` (giữ như cũ); ghi chú "Chờ hồi cứu xong rồi giao vòng sửa" vì vậy chưa thấy. Muốn thấy nó thì cần một lần nghiệm thu giao việc sửa mà không hỏi gì.
12. **Sổ vấn đề:** VD-1..3 (An nêu ở file nguồn khi file chưa tồn tại, người sửa "chưa rõ") vẫn "Mở" dù Mai đã sửa và An duyệt lại đạt. Vấn đề không rõ chủ không vào danh sách duyệt lại nên không bao giờ được đóng; nếu không ai đóng tay, chúng sẽ còn mở tới nghiệm thu.
13. **Bộ não nhập dòng giữ chỗ thành ý đã duyệt:** ở bước 2, bảng ý của An chỉ có dòng "Chưa duyệt ý nào" (ghi chú "Chờ file nguồn của Mai"); máy chủ tạo `tri-thuc/menh-de/chua-duyet-y-nao.md` với `trang_thai: da-duyet`. Cần coi dòng kiểu này là trống (giống cách sửa mã giữ chỗ "(chưa kiểm)" ở dot-2.md số 16) và xoá hoặc đặt `bac-bo` cho note đó.

Chạy tiếp tới nghiệm thu (2026-10-22, 22:00–22:12, sau khi hạn mức làm mới):

14. **Lỗi (đã sửa): bước duyệt lại không chờ bước giao ban chèn vào khi chạy song song.** Giao ban sau bước 13 chèn bước 14 (Mai tải hình) và 15 (Vy sửa thiết kế) với `from` rỗng. Bước 16 (Hạ duyệt lại) chỉ chờ bước 11–13, nên với `maxParallel: 2` Hạ bắt đầu cùng lúc với Mai, trước khi Vy sửa. Hạ duyệt bản thiết kế cũ, vẫn CẦN SỬA, rồi hết vòng sửa và để nghiệm thu xử lý. `choBuocChen` (`lib/lich.js`, có kiểm thử) nay thêm các bước chèn vào `from` của mọi bước đang chờ phía sau. Chạy tuần tự không đổi. Các chỗ chèn bước khác (`handleReview`, hình tải hỏng) chưa xét.
15. **Bản sửa lỗi 429 (dot-4.md số 19) chưa được thử thật:** lần chạy lại này Mai vẫn bị Commons trả 429, nhưng có ghi `danh-sach.md` nên bước được tính là xong, không đi vào nhánh lỗi. Hình cơ tứ đầu vẫn chưa tải được; thiết kế dùng tạm `Knee_diagram` theo câu trả lời của chủ dự án.
16. Dự án xong: 85/100 lần đầu, 2,71 triệu token quy đổi (bước nguồn 0,48 triệu), 3 lần giao ban, 0 câu hỏi trùng. Hồi cứu ra 5 bài học mới, 2 lần sửa/gộp, 6 lỗ hổng, 2 mẫu tốt; 5 bài cũ của Vy (BH-51, 52, 53, 57, 58) tái phạm và lên checklist. Không có đề xuất cải tiến nào, nên khối Đề xuất cải tiến vẫn chưa thử được với đề xuất thật.
