// ==UserScript==
// @name         只看
// @namespace    zhikan.qwertybuaa
// @version      1.2.0
// @description  将 B 站首页变成搜索框和固定的 UP 主，隐藏首页推荐流，支持全站或 UP 主内搜索及一键开关。
// @author       qwertybuaa
// @license      Copyright (c) 2026 qwertybuaa
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAFYklEQVR4AeybfWhVZRzHv+dAGFhSdoPI6p+FGIyCTAyjiJQgM0IlKRGjaVsURiEUNCMiFxRIkSRtmZVIhmERmUFo9EIysYJikEj7pzICl4UlJNGOv89z7t2ud/fcnbc7tns2nt+5z8vv5fv9nuc+9435ivkXPNi3POh67dWgs7ff7ITZ/2bBJDGwgKnfYTSsMWmpoQDBhl2zjOBmsxPygvcVeA9b4oVmJbOGsbY+kQ0sYFroMBpWMJtthkMjIATWXbc73qEzpwdtsduM5PYwpRqYu+HguERArysA28ju+BsWQxJ7mNKtBBfHqQ6NMQKYWu+4bVTHeUpP2dPXcashcY4ATiUvuK/Gp3WGxs1xrGI0IoCp09GSd76KrOuGO6HD9e3iBHAnpRe8YONiNOPqOBtbJ4CdlE9Yv2RWlFYqcx55H9BVFOZVPB1n3577y22ySHff6LpWgrsvf3iJGxbxYtx9O/nnF5G74xx48zkE29ygmJc2BJhdTO6O9WwEwNyoCJcajn6RyTstpgVwMhT4Mr0DJuTmX3C+tMBebVctkh6/U+q5V3rlAam3MzT6zLGGD77ETAC45u6ABVdLG+6QtqyV1i+WFrdL8+ZIpVnSjPNG6dFnjjV88CWGWHKMeubea44Ai+ZKz64y0rdJ7VemB03sestBLnKmzxQZma8Ac+w91WNLpftvlS67KLJo4gVykZPc1EicIDogPwFumic9vVK65oroallXyE0NamXNVY7PR4C7b5DW3iJ5npr+Rw1qUTOHYtkF4NReen18KH/8LR37Lb5/lCc1qR21HnM+mwAr7UciTu2YxZzbln32qmD29ucSYrjJlBdqgyFlOGHpBVhyrXT7deRIZhXSh46FQuz7Nll8rTcYwFI7H3OcToD2q6R7boxZooEbYnxkAjy1O9vTAixgalAqaim5ALxDW3NzVL508wjx1hdSlt0AJrAlRJBcAA6ei2cmLBPDHREquyGG+xgXMIGtZmG8YXIBxsuYxzpi5JEnRo7kAuw5JP15OkbqFC532fezz9tPk5dcmDwYTGBLGJlcgH/+lXZ9lbDMOO4Q3rhMWmYCjOMauQwmsEU61F9ILgB5Bn6W3uunl80gXrnrcy9PnwssYEqRIZ0AFDrwg/Tp9/SSGaSJ4NMd2z3LXScPGMBCP4WlF4Biew9LBwfoxTe2OsT5dBc/qr4ntcFQfzXWbDYBKMHBs/87evGMHYDF8472oia1oz1irWQXgDIffiPt/FIKAkbNNWpQi5o5VMpHAIB8fVR6bq/046+MmmPkpga1cqqQnwAAOn5Senm/xCe93/9iJh8jFznJTY18sros+QrgUtqFT3rP7JG2fyYN/GITKRux5CAXOVOmaRTWHAEqFY/8JG39RNq408Q4GL5iHD0uDZ2SzvxX8Qr7zLHGyb7dfIkhlhyjnrn3mitABS7v0I4MSpzaL30sdb8rPfqm1NUXGn3mWMMHX2Iq8U18nBgBmkgga+ppAbIqONnik+KZ3gGm2LBZUdswO8DevRSVv04igL0+FVaAQV9eYN9LF1QA4+5r2D9QUPqCu++93vmBCTBkVrQ2BHe/zLq3/FikB8c5FGDGzBeNeZF2wZBCzuH/C3hb15xS4D1pIhSjGVfH2diGO8A69nzYYa8I26zb2s0LtjmuZZYjAjD2eh96xHaC/VTLqAUt8HY7jlXUzhGAeVNndUvuhPDOr4ZjtY0RgEWnUuCts34rHIxDtqvXOU5GqLbVFQAn2wk77KRss36P2VQUAsw9cHBcjES9FikAzpyUXl/XJrNLTcUV5aeG/Rwkkk+KT5HgNAMLmA47jIG3Asxmm+Bg65HtLAAAAP//UCTImAAAAAZJREFUAwCnlvlCwuz02AAAAABJRU5ErkJggg==
// @homepageURL  https://github.com/qwertybuaa/zhikan
// @supportURL   https://github.com/qwertybuaa/zhikan/issues
// @match        *://www.bilibili.com/*
// @match        *://bilibili.com/*
// @match        https://space.bilibili.com/*
// @run-at       document-start
// @noframes
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addValueChangeListener
// ==/UserScript==

// UI and logic are bundled from the 只看 extension without minification.
// Bilibili wordmark: https://search.bilibili.com/ (svg.search-logo), 2026-10-17.
// The Bilibili name and logo belong to their owner. This is an independent project.

