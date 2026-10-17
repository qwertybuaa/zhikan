"""Bundle the extension UI into a readable, standalone Greasy Fork userscript."""
from pathlib import Path
import json
import re
import base64

root = Path(__file__).resolve().parents[1]
extension = root / 'extension'
manifest = json.loads((extension / 'manifest.json').read_text(encoding='utf-8'))

def read(name):
    return (extension / name).read_text(encoding='utf-8')

def template(text):
    return '`' + text.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${') + '`'

core = re.sub(r'^export ', '', read('core.js'), flags=re.M)
client = read('client.js').split('export const icons = ', 1)[1]
client = 'const icons = ' + re.sub(r'^export ', '', client, flags=re.M)
home = re.sub(r'^import .*\n', '', read('home.js'), flags=re.M)
home = home.replace('document.querySelector(selector)', 'shadow.querySelector(selector)')
home = home.replace("chrome.storage.onChanged.addListener((changes, area) => { if (area === 'local' && changes.focusState?.newValue) render(changes.focusState.newValue); });", 'onPinsChanged = render;')
assert 'chrome.' not in home
html = re.search(r'<body[^>]*>(.*?)</body>', read('home.html'), re.S).group(1)
logo = read('icons/bilibili.svg').strip().replace('<svg ', '<svg class="bilibili-logo" role="img" aria-label="哔哩哔哩" ', 1)
html = re.sub(r'<img class="bilibili-logo"[^>]*>', lambda _: logo, html)
styles = read('styles.css').replace(':root {', ':host {', 1)
styles += '\n.home-page { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", "PingFang SC", sans-serif; font-size: 14px; color: var(--body); background: var(--paper); visibility: visible; line-height: normal; text-align: left; }\n'
header = f'''// ==UserScript==
// @name         只看
// @namespace    zhikan.qwertybuaa
// @version      {manifest['version']}
// @description  将 B 站首页变成搜索框和固定的 UP 主，隐藏首页推荐流，支持全站或 UP 主内搜索及一键开关。
// @author       qwertybuaa
// @license      Copyright (c) 2026 qwertybuaa
// @icon         data:image/png;base64,{base64.b64encode((extension / 'icons/icon-64.png').read_bytes()).decode()}
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
'''
runtime = (root / 'userscript/runtime.js').read_text(encoding='utf-8')
code = header + '\n(function () {\n\'use strict\';\n\n' + core + '\n' + client
code += '\nconst STYLES = ' + template(styles) + ';\n'
code += '\nconst HOME_HTML = ' + template(html) + ';\n'
code += '\nfunction startHome(shadow) {\n' + home + '\n}\n\n' + runtime + '\n})();\n'
destination = root / 'userscript/zhikan.user.js'
destination.write_text(code, encoding='utf-8')
print(f'{destination} ({destination.stat().st_size:,} bytes)')
