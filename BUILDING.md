# 构建与安装

这是一个可独立安装的 Android 应用，包内包含完整游戏界面与关卡，无需浏览器或联网。最低安装要求为 Android 8.0（API 26），目标 SDK 为 API 36。目前尚未在 Android 真机或模拟器上运行验证；最低 SDK 声明和脚本兼容目标不代表所有设备与系统 WebView 版本都已实测。

## 开发环境

Windows 自动构建脚本面向 Windows 10 / 11 x64，需要 Node.js 20 或以上、npm、Python 3.10 或以上，以及可用的 `python` 命令。推荐使用 Node.js 24；前端依赖由 `package-lock.json` 锁定。首次构建需要访问 npm、Microsoft、Gradle、Google Android 仓库与 Maven Central。

| Android 工具 | 版本 |
| --- | --- |
| Microsoft OpenJDK | 17.0.21.0.2 |
| Gradle | 8.11.1 |
| Android Gradle Plugin | 8.10.1 |
| Android SDK Platform | 36 |
| Android SDK Build Tools | 36.0.0 |

## 从源码构建 APK

在 PowerShell 中克隆仓库并执行构建脚本，也可以下载源码 ZIP 后在解压目录执行同一脚本：

```powershell
git clone https://github.com/fading723/number-cipher-android.git
cd number-cipher-android
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/build-android.ps1
```

脚本在未安装前端依赖时执行 `npm ci`，随后执行 `npm run build:web`，再将 JDK、Gradle、SDK 和构建工具下载到项目的 `.tools` 目录，并校验官方提供的文件摘要。构建缓存和本地调试签名同样保存在 `.tools`，不进入版本控制。脚本不会修改系统 PATH，也不要求安装 Android Studio。

下载完成后可跳过工具准备：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/build-android.ps1 -SkipBootstrap
```

`-SkipBootstrap` 仅跳过工具链准备，不是离线模式；缺失的 Gradle 依赖仍需要下载。更新源码中的依赖清单后，应先运行 `npm ci` 再构建。

构建会运行 `assembleDebug`、`lintDebug`，用 `apksigner` 验证安装包签名，使用 `aapt` 检查包名、SDK 与权限，并逐文件核对 APK 中的游戏资源与当前源码一致。产物为：

```text
artifacts/number-cipher-1.0.0-debug.apk
artifacts/apk-verification.json
app/build/reports/lint-results-debug.html
```

这是供直接安装试玩的调试签名 APK。应用包名为 `cn.shuzhen.puzzle.debug`。正式上架前应使用开发者自己的发布签名，完成真机验证，并按应用商店要求生成 release APK 或 AAB。

## 运行测试

在仓库根目录执行：

```powershell
npm ci
npm test
npm run test:ui
```

数学测试不需要浏览器。UI 测试使用本机安装的 Chrome 或 Edge，在隔离的无头浏览器上下文中运行，并自动重新打包游戏脚本。`playwright-core` 不会自动下载浏览器；若浏览器安装在非默认位置，可指定路径：

```powershell
$env:CHROME_PATH = 'C:\path\to\chrome.exe'
npm run test:ui
```

报告与截图生成在 `artifacts/ui/`。浏览器触摸模式测试不能代替 Android 真机或模拟器测试。

## 安装试玩

把 APK 发送到安卓手机，用系统文件管理器打开安装。系统可能要求为当前文件管理器开启“安装未知应用”权限。

已配置 USB 调试时，也可执行：

```powershell
.tools/android-sdk/platform-tools/adb.exe install -r artifacts/number-cipher-1.0.0-debug.apk
```

`-r` 更新同签名应用并保留本地进度。不同开发环境首次构建会生成各自的调试签名，可能无法覆盖安装预构建 APK。切换签名需要先卸载旧应用；卸载应用或清除应用数据会删除本地进度。

发布说明中的 SHA-256 仅对应该次发布的 APK。本地重建可能因调试签名和构建元数据不同而产生不同摘要。

## 使用已有 Android 开发环境

使用 JDK 17、SDK Platform 36 和 Build Tools 36.0.0，并通过 Android Studio、`ANDROID_HOME` 或本机 `local.properties` 配置 SDK 路径。在项目根目录执行：

```powershell
npm ci
npm run build:web
.\gradlew.bat --no-daemon :app:assembleDebug :app:lintDebug
```

APK 默认输出到 `app/build/outputs/apk/debug/app-debug.apk`。此方式不会自动复制到 `artifacts` 或生成项目的 APK 校验报告。Gradle wrapper 固定使用 8.11.1，并配置发行包 SHA-256 校验。

Android Studio 可直接打开仓库根目录。修改界面、数学引擎或关卡后，构建安卓应用前应先执行 `npm run build:web`。项目无第三方 Android 运行时依赖，自动工具下载与 APK 校验脚本目前面向 Windows；其他操作系统需要自行配置 Android 工具链。

## 离线宿主说明

- 原生 Java Activity 加载 APK 内的 WebView 游戏资源。
- 使用 `https://appassets.androidplatform.net/assets/www/` 本地域，并在 `shouldInterceptRequest` 中读取本地 assets，为资源和 localStorage 提供稳定来源。
- 游戏入口以经典脚本加载 `game.bundle.js`，并不直接加载 ES module。界面与数学源码使用 ES modules 组织，由 `npm run build:web` 打包为面向 Chromium 61 的离线脚本。
- Manifest 不声明 INTERNET、存储、位置、相机等权限；外部导航与文件访问关闭。
- 状态栏、手势导航和刘海安全区由原生层处理；Android 返回键先调用游戏的 `window.onAndroidBack()`。
- 游戏进度存放在应用私有 WebView localStorage 中，不上传到服务器。

## 官方版本资料

- [AGP 8.10 兼容性：支持 API 36、Gradle 8.11.1、JDK 17](https://developer.android.com/build/releases/agp-8-10-0-release-notes)
- [Microsoft OpenJDK 下载与校验文件](https://learn.microsoft.com/en-us/java/openjdk/download)
- [Gradle 8.11.1 发布说明](https://docs.gradle.org/8.11.1/release-notes.html)

测试范围见 [验证记录](docs/VALIDATION.md)，当前预览包信息见 [v1.0.0-preview 发布说明](docs/releases/v1.0.0-preview.md)。
