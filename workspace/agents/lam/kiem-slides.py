import re
p=r'D:\work\yoga-lab-pixel\workspace\output\suy-giap-v6\slides.md'
t=open(p,encoding='utf-8').read()
t=t.replace("Tổng: 60 phút. Lý thuyết và y khoa 35 phút (tr.1–15, 23–26: 3+2+3+... xem từng trang), thực hành 25 phút (tr.16–22: 5+4+3+3+3+2+5).","Tổng: 60 phút = lý thuyết, y khoa, an toàn 35 phút (tr.1–15, 23–26) + thực hành 25 phút (tr.16–22: 5+4+3+3+3+2+5).")
t=t.replace("- Nguồn: [1][3][13]","- Nguồn: [1][3][14]")
t=re.sub(r"\n\[15\].*","",t); t=re.sub(r"\n\[16\].*","",t)
t=t.replace("[1]–[16]","[1]–[14]")
t=t.replace("Nếu bạn là nữ, trên 30 tuổi, mẹ hay chị có tiền sử tuyến giáp thì","Nếu bạn là nữ, hoặc mẹ, chị có tiền sử tuyến giáp thì")
t=t.replace("Người suy giáp có thể nhịp tim chậm và hay choáng khi đứng dậy nhanh, vì vậy","Một số người suy giáp có nhịp tim chậm, huyết áp có thể thấp, vì vậy")
t=t.replace("Nếu bạn dùng muối, rong biển hay viên bổ sung,","Nếu bạn dùng rong biển hay viên bổ sung,")
open(p,'w',encoding='utf-8').write(t)
pages=re.split(r"\n## Trang ",t)[1:]
tot=0;tp=0
for pg in pages:
    num=pg.split(' ·')[0]
    ph=int(re.search(r"- Phút: (\d+)",pg).group(1)); tot+=ph
    if 16<=int(num)<=22: tp+=ph
    y=pg.split('- Ý chính:')[1].split('- Câu chốt:')[0]
    items=[l.strip()[2:] for l in y.splitlines() if l.strip().startswith('- ')]
    ch=re.search(r"- Câu chốt: (.*)",pg).group(1)
    ch='' if ch.strip()=='—' else ch
    at=re.search(r"Trên slide: (.*)",pg)
    w=sum(len(i.split()) for i in items)+len(ch.split())+(len(at.group(1).split()) if at else 0)
    print(num,ph,len(items),w)
print('pages',len(pages),'tot',tot,'practice',tp)
for k in ['chữa','kích thích','massage tuyến','giảm liều','thải độc','chắc chắn','duy nhất','giáo viên','thầy',',.','..',' ,','  ']:
    print(repr(k),[t[max(0,m.start()-20):m.start()+20] for m in re.finditer(re.escape(k),t)][:4])
