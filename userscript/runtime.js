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
