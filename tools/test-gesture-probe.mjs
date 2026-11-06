import { startBrowserTest } from './test-browser.mjs';
import assert from 'node:assert/strict';
const test = await startBrowserTest();
try {
  for (const mode of ['keep-session-playwright', 'keep-session-cdp', 'detach-session-playwright', 'zero-id-playwright']) {
    const context = await test.browser.newContext({viewport:{width:360,height:800},isMobile:true,hasTouch:true});
    const page = await context.newPage();
    await page.goto(test.url);
    await page.locator('.level-card[data-level="4"]').tap();
    await page.evaluate(() => {
      window.events = [];
      ['pointerdown','pointerup','touchend','click'].forEach(type => document.addEventListener(type, e => window.events.push([type, e.target.closest('button')?.dataset.cell, e.target.closest('button')?.dataset.number]), true));
    });
    const bank = await page.locator('[data-number="5"]').boundingBox();
    const grid = await page.locator('[data-cell="2"]').boundingBox();
    const from = {x:bank.x+bank.width/2,y:bank.y+bank.height/2};
    const to = {x:grid.x+grid.width/2,y:grid.y+grid.height/2};
    const session = await context.newCDPSession(page);
    const id = mode === 'zero-id-playwright' ? 0 : 1;
    await session.send('Input.dispatchTouchEvent', {type:'touchStart',touchPoints:[{...from,id}]});
    for(let n=1;n<=8;n++) await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:from.x+(to.x-from.x)*n/8,y:from.y+(to.y-from.y)*n/8,id}]});
    await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    if(mode==='detach-session-playwright') await session.detach();
    await page.waitForFunction(() => document.querySelector('[data-cell="2"] .cell-value')?.textContent === '5');
    if(mode==='keep-session-cdp') {
      const target = await page.locator('[data-cell="3"]').boundingBox();
      const point={x:target.x+target.width/2,y:target.y+target.height/2,id};
      await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point]});
      await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    } else await page.locator('[data-cell="3"]').tap();
    const selected = await page.locator('[data-cell="3"][aria-pressed="true"]').waitFor({timeout:500}).then(()=>true).catch(()=>false);
    assert.equal(selected, true, `${mode}: a tap immediately after a drag selects its destination`);
    await page.locator('[data-action="notes"]').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('[data-action="notes"]').getAttribute('aria-pressed'), 'true', 'Keyboard compatibility click remains available');
    await page.locator('[data-action="notes"]').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('[data-action="notes"]').getAttribute('aria-pressed'), 'false', 'Keyboard activation does not double-toggle');
    console.log(JSON.stringify({mode,selected,events:await page.evaluate(()=>window.events)}));
    await context.close();
  }
} finally { await test.close(); }
