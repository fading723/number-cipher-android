"""Install the pinned Android toolchain locally; never modify the system PATH."""
from concurrent.futures import ThreadPoolExecutor
import hashlib
from pathlib import Path
import shutil
import time
import urllib.request
import xml.etree.ElementTree as ET
import zipfile

ROOT = Path(__file__).resolve().parent.parent
TOOLS = ROOT / '.tools'
CACHE = TOOLS / 'downloads'
SDK = TOOLS / 'android-sdk'
CACHE.mkdir(parents=True, exist_ok=True)
SDK.mkdir(parents=True, exist_ok=True)


def fetch(url):
    request = urllib.request.Request(url, headers={'User-Agent': 'NumberCipher-build/1.0'})
    return urllib.request.urlopen(request, timeout=120)


def download(name, url, digest=None, algorithm='sha256'):
    path = CACHE / name
    if path.exists() and digest:
        if hashlib.new(algorithm, path.read_bytes()).hexdigest() == digest:
            return path
    for attempt in range(3):
        print(f'Downloading {name} (attempt {attempt + 1})', flush=True)
        request_url = url + ('&' if '?' in url else '?') + f'build={time.time_ns()}'
        try:
            with fetch(request_url) as response, path.open('wb') as output:
                shutil.copyfileobj(response, output, 1024 * 1024)
            if digest and hashlib.new(algorithm, path.read_bytes()).hexdigest() != digest:
                raise RuntimeError(f'Checksum mismatch: {name}')
            print(f'Verified {name} ({path.stat().st_size // 1048576} MiB)', flush=True)
            return path
        except Exception as error:
            print(f'{name}: {error}', flush=True)
            if attempt == 2:
                raise


def install_jdk():
    destination = TOOLS / 'jdk'
    if (destination / 'bin' / 'java.exe').exists():
        return
    name = 'microsoft-jdk-17.0.21.0.2-windows-x64.zip'
    url = 'https://aka.ms/download-jdk/' + name
    with fetch(url + '.sha256sum.txt') as r:
        checksum = r.read().decode().split()[0]
    archive = download(name, url, checksum)
    with zipfile.ZipFile(archive) as z:
        prefix = z.namelist()[0].split('/')[0]
        z.extractall(TOOLS / 'jdk-unpack')
    shutil.move(str(TOOLS / 'jdk-unpack' / prefix), str(destination))
    print('JDK ready', flush=True)


def install_gradle():
    if (TOOLS / 'gradle-8.11.1' / 'bin' / 'gradle.bat').exists():
        return
    url = 'https://downloads.gradle.org/distributions/gradle-8.11.1-bin.zip'
    with fetch(url + '.sha256') as r:
        checksum = r.read().decode().strip()
    archive = download('gradle-8.11.1-bin.zip', url, checksum)
    with zipfile.ZipFile(archive) as z:
        z.extractall(TOOLS)
    print('Gradle ready', flush=True)


def install_sdk_package(package, destination):
    if (destination / 'source.properties').exists():
        return
    with fetch('https://dl.google.com/android/repository/repository2-3.xml') as r:
        repository = ET.fromstring(r.read())
    remote = next(p for p in repository.findall('remotePackage') if p.get('path') == package)
    archive = next(a for a in remote.findall('./archives/archive') if a.findtext('host-os') in (None, 'windows'))
    url = archive.findtext('./complete/url')
    checksum = archive.find('./complete/checksum')
    path = download(url, 'https://dl.google.com/android/repository/' + url, checksum.text, checksum.get('type', 'sha1'))
    unpack = TOOLS / ('unpack-' + package.replace(';', '-'))
    with zipfile.ZipFile(path) as z:
        z.extractall(unpack)
    children = list(unpack.iterdir())
    source = children[0] if len(children) == 1 and children[0].is_dir() else unpack
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.move(str(source), str(destination))
    print(f'{package} ready', flush=True)


with ThreadPoolExecutor(max_workers=5) as pool:
    jobs = [
        pool.submit(install_jdk),
        pool.submit(install_gradle),
        pool.submit(install_sdk_package, 'platforms;android-36', SDK / 'platforms' / 'android-36'),
        pool.submit(install_sdk_package, 'build-tools;36.0.0', SDK / 'build-tools' / '36.0.0'),
        pool.submit(install_sdk_package, 'platform-tools', SDK / 'platform-tools'),
    ]
    for job in jobs:
        job.result()
print('Local Android toolchain installed.', flush=True)
