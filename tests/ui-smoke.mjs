import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { LEVELS } from '../app/src/main/assets/www/levels.js';
import { startBrowserTest, inspectLayout } from '../tools/test-browser.mjs';

const test = await startBrowserTest();
const report = { status: 'running', checks: [], screenshots: [], layouts: [], errors: [] };
const context = await test.browser.newContext({
  viewport: { width: 360, height: 800 }, deviceScaleFactor: 1,
  isMobile: true, hasTouch: true, reducedMotion: 'reduce',
});
const page = await context.newPage();
page.on('pageerror', error => report.errors.push(error.message));
page.on('requestfailed', request => report.errors.push(`${request.method()} ${request.url()} ${request.failure()?.errorText}`));
const action = name => page.locator(`[data-action="${name}"]`);
const cell = index => page.locator(`[data-cell="${index}"]`);
const number = value => page.locator(`[data-number="${value}"]`);
const valueAt = index => cell(index).evaluate(element => element.querySelector('.cell-value')?.textContent.trim() || '');
const boardValues = () => page.locator('[data-cell]').evaluateAll(cells => cells.map(element => element.querySelector('.cell-value')?.textContent.trim() || ''));

async function openLevel(id) {
  if (await action('back').count()) await action('back').tap();
  const level = LEVELS.find(item => item.id === id);
  const filter = page.locator(`[data-action="filter"][data-tier="${level.tier}"]`);
  if (await filter.count()) await filter.tap();
  await page.locator(`.level-card[data-action="open-level"][data-level="${id}"]`).tap();
  await cell(0).waitFor();
  assert.equal(await page.locator('[data-cell]').count(), level.digits.length, `Level ${id} grid size`);
  assert.equal(await page.locator('[data-number]').count(), level.digits.length, `Level ${id} number bank`);
}

async function recordScreen(name, { largeText = false } = {}) {
  if (largeText) {
    // Android WebView text zoom is approximated by scaling computed text sizes
    // while preserving the CSS box dimensions. This is not a real-device test.
    await page.evaluate(() => {
      const sizes = [...document.querySelectorAll('body *')]
        .filter(element => element instanceof HTMLElement)
        .map(element => [element, parseFloat(getComputedStyle(element).fontSize)]);
      for (const [element, size] of sizes) if (Number.isFinite(size)) element.style.fontSize = `${size * 1.3}px`;
    });
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  const filename = `${name}.png`;
  await page.screenshot({ path: path.join(test.output, filename), fullPage: true });
  report.screenshots.push(filename);
  const layout = await inspectLayout(page);
  report.layouts.push({ name, ...layout });
  assert.ok(layout.scrollWidth <= layout.viewport.width + 1, `${name}: page horizontally overflows`);
  const visibleOverflow = layout.overflow.filter(item => !item.classes.includes('sr-only'));
  assert.deepEqual(visibleOverflow, [], `${name}: elements cross viewport edges`);
  assert.deepEqual(layout.smallTargets, [], `${name}: touch targets must be at least 44 CSS pixels`);
}

async function fillLevel(id) {
  const level = LEVELS.find(item => item.id === id);
  for (let index = 0; index < level.solution.length; index += 1) {
    await cell(index).tap();
    await number(level.solution[index]).tap();
  }
  // Some builds congratulate immediately; others wait for an explicit check.
  if (!(await page.locator('.success-modal').count())) await action('check').tap();
  await page.locator('.success-modal').waitFor();
  assert.ok((await page.locator('.success-modal').innerText()).length > 10);
}

async function touchDrag(source, target) {
  await source.scrollIntoViewIfNeeded();
  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();
  assert.ok(sourceBox && targetBox, 'Drag endpoints are visible');
  const from = { x: sourceBox.x + sourceBox.width / 2, y: sourceBox.y + sourceBox.height / 2 };
  const to = { x: targetBox.x + targetBox.width / 2, y: targetBox.y + targetBox.height / 2 };
  const session = await context.newCDPSession(page);
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...from, id: 1 }] });
  for (let step = 1; step <= 8; step += 1) {
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{
      x: from.x + (to.x - from.x) * step / 8,
      y: from.y + (to.y - from.y) * step / 8, id: 1,
    }] });
  }
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await session.detach();
}

