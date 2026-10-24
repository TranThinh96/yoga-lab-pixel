'use strict';
// Đóng gói file .pptx (Office Open XML) từ một bộ slide đã dàn trang, không cần gói npm.
// Bộ slide: { slides: [{ bg, shapes, notes }], media: [{ name, data }] }; toạ độ, kích thước tính bằng inch (khổ 13,333 × 7,5).
// Hình: { kieu: 'hop' | 'chu' | 'anh' | 'tron', x, y, w, h, ... } (xem hinhXml). Chỉ xử lý dữ liệu trong bộ nhớ: không đọc file.
const zlib = require('zlib');

const EMU = 914400, RONG = 40 / 3, CAO = 7.5; // khổ 16:9 chuẩn của PowerPoint: 12192000 × 6858000 EMU
const emu = v => Math.round(v * EMU);

// ── Zip ──
const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
  return t;
})();
function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}
// files: [{ name, data: Buffer | string }]; ảnh đã nén sẵn nên chỉ lưu, file chữ thì nén deflate
function zip(files) {
  const parts = [], dir = [];
  let off = 0;
  for (const f of files) {
    const raw = Buffer.isBuffer(f.data) ? f.data : Buffer.from(String(f.data), 'utf8');
    const nen = !/\.(png|jpe?g|gif|webp)$/i.test(f.name);
    const data = nen ? zlib.deflateRawSync(raw, { level: 6 }) : raw;
    const ten = Buffer.from(f.name, 'utf8'), crc = crc32(raw);
    const head = Buffer.alloc(30);
    head.writeUInt32LE(0x04034b50, 0); head.writeUInt16LE(20, 4); head.writeUInt16LE(0x0800, 6); head.writeUInt16LE(nen ? 8 : 0, 8);
    head.writeUInt32LE(0, 10); head.writeUInt32LE(crc, 14); head.writeUInt32LE(data.length, 18); head.writeUInt32LE(raw.length, 22);
    head.writeUInt16LE(ten.length, 26); head.writeUInt16LE(0, 28);
    parts.push(head, ten, data);
    const cd = Buffer.alloc(46);
    cd.writeUInt32LE(0x02014b50, 0); cd.writeUInt16LE(20, 4); cd.writeUInt16LE(20, 6); cd.writeUInt16LE(0x0800, 8); cd.writeUInt16LE(nen ? 8 : 0, 10);
    cd.writeUInt32LE(0, 12); cd.writeUInt32LE(crc, 16); cd.writeUInt32LE(data.length, 20); cd.writeUInt32LE(raw.length, 24);
    cd.writeUInt16LE(ten.length, 28); cd.writeUInt32LE(off, 42);
    dir.push(cd, ten);
    off += 30 + ten.length + data.length;
  }
  const cdLen = dir.reduce((a, b) => a + b.length, 0), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(files.length, 8); end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(cdLen, 12); end.writeUInt32LE(off, 16);
  return Buffer.concat([...parts, ...dir, end]);
}

// Kích thước ảnh PNG/JPEG từ phần đầu file: { w, h } hoặc null
function kichThuocAnh(buf) {
  if (!buf || buf.length < 24) return null;
  if (buf.readUInt32BE(0) === 0x89504e47) return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  if (buf[0] === 0xFF && buf[1] === 0xD8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xFF) { i++; continue; }
      const m = buf[i + 1], len = buf.readUInt16BE(i + 2);
      if (m >= 0xC0 && m <= 0xCF && ![0xC4, 0xC8, 0xCC].includes(m)) return { w: buf.readUInt16BE(i + 7), h: buf.readUInt16BE(i + 5) };
      i += 2 + len;
    }
  }
  return null;
}

