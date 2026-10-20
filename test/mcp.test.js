'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

test('cầu nối MCP chuyển lời gọi về máy chủ', async () => {
  const keys = [];
  const srv = http.createServer((req, res) => {
    let s = '';
    req.on('data', d => { s += d; });
    req.on('end', () => {
      const body = JSON.parse(s);
      keys.push(body.key);
      res.setHeader('Content-Type', 'application/json');
      if (req.url === '/api/lab/_list') return res.end(JSON.stringify({ tools: [{ name: 'soat_loi', description: 'x', inputSchema: { type: 'object' } }] }));
      if (req.url === '/api/lab/_call') return res.end(JSON.stringify({ text: 'ok:' + body.name }));
      res.statusCode = 404; res.end('{}');
    });
  });
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const proc = spawn(process.execPath, [path.join(__dirname, '..', 'mcp', 'yogalab-mcp.js')], {
    env: { ...process.env, YOGALAB_URL: `http://127.0.0.1:${srv.address().port}`, YOGALAB_KEY: 'k' }
  });
  try {
    const replies = [];
    let buf = '';
    const done = new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error('quá thời gian chờ trả lời')), 10000);
      proc.stdout.setEncoding('utf8');
      proc.stdout.on('data', d => {
        buf += d; let i;
        while ((i = buf.indexOf('\n')) >= 0) {
          replies.push(JSON.parse(buf.slice(0, i))); buf = buf.slice(i + 1);
          if (replies.length >= 4) { clearTimeout(t); setTimeout(resolve, 200); } // chờ thêm chút: không được có dòng thứ 5
        }
      });
    });
    const msgs = [
      { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 't', version: '1' } } },
      { jsonrpc: '2.0', method: 'notifications/initialized' },
      { jsonrpc: '2.0', id: 2, method: 'tools/list' },
      { jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'soat_loi', arguments: { file: 'a.md' } } },
      { jsonrpc: '2.0', id: 4, method: 'foo/bar' }
    ];
    proc.stdin.write(msgs.map(m => JSON.stringify(m)).join('\n') + '\n');
    await done;
    assert.equal(replies.length, 4);
    const by = id => replies.find(r => r.id === id);
    assert.equal(by(1).result.protocolVersion, '2025-06-18');
    assert.equal(by(1).result.serverInfo.name, 'yogalab');
    assert.equal(by(2).result.tools.length, 1);
    assert.equal(by(3).result.content[0].text, 'ok:soat_loi');
    assert.equal(by(3).result.isError, false);
    assert.equal(by(4).error.code, -32601);
    assert.ok(keys.length === 2 && keys.every(k => k === 'k'));
  } finally {
    proc.kill();
    await new Promise(r => srv.close(r));
  }
});
