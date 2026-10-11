// Takes review screenshots of the running site: node scripts/shoot.mjs <outDir> [baseUrl]
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const out = process.argv[2] ?? 'shots';
const base = process.argv[3] ?? 'http://127.0.0.1:8110';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const errors = [];
for (const [name, vp] of [['desktop', { width: 1440, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
  const ctx = await browser.newContext({ viewport: vp, reducedMotion: 'no-preference' });
  const page = await ctx.newPage();
  page.on('console', (m) => m.type() === 'error' && errors.push(`${name}: ${m.text()}`));
  page.on('pageerror', (e) => errors.push(`${name}: ${e.message}`));
  await page.goto(base);
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${out}/${name}-hero.png` });
  await page.screenshot({ path: `${out}/${name}-full.png`, fullPage: true });
  for (const id of ['devmarshal', 'slotkeeper', 'planwright', 'signalpost']) {
    await page.goto(`${base}/?p=${id}`);
    await page.waitForTimeout(id === 'devmarshal' ? 4000 : 800);
    if (id === 'slotkeeper') {
      await page.getByRole('button', { name: /Fire 30/ }).click();
      await page.waitForTimeout(3200);
    }
    await page.locator('#work').screenshot({ path: `${out}/${name}-${id}.png` });
  }
  await page.goto(`${base}/?p=slotkeeper&l=hood`);
  await page.getByRole('button', { name: /Reveal the system/ }).click();
  await page.waitForTimeout(500);
  await page.locator('#stage').screenshot({ path: `${out}/${name}-hood.png` });
  await page.goto(`${base}/?view=overview`);
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${out}/${name}-overview.png`, fullPage: true });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 0) errors.push(`${name}: horizontal overflow ${overflow}px on overview`);
  await page.goto(base);
  const overflow2 = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow2 > 0) errors.push(`${name}: horizontal overflow ${overflow2}px on studio`);
  await ctx.close();
}
await browser.close();
console.log(errors.length ? errors.join('\n') : 'no console errors, no horizontal overflow');
