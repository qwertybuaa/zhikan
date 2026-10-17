"""Create an installable archive without browser-generated metadata or test data."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import json

root = Path(__file__).resolve().parents[1]
extension = root / 'extension'
manifest = json.loads((extension / 'manifest.json').read_text())
files = [
    'manifest.json', 'rules.json', 'background.js', 'core.js', 'client.js',
    'home.html', 'home.js', 'popup.html', 'popup.js', 'styles.css',
    'icons/mark.svg', 'icons/bilibili.svg', 'icons/SOURCES.md', 'icons/icon-16.png', 'icons/icon-32.png',
    'icons/icon-48.png', 'icons/icon-64.png', 'icons/icon-128.png',
]
for file in files:
    assert (extension / file).is_file(), f'Missing extension file: {file}'
instructions = '''只看

1. 解压这个 ZIP 包，并保留解压后的文件夹。
2. 在 Chrome 地址栏输入 chrome://extensions
3. 打开右上角“开发者模式”。
4. 点击“加载已解压的扩展程序”，选择解压后的 bili-focus 文件夹。
   注意：选中包含 manifest.json 的这一层。
5. 打开或刷新 https://www.bilibili.com/，就会进入极简首页。

点“添加 UP 主”，建立自己的固定列表。
搜索框左侧可选择全站搜索或只搜某位固定的 UP 主。
工具栏打开插件，可以固定当前空间页的 UP 主。
工具栏中的“极简 B 站”开关可以开启或关闭首页替换；固定列表保留。

不需要运行服务器。请不要删除安装时选择的文件夹。
固定列表只保存在本机；卸载插件会清除列表。
视频页自身的相关推荐保持原站行为。
'''
destination = root / 'artifacts' / f'bili-focus-v{manifest["version"]}.zip'
destination.parent.mkdir(exist_ok=True)
with ZipFile(destination, 'w', ZIP_DEFLATED) as archive:
    for file in files:
        archive.write(extension / file, 'bili-focus/' + file)
    archive.writestr('安装说明.txt', instructions)
with ZipFile(destination) as archive:
    assert archive.testzip() is None
    assert len(archive.namelist()) == len(files) + 1
print(f'{destination} ({destination.stat().st_size:,} bytes)')

# Chrome Web Store requires manifest.json at the root of the uploaded archive.
store_destination = root / 'artifacts' / f'zhikan-chrome-web-store-v{manifest["version"]}.zip'
with ZipFile(store_destination, 'w', ZIP_DEFLATED) as archive:
    for file in files:
        archive.write(extension / file, file)
with ZipFile(store_destination) as archive:
    assert archive.testzip() is None
    assert 'manifest.json' in archive.namelist()
    assert json.loads(archive.read('manifest.json'))['name'] == '只看'
    assert len(archive.namelist()) == len(files)
print(f'{store_destination} ({store_destination.stat().st_size:,} bytes)')
