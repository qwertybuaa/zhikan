import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parseMid, validatePin, creatorURL, searchURL, nameFromTitle} from '../extension/core.js';

test('space links, copied URLs and long UIDs preserve the correct creator', () => {
  for (const value of ['206214', ' https://space.bilibili.com/206214?spm_id_from=333.1007 ', 'space.bilibili.com/206214/upload/video', '//space.bilibili.com/206214/']) assert.equal(parseMid(value), '206214');
  assert.equal(parseMid('12345678901234567890'), '12345678901234567890');
});
test('untrusted URLs cannot become creator links', () => {
  for (const value of ['', '0', '0012', '-2', '2.5', 'https://space.bilibili.com.evil.com/206214', 'https://space.bilibili.com@evil.com/206214', 'https://evil@space.bilibili.com/206214', 'javascript:alert(1)', 'https://www.bilibili.com/video/BV1xx', 'https://space.bilibili.com/206214abc', 'ftp://space.bilibili.com/206214', 'https://space.bilibili.com:8080/206214']) assert.throws(() => parseMid(value), value);
});
test('search queries are encoded as data, including Chinese and URL delimiters', () => {
  for (const query of ['动态规划', 'C++ & Python #1', 'x?redirect=https://evil.com', '<svg onload=alert(1)>']) {
    const global = new URL(searchURL(query));
    assert.equal(global.hostname, 'search.bilibili.com'); assert.equal(global.searchParams.get('keyword'), query);
    const scoped = new URL(searchURL(query, '206214'));
    assert.equal(scoped.pathname, '/206214/search'); assert.equal(scoped.searchParams.get('keyword'), query);
  }
  assert.throws(() => searchURL('   '));
  assert.equal(creatorURL('206214'), 'https://space.bilibili.com/206214/upload/video');
});
test('pin records have bounded, trimmed labels and no extra properties', () => {
  assert.deepEqual(validatePin({mid: '206214', name: ' 灵茶山艾府 ', note: ' 算法 ', malicious: 'x'}), {mid: '206214', name: '灵茶山艾府', note: '算法'});
  for (const pin of [{mid:'1',name:''},{mid:'1',name:'a'.repeat(41)},{mid:'1',name:'x',note:'a'.repeat(81)}]) assert.throws(() => validatePin(pin));
  assert.equal(nameFromTitle('灵茶山艾府的个人空间-灵茶山艾府个人主页-哔哩哔哩视频'), '灵茶山艾府');
});
test('redirect targets only home documents, never videos, searches, login or creator pages', () => {
  const [rule] = JSON.parse(fs.readFileSync(new URL('../extension/rules.json', import.meta.url)));
  const pattern = new RegExp(rule.condition.regexFilter);
  for (const url of ['https://www.bilibili.com/', 'http://bilibili.com/', 'https://www.bilibili.com/?spm_id_from=333.1007', 'https://www.bilibili.com/index.html', 'https://www.bilibili.com/index.htm?from=old', 'https://bilibili.com/#top']) assert.match(url, pattern);
  for (const url of ['https://www.bilibili.com/video/BV1xx/', 'https://www.bilibili.com/bangumi/play/ep123', 'https://search.bilibili.com/all?keyword=x', 'https://space.bilibili.com/206214', 'https://passport.bilibili.com/login', 'https://www.bilibili.com/account/history', 'https://www.bilibili.com/v/popular/all', 'https://www.bilibili.com.evil.com/']) assert.doesNotMatch(url, pattern);
  assert.deepEqual(rule.condition.resourceTypes, ['main_frame']);
  assert.deepEqual(rule.condition.requestMethods, ['get']);
});
