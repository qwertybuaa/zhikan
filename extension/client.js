export async function request(type, payload = {}) {
  const response = await chrome.runtime.sendMessage({type, ...payload});
  if (!response?.ok) throw new Error(response?.error || '暂时无法保存，请刷新页面后重试。');
  return response.data;
}

export const icons = {
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  edit: '<path d="m15 5 4 4M4 20l4-1L20 7a2.8 2.8 0 0 0-4-4L4 15v5Z"/>',
  pin: '<path d="m16 3 5 5-4 2-2 5-2 2-6-6 2-2 5-2 2-4ZM9 15l-6 6"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>',
};

export function icon(name) {
  // Every path comes from the fixed table above; user data is always textContent.
  const span = document.createElement('span');
  span.className = 'icon';
  span.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
  return span;
}

export function setStatus(element, text, error = false) {
  element.textContent = text;
  element.classList.toggle('is-error', error);
}
