param([switch]$SkipBootstrap)
$ErrorActionPreference = 'Stop'
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Push-Location $ProjectRoot
try {
    if (-not (Test-Path (Join-Path $ProjectRoot 'node_modules'))) {
        npm ci
        if ($LASTEXITCODE -ne 0) { throw 'Web build dependencies could not be installed.' }
    }
    npm run build:web
    if ($LASTEXITCODE -ne 0) { throw 'Web asset build failed.' }
    if (-not $SkipBootstrap) {
        python (Join-Path $PSScriptRoot 'bootstrap-android.py')
        if ($LASTEXITCODE -ne 0) { throw 'Android toolchain setup failed.' }
    }
    $env:JAVA_HOME = Join-Path $ProjectRoot '.tools\jdk'
    $env:ANDROID_HOME = Join-Path $ProjectRoot '.tools\android-sdk'
    $env:ANDROID_SDK_ROOT = $env:ANDROID_HOME
    $env:GRADLE_USER_HOME = Join-Path $ProjectRoot '.tools\gradle-cache'
    $env:ANDROID_USER_HOME = Join-Path $ProjectRoot '.tools\android-user'
    $GradleCommand = Join-Path $ProjectRoot '.tools\gradle-8.11.1\bin\gradle.bat'
    & $GradleCommand --no-daemon --console=plain :app:assembleDebug :app:lintDebug
    if ($LASTEXITCODE -ne 0) { throw 'Android build failed.' }
    $OutputDirectory = Join-Path $ProjectRoot 'artifacts'
    New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null
    $ApkPath = Join-Path $OutputDirectory 'number-cipher-1.0.0-debug.apk'
    Copy-Item -LiteralPath (Join-Path $ProjectRoot 'app\build\outputs\apk\debug\app-debug.apk') -Destination $ApkPath -Force
    & (Join-Path $env:ANDROID_HOME 'build-tools\36.0.0\apksigner.bat') verify --verbose $ApkPath
    if ($LASTEXITCODE -ne 0) { throw 'APK signature verification failed.' }
    python (Join-Path $PSScriptRoot 'verify-apk.py') $ApkPath
    if ($LASTEXITCODE -ne 0) { throw 'APK metadata or packaged asset verification failed.' }
    Get-FileHash -LiteralPath $ApkPath -Algorithm SHA256
    Write-Output "APK ready: $ApkPath"
} finally {
    Pop-Location
}
