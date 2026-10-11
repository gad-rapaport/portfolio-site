// Accessibility smoke check with axe on the main views: node scripts/axe.mjs [baseUrl]
import { chromium } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

const base = process.argv[2] ?? 'http://127.0.0.1:8110';
const browser = await chromium.launch();
const ctx = await browser.newContext({ reducedMotion: 'reduce' });
const page = await ctx.newPage();
let failed = 0;
for (const path of ['/', '/?p=slotkeeper&l=hood', '/?p=planwright&l=build', '/?p=signalpost', '/?view=overview']) {
  await page.goto(base + path);
  await page.waitForTimeout(400);
  const { violations } = await new AxeBuilder({ page }).analyze();
  for (const v of violations) {
    failed++;
    console.log(`${path}  ${v.impact}  ${v.id}: ${v.help}`);
    for (const n of v.nodes.slice(0, 3)) console.log(`    ${n.target.join(' ')}`);
  }
}
await browser.close();
console.log(failed ? `${failed} violation types` : 'axe: no violations');
process.exit(failed ? 1 : 0);
