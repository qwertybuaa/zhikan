import {DEFAULT_PINS, MAX_PINS, validatePin, parseMid} from './core.js';

// Serialize reads and writes across all open home pages and the toolbar popup.
// This queue is short lived; the source of truth is persistent Chrome storage.
let queue = Promise.resolve();
const serial = task => {
  const result = queue.then(task);
  queue = result.catch(() => {});
  return result;
};

async function readState() {
  const {focusState} = await chrome.storage.local.get('focusState');
  if (focusState !== undefined) {
    if (!Array.isArray(focusState.pins)) throw new Error('固定列表无法读取，请重新加载插件后再试。');
    if (typeof focusState.enabled !== 'boolean') {
      focusState.enabled = true;
      await chrome.storage.local.set({focusState});
    }
    return focusState;
  }
  const initial = {version: 1, enabled: true, pins: DEFAULT_PINS.map(pin => ({...pin}))};
  await chrome.storage.local.set({focusState: initial});
  return initial;
}

async function applyEnabled(enabled) {
  const rulesets = await chrome.declarativeNetRequest.getEnabledRulesets();
  if (rulesets.includes('focus_home') === enabled) return;
  await chrome.declarativeNetRequest.updateEnabledRulesets(enabled
    ? {enableRulesetIds: ['focus_home']}
    : {disableRulesetIds: ['focus_home']});
}

async function restoreSetting() {
  const state = await readState();
  await applyEnabled(state.enabled);
}

// Chrome resets static rule enablement on extension updates. Restore the saved choice.
chrome.runtime.onInstalled.addListener(() => { serial(restoreSetting).catch(console.error); });
chrome.runtime.onStartup.addListener(() => { serial(restoreSetting).catch(console.error); });

chrome.runtime.onMessage.addListener((message, sender, respond) => {
  if (sender.id !== chrome.runtime.id || !sender.url?.startsWith(chrome.runtime.getURL('')) || !['state:read', 'pin:save', 'pin:delete', 'settings:set'].includes(message?.type)) return;
  serial(async () => {
    const state = await readState();
    if (message.type === 'settings:set') {
      if (typeof message.enabled !== 'boolean') throw new Error('开关状态无效，请重试。');
      await applyEnabled(message.enabled);
      const next = {...state, enabled: message.enabled};
      try { await chrome.storage.local.set({focusState: next}); }
      catch (error) { await applyEnabled(state.enabled); throw error; }
      return next;
    } else if (message.type === 'state:read') {
      await applyEnabled(state.enabled);
    } else if (message.type === 'pin:save') {
      const pin = validatePin(message.pin);
      const index = state.pins.findIndex(item => item.mid === pin.mid);
      if (index === -1) {
        if (state.pins.length >= MAX_PINS) throw new Error('最多固定 100 位 UP 主，请先移除一位。');
        state.pins.push(pin);
      } else state.pins[index] = pin;
      await chrome.storage.local.set({focusState: state});
    } else if (message.type === 'pin:delete') {
      const mid = parseMid(message.mid);
      state.pins = state.pins.filter(pin => pin.mid !== mid);
      await chrome.storage.local.set({focusState: state});
    }
    return state;
  }).then(data => respond({ok: true, data}), error => respond({ok: false, error: error.message}));
  return true;
});
