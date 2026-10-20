// Renders showreel/index.html.
//   node showreel/render.mjs beats <outDir>        one frame per beat + a contact sheet, for review
//   node showreel/render.mjs still <outDir> <t>    one frame at time t
//   node showreel/render.mjs full <workDir> <out>  60 fps with 3 blended subframes per frame, plus the soundtrack
import { chromium } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { extname, join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const [mode = 'beats', dir = 'showreel-out', arg] = process.argv.slice(2);
const FPS = 60, SUB = 3, DUR = 15, WORKERS = 4;
const types = { '.html': 'text/html', '.woff2': 'font/woff2', '.js': 'text/javascript' };

const server = createServer(async (req, res) => {
  try {
    const body = await readFile(join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname)));
    res.writeHead(200, { 'content-type': types[extname(req.url)] ?? 'application/octet-stream' }).end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/showreel/index.html`;
const browser = await chromium.launch();

async function openPage() {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.error('page error:', e.message));
  await page.goto(url);
  await page.evaluate(() => window.ready);
  return page;
}
async function shot(page, t, path) {
  await page.evaluate((t) => window.seek(t), t);
  await page.screenshot({ path, type: 'png' });
}

await mkdir(dir, { recursive: true });
if (mode === 'beats') {
  const page = await openPage();
  for (let b = 0; b < 30; b++) await shot(page, b * 0.5 + 0.25, join(dir, `beat${String(b + 1).padStart(2, '0')}.png`));
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', join(dir, 'beat%02d.png'), '-vf', 'scale=480:-1,tile=6x5:padding=6:color=0x333333', '-frames:v', '1', join(dir, 'sheet.png')]);
} else if (mode === 'still') {
  const page = await openPage();
  await shot(page, Number(arg), join(dir, `t${arg}.png`));
} else if (mode === 'full') {
  const out = resolve(arg ?? 'showreel.mp4');
  const frames = join(dir, 'sub');
  await mkdir(frames, { recursive: true });
  const total = DUR * FPS * SUB;
  let next = 0, done = 0;
  const started = Date.now();
  await Promise.all(
    Array.from({ length: WORKERS }, async () => {
      const page = await openPage();
      for (;;) {
        const n = next++;
        if (n >= total) break;
        // Subframes 0..2 of frame k sit at k/60, k/60 + 1/180, k/60 + 2/180.
        await shot(page, n / (FPS * SUB), join(frames, `${String(n).padStart(5, '0')}.png`));
        if (++done % 300 === 0) console.log(`${done}/${total} subframes, ${((Date.now() - started) / 1000).toFixed(0)} s`);
      }
    }),
  );
  const page = await openPage();
  const wav = Buffer.from(await page.evaluate(() => window.renderAudio()), 'base64');
  const wavPath = join(dir, 'soundtrack.wav');
  await writeFile(wavPath, wav);
  execFileSync('ffmpeg', [
    '-y', '-loglevel', 'error',
    '-framerate', String(FPS * SUB), '-i', join(frames, '%05d.png'),
    '-i', wavPath,
    '-vf', `tmix=frames=${SUB},select='eq(mod(n\\,${SUB})\\,${SUB - 1})',setpts=N/${FPS}/TB`,
    '-r', String(FPS), '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '192k', '-t', String(DUR), '-movflags', '+faststart', out,
  ], { stdio: 'inherit' });
  console.log('wrote', out);
}
await browser.close();
server.close();