(function () {
'use strict';

const DEFAULT_PINS = [];
const MAX_PINS = 100;

function parseMid(value) {
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

function validatePin(input) {
  const mid = parseMid(input?.mid);
  const name = String(input?.name ?? '').trim();
  const note = String(input?.note ?? '').trim();
  if (!name || name.length > 40) throw new Error('请填写 1–40 个字的 UP 主名称。');
  if (note.length > 80) throw new Error('备注最多 80 个字。');
  return {mid, name, note};
}

function creatorURL(mid) {
  return `https://space.bilibili.com/${parseMid(mid)}/upload/video`;
}

function searchURL(keyword, mid = '') {
  const query = String(keyword).trim();
  if (!query) throw new Error('先输入想看的内容。');
  if (mid) return `https://space.bilibili.com/${parseMid(mid)}/search?keyword=${encodeURIComponent(query)}`;
  return `https://search.bilibili.com/all?keyword=${encodeURIComponent(query)}`;
}

function nameFromTitle(title) {
  return String(title ?? '').split(/的个人空间|个人主页/)[0].trim().slice(0, 40);
}

const icons = {
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  edit: '<path d="m15 5 4 4M4 20l4-1L20 7a2.8 2.8 0 0 0-4-4L4 15v5Z"/>',
  pin: '<path d="m16 3 5 5-4 2-2 5-2 2-6-6 2-2 5-2 2-4ZM9 15l-6 6"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>',
};

function icon(name) {
  // Every path comes from the fixed table above; user data is always textContent.
  const span = document.createElement('span');
  span.className = 'icon';
  span.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
  return span;
}

function setStatus(element, text, error = false) {
  element.textContent = text;
  element.classList.toggle('is-error', error);
}

const STYLES = `:host {
  color-scheme: light;
  --paper: #fffafb;
  --surface: #fff;
  --ink: #30282e;
  --body: #40373d;
  --muted: #74636c;
  --line: #eee4e9;
  --accent: #ff6699;
  --accent-light: #fff0f5;
  --accent-text: #b82d5d;
  --accent-ink: #58172e;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", "PingFang SC", sans-serif;
  font-size: 14px;
  background: var(--paper);
  color: var(--body);
  -webkit-font-smoothing: antialiased;
}
* { box-sizing: border-box; }
body { margin: 0; }
button, input, select { font: inherit; }
button, a, input, select { -webkit-tap-highlight-color: transparent; }
button, select { cursor: pointer; }
button { color: inherit; }
button:disabled { cursor: default; opacity: .45; }
a { color: inherit; text-decoration: none; }
button, a, input, select { outline-offset: 4px; }
:focus-visible { outline: 2px solid var(--accent); }
[hidden] { display: none !important; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0; }
.home-page { min-height: 100vh; display: flex; flex-direction: column; }
.site-header { display: flex; justify-content: space-between; align-items: center; gap: 24px; padding: 32px 44px; }
.brand { display: inline-flex; align-items: center; gap: 12px; color: var(--ink); font-size: 19px; font-weight: 650; letter-spacing: 1px; }
.brand img { border-radius: 9px; }
.brand-divider { margin: 0 13px; color: #d9cbd1; font-weight: 300; }
.brand-detail { color: var(--muted); font-size: 12px; letter-spacing: 1px; font-weight: 400; }
.focus-status { display: inline-flex; align-items: center; gap: 8px; font-size: 11px; color: var(--muted); letter-spacing: 1px; }
.focus-status > span { width: 5px; height: 5px; background: #ff6699; border-radius: 50%; }
.main { width: min(650px, calc(100% - 48px)); margin: clamp(80px, 20vh, 220px) auto 40px; }
.bilibili-logo { display: block; width: 140px; height: 64px; margin: 0 auto; }
.eyebrow { margin: 0 0 20px; color: var(--muted); font-size: 12px; letter-spacing: 2px; }
h1 { margin: 0; font-weight: 500; color: var(--ink); font-size: clamp(30px, 4vw, 40px); line-height: 1.4; letter-spacing: 2px; }
.search-form { display: flex; align-items: center; gap: 14px; background: var(--surface); border: 1px solid #eadce3; border-radius: 14px; margin-top: 32px; padding: 9px 10px 9px 17px; box-shadow: 0 3px 8px #6b183403; transition: border-color .16s, box-shadow .16s; }
.search-form:focus-within { border-color: #ef94b2; box-shadow: 0 0 0 3px #ff669907; }
.search-form select { appearance: auto; width: auto; max-width: 150px; padding: 7px 1px; background: transparent; border: 0; color: #74636c; font-size: 12px; }
.search-divider { height: 20px; width: 1px; background: var(--line); flex-shrink: 0; }
.search-form input { min-width: 0; flex: 1; padding: 10px 0; border: 0; border-radius: 0; background: none; color: var(--ink); font-size: 15px; box-shadow: none; outline: none; }
input::placeholder { color: #74636c; opacity: 1; }
.search-submit { flex: 0 0 42px; height: 42px; border: 0; border-radius: 10px; background: var(--accent); color: var(--accent-ink); display: grid; place-items: center; }
.search-submit:hover { background: #f45287; }
svg { display: block; width: 21px; height: 21px; }
.icon { display: inline-flex; flex-shrink: 0; }
.search-hint { display: flex; justify-content: space-between; gap: 12px; margin-top: 14px; color: var(--muted); font-size: 11px; letter-spacing: .4px; }
.keyboard-hint { display: inline-flex; align-items: center; gap: 6px; }
kbd { font: 10px inherit; border: 1px solid #eadce3; padding: 2px 5px; border-radius: 4px; }
.pins-section { margin-top: 56px; }
.section-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 17px; }
h2 { margin: 0; color: var(--ink); font-size: 14px; font-weight: 500; }
.count { margin-left: 10px; font-size: 11px; color: var(--muted); font-family: ui-monospace, monospace; }
.section-actions { display: flex; align-items: center; gap: 12px; }
.text-button { border: 0; background: transparent; padding: 6px 2px; color: var(--muted); font-size: 12px; }
.text-button:hover { color: var(--accent-text); }
.action-divider { height: 11px; width: 1px; background: #eadce3; }
.add-button { color: var(--accent-text); }
.add-button > span { margin-right: 2px; font-size: 15px; }
.pin-list { display: grid; gap: 10px; }
.pin-row { display: flex; align-items: stretch; background: #ffffffa6; border: 1px solid var(--line); border-radius: 12px; transition: border-color .16s, background .16s; }
.pin-row:hover { border-color: #f0afc6; background: #fff; }
.pin-link { display: flex; align-items: center; gap: 16px; padding: 19px 22px; flex: 1; min-width: 0; border-radius: 12px; }
.avatar { width: 46px; height: 46px; flex: 0 0 46px; display: grid; place-items: center; border-radius: 50%; background: #ffe8f0; color: #b82d5d; font-size: 21px; font-family: "Songti SC", "SimSun", serif; }
.pin-info { min-width: 0; flex: 1; display: grid; gap: 6px; }
.pin-name { color: var(--ink); font-size: 14px; font-weight: 500; overflow-wrap: anywhere; }
.pin-note { color: var(--muted); font-size: 11px; line-height: 1.6; overflow-wrap: anywhere; }
.pin-destination { color: #a87b8d; }
.pin-destination svg { width: 18px; }
.pin-actions { display: flex; align-items: center; gap: 3px; padding-right: 12px; }
.icon-button { display: inline-grid; place-items: center; width: 34px; height: 34px; padding: 0; border: 0; border-radius: 7px; background: none; color: #826776; }
.icon-button:hover { background: var(--accent-light); color: var(--accent-text); }
.icon-button svg { width: 18px; height: 18px; }
.pins-hint { margin: 14px 0 0; font-size: 11px; line-height: 1.8; color: var(--muted); }
.empty-state { margin: 0; padding: 28px 20px; text-align: center; border: 1px dashed #ead2dc; border-radius: 12px; color: var(--muted); line-height: 1.8; font-size: 13px; }
.status { min-height: 18px; color: var(--accent-text); font-size: 12px; line-height: 1.7; margin-top: 20px; overflow-wrap: anywhere; }
.is-error, .form-error { color: #b12f45; }
.undo-button { padding-top: 0; }
.site-footer { display: flex; align-items: center; flex-direction: column; padding: 36px 24px 27px; gap: 11px; }
.footer-line { width: 24px; height: 1px; background: #dfcbd4; }
.site-footer p { margin: 0; font-size: 11px; letter-spacing: 2px; color: var(--muted); }
dialog { width: min(460px, calc(100% - 32px)); max-height: calc(100vh - 48px); overflow-y: auto; border: 1px solid #eadce3; border-radius: 18px; padding: 28px; color: var(--body); background: var(--paper); box-shadow: 0 20px 90px #6b18342b; }
dialog::backdrop { background: #4d26363f; backdrop-filter: blur(4px); }
.dialog-header { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.dialog-header h2 { font-size: 20px; letter-spacing: .5px; }
.dialog-description { font-size: 12px; color: var(--muted); margin: 6px 0 24px; line-height: 1.8; }
label { display: block; font-size: 12px; margin: 19px 0 9px; }
input { display: block; width: 100%; background: var(--surface); border: 1px solid #eadce3; border-radius: 8px; padding: 12px; color: var(--ink); font-size: 13px; }
input[readonly] { color: var(--muted); background: #faf1f5; }
.optional { margin-left: 5px; color: var(--muted); font-size: 11px; }
.field-hint { color: var(--muted); font-size: 11px; margin: 8px 0 0; }
.form-error { min-height: 18px; font-size: 12px; margin: 14px 0; }
.dialog-actions { display: flex; justify-content: flex-end; gap: 10px; }
.primary-button, .secondary-button { border: 1px solid var(--accent); padding: 11px 19px; border-radius: 8px; background: var(--accent); color: var(--accent-ink); font-size: 13px; }
.primary-button:hover { background: #f45287; }
.secondary-button { border-color: #e8cdd8; color: #9d385b; background: transparent; }
.secondary-button:hover { background: #fff0f5; }
.popup-page { width: 350px; padding: 23px; }
.popup-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
.popup-logo { display: block; width: 96px; height: 44px; }
.setting-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin: 0; padding: 0 0 19px; border-bottom: 1px solid var(--line); font-size: 14px; cursor: pointer; }
.setting-control { display: flex; align-items: center; gap: 10px; }
.setting-value { font-size: 11px; color: var(--muted); }
.switch { appearance: none; flex: 0 0 40px; width: 40px; height: 24px; padding: 2px; margin: 0; border: 1px solid #8f7d85; border-radius: 20px; background: #8f7d85; cursor: pointer; transition: background .16s, border-color .16s; }
.switch::before { content: ''; display: block; width: 18px; height: 18px; border-radius: 50%; background: #fff; transform: translateX(0); transition: transform .16s; box-shadow: 0 1px 3px #431a2820; }
.switch:checked { background: #ce3e70; border-color: #ce3e70; }
.switch:checked::before { transform: translateX(16px); }
.switch:disabled { opacity: .5; cursor: wait; }
.setting-status { margin: 10px 0 0; color: var(--muted); font-size: 11px; line-height: 1.7; }
.setting-status:empty { display: none; }
.setting-status.is-error { color: #b12f45; }
#quick-pin-form { margin-top: 22px; }
.popup-caption { font-size: 11px; color: var(--muted); }
.popup-page h1 { font-size: 20px; letter-spacing: 0; }
.popup-description { color: var(--muted); font-size: 12px; line-height: 1.9; }
.popup-page .status:empty { display: none; }
.full-width { width: 100%; }
#quick-save { margin-top: 22px; }
.popup-footer { color: var(--muted); font-size: 11px; text-align: center; margin: 22px 0 0; }
@media (max-width: 600px) {
  .site-header { padding: 24px; }
  .focus-status { display: none; }
  .main { margin-top: 15vh; }
  .brand-detail { font-size: 11px; }
  h1 { font-size: 29px; letter-spacing: 1px; }
  .eyebrow { font-size: 11px; letter-spacing: 1px; }
  .search-form { gap: 9px; padding-left: 12px; }
  .search-form select { max-width: 94px; }
  .search-form input { font-size: 13px; }
  .search-hint { font-size: 10px; }
  .keyboard-hint { display: none; }
  .pins-section { margin-top: 42px; }
  .section-actions { gap: 8px; }
  h2 { font-size: 13px; }
  .count { margin-left: 6px; }
  .pin-link { padding: 16px 14px; gap: 12px; }
  .avatar { width: 40px; height: 40px; flex-basis: 40px; }
  .pin-actions { gap: 0; padding-right: 6px; }
  .pin-actions .icon-button { width: 29px; }
  .pin-row:has(.pin-actions) .pin-destination { display: none; }
  dialog { padding: 22px; }
}
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition: none !important; scroll-behavior: auto !important; } }

.home-page { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", "PingFang SC", sans-serif; font-size: 14px; color: var(--body); background: var(--paper); visibility: visible; line-height: normal; text-align: left; }
`;

const HOME_HTML = `
  <main class="main">
    <svg class="bilibili-logo" role="img" aria-label="哔哩哔哩" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2240 1024" fill="#ff6699"><path d="M2079.810048 913.566175c-10.01309 0-18.554608 0.799768-26.936172-0.159954-16.987063-1.951433-33.974126-1.567544-50.99318-2.079395-10.972811-0.287916-10.652904-0.287916-11.580634-10.90883-2.71921-32.406582-5.694345-64.781173-8.605499-97.155764-2.527266-28.439735-4.926568-56.91146-7.70976-85.319204-2.527266-26.040432-5.566382-52.016883-8.317583-78.025324-2.623238-24.440897-5.054531-48.913784-7.77374-73.322691a12681.114551 12681.114551 0 0 0-10.684895-92.133223c-3.295042-27.128116-6.558094-54.320213-10.205034-81.416339a20559.272961 20559.272961 0 0 0-17.530905-125.979387c-6.398141-44.723002-14.075909-89.22207-22.105576-133.657156-1.439582-7.965685-1.247637-8.253601 6.36615-9.533229 31.670796-5.406429 63.501545-10.01309 95.716183-9.309295 3.486987 0.095972 7.005964 0.159954 10.460959 0.607823 5.662354 0.703795 8.605499 3.454996 8.925406 10.045081 1.119675 22.969325 2.71921 45.938649 4.414717 68.875983 2.71921 37.589076 5.662354 75.178151 8.477537 112.735236 1.791479 24.184971 3.327033 48.305961 5.150503 72.426951 2.911154 38.772732 5.982261 77.513473 8.925406 116.286205 1.791479 23.705111 3.359024 47.474203 5.182494 71.179313 2.783191 34.805885 5.822308 69.579778 8.637489 104.353672 1.791479 22.137566 3.391014 44.307123 5.278466 66.44469 2.783191 32.79047 5.790317 65.580941 8.63749 98.371411 2.143377 25.592562 4.09481 51.249106 6.270178 77.673426zM853.670395 114.918282c4.638652 0 11.644616-0.511851 18.554607 0.127963 8.797443 0.799768 10.49295 3.071107 11.036793 11.900541 2.527266 40.372267 4.894578 80.776524 7.581796 121.180782 2.943145 43.571337 6.174206 87.078693 9.405267 130.586048 2.975135 39.956388 5.950271 79.912775 9.149341 119.869163 3.486987 43.891244 7.357862 87.718507 10.876839 131.609751 2.655228 33.622229 4.926568 67.244457 7.677768 100.898677 2.623238 31.222926 5.694345 62.38187 8.509527 93.572805 2.399303 26.8402 4.830596 53.71239 7.165918 80.58458 0.735786 8.509527 0.127963 9.053369-9.053369 8.829434-24.025018-0.575833-47.922073-3.391014-71.947091-2.71921-5.502401 0.159954-7.101936-2.367312-8.029666-7.581796-1.983424-11.356699-1.663517-22.905343-2.879163-34.390006-3.295042-30.359177-5.182494-60.846317-7.965685-91.269474-2.495275-27.639967-5.502401-55.215953-8.349574-82.82393-2.527266-25.240664-5.02254-50.481329-7.709759-75.753984-2.687219-24.792795-5.534392-49.61758-8.349573-74.442365-2.591247-22.841362-5.118512-45.682723-7.869713-68.524085-4.062819-33.462275-8.093648-66.92455-12.508365-100.322844-4.062819-30.647093-8.66948-61.198214-12.988225-91.813317-5.886289-41.587914-12.508365-83.079855-19.834236-124.411842a1393.96288 1393.96288 0 0 0-5.310457-28.023856c-0.959721-4.702633-0.095972-7.421843 5.278466-8.157629 14.139891-1.887451 28.24779-4.830596 42.451663-6.206196 14.203872-1.311619 28.407744-3.966847 45.106891-2.71921z m1006.075609 403.33878c27.064134 0 27.703949 0.191944 32.054684 24.536869 5.342447 30.03927 9.08536 60.334465 12.636328 90.62966 3.742912 32.278619 7.517815 64.557238 10.972811 96.867848 2.783191 26.008441 5.118512 52.080864 7.74175 78.089305 2.7512 27.256079 5.662354 54.416185 8.509527 81.640274 1.567544 15.387528 3.039117 30.775056 4.798605 46.130593 0.511851 4.446708-0.831758 6.81402-5.214485 7.325871-9.245313 1.055693-18.426645 2.27134-27.639967 3.263052-16.891091 1.82347-33.814173 3.614949-50.737254 5.182493-8.733462 0.799768-9.309294 0.319907-10.940821-8.125638-14.843686-76.617733-29.719363-153.171485-44.435086-229.821208-9.789155-50.961189-19.322384-101.95437-28.919595-152.915559a805.525894 805.525894 0 0 1-3.582959-21.081873c-0.639814-4.030829 0.44787-6.622075 5.022541-7.70976 30.48714-7.133927 61.294186-12.636328 89.733921-14.011927z m-1137.077537 0c28.951586 0 28.823623 0.095972 33.302322 26.360339 6.909992 40.660183 11.804569 81.544301 16.187295 122.556382 4.286754 39.796434 8.957397 79.560878 13.148179 119.357311 2.847173 27.224088 5.086522 54.512157 7.74175 81.704255 1.887451 19.354375 4.126801 38.644769 6.174206 57.967153 0.255926 2.367312 0.383888 4.734624 0.543842 7.133927 0.415879 9.469248 0 10.237025-9.117351 11.164755-18.074747 1.887451-36.181485 3.454996-54.256232 5.246476-6.558094 0.639814-13.084197 1.599535-19.57831 2.239349-8.63749 0.799768-8.925406 0.767777-10.620913-7.965685-6.078234-30.679084-11.964523-61.422149-17.914793-92.101233-14.267853-73.898523-28.69566-147.733065-42.867542-221.631589-5.662354-29.559409-10.524941-59.246781-16.091323-88.838181-1.023702-5.406429-0.255926-7.933694 5.342447-9.245313 30.199223-7.037955 60.590391-12.540355 88.006423-13.947946z m382.128944 309.861946v124.027954c0 1.183656-0.127963 2.399303 0.03199 3.582959 0.607823 6.014252-1.599535 8.66948-7.805731 8.413555-8.157629-0.351898-16.251277-0.127963-24.408906 0.063981-17.019054 0.319907-34.070098-0.351898-51.057162 1.599535-9.405267 1.087684-9.213322 0.511851-10.141052-9.405266-2.783191-31.222926-5.822308-62.413861-8.669481-93.636787-2.623238-28.823623-4.99055-57.711228-7.677768-86.534851-2.71921-29.655381-5.758326-59.214791-8.509527-88.838181-1.887451-19.770254-3.550968-39.508518-5.214485-59.278772-2.175368-25.720525-4.190782-51.409059-6.462122-77.129585-0.959721-10.844848-0.159954-12.380402 10.588923-13.500076a531.877423 531.877423 0 0 1 83.527724-2.591247c6.941982 0.383888 13.851974 1.727498 20.570022 3.359024 8.477536 2.015414 9.405267 3.263052 9.853137 12.124476 0.92773 17.850812 1.855461 35.701624 2.335321 53.584427 0.543842 19.866226 0.095972 39.764443 0.831758 59.63067 1.855461 54.800074 1.567544 109.664129 2.207359 164.528184z m1134.806197 5.630364v117.437869c0 1.983424-0.063981 3.966847 0.03199 5.982262 0.415879 5.150503-1.983424 6.973973-6.878001 6.941982-12.028504-0.095972-24.025018 0-36.021531 0.159954-13.564058 0.127963-27.096125 0.063981-40.628192 1.535553-8.925406 1.023702-8.989387 0.351898-9.789155-8.509527-3.678931-40.660183-7.549806-81.320366-11.260728-122.04453-3.391014-37.525094-6.526103-75.082179-9.981099-112.639265-3.550968-38.740741-7.421843-77.38551-10.90883-116.09426-1.727498-19.386366-3.16708-38.772732-4.606661-58.159097-0.575833-8.445546 0.351898-9.949109 9.885127-10.716886 16.571184-1.311619 33.078387-3.550968 49.777534-3.263051 16.635165 0.319907 33.302322-0.607823 49.841515 2.559256 14.011928 2.687219 14.715723 3.486987 15.547481 18.458635 2.399303 44.051198 1.663517 88.230358 3.231061 132.281556 1.599535 46.89837 0.479861 93.79674 1.759489 146.069549zM1831.498213 305.135c9.789155 0.575833 17.498914 0.095972 25.176683 1.791479 4.894578 1.119675 7.357862 3.327033 7.837723 8.573509 2.303331 25.240664 4.798605 50.51332 7.32587 75.785975 2.015414 20.50604 4.158791 41.012081 6.238188 61.518121l0.191944 1.183656c1.663517 12.924244 1.279628 13.276142-11.292718 13.979937-11.196746 0.607823-22.361501 1.599535-33.558247 2.27134-7.357862 0.44787-9.693183 1.695507-10.90883-9.021378-4.190782-37.813011-9.053369-75.530049-13.692021-113.311069a1185.0316 1185.0316 0 0 0-4.286754-31.798759c-0.92773-5.982261 1.407591-9.277304 7.005964-9.757164 7.357862-0.671805 14.715723-0.863749 19.962198-1.215647z m-1133.398606 0.159954c7.549806 0.415879 15.323547-0.159954 22.937334 1.599535 4.350736 0.991712 6.558094 2.815182 6.973973 7.773741 0.92773 11.83656 2.7512 23.641129 3.870875 35.477689 3.550968 36.309448 6.909992 72.650886 10.237025 108.992324 0.703795 7.901704 0.543842 8.061657-6.84601 8.605499-13.116188 0.959721-26.264367 1.919442-39.412546 2.463284-7.645778 0.351898-8.605499-0.575833-9.56522-8.381564-3.327033-26.744227-6.462122-53.520446-9.661192-80.296664-2.591247-22.073585-4.766615-44.14717-7.901704-66.156773-0.863749-6.078234 1.119675-7.74175 5.982262-8.733462 7.709759-1.567544 15.451509-1.055693 23.385203-1.343609z m399.147998 100.002936c0 23.001315 0.063981 45.97064-0.031991 69.003946 0 10.332997-0.127963 10.396978-10.396978 10.269016a324.289753 324.289753 0 0 1-36.981252-1.919443c-7.933694-0.991712-8.093648-0.735786-8.317583-9.149341-0.799768-28.119828-1.631526-56.239655-2.207359-84.359483-0.415879-19.034468-0.639814-38.004955-1.791479-57.039422-0.607823-9.821146-0.063981-9.917118 9.373276-10.045081 13.915956-0.159954 27.799921 0.479861 41.619904 2.591247 8.317583 1.279628 8.701471 1.279628 8.733462 10.49295 0.063981 23.385204 0.063981 46.770407 0.063981 70.187602h-0.063981z m1135.38203 0.607824c0 23.033306 0.063981 46.034621-0.031991 69.035936 0 9.661192-0.159954 9.725174-9.853137 9.661192a505.32514 505.32514 0 0 1-38.132917-1.791479c-6.302168-0.479861-8.157629-3.135089-7.74175-8.861425 0.063981-0.799768 0-1.599535 0-2.399302-0.959721-44.403095-1.919442-88.7742-2.815182-133.177296-0.031991-2.367312-0.159954-4.734624-0.063982-7.133926 0.127963-8.957397 0.159954-9.181332 9.149341-9.117351 12.380402 0.063981 24.664832 0.703795 37.013243 1.919442 15.067621 1.503563 12.412393 3.359024 12.476375 15.259566 0.063981 22.169557 0.031991 44.403095 0 66.604643z m-1565.593 54.000306c0.287916 12.636328 0.287916 12.604337-11.804569 15.547481-8.221611 2.015414-16.443221 4.222773-24.728813 6.046243-7.069945 1.599535-8.317583 0.703795-9.53323-6.238187-8.445546-47.090314-16.8591-94.212619-25.240664-141.334924-1.695507-9.757164-1.247637-10.364988 8.349573-12.060495 11.804569-2.079396 23.577148-4.126801 35.381717-5.950271 7.517815-1.183656 8.477536-0.767777 9.9811 7.517815 2.975135 16.731138 5.790317 33.526256 7.997675 50.385357 3.423005 26.680246 6.238187 53.456464 9.309295 80.168701 0.255926 1.951433 0.191944 3.966847 0.287916 5.91828z m1064.138735-136.696273c15.451509-2.527266 31.030982-5.086522 46.610454-7.549806 5.598373-0.863749 7.29388 2.655228 8.029666 7.645778 2.655228 18.426645 5.982261 36.725327 8.157629 55.183962 3.19907 26.744227 7.581797 53.360492 8.413555 80.328655 0.063981 2.7512 0.031991 5.566382 0.095972 8.317583 0.159954 4.286754-1.983424 6.494113-5.950271 7.421843-10.556932 2.367312-21.113864 4.734624-31.638805 7.261889-5.054531 1.215647-6.750038-0.92773-7.581796-5.854298-3.16708-18.746552-6.81402-37.397131-10.045081-56.079702-5.47041-30.775056-10.780867-61.582103-16.091323-92.38915-0.127963-1.119675 0-2.303331 0-4.286754z m-710.64147 108.032603c-0.44787 16.37924 0.543842 30.647093-1.695507 44.914947-0.671805 4.510689-1.983424 7.421843-6.846011 7.837722-10.428969 0.863749-20.825947 1.695507-31.190935 2.7512-5.02254 0.543842-6.430131-1.631526-7.261889-6.558094-2.335321-14.55577-1.919442-29.303484-3.327033-43.923234-2.655228-27.607976-3.774903-55.407897-5.566383-83.111846-0.44787-6.750038-1.119675-13.436095-1.663516-20.186134-0.287916-3.774903 1.215647-5.886289 5.246475-6.046242 13.500077-0.543842 26.936172-3.007126 40.50023-2.527266 7.933694 0.287916 8.605499 0.799768 9.181331 8.797443 0.351898 5.534392 0.255926 11.132765 0.383889 16.699147l2.239349 81.352357z m1134.902169-15.867388c0 19.066459 0.223935 38.132918-0.031991 57.199376-0.159954 9.917118-1.279628 10.780867-10.652904 11.644616-9.277304 0.863749-18.490626 1.567544-27.735939 2.559256-5.214485 0.543842-7.645778-0.991712-7.965685-6.973973-1.34361-25.336637-3.16708-50.673273-4.926568-75.977919-1.3756-20.985901-2.943145-41.939811-4.414717-62.893722-0.159954-2.399303-0.031991-4.798605-0.191944-7.165917-0.223935-4.190782 1.055693-6.654066 5.758326-6.81402 13.116188-0.44787 26.136404-2.975135 39.348564-2.495274 8.061657 0.287916 8.18962 0.415879 8.797444 8.797443 1.951433 27.32006 2.143377 54.704102 2.015414 82.120134zM628.295894 756.171918c16.571184 18.234701 17.402942 39.828425 11.932532 62.413861-5.502401 22.585436-18.042756 41.204025-33.23834 57.903171-25.49659 27.895893-56.303637 48.497905-89.062116 65.99682-56.399609 30.135242-116.190232 50.161422-178.572103 61.997982-44.882956 8.477536-90.053828 15.00364-135.704561 17.498914-13.915956 0.767777-27.799921 1.407591-41.715876 1.311619-10.077071 0-20.186133 0.287916-30.231214-0.063981-8.541518-0.319907-9.789155-1.791479-10.49295-10.716886-2.591247-32.022693-4.798605-64.077378-7.645778-96.100071-3.327033-37.109215-7.229899-74.18644-10.812858-111.295654-2.623238-26.8402-4.894578-53.744381-7.773741-80.520599-3.327033-31.542833-7.069945-63.021684-10.716885-94.564517-3.327033-29.111539-6.526103-58.28706-10.045081-87.430591-3.934856-32.278619-7.997676-64.493257-12.31642-96.707894a8228.968456 8228.968456 0 0 0-13.212161-92.996973 5984.500754 5984.500754 0 0 0-24.312934-152.627642 3243.825263 3243.825263 0 0 0-23.67312-123.740038c-1.151665-5.502401 0.511851-7.709759 5.342448-9.725174C52.335283 47.609843 98.465876 28.063524 144.724432 8.77313c8.605499-3.582959 17.434933-6.590085 26.584274-8.285592 6.334159-1.183656 7.965685 0.127963 7.773741 6.494113-0.479861 16.283268 0.191944 32.630517-1.407591 48.849803a161.393095 161.393095 0 0 0-0.639814 13.084197c-0.735786 58.383032-1.439582 116.798056 0.095972 175.213079 1.34361 51.185124 4.030829 102.338258 7.005964 153.491392 2.335321 40.372267 5.694345 80.744534 9.149341 121.052819 3.391014 39.508518 7.517815 78.953054 11.38869 118.461572 0.735786 7.517815 1.407591 8.221611 9.949108 7.069945a381.329176 381.329176 0 0 1 50.833227-4.190782c52.880632-0.127963 104.897514 7.133927 156.338564 19.322384 45.010919 10.684895 88.806191 24.920757 130.777993 44.818975 20.793957 9.853136 40.692174 21.241827 58.830902 35.701624 6.174206 4.862587 11.676606 10.46096 16.891091 16.315259z m1126.840512-9.597211c20.47405 17.946784 27.927883 39.924397 22.105576 67.116494-4.830596 22.425483-15.771416 41.268006-30.359177 58.127107-23.417194 27.096125-51.856929 47.698138-82.631985 64.909136-60.334465 33.782182-124.603787 55.727804-192.168151 68.396122a1151.089465 1151.089465 0 0 1-111.455609 15.547481c-21.177845 1.82347-42.451662 4.09481-66.220754 2.623238h-27.76793c-5.406429 0-8.477536-1.695507-8.925406-8.125638-2.047405-28.087837-4.414717-56.143683-6.941983-84.19953-2.687219-29.623391-5.662354-59.246781-8.477536-88.870172-2.559256-27.224088-4.926568-54.512157-7.709759-81.736245-2.559256-25.656544-5.502401-51.249106-8.285592-76.873659-2.591247-24.057008-5.086522-48.114017-7.933695-72.139035-3.423005-29.111539-7.037955-58.223079-10.652904-87.334618-3.391014-27.160107-6.750038-54.288222-10.364987-81.416338a6133.577429 6133.577429 0 0 0-12.156467-87.142675c-5.694345-37.653057-11.804569-75.178151-17.818822-112.767227a3259.14881 3259.14881 0 0 0-29.111539-158.993792c-0.44787-2.335321-0.671805-4.734624-1.3756-7.005964-1.663517-5.118512-0.063981-7.837722 4.958559-9.821146C1191.012355 47.641834 1238.61452 24.448575 1288.2321 6.149893c6.494113-2.431293 13.052207-5.150503 20.058171-5.854299 6.302168-0.639814 7.901704 0.383888 7.29388 7.101936-3.327033 36.43741-1.407591 73.066765-3.135089 109.536166-1.407591 29.751354-1.247637 59.598679 0.255926 89.382023 0.351898 7.549806 0.639814 15.131602 0.575832 22.649418-0.383888 35.765606 1.503563 71.499221 3.327033 107.200845 2.335321 47.186286 5.758326 94.276601 9.245313 141.398906 2.527266 34.006117 5.822308 67.948253 9.021379 101.922379 1.695507 18.586598 3.518977 37.141206 5.822308 55.631832 1.247637 10.205034 1.759489 10.301006 11.772578 8.957396 17.658868-2.399303 35.349726-4.350736 53.200539-4.09481 62.637796 0.799768 124.027954 10.684895 184.266447 27.863902 40.788146 11.580634 80.488608 26.040432 117.981712 46.290547a253.55831 253.55831 0 0 1 47.218277 32.438573zM308.676783 922.811488c23.161269-11.068783 135.608589-98.947243 144.533995-113.279078-54.576139-23.513166-109.344222-45.362816-168.239105-63.24562l23.70511 176.524698z m1277.196815-107.520752c2.879163-3.103098 2.559256-5.502401-1.343609-7.229899-7.773741-3.550968-15.4835-7.325871-23.353213-10.556932-42.003793-17.179007-84.19953-33.814173-127.482951-47.37823-3.774903-1.151665-7.645778-3.774903-12.476374-1.535554l23.321222 173.45359c3.454996 0.767777 4.798605-0.831758 6.33416-1.919442 39.316574-28.855614 78.889073-57.35933 116.638102-88.390312 6.36615-5.182494 12.668318-10.396978 18.362663-16.443221z"></path></svg>
    <section class="search-section" aria-labelledby="heading">
      <h1 id="heading" class="sr-only">搜索 B 站</h1>
      <form id="search-form" class="search-form" role="search">
        <label class="sr-only" for="search-scope">搜索范围</label>
        <select id="search-scope" title="搜索范围"><option value="">全站</option></select>
        <span class="search-divider" aria-hidden="true"></span>
        <label class="sr-only" for="search-input">搜索 B 站</label>
        <input id="search-input" type="search" placeholder="搜索 B 站" autocomplete="off" maxlength="200" required autofocus>
        <button class="search-submit" type="submit" aria-label="搜索"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></button>
      </form>
    </section>

    <section class="pins-section" aria-labelledby="pins-heading">
      <div class="section-heading">
        <h2 id="pins-heading">固定的 UP 主</h2>
        <div class="section-actions"><button id="manage-button" type="button" class="text-button" aria-pressed="false" disabled>管理</button><span class="action-divider" aria-hidden="true"></span><button id="add-button" type="button" class="text-button add-button" disabled><span aria-hidden="true">＋</span> 添加 UP 主</button></div>
      </div>
      <div id="pin-list" class="pin-list" aria-busy="true"><p class="empty-state">加载中…</p></div>
    </section>
    <div id="status" class="status" role="status" aria-live="polite"></div>
    <button id="undo-button" class="text-button undo-button" type="button" hidden>撤销移除</button>
    <button id="retry-button" class="text-button" type="button" hidden>重新读取</button>
  </main>

  <dialog id="pin-dialog" aria-labelledby="dialog-title">
    <form id="pin-form">
      <div class="dialog-header"><h2 id="dialog-title">固定一位 UP 主</h2><button id="close-dialog" class="icon-button" type="button" aria-label="关闭"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg></button></div>
      <label for="pin-url">空间链接或 UID</label>
      <input id="pin-url" placeholder="https://space.bilibili.com/206214" required autocomplete="off" spellcheck="false">
      <label for="pin-name">UP 主名称</label>
      <input id="pin-name" placeholder="例如：灵茶山艾府" required maxlength="40" autocomplete="off">
      <label for="pin-note">备注 <span class="optional">选填</span></label>
      <input id="pin-note" placeholder="例如：算法 · 力扣" maxlength="80" autocomplete="off">
      <p id="form-error" class="form-error" role="alert"></p>
      <div class="dialog-actions"><button id="cancel-dialog" class="secondary-button" type="button">取消</button><button id="save-pin" class="primary-button" type="submit">固定到首页</button></div>
    </form>
  </dialog>
`;

function startHome(shadow) {

const $ = selector => shadow.querySelector(selector);
let pins = [];
let managing = false;
let removedPin = null;
let saving = false;
const status = $('#status');
const dialog = $('#pin-dialog');

function button(label, iconName, action) {
  const node = document.createElement('button');
  node.type = 'button'; node.className = 'icon-button';
  node.title = label; node.setAttribute('aria-label', label);
  node.append(icon(iconName)); node.addEventListener('click', action);
  return node;
}

function render(state) {
  pins = state.pins;
  if (!pins.length) {
    managing = false;
    $('#manage-button').textContent = '管理';
    $('#manage-button').setAttribute('aria-pressed', 'false');
  }
  const list = $('#pin-list');
  list.replaceChildren();
  list.setAttribute('aria-busy', 'false');
  $('#manage-button').disabled = !pins.length;
  $('#add-button').disabled = false;
  $('#retry-button').hidden = true;
  if (!pins.length) {
    const empty = document.createElement('p'); empty.className = 'empty-state';
    empty.textContent = '暂无固定的 UP 主'; list.append(empty);
  }
  for (const pin of pins) {
    const row = document.createElement('div'); row.className = 'pin-row';
    const link = document.createElement('a'); link.className = 'pin-link'; link.href = creatorURL(pin.mid);
    link.setAttribute('aria-label', `查看${pin.name}的投稿`);
    const avatar = document.createElement('span'); avatar.className = 'avatar'; avatar.textContent = [...pin.name][0]; avatar.setAttribute('aria-hidden', 'true');
    const info = document.createElement('span'); info.className = 'pin-info';
    const name = document.createElement('span'); name.className = 'pin-name'; name.textContent = pin.name;
    info.append(name);
    if (pin.note) {
      const note = document.createElement('span'); note.className = 'pin-note'; note.textContent = pin.note;
      info.append(note);
    }
    const destination = document.createElement('span'); destination.className = 'pin-destination'; destination.append(icon('arrow'));
    link.append(avatar, info, destination); row.append(link);
    if (managing) {
      const actions = document.createElement('div'); actions.className = 'pin-actions';
      actions.append(button(`编辑${pin.name}`, 'edit', () => openDialog(pin)), button(`移除${pin.name}`, 'close', () => removePin(pin)));
      row.append(actions);
    }
    list.append(row);
  }
  const scope = $('#search-scope'); const previous = scope.value;
  scope.replaceChildren(new Option('全站', ''), ...pins.map(pin => new Option(pin.name, pin.mid)));
  scope.value = pins.some(pin => pin.mid === previous) ? previous : '';
}

async function load() {
  try { render(await request('state:read')); setStatus(status, ''); }
  catch { setStatus(status, '固定列表暂时无法读取，请重试。', true); $('#retry-button').hidden = false; $('#pin-list').setAttribute('aria-busy', 'false'); $('#pin-list').replaceChildren(); }
}

function openDialog(pin) {
  $('#pin-form').reset(); $('#form-error').textContent = '';
  $('#dialog-title').textContent = pin ? '编辑 UP 主' : '固定一位 UP 主';
  $('#save-pin').textContent = pin ? '保存修改' : '固定到首页';
  $('#pin-url').value = pin ? `https://space.bilibili.com/${pin.mid}` : '';
  $('#pin-url').readOnly = Boolean(pin);
  $('#pin-name').value = pin?.name || ''; $('#pin-note').value = pin?.note || '';
  dialog.showModal(); (pin ? $('#pin-name') : $('#pin-url')).focus();
}

async function removePin(pin) {
  try {
    render(await request('pin:delete', {mid: pin.mid}));
    removedPin = pin; $('#undo-button').hidden = false;
    setStatus(status, `已移除「${pin.name}」。`);
  } catch (error) { setStatus(status, error.message, true); }
}

$('#search-form').addEventListener('submit', event => {
  event.preventDefault();
  try { location.assign(searchURL($('#search-input').value, $('#search-scope').value)); }
  catch (error) { setStatus(status, error.message, true); $('#search-input').focus(); }
});
$('#search-scope').addEventListener('change', () => { $('#search-input').focus(); });
$('#add-button').addEventListener('click', () => openDialog());
$('#manage-button').addEventListener('click', () => {
  managing = !managing;
  $('#manage-button').textContent = managing ? '完成' : '管理';
  $('#manage-button').setAttribute('aria-pressed', String(managing)); render({pins});
});
for (const id of ['#close-dialog', '#cancel-dialog']) $(id).addEventListener('click', () => { if (!saving) dialog.close(); });
dialog.addEventListener('cancel', event => { if (saving) event.preventDefault(); });
$('#pin-url').addEventListener('change', () => {
  if ($('#pin-url').readOnly) return;
  try {
    const existing = pins.find(pin => pin.mid === parseMid($('#pin-url').value));
    if (existing) { $('#pin-name').value = existing.name; $('#pin-note').value = existing.note; }
  } catch { /* Validate on submit, without interrupting typing. */ }
});
$('#pin-form').addEventListener('submit', async event => {
  event.preventDefault(); if (saving) return;
  saving = true; $('#save-pin').disabled = true; $('#form-error').textContent = '';
  try {
    const state = await request('pin:save', {pin: {mid: $('#pin-url').value, name: $('#pin-name').value, note: $('#pin-note').value}});
    render(state); dialog.close(); setStatus(status, '已保存');
  } catch (error) { $('#form-error').textContent = error.message; }
  finally { saving = false; $('#save-pin').disabled = false; }
});
$('#undo-button').addEventListener('click', async () => {
  if (!removedPin) return;
  $('#undo-button').disabled = true;
  try { render(await request('pin:save', {pin: removedPin})); removedPin = null; $('#undo-button').hidden = true; setStatus(status, '已恢复固定。'); }
  catch (error) { setStatus(status, error.message, true); }
  finally { $('#undo-button').disabled = false; }
});
$('#retry-button').addEventListener('click', load);
onPinsChanged = render;
load();

}

// Storage is provided by the userscript manager, separate from Bilibili's storage.
const PINS_KEY = 'zhikan.pins.v1';
const ENABLED_KEY = 'zhikan.enabled.v1';
let onPinsChanged = () => {};

function readState() {
  const stored = GM_getValue(PINS_KEY, DEFAULT_PINS);
  if (!Array.isArray(stored) || stored.length > MAX_PINS) throw new Error('固定列表无法读取。');
  return {pins: stored.map(validatePin), enabled: GM_getValue(ENABLED_KEY, true) !== false};
}

async function request(type, payload = {}) {
  const state = readState();
  if (type === 'pin:save') {
    const pin = validatePin(payload.pin);
    const index = state.pins.findIndex(item => item.mid === pin.mid);
    if (index < 0) {
      if (state.pins.length >= MAX_PINS) throw new Error('最多固定 100 位 UP 主，请先移除一位。');
      state.pins.push(pin);
    } else state.pins[index] = pin;
    GM_setValue(PINS_KEY, state.pins);
  } else if (type === 'pin:delete') {
    const mid = parseMid(payload.mid);
    state.pins = state.pins.filter(pin => pin.mid !== mid);
    GM_setValue(PINS_KEY, state.pins);
  } else if (type !== 'state:read') throw new Error('未知操作。');
  return state;
}

function isHome() {
  return ['www.bilibili.com', 'bilibili.com'].includes(location.hostname)
    && /^\/(?:index\.html?)?$/.test(location.pathname);
}

let toggleMenu;
function updateMenu() {
  if (toggleMenu !== undefined) GM_unregisterMenuCommand(toggleMenu);
  const enabled = GM_getValue(ENABLED_KEY, true) !== false;
  toggleMenu = GM_registerMenuCommand(`极简 B 站：${enabled ? '已开启（点击关闭）' : '已关闭（点击开启）'}`, () => {
    GM_setValue(ENABLED_KEY, GM_getValue(ENABLED_KEY, true) === false);
  });
}

updateMenu();
GM_addValueChangeListener(ENABLED_KEY, () => {
  updateMenu();
  if (isHome()) location.reload();
});
GM_addValueChangeListener(PINS_KEY, () => {
  try { onPinsChanged(readState()); } catch (error) { console.error('[只看]', error); }
});

if (location.hostname === 'space.bilibili.com') {
  GM_registerMenuCommand('固定当前 UP 主', async () => {
    try {
      const mid = parseMid(location.href);
      const existing = readState().pins.find(pin => pin.mid === mid);
      const name = prompt('UP 主名称', existing?.name || nameFromTitle(document.title));
      if (name === null) return;
      const note = prompt('备注（选填）', existing?.note || '');
      if (note === null) return;
      await request('pin:save', {pin: {mid, name, note}});
      alert('已固定到极简首页');
    } catch (error) { alert(error.message); }
  });
}

if (isHome() && GM_getValue(ENABLED_KEY, true) !== false) {
  // The desktop Bilibili page fixes its viewport width. Use a responsive viewport
  // only on the replaced homepage; disabling the script reloads the original.
  function useResponsiveViewport() {
    if (!document.head) return;
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.append(viewport);
    }
    viewport.content = 'width=device-width, initial-scale=1';
  }
  useResponsiveViewport();
  document.addEventListener('DOMContentLoaded', useResponsiveViewport, {once: true});
  window.addEventListener('load', useResponsiveViewport, {once: true});
  // Hide the original homepage as soon as the document element is available.
  // The userscript does not intercept requests or stop Bilibili's own JavaScript.
  // A Shadow DOM keeps site styles out of the minimal interface.
  function mount() {
    if (!document.documentElement) return false;
    if (document.querySelector('#zhikan-root')) return true;
    const host = document.createElement('div');
    host.id = 'zhikan-root';
    host.setAttribute('style', 'all: initial; display: block !important; position: fixed !important; inset: 0 !important; z-index: 2147483647 !important; overflow: auto !important; background: #fffafb !important;');
    const shadow = host.attachShadow({mode: 'open'});
    const style = document.createElement('style');
    style.textContent = STYLES;
    const content = document.createElement('div');
    content.className = 'home-page';
    // HTML is a bundled static template; saved names and notes use textContent.
    content.innerHTML = HOME_HTML;
    shadow.append(style, content);
    const shield = document.createElement('style');
    shield.id = 'zhikan-shield';
    shield.textContent = 'html[data-zhikan-home] { overflow: hidden !important; background: #fffafb !important; } html[data-zhikan-home] > body { display: none !important; }';
    document.documentElement.append(shield, host);
    document.documentElement.setAttribute('data-zhikan-home', '');
    try {
      startHome(shadow);
      // Some site applications replace direct children while bootstrapping.
      const observer = new MutationObserver(() => {
        if (!shield.isConnected) document.documentElement.append(shield);
        if (!host.isConnected) document.documentElement.append(host);
      });
      observer.observe(document.documentElement, {childList: true});
    } catch (error) {
      document.documentElement.removeAttribute('data-zhikan-home');
      shield.remove(); host.remove();
      console.error('[只看] 无法打开极简首页', error);
    }
    return true;
  }
  if (!mount()) {
    const observer = new MutationObserver(() => { if (mount()) observer.disconnect(); });
    observer.observe(document, {childList: true, subtree: true});
  }
}

})();
