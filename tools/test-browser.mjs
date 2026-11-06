import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const root = path.resolve('app/src/main/assets/www');
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

export async function startBrowserTest() {
  const executablePath = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/chromium',
    '/usr/bin/google-chrome',
  ].find(candidate => candidate && existsSync(candidate));
  if (!executablePath) throw new Error('Set CHROME_PATH to an installed Chrome or Edge executable.');

  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url, 'http://localhost');
      const filePath = path.resolve(root, `.${decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname)}`);
      if (filePath !== root && !filePath.startsWith(root + path.sep)) {
        response.writeHead(403).end();
        return;
      }
      const content = await readFile(filePath);
      response.writeHead(200, { 'Content-Type': mimeTypes[path.extname(filePath)] ?? 'application/octet-stream' });
      response.end(content);
    } catch {
      response.writeHead(404).end('Not found');
    }
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  let browser;
  try {
    browser = await chromium.launch({ executablePath, headless: true });
  } catch (error) {
    await new Promise(resolve => server.close(resolve));
    throw error;
  }
  const output = path.resolve('artifacts/ui');
  await mkdir(output, { recursive: true });
  return {
    browser,
    url: `http://127.0.0.1:${server.address().port}`,
    output,
    close: async () => {
      await browser.close();
      await new Promise(resolve => server.close(resolve));
    },
  };
}

export async function inspectLayout(page) {
  return page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const overflow = [...document.querySelectorAll('body *')].filter(element => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 &&
        (rect.left < -1 || rect.right > width + 1);
    }).map(element => ({ tag: element.tagName, id: element.id, classes: element.className,
      text: (element.textContent ?? '').trim().slice(0, 60) }));
    const smallTargets = [...document.querySelectorAll('button,input,[role="button"]')].filter(element => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && (rect.width < 43.5 || rect.height < 43.5);
    }).map(element => ({ text: (element.textContent ?? element.getAttribute('aria-label') ?? '').trim().slice(0, 40),
      width: Math.round(element.getBoundingClientRect().width), height: Math.round(element.getBoundingClientRect().height) }));
    return { viewport: { width, height: innerHeight }, scrollWidth: document.documentElement.scrollWidth, overflow, smallTargets };
  });
}
