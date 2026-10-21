#!/usr/bin/env node
'use strict';
// Cầu nối MCP (stdio) cho agent Claude Code: chuyển lời gọi công cụ về máy chủ Yoga Lab qua 127.0.0.1.
// Mỗi dòng stdin/stdout là một thông điệp JSON-RPC 2.0. stdout chỉ dành cho thông điệp; ghi log ra stderr.
const http = require('http');
const readline = require('readline');
const BASE = process.env.YOGALAB_URL || 'http://127.0.0.1:4321', KEY = process.env.YOGALAB_KEY || '';

function goi(duong, body) {
  return new Promise((resolve, reject) => {
    const data = Buffer.from(JSON.stringify(body));
    // hoi_dong_nghiep chờ đồng nghiệp trả lời tối đa 3 phút
    const req = http.request(BASE + '/api/lab/' + duong, { method: 'POST', timeout: 240000,
      headers: { 'Content-Type': 'application/json', 'Content-Length': data.length } }, res => {
      let s = ''; res.setEncoding('utf8');
      res.on('data', d => { s += d; });
      res.on('end', () => { try { resolve(JSON.parse(s)); } catch { reject(new Error('HTTP ' + res.statusCode)); } });
    });
    req.on('timeout', () => req.destroy(new Error('quá thời gian')));
    req.on('error', reject);
    req.end(data);
  });
}
const gui = m => process.stdout.write(JSON.stringify(m) + '\n');

async function xuLy(m) {
  if (!m || m.id === undefined || m.id === null) return; // thông báo (notifications/…): không trả lời
  const ok = result => gui({ jsonrpc: '2.0', id: m.id, result });
  try {
    if (m.method === 'initialize') return ok({ protocolVersion: (m.params && m.params.protocolVersion) || '2025-06-18',
      capabilities: { tools: {} }, serverInfo: { name: 'yogalab', version: '1.0.0' } });
    if (m.method === 'ping') return ok({});
    if (m.method === 'tools/list') return ok({ tools: (await goi('_list', { key: KEY })).tools || [] });
    if (m.method === 'tools/call') {
      const r = await goi('_call', { key: KEY, name: m.params && m.params.name, args: (m.params && m.params.arguments) || {} });
      return ok({ content: [{ type: 'text', text: String(r.text || r.error || '') }], isError: !!(r.isError || r.error) });
    }
    gui({ jsonrpc: '2.0', id: m.id, error: { code: -32601, message: 'Method not found' } });
  } catch (e) {
    if (m.method === 'tools/call') return ok({ content: [{ type: 'text', text: 'Máy chủ Yoga Lab không trả lời: ' + e.message }], isError: true });
    gui({ jsonrpc: '2.0', id: m.id, error: { code: -32603, message: e.message } });
  }
}

readline.createInterface({ input: process.stdin }).on('line', line => {
  line = line.trim(); if (!line) return;
  let m; try { m = JSON.parse(line); } catch { return; }
  for (const x of Array.isArray(m) ? m : [m]) xuLy(x);
});
