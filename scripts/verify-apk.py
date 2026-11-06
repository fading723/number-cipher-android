"""Verify Android metadata and byte-for-byte parity with the game source assets."""
import hashlib
import json
from pathlib import Path
import re
import subprocess
import sys
import zipfile

root = Path(__file__).resolve().parent.parent
apk = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else root / 'artifacts/number-cipher-1.0.0-debug.apk'
aapt = root / '.tools/android-sdk/build-tools/36.0.0/aapt.exe'
result = subprocess.run([str(aapt), 'dump', 'badging', apk.name], cwd=apk.parent, capture_output=True, check=True)
badging = result.stdout.decode('utf-8')
package = re.search(r"package: name='([^']+)'", badging).group(1)
minimum = int(re.search(r"sdkVersion:'(\d+)'", badging).group(1))
target = int(re.search(r"targetSdkVersion:'(\d+)'", badging).group(1))
permissions = re.findall(r"uses-permission: name='([^']+)'", badging)
assert package == 'cn.shuzhen.puzzle.debug', package
assert (minimum, target) == (26, 36), (minimum, target)
assert permissions == [], permissions

asset_root = root / 'app/src/main/assets/www'
asset_hashes = {}
with zipfile.ZipFile(apk) as archive:
    assert {'AndroidManifest.xml', 'classes.dex', 'resources.arsc'} <= set(archive.namelist())
    source_names = {'assets/www/' + p.relative_to(asset_root).as_posix() for p in asset_root.rglob('*') if p.is_file()}
    apk_names = {n for n in archive.namelist() if n.startswith('assets/www/') and not n.endswith('/')}
    assert apk_names == source_names, 'Missing or unexpected packaged assets'
    for name in sorted(source_names):
        data = archive.read(name)
        assert data == (root / 'app/src/main' / name).read_bytes(), f'Stale asset: {name}'
        asset_hashes[name] = hashlib.sha256(data).hexdigest()

report = {
    'apk': apk.name,
    'bytes': apk.stat().st_size,
    'sha256': hashlib.sha256(apk.read_bytes()).hexdigest(),
    'package': package,
    'minimumSdk': minimum,
    'targetSdk': target,
    'permissions': permissions,
    'allPackagedAssetsMatchSource': True,
    'assetSha256': asset_hashes,
    'physicalDeviceOrEmulatorTested': False,
}
report_path = apk.parent / 'apk-verification.json'
report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'APK metadata and {len(asset_hashes)} packaged assets verified; no Android permissions requested.')
print(f'Verification report: {report_path}')