try {
  await page.goto(test.url, { waitUntil: 'networkidle' });
  await page.locator('.level-card').first().waitFor();
  await recordScreen('home-360x800');
  report.checks.push('Home loads without a network dependency');

  const scrollSession = await context.newCDPSession(page);
  const cardBox = await page.locator('.level-card').first().boundingBox();
  const swipeX = cardBox.x + cardBox.width / 2;
  const swipeY = Math.min(760, cardBox.y + cardBox.height / 2);
  await scrollSession.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: swipeX, y: swipeY, id: 1 }] });
  for (let step = 1; step <= 10; step += 1) await scrollSession.send('Input.dispatchTouchEvent', {
    type: 'touchMove', touchPoints: [{ x: swipeX, y: swipeY - 30 * step, id: 1 }],
  });
  await scrollSession.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await scrollSession.detach();
  assert.equal(await page.locator('.home-screen').count(), 1, 'Scrolling across a level card does not open it');
  assert.ok(await page.evaluate(() => scrollY) > 20, 'Touch gesture scrolls the map');
  await page.evaluate(() => window.scrollTo(0, 0));
  report.checks.push('Touch scrolling the level map does not accidentally open a level');

  await openLevel(4);
  await recordScreen('normal-360x800');
  await cell(0).tap();
  await number(2).tap();
  assert.equal(await valueAt(0), '2', 'Touch tap places number');
  await action('undo').tap();
  assert.equal(await valueAt(0), '', 'Undo restores empty cell');
  report.checks.push('Touch placement and undo');

  await cell(1).tap();
  await action('notes').tap();
  await number(3).tap();
  assert.equal(await valueAt(1), '', 'Notes do not become placed numbers');
  assert.match(await cell(1).innerText(), /3/, 'Candidate note is visible');
  await action('notes').tap();
  await number(4).tap();
  assert.equal(await valueAt(1), '4');
  await action('erase').tap();
  assert.equal(await valueAt(1), '', 'Erase clears selected cell');
  report.checks.push('Candidate notes and erase');

  await cell(0).tap();
  await number(2).tap();
  const beforeHint = await boardValues();
  await action('hint').tap();
  await page.locator('.hint-panel').waitFor();
  assert.deepEqual(await boardValues(), beforeHint, 'Hint must not fill the board');
  report.checks.push('Reasoning hint does not reveal or fill an answer');

  await page.reload({ waitUntil: 'networkidle' });
  if (!(await cell(0).count())) await openLevel(4);
  assert.equal(await valueAt(0), '2', 'Progress survives reload');
  report.checks.push('Local saved progress survives reload');

  await cell(2).tap();
  await number(5).tap();
  await cell(3).tap();
  await number(5).tap();
  assert.equal(await valueAt(3), '5', 'An existing number can be moved to an empty cell');
  const assigned = (await boardValues()).filter(Boolean);
  assert.equal(assigned.filter(value => value === '5').length, 1, 'A number card cannot be duplicated');
  report.checks.push('Duplicate number card protection');

  const beforeSwap = await boardValues();
  await cell(0).tap();
  await number(5).tap();
  assert.equal(await valueAt(0), '5', 'Moving an existing card replaces the target');
  assert.equal(await valueAt(3), '2', 'Moving an existing card swaps the target back to its source');
  await action('undo').tap();
  assert.deepEqual(await boardValues(), beforeSwap, 'Undo restores both sides of a swap');
  report.checks.push('Occupied-cell swap and undo');

  await action('reset').tap();
  await action('close-modal').tap();
  assert.deepEqual(await boardValues(), beforeSwap, 'Cancelling reset preserves progress');
  await action('reset').tap();
  await action('confirm-reset').tap();
  assert.ok((await boardValues()).every(value => value === ''), 'Confirmed reset clears the board');
  assert.equal(await action('undo').isDisabled(), true, 'Confirmed reset clears history');
  report.checks.push('Reset requires confirmation; cancellation preserves progress');

  for (let index = 0; index < 3; index += 1) {
    await cell(index).tap();
    await number(index + 1).tap();
  }
  await action('check').tap();
  assert.ok(await page.locator('.cell.conflict').count() >= 3, 'Invalid full row is highlighted');
  await page.locator('[data-clue="row-0"]').tap();
  assert.equal(await page.locator('.cell.highlighted').count(), 3, 'A row clue highlights its three cells');
  assert.match(await page.locator('.clue-detail').innerText(), /A1、A2、A3/);
  report.checks.push('Invalid-clue feedback and coordinate highlight');

  await action('help').tap();
  assert.equal(await page.locator('#app').evaluate(element => element.inert), true, 'Help isolates background controls');
  assert.equal(await page.evaluate(() => window.onAndroidBack()), true, 'Android back closes help');
  assert.equal(await page.locator('[role="dialog"]').count(), 0);
  assert.equal(await page.evaluate(() => window.onAndroidBack()), true, 'Android back returns game to map');
  assert.equal(await page.evaluate(() => window.onAndroidBack()), false, 'Android back at home is handed to the host');
  report.checks.push('Help dialog and Android back routing');

  await openLevel(4);
  await fillLevel(4);
  await action('next-level').tap();
  assert.match(await page.locator('.game-topbar-center').innerText(), /05/);
  report.checks.push('Agreed sample level 4 completes and advances to level 5');

  await openLevel(1);
  await recordScreen('tutorial-360x800');
  await fillLevel(1);
  await recordScreen('success-360x800');
  report.checks.push('Tutorial completion opens success feedback');
  await action('next-level').tap();
  assert.match(await page.locator('.game-topbar-center').innerText(), /02/);
  assert.equal(await page.locator('[data-cell]').count(), LEVELS[1].digits.length);
  await openLevel(3);
  await recordScreen('tutorial-six-cards-360x800');
  report.checks.push('Next-level navigation and six-card tutorial layout');

  await openLevel(25);
  assert.match(await page.locator('.tier-badge').innerText(), /深度挑战/);
  await recordScreen('challenge-360x800');
  report.checks.push('Challenge tier is reachable');

  await page.setViewportSize({ width: 320, height: 800 });
  await recordScreen('challenge-320x800-large-text', { largeText: true });
  await action('back').tap();
  await recordScreen('home-320x800-large-text', { largeText: true });
  report.checks.push('320px screen with 130% text has no horizontal overflow');

  await page.setViewportSize({ width: 360, height: 800 });
  await openLevel(22);
  await fillLevel(22);
  await action('next-level').tap();
  assert.match(await page.locator('.game-topbar-center').innerText(), /23/);
  report.checks.push('Challenge level 22 completes and advances to level 23');
  await openLevel(30);
  await fillLevel(30);
  assert.equal(await action('next-level').count(), 0, 'Last level does not navigate beyond the pack');
  await action('close-modal').tap();
  assert.match(await page.locator('.game-topbar-center').innerText(), /30/);
  await page.reload({ waitUntil: 'networkidle' });
  const finalCard = page.locator('.level-card[data-level="30"]');
  assert.equal(await finalCard.evaluate(element => element.classList.contains('complete')), true, 'Completion persists');
  report.checks.push('Final-level completion and persisted completion badge');

  await page.evaluate(() => localStorage.setItem('shuzhen.progress.v1', '{corrupt json'));
  await page.reload({ waitUntil: 'networkidle' });
  assert.ok(await page.locator('.level-card').count() > 0, 'Corrupt save does not block the home screen');
  await openLevel(4);
  await cell(0).tap();
  await number(1).tap();
  assert.equal(await valueAt(0), '1', 'Game remains playable after a corrupt save');
  report.checks.push('Corrupt local save recovery');

  const blockedContext = await test.browser.newContext({ viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true });
  await blockedContext.addInitScript(() => {
    Storage.prototype.setItem = () => { throw new DOMException('Storage is unavailable', 'QuotaExceededError'); };
  });
  const blockedPage = await blockedContext.newPage();
  blockedPage.on('pageerror', error => report.errors.push(`Blocked storage: ${error.message}`));
  await blockedPage.goto(test.url, { waitUntil: 'networkidle' });
  await blockedPage.locator('.level-card[data-level="4"]').tap();
  await blockedPage.locator('[data-cell="0"]').tap();
  await blockedPage.locator('[data-number="1"]').tap();
  assert.equal(await blockedPage.locator('[data-cell="0"] .cell-value').textContent(), '1');
  assert.match(await blockedPage.locator('#toast').innerText(), /无法保存/);
  await blockedContext.close();
  report.checks.push('Unavailable storage warns while keeping the game playable');

  await page.evaluate(() => {
    window.__qaGestureEvents = [];
    for (const type of ['touchstart', 'touchend', 'pointerdown', 'pointerup', 'click']) document.addEventListener(type, event => {
      const element = event.target.closest('button');
      window.__qaGestureEvents.push({ type, t: performance.now(), cell: element?.dataset.cell, number: element?.dataset.number,
        pointer: event.pointerId, x: event.clientX, y: event.clientY });
    }, true);
  });
  await touchDrag(number(5), cell(2));
  await page.waitForFunction(() => document.querySelector('[data-cell="2"] .cell-value')?.textContent === '5');
  await cell(3).tap();
  await page.locator('[data-cell="3"][aria-pressed="true"]').waitFor({ timeout: 1500 }).catch(() => {});
  report.gestureTrace = await page.evaluate(() => window.__qaGestureEvents);
  assert.equal(await cell(3).getAttribute('aria-pressed'), 'true', 'Tap selects the destination after dragging');
  await number(5).tap();
  assert.equal(await valueAt(3), '5', 'Number can move again immediately after a drag');
  report.checks.push('Touch drag followed immediately by a new selection and move');

  assert.deepEqual(report.errors, [], 'No JavaScript or failed-resource errors');
  report.status = 'passed';
} catch (error) {
  report.status = 'failed';
  report.failure = error.stack || String(error);
  await page.screenshot({ path: path.join(test.output, 'failure.png'), fullPage: true }).catch(() => {});
  throw error;
} finally {
  await writeFile(path.join(test.output, 'report.json'), JSON.stringify(report, null, 2));
  await test.close();
  console.log(JSON.stringify(report, null, 2));
}
