// Takes review screenshots of the running site in both languages: node scripts/shoot.mjs <outDir> [baseUrl]
// Also reports console errors and horizontal overflow.
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const out = process.argv[2] ?? 'shots';
const base = process.argv[3] ?? 'http://127.0.0.1:8110';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const errors = [];
const viewports = [['desktop', { width: 1440, height: 900 }], ['phone', { width: 390, height: 844 }]];

for (const lang of ['en', 'he']) {
  const q = lang === 'he' ? '?lang=he' : '?';
  const amp = lang === 'he' ? '&' : '';
  for (const [vpName, vp] of viewports) {
    const name = `${lang}-${vpName}`;
    const ctx = await browser.newContext({ viewport: vp, reducedMotion: 'no-preference' });
    const page = await ctx.newPage();
    page.on('console', (m) => m.type() === 'error' && errors.push(`${name}: ${m.text()}`));
    page.on('pageerror', (e) => errors.push(`${name}: ${e.message}`));

    // Intro frames on the first visit of the session.
    await page.goto(`${base}/${q}`);
    for (const ms of [700, 1500, 2600]) {
      await page.waitForTimeout(ms === 700 ? 700 : ms === 1500 ? 800 : 1100);
      if (vpName === 'desktop') await page.screenshot({ path: `${out}/${name}-intro-${ms}.png` });
    }
    await page.waitForTimeout(2200);
    await page.screenshot({ path: `${out}/${name}-hero.png` });
    await page.screenshot({ path: `${out}/${name}-full.png`, fullPage: true });

    for (const id of ['devmarshal', 'slotkeeper', 'planwright', 'signalpost']) {
      await page.goto(`${base}/${q}${amp}p=${id}`);
      await page.waitForTimeout(id === 'devmarshal' ? 4500 : 1000);
      if (id === 'slotkeeper') {
        await page.locator('.cv-sk .btn--fill').click();
        await page.waitForTimeout(3200);
      }
      await page.locator('#work').screenshot({ path: `${out}/${name}-${id}.png` });
    }
    await page.goto(`${base}/${q}${amp}p=slotkeeper&l=hood`);
    await page.locator('.reveal').click();
    await page.waitForTimeout(600);
    await page.locator('#stage').screenshot({ path: `${out}/${name}-hood.png` });

    await page.goto(`${base}/${q}${amp}view=overview`);
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${out}/${name}-overview.png`, fullPage: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) errors.push(`${name}: horizontal overflow ${overflow}px on overview`);

    await page.goto(`${base}/${q}`);
    await page.waitForTimeout(400);
    await page.locator('#education').scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    await page.locator('#education').screenshot({ path: `${out}/${name}-education.png` });
    const overflow2 = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow2 > 0) errors.push(`${name}: horizontal overflow ${overflow2}px on studio`);
    await ctx.close();
  }
}
await browser.close();
console.log(errors.length ? errors.join('\n') : 'no console errors, no horizontal overflow');
