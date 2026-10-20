'use strict';
// Đọc/ghi note Markdown có frontmatter, chỉ phần YAML đơn giản mà Obsidian Properties dùng:
// chuỗi, số, true/false, danh sách khối ("  - a") hoặc danh sách một dòng ("[a, b]").
function giaTri(s) {
  s = s.trim();
  if (s === '') return '';
  if (/^".*"$/.test(s)) { try { return JSON.parse(s); } catch { return s.slice(1, -1); } }
  if (/^'.*'$/.test(s)) return s.slice(1, -1).replace(/''/g, "'");
  if (/^\[.*\]$/.test(s)) return s.slice(1, -1).split(',').map(x => giaTri(x)).filter(x => x !== '');
  if (/^(true|false)$/.test(s)) return s === 'true';
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  return s;
}

function docGhiChu(text) {
  const t = String(text || '').replace(/^﻿/, '').normalize('NFC');
  const m = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/.exec(t);
  if (!m) return { data: {}, body: t };
  const data = {};
  let key = null;
  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim() || /^\s*#/.test(line)) continue;
    const kv = /^([A-Za-z0-9_-]+):(?:\s+(.*))?$/.exec(line);
    if (kv) { key = kv[1]; data[key] = kv[2] === undefined ? '' : giaTri(kv[2].replace(/\s+#.*$/, '')); continue; }
    const item = /^\s*-\s+(.*)$/.exec(line);
    if (item && key) { if (!Array.isArray(data[key])) data[key] = []; data[key].push(giaTri(item[1])); }
  }
  return { data, body: t.slice(m[0].length) };
}

const canNhay = s => s === '' || /^[\s'"\[\]{}>|*&!%@`#,?-]|: |\s#|^(true|false|null|~)$|^-?\d+(\.\d+)?$|\s$/.test(s);
const chuoi = s => { s = String(s); return canNhay(s) || /[\[\]]/.test(s) ? JSON.stringify(s) : s; };

// Ghi danh sách dạng khối, giống cách Obsidian tự ghi, để file không bị đổi qua lại mỗi lần lưu
function vietGhiChu(data, body) {
  const L = ['---'];
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) { L.push(v.length ? `${k}:` : `${k}: []`); for (const x of v) L.push(`  - ${chuoi(x)}`); }
    else if (typeof v === 'number' || typeof v === 'boolean') L.push(`${k}: ${v}`);
    else L.push(`${k}: ${chuoi(v)}`);
  }
  L.push('---');
  return L.join('\n') + '\n' + String(body || '').replace(/^\n+/, '');
}

module.exports = { docGhiChu, vietGhiChu };
