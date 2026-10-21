'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const bh = require('../lib/bai-hoc');

test('gocCua', () => {
  assert.equal(bh.gocCua('lech-hai-file'), 'quy-trinh');
  assert.equal(bh.gocCua('link-chet'), 'moi-truong');
  assert.equal(bh.gocCua('file-khong-ton-tai'), 'cong-cu');
  assert.equal(bh.gocCua('phong-dai'), 'agent');
  assert.equal(bh.gocCua('khac'), 'agent');
});
