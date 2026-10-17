export const DEFAULT_PINS = [];
export const MAX_PINS = 100;

export function parseMid(value) {
  const input = String(value ?? '').trim();
  if (/^[1-9]\d{0,19}$/.test(input)) return input;
  let url;
  try { url = new URL(/^(?:https?:)?\/\//i.test(input) ? (input.startsWith('//') ? 'https:' + input : input) : 'https://' + input); }
  catch { throw new Error('请粘贴 UP 主的 B 站空间链接，或输入数字 UID。'); }
  if (!['https:', 'http:'].includes(url.protocol) || url.hostname !== 'space.bilibili.com' || url.username || url.password || url.port) {
    throw new Error('需要 space.bilibili.com 开头的个人空间链接。');
  }
  const match = url.pathname.match(/^\/([1-9]\d{0,19})(?:\/|$)/);
  if (!match) throw new Error('这个空间链接里没有有效的 UID。');
  return match[1];
}

export function validatePin(input) {
  const mid = parseMid(input?.mid);
  const name = String(input?.name ?? '').trim();
  const note = String(input?.note ?? '').trim();
  if (!name || name.length > 40) throw new Error('请填写 1–40 个字的 UP 主名称。');
  if (note.length > 80) throw new Error('备注最多 80 个字。');
  return {mid, name, note};
}

export function creatorURL(mid) {
  return `https://space.bilibili.com/${parseMid(mid)}/upload/video`;
}

export function searchURL(keyword, mid = '') {
  const query = String(keyword).trim();
  if (!query) throw new Error('先输入想看的内容。');
  if (mid) return `https://space.bilibili.com/${parseMid(mid)}/search?keyword=${encodeURIComponent(query)}`;
  return `https://search.bilibili.com/all?keyword=${encodeURIComponent(query)}`;
}

export function nameFromTitle(title) {
  return String(title ?? '').split(/的个人空间|个人主页/)[0].trim().slice(0, 40);
}
