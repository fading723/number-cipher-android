# 数阵破译

**Number Cipher · 面向初中生的离线数学推理游戏**

把数字卡片放入数阵，让行、列与交叉区域的数学条件同时成立。从和与积出发，结合差值、倍数和候选排除，找到每个数字的位置。

游戏提供 30 个固定关卡，不设倒计时，支持随时保存并继续。Android 8.0 及以上可安装；全部游戏资源随 APK 提供，无需账号或联网。

[下载 Android 安装包](https://github.com/fading723/number-cipher-android/releases/download/v1.0.0-preview/number-cipher-1.0.0-debug.apk) · [版本发布](https://github.com/fading723/number-cipher-android/releases/tag/v1.0.0-preview) · [构建指南](BUILDING.md)

## 界面预览

<table>
  <tr>
    <th>关卡地图</th>
    <th>数阵推演</th>
    <th>深度挑战</th>
  </tr>
  <tr>
    <td align="center" valign="top"><img src="docs/images/home.png" width="230" alt="数阵破译首页，展示进度、继续游戏与关卡地图"></td>
    <td align="center" valign="top"><img src="docs/images/normal.png" width="230" alt="普通关卡，展示九宫格、行列条件与数字卡片"></td>
    <td align="center" valign="top"><img src="docs/images/challenge.png" width="230" alt="挑战关卡，展示稀疏线索与跨区域数学条件"></td>
  </tr>
</table>

## 下载与安装

1. 下载 [v1.0.0-preview APK](https://github.com/fading723/number-cipher-android/releases/download/v1.0.0-preview/number-cipher-1.0.0-debug.apk)，保存到 Android 8.0 或更高版本的手机。
2. 使用手机文件管理器打开 APK，按系统提示允许该来源安装应用。
3. 启动“数阵破译”，选择任意关卡开始游戏。

游戏进度自动保存在设备本地。版本说明和下载文件见 [Releases](https://github.com/fading723/number-cipher-android/releases/tag/v1.0.0-preview)。

## 玩法与关卡

每个数字恰好使用一次，所有条件同时成立即通关。差值按较大数减较小数计算，倍数按较大数除以较小数计算。棋盘以 A/B/C 标记行、1/2/3 标记列；点击任意线索，可以查看它关联的格子。

| 难度 | 关卡 | 内容 |
| --- | --- | --- |
| 推理入门 | 1–3，共 3 关 | 从小数阵认识数字放置、和、积、差与候选标记 |
| 数阵推演 | 4–21，共 18 关 | 在九宫格中结合行列、对角与交叉条件进行推导 |
| 深度挑战 | 22–30，共 9 关 | 使用更稀疏的区域线索，组合差值、倍数与多条条件排除候选 |

**30 个关卡均有唯一解，支持自由选择。**

第 4 关“交叉相遇”是一道典型数阵：使用 1–9，三行的和依次为 **15、13、17**，三列的积依次为 **72、144、35**，主对角线的和为 **12**。这些条件相互约束，需要结合多条线索确定数字的位置。

## 主要功能

- **点选与拖放**：点击格子后填数，或直接拖动数字；将已使用的数字放入占用格时交换两格内容。
- **候选标记与撤销**：记录可能数字，随时撤回填数或标记操作；重来前会要求确认，并保留历史通关记录。
- **线索高亮与检查**：查看条件关联的区域，检查冲突；局部条件成立会变绿，全部满足才算通关。
- **推理提示**：围绕因数、范围与交叉关系提供思路，帮助定位冲突和推导下一步。
- **本地进度**：自动保存棋盘、候选、操作记录和通关状态，支持离线继续游戏。
- **安卓交互**：返回键依次关闭弹窗、返回关卡地图，再交由系统退出应用。

桌面预览支持数字键填数、方向键选格、Delete/Backspace 擦除、N 切换候选、Ctrl+Z 撤销。

## 技术结构

应用使用 **Java 原生 Activity + 本地 WebView**。原生宿主将 APK 内的资源映射到应用内部的 HTTPS 来源；页面、关卡与数学逻辑均在设备本地运行。WebView 的本地存储用于保存进度，应用不声明联网或存储权限，也不上传游戏数据。

界面交互、数学引擎和关卡数据分别维护，JavaScript 使用 esbuild 打包。Android 最低版本为 API 26，目标版本为 API 36。

## 开发与构建

开发需要 **Node.js 20+、npm 和 Python 3**。浏览器交互测试还需要安装 Chrome 或 Edge。

```powershell
git clone https://github.com/fading723/number-cipher-android.git
cd number-cipher-android
npm ci
npm run build:web
```

启动本地浏览器预览：

```powershell
python -m http.server 4173 --bind 127.0.0.1 --directory app/src/main/assets/www
```

打开 [本地预览](http://127.0.0.1:4173)。修改脚本或关卡后，重新执行 `npm run build:web` 并刷新页面。

Windows 下构建安卓 APK：

```powershell
powershell -ExecutionPolicy Bypass -File scripts/build-android.ps1
```

构建脚本自动准备 JDK 17、Gradle 8.11.1 和 Android SDK，首次执行需要联网。APK 输出至 `artifacts/number-cipher-1.0.0-debug.apk`。Android Studio 和已有工具链的配置方式详见 [BUILDING.md](BUILDING.md)。

## 测试

```powershell
# 数学引擎与关卡测试
npm test

# 自动构建 Web 资源，运行移动端触摸交互与布局测试
npm run test:ui
```

UI 测试报告和截图输出至 `artifacts/ui/`。如浏览器安装位置不在默认路径，可通过 `CHROME_PATH` 指定可执行文件。

## 项目目录

```text
app/src/main/
  java/                        原生安卓宿主与资源加载
  res/                         应用图标、名称与主题
  assets/www/
    index.html / styles.css    页面入口与界面样式
    app.js                     交互、候选、撤销与本地进度
    engine.js                  数学约束、求解与推理提示
    levels.js                  30 个固定关卡
    game.bundle.js             离线脚本构建产物
scripts/                       关卡生成、难度分析与构建脚本
tests/                         数学与 UI 自动化测试
tools/                         浏览器测试辅助工具
docs/                          技术文档与项目截图
BUILDING.md                    安卓构建与安装指南
```