// ── XML ──
const NS = 'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"';
const XML = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
const esc = s => String(s == null ? '' : s).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const mau = c => String(c || '000000').replace(/^#/, '').toUpperCase();
const NHOM = '<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>';
const xfrm = s => `<a:xfrm><a:off x="${emu(s.x)}" y="${emu(s.y)}"/><a:ext cx="${Math.max(1, emu(s.w))}" cy="${Math.max(1, emu(s.h))}"/></a:xfrm>`;
const to = (c, alpha) => c ? `<a:solidFill><a:srgbClr val="${mau(c)}">${alpha != null && alpha < 1 ? `<a:alpha val="${Math.round(alpha * 100000)}"/>` : ''}</a:srgbClr></a:solidFill>` : '<a:noFill/>';
const vien = s => s.vien ? `<a:ln w="${Math.round((s.vienDay || 1.5) * 12700)}">${to(s.vien)}${s.netDut ? '<a:prstDash val="dash"/>' : ''}</a:ln>` : '<a:ln><a:noFill/></a:ln>';

// Đoạn chữ: { chu: [{ t, dam, nghieng, co, mau, font }], canh: 'l'|'ctr'|'r', cham: bool, sau: pt }
function doanXml(d, macDinh) {
  const pPr = [`<a:pPr algn="${d.canh || 'l'}"${d.cham ? ' marL="228600" indent="-228600"' : ''}>`,
    `<a:lnSpc><a:spcPct val="${Math.round((d.gian || macDinh.gian || 1.1) * 100000)}"/></a:lnSpc>`,
    `<a:spcAft><a:spcPts val="${Math.round((d.sau != null ? d.sau : 4) * 100)}"/></a:spcAft>`,
    d.cham ? `<a:buClr><a:srgbClr val="${mau(macDinh.mauCham || macDinh.mau)}"/></a:buClr><a:buFont typeface="Arial"/><a:buChar char="•"/>` : '<a:buNone/>',
    '</a:pPr>'].join('');
  const runs = (d.chu || []).filter(r => r.t).map(r => {
    const f = r.font || macDinh.font;
    return `<a:r><a:rPr lang="vi-VN" sz="${Math.round((r.co || macDinh.co || 18) * 100)}" b="${r.dam ? 1 : 0}" i="${r.nghieng ? 1 : 0}" dirty="0">` +
      `${to(r.mau || macDinh.mau)}<a:latin typeface="${esc(f)}"/><a:cs typeface="${esc(f)}"/></a:rPr><a:t>${esc(r.t)}</a:t></a:r>`;
  }).join('');
  const end = `<a:endParaRPr lang="vi-VN" sz="${Math.round((macDinh.co || 18) * 100)}" dirty="0"/>`;
  return `<a:p>${pPr}${runs}${end}</a:p>`;
}
function thanChu(s) {
  const le = s.le != null ? s.le : 0.12, md = { font: s.font, co: s.co, mau: s.mau, gian: s.gian, mauCham: s.mauCham };
  const doan = (s.doan && s.doan.length ? s.doan : [{ chu: [] }]).map(d => doanXml(d, md)).join('');
  return `<p:txBody><a:bodyPr wrap="${s.khongXuong ? 'none' : 'square'}" lIns="${emu(le)}" tIns="${emu(le * 0.7)}" rIns="${emu(le)}" bIns="${emu(le * 0.7)}" anchor="${s.doc || 't'}" rtlCol="0"><a:normAutofit/></a:bodyPr><a:lstStyle/>${doan}</p:txBody>`;
}
const HINH = { hop: 'rect', bo: 'roundRect', tron: 'ellipse', vienthuoc: 'roundRect', dauBo: 'round2SameRect', muiTenXuong: 'downArrow' };
const bong = s => s.bong ? '<a:effectLst><a:outerShdw blurRad="88900" dist="25400" dir="5400000" algn="t" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="14000"/></a:srgbClr></a:outerShdw></a:effectLst>' : '';
const hinhHoc = s => {
  const prst = HINH[s.dang || 'hop'] || 'rect';
  if (prst === 'roundRect' || prst === 'round2SameRect') return `<a:prstGeom prst="${prst}"><a:avLst><a:gd name="adj${prst === 'roundRect' ? '' : '1'}" fmla="val ${s.dang === 'vienthuoc' ? 50000 : Math.round((s.bo != null ? s.bo : 0.12) * 100000)}"/></a:avLst></a:prstGeom>`;
  return `<a:prstGeom prst="${prst}"><a:avLst/></a:prstGeom>`;
};
// Hình vẽ tự do (cành lá, sóng): duong = [{ d: [['M', x, y], ['C', x1, y1, x2, y2, x, y], ['L', x, y], ['Z']], kin: true|false }], toạ độ 0–1000 trong khung
function hinhVe(s) {
  const pt = (x, y) => `<a:pt x="${Math.round(x)}" y="${Math.round(y)}"/>`;
  const paths = (s.duong || []).map(p => `<a:path w="1000" h="1000"${p.kin ? '' : ' fill="none"'}>` + p.d.map(([l, ...v]) =>
    l === 'M' ? `<a:moveTo>${pt(v[0], v[1])}</a:moveTo>` : l === 'L' ? `<a:lnTo>${pt(v[0], v[1])}</a:lnTo>` :
      l === 'C' ? `<a:cubicBezTo>${pt(v[0], v[1])}${pt(v[2], v[3])}${pt(v[4], v[5])}</a:cubicBezTo>` : '<a:close/>').join('') + '</a:path>').join('');
  return `<a:custGeom><a:avLst/><a:gdLst/><a:ahLst/><a:cxnLst/><a:rect l="0" t="0" r="r" b="b"/><a:pathLst>${paths}</a:pathLst></a:custGeom>`;
}
function hinhXml(s, id, rid) {
  if (s.kieu === 'anh') {
    const c = s.cat || {}, p = v => Math.round((v || 0) * 100000);
    return `<p:pic><p:nvPicPr><p:cNvPr id="${id}" name="${esc(s.ten || 'Hình ' + id)}"${s.moTa ? ` descr="${esc(s.moTa)}"` : ''}/><p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr><p:nvPr/></p:nvPicPr>` +
      `<p:blipFill><a:blip r:embed="${rid}"/><a:srcRect l="${p(c.l)}" t="${p(c.t)}" r="${p(c.r)}" b="${p(c.b)}"/><a:stretch><a:fillRect/></a:stretch></p:blipFill>` +
      `<p:spPr>${xfrm(s)}${hinhHoc({ dang: s.dang || 'hop', bo: s.bo })}${bong(s)}</p:spPr></p:pic>`;
  }
  const geom = s.kieu === 've' ? hinhVe(s) : hinhHoc(s);
  return `<p:sp><p:nvSpPr><p:cNvPr id="${id}" name="${esc(s.ten || 'Khối ' + id)}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr>` +
    `<p:spPr>${xfrm(s)}${geom}${to(s.nen, s.mo)}${s.kieu === 've' && s.net ? `<a:ln w="${Math.round((s.netDay || 1) * 12700)}" cap="rnd">${to(s.net, s.netMo)}</a:ln>` : vien(s)}${bong(s)}</p:spPr>${thanChu(s)}</p:sp>`;
}

function slideXml(sl, ridAnh) {
  let id = 2;
  const shapes = (sl.shapes || []).map(s => hinhXml(s, id++, s.kieu === 'anh' ? ridAnh[s.anh] : null)).join('');
  return `${XML}<p:sld ${NS}><p:cSld><p:bg><p:bgPr>${to(sl.bg || 'FFFFFF')}<a:effectLst/></p:bgPr></p:bg><p:spTree>${NHOM}${shapes}</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>`;
}
function ghiChuXml(text) {
  const doan = String(text || '').split(/\r?\n/).map(l => `<a:p><a:r><a:rPr lang="vi-VN" dirty="0"/><a:t>${esc(l)}</a:t></a:r></a:p>`).join('') || '<a:p/>';
  return `${XML}<p:notes ${NS}><p:cSld><p:spTree>${NHOM}` +
    '<p:sp><p:nvSpPr><p:cNvPr id="2" name="Slide Image Placeholder 1"/><p:cNvSpPr><a:spLocks noGrp="1" noRot="1" noChangeAspect="1"/></p:cNvSpPr><p:nvPr><p:ph type="sldImg"/></p:nvPr></p:nvSpPr><p:spPr/></p:sp>' +
    `<p:sp><p:nvSpPr><p:cNvPr id="3" name="Notes Placeholder 2"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="body" idx="1"/></p:nvPr></p:nvSpPr><p:spPr/><p:txBody><a:bodyPr/><a:lstStyle/>${doan}</p:txBody></p:sp>` +
    '</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:notes>';
}

const CLR_MAP = 'bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"';
function themeXml(fontTieuDe, fontNoiDung) {
  const c = (n, v) => `<a:${n}><a:srgbClr val="${v}"/></a:${n}>`;
  const fill = '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>';
  const ln = w => `<a:ln w="${w}"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln>`;
  return `${XML}<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Yoga Lab"><a:themeElements>` +
    `<a:clrScheme name="Yoga Lab"><a:dk1><a:srgbClr val="2E3829"/></a:dk1><a:lt1><a:srgbClr val="FFFFFF"/></a:lt1>${c('dk2', '3E5F45')}${c('lt2', 'F4F1E8')}` +
    `${c('accent1', '3E5F45')}${c('accent2', '8A9A5B')}${c('accent3', 'C2654F')}${c('accent4', 'E3CFAE')}${c('accent5', '6F8F72')}${c('accent6', 'A3B18A')}${c('hlink', '3E5F45')}${c('folHlink', '8A9A5B')}</a:clrScheme>` +
    `<a:fontScheme name="Yoga Lab"><a:majorFont><a:latin typeface="${esc(fontTieuDe)}"/><a:ea typeface=""/><a:cs typeface=""/></a:majorFont><a:minorFont><a:latin typeface="${esc(fontNoiDung)}"/><a:ea typeface=""/><a:cs typeface=""/></a:minorFont></a:fontScheme>` +
    `<a:fmtScheme name="Yoga Lab"><a:fillStyleLst>${fill}${fill}${fill}</a:fillStyleLst><a:lnStyleLst>${ln(6350)}${ln(12700)}${ln(19050)}</a:lnStyleLst>` +
    '<a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst>' +
    `<a:bgFillStyleLst>${fill}${fill}${fill}</a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/></a:theme>`;
}
const MASTER = `${XML}<p:sldMaster ${NS}><p:cSld><p:bg><p:bgRef idx="1001"><a:schemeClr val="bg1"/></p:bgRef></p:bg><p:spTree>${NHOM}</p:spTree></p:cSld>` +
  `<p:clrMap ${CLR_MAP}/><p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst>` +
  '<p:txStyles><p:titleStyle><a:lvl1pPr><a:defRPr sz="3200"><a:latin typeface="+mj-lt"/></a:defRPr></a:lvl1pPr></p:titleStyle><p:bodyStyle><a:lvl1pPr><a:defRPr sz="2000"><a:latin typeface="+mn-lt"/></a:defRPr></a:lvl1pPr></p:bodyStyle><p:otherStyle><a:lvl1pPr><a:defRPr sz="1800"><a:latin typeface="+mn-lt"/></a:defRPr></a:lvl1pPr></p:otherStyle></p:txStyles></p:sldMaster>';
const LAYOUT = `${XML}<p:sldLayout ${NS} type="blank" preserve="1"><p:cSld name="Trống"><p:spTree>${NHOM}</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>`;
const NOTES_MASTER = `${XML}<p:notesMaster ${NS}><p:cSld><p:bg><p:bgRef idx="1001"><a:schemeClr val="bg1"/></p:bgRef></p:bg><p:spTree>${NHOM}` +
  '<p:sp><p:nvSpPr><p:cNvPr id="2" name="Slide Image Placeholder 1"/><p:cNvSpPr><a:spLocks noGrp="1" noRot="1" noChangeAspect="1"/></p:cNvSpPr><p:nvPr><p:ph type="sldImg" idx="2"/></p:nvPr></p:nvSpPr><p:spPr><a:xfrm><a:off x="381000" y="685800"/><a:ext cx="6096000" cy="3429000"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/><a:ln w="12700"><a:solidFill><a:prstClr val="black"/></a:solidFill></a:ln></p:spPr></p:sp>' +
  '<p:sp><p:nvSpPr><p:cNvPr id="3" name="Notes Placeholder 2"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="body" sz="quarter" idx="3"/></p:nvPr></p:nvSpPr><p:spPr><a:xfrm><a:off x="685800" y="4343400"/><a:ext cx="5486400" cy="4114800"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr><p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:endParaRPr lang="vi-VN"/></a:p></p:txBody></p:sp>' +
  `</p:spTree></p:cSld><p:clrMap ${CLR_MAP}/><p:notesStyle><a:lvl1pPr marL="0" algn="l"><a:defRPr sz="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/></a:defRPr></a:lvl1pPr></p:notesStyle></p:notesMaster>`;

const RT = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/';
const rels = ds => `${XML}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${ds.map(([id, type, target]) => `<Relationship Id="${id}" Type="${type.startsWith('http') ? type : RT + type}" Target="${esc(target)}"/>`).join('')}</Relationships>`;
const CT = 'application/vnd.openxmlformats-officedocument.presentationml.';

// deck: { slides, media, tieuDe, tacGia, fontTieuDe, fontNoiDung } → Buffer của file .pptx
function taoPptx(deck) {
  const slides = deck.slides || [], media = deck.media || [];
  const files = [], over = [];
  const them = (name, data, type) => { files.push({ name, data }); if (type) over.push([name, type]); };
  const mediaTen = new Map(media.map((m, i) => [m.name, `image${i + 1}${/\.jpe?g$/i.test(m.name) ? '.jpeg' : '.png'}`]));
  slides.forEach((sl, i) => {
    const n = i + 1, dung = [...new Set((sl.shapes || []).filter(s => s.kieu === 'anh').map(s => s.anh))];
    const ridAnh = Object.fromEntries(dung.map((a, k) => [a, `rId${k + 3}`]));
    them(`ppt/slides/slide${n}.xml`, slideXml(sl, ridAnh), CT + 'slide+xml');
    them(`ppt/slides/_rels/slide${n}.xml.rels`, rels([['rId1', 'slideLayout', '../slideLayouts/slideLayout1.xml'],
      ['rId2', 'notesSlide', `../notesSlides/notesSlide${n}.xml`], ...dung.map(a => [ridAnh[a], 'image', `../media/${mediaTen.get(a)}`])]));
    them(`ppt/notesSlides/notesSlide${n}.xml`, ghiChuXml(sl.notes), CT + 'notesSlide+xml');
    them(`ppt/notesSlides/_rels/notesSlide${n}.xml.rels`, rels([['rId1', 'notesMaster', '../notesMasters/notesMaster1.xml'], ['rId2', 'slide', `../slides/slide${n}.xml`]]));
  });
  for (const m of media) them(`ppt/media/${mediaTen.get(m.name)}`, m.data);
  const ft = deck.fontTieuDe || 'Lora', fn = deck.fontNoiDung || 'Be Vietnam Pro';
  them('ppt/presentation.xml', `${XML}<p:presentation ${NS} saveSubsetFonts="1"><p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst>` +
    `<p:notesMasterIdLst><p:notesMasterId r:id="rId2"/></p:notesMasterIdLst><p:sldIdLst>${slides.map((_, i) => `<p:sldId id="${256 + i}" r:id="rId${i + 7}"/>`).join('')}</p:sldIdLst>` +
    `<p:sldSz cx="${emu(RONG)}" cy="${emu(CAO)}"/><p:notesSz cx="6858000" cy="9144000"/></p:presentation>`, CT + 'presentation.main+xml');
  them('ppt/_rels/presentation.xml.rels', rels([['rId1', 'slideMaster', 'slideMasters/slideMaster1.xml'], ['rId2', 'notesMaster', 'notesMasters/notesMaster1.xml'],
    ['rId3', 'theme', 'theme/theme1.xml'], ['rId4', 'presProps', 'presProps.xml'], ['rId5', 'viewProps', 'viewProps.xml'], ['rId6', 'tableStyles', 'tableStyles.xml'],
    ...slides.map((_, i) => [`rId${i + 7}`, 'slide', `slides/slide${i + 1}.xml`])]));
  them('ppt/slideMasters/slideMaster1.xml', MASTER, CT + 'slideMaster+xml');
  them('ppt/slideMasters/_rels/slideMaster1.xml.rels', rels([['rId1', 'slideLayout', '../slideLayouts/slideLayout1.xml'], ['rId2', 'theme', '../theme/theme1.xml']]));
  them('ppt/slideLayouts/slideLayout1.xml', LAYOUT, CT + 'slideLayout+xml');
  them('ppt/slideLayouts/_rels/slideLayout1.xml.rels', rels([['rId1', 'slideMaster', '../slideMasters/slideMaster1.xml']]));
  them('ppt/notesMasters/notesMaster1.xml', NOTES_MASTER, CT + 'notesMaster+xml');
  them('ppt/notesMasters/_rels/notesMaster1.xml.rels', rels([['rId1', 'theme', '../theme/theme2.xml']]));
  them('ppt/theme/theme1.xml', themeXml(ft, fn), 'application/vnd.openxmlformats-officedocument.theme+xml');
  them('ppt/theme/theme2.xml', themeXml(ft, fn), 'application/vnd.openxmlformats-officedocument.theme+xml');
  them('ppt/presProps.xml', `${XML}<p:presentationPr ${NS}/>`, CT + 'presProps+xml');
  them('ppt/viewProps.xml', `${XML}<p:viewPr ${NS}><p:normalViewPr><p:restoredLeft sz="15620"/><p:restoredTop sz="80000"/></p:normalViewPr><p:gridSpacing cx="76200" cy="76200"/></p:viewPr>`, CT + 'viewProps+xml');
  them('ppt/tableStyles.xml', `${XML}<a:tblStyleLst xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" def="{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}"/>`, CT + 'tableStyles+xml');
  const now = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
  them('docProps/core.xml', `${XML}<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">` +
    `<dc:title>${esc(deck.tieuDe || '')}</dc:title><dc:creator>${esc(deck.tacGia || 'Yoga Lab')}</dc:creator>` +
    `<dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified></cp:coreProperties>`,
    'application/vnd.openxmlformats-package.core-properties+xml');
  them('docProps/app.xml', `${XML}<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>Yoga Lab</Application><Slides>${slides.length}</Slides></Properties>`,
    'application/vnd.openxmlformats-officedocument.extended-properties+xml');
  them('_rels/.rels', rels([['rId1', 'officeDocument', 'ppt/presentation.xml'],
    ['rId2', 'http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties', 'docProps/core.xml'],
    ['rId3', 'extended-properties', 'docProps/app.xml']]));
  const types = `${XML}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>' +
    '<Default Extension="png" ContentType="image/png"/><Default Extension="jpeg" ContentType="image/jpeg"/>' +
    over.map(([n, t]) => `<Override PartName="/${n}" ContentType="${t}"/>`).join('') + '</Types>';
  return zip([{ name: '[Content_Types].xml', data: types }, ...files]);
}

module.exports = { taoPptx, zip, crc32, kichThuocAnh, RONG, CAO };
