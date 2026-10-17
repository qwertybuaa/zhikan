import {parseMid, nameFromTitle} from './core.js';
import {request, setStatus} from './client.js';
const $ = selector => document.querySelector(selector);
let mid;
let busy = false;
let enabled = true;
let savingSetting = false;

function renderSetting(state) {
  enabled = state.enabled !== false;
  $('#focus-enabled').checked = enabled;
  $('#setting-value').textContent = enabled ? '已开启' : '已关闭';
  $('#focus-enabled').disabled = savingSetting;
  $('#open-home').textContent = enabled ? '打开极简首页 ↗' : '打开 B 站 ↗';
}

$('#focus-enabled').addEventListener('change', async () => {
  if (savingSetting) return;
  const desired = $('#focus-enabled').checked;
  savingSetting = true;
  $('#focus-enabled').disabled = true;
  setStatus($('#setting-status'), '');
  try {
    const state = await request('settings:set', {enabled: desired});
    renderSetting(state);
    setStatus($('#setting-status'), '已保存，重新打开 B 站首页后生效。');
  } catch (error) {
    $('#focus-enabled').checked = enabled;
    setStatus($('#setting-status'), '保存失败，请重试。', true);
  } finally { savingSetting = false; $('#focus-enabled').disabled = false; }
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.focusState?.newValue) renderSetting(changes.focusState.newValue);
});

$('#open-home').addEventListener('click', async () => {
  await chrome.tabs.create({url: enabled ? chrome.runtime.getURL('home.html') : 'https://www.bilibili.com/'}); window.close();
});
$('#quick-pin-form').addEventListener('submit', async event => {
  event.preventDefault(); if (busy || !mid) return;
  busy = true; $('#quick-save').disabled = true;
  try {
    await request('pin:save', {pin: {mid, name: $('#quick-name').value, note: $('#quick-note').value}});
    setStatus($('#popup-status'), '已固定'); $('#quick-save').textContent = '保存修改';
  } catch (error) { setStatus($('#popup-status'), error.message, true); }
  finally { busy = false; $('#quick-save').disabled = false; }
});

async function init() {
  const state = await request('state:read');
  renderSetting(state);
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  try { mid = parseMid(tab?.url || ''); } catch { return; }
  const pin = state.pins.find(item => item.mid === mid);
  $('#popup-intro').hidden = true; $('#quick-pin-form').hidden = false;
  $('#quick-heading').textContent = pin ? '这位 UP 主已固定' : '固定这位 UP 主';
  $('#quick-uid').textContent = `UID ${mid}`;
  $('#quick-name').value = pin?.name || nameFromTitle(tab.title);
  $('#quick-note').value = pin?.note || '';
  if (pin) $('#quick-save').textContent = '保存修改';
}
init().catch(error => setStatus($('#popup-status'), error.message, true));
