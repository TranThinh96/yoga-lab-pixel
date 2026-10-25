#!/usr/bin/env node
'use strict';
// Vẽ chân dung pixel public/assets/portrait-<id>.png cho agent chưa có ảnh, theo màu trong config.json (look).
//   node scripts/ve-chan-dung.js            → mọi agent chưa có ảnh
//   node scripts/ve-chan-dung.js vy nhi     → chỉ những người này (đã có ảnh thì bỏ qua)
//   thêm --ghi-de để vẽ lại cả ảnh đã có
const fs = require('fs');
const path = require('path');
const { veChanDung, VAT } = require('../lib/chan-dung');
const { maHoa } = require('../lib/anh');

const ROOT = path.join(__dirname, '..');
const args = process.argv.slice(2), ghiDe = args.includes('--ghi-de'), ids = args.filter(a => !a.startsWith('--'));
const agents = JSON.parse(fs.readFileSync(path.join(ROOT, 'config.json'), 'utf8')).agents || [];
for (const a of agents) {
  if (ids.length && !ids.includes(a.id)) continue;
  const file = path.join(ROOT, 'public', 'assets', `portrait-${a.id}.png`);
  if (fs.existsSync(file) && !ghiDe) { if (ids.length) console.log(`${a.id}: đã có ảnh, bỏ qua (thêm --ghi-de để vẽ lại)`); continue; }
  fs.writeFileSync(file, maHoa(veChanDung(a.look, { vat: VAT[a.id] })));
  console.log(`${a.id}: ${path.relative(ROOT, file)}`);
}
