import {creatorURL, searchURL, parseMid} from './core.js';
import {request, icon, setStatus} from './client.js';

const $ = selector => document.querySelector(selector);
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
chrome.storage.onChanged.addListener((changes, area) => { if (area === 'local' && changes.focusState?.newValue) render(changes.focusState.newValue); });
load();
