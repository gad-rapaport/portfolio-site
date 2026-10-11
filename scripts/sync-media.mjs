// Copies the real product media (posters, looping previews, films, screenshots) from the project
// repositories into public/media and writes src/data/media.json with each image's size, so the page can
// reserve space for it. Screenshots are converted to WebP. Needs ffmpeg and ffprobe on PATH.
//
//   node scripts/sync-media.mjs [--root C:\dev\portfolio]
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const root = args.includes('--root') ? args[args.indexOf('--root') + 1] : 'C:/dev/portfolio';
const out = join(import.meta.dirname, '..', 'public', 'media');

const screenshots = {
  slotkeeper: ['day', 'week', 'booking-dialog', 'mobile-day'],
  planwright: ['compare', 'plan-branch', 'compare-dark', 'mobile'],
  signalpost: ['status', 'status-outage', 'policy-blocked', 'admin-monitors'],
  fieldline: ['dashboard', 'request-detail', 'requests'],
  airwise: ['overview', 'daily-aqi'],
};

function size(file) {
  const [w, h] = execFileSync('ffprobe', [
    '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', file,
  ]).toString().trim().split(',').map(Number);
  return { w, h };
}

const manifest = {};
for (const [id, shots] of Object.entries(screenshots)) {
  const src = join(root, id);
  const dst = join(out, id);
  mkdirSync(dst, { recursive: true });
  const entry = (manifest[id] = { screenshots: {} });

  copyFileSync(join(src, 'docs', 'media', 'poster.jpg'), join(dst, 'poster.jpg'));
  copyFileSync(join(src, 'docs', 'media', 'preview.webp'), join(dst, 'preview.webp'));
  copyFileSync(join(src, 'animation', 'out', `${id}-film.mp4`), join(dst, 'film.mp4'));
  entry.poster = size(join(dst, 'poster.jpg'));
  const film = join(dst, 'film.mp4');
  entry.film = { ...size(film) };

  for (const shot of shots) {
    const png = join(src, 'docs', 'screenshots', `${shot}.png`);
    if (!existsSync(png)) throw new Error(`missing ${png}`);
    const webp = join(dst, `${shot}.webp`);
    execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', png, '-vf', "scale='min(1600,iw)':-2", '-quality', '82', webp]);
    entry.screenshots[shot] = size(webp);
  }
  console.log(`${id}: poster, preview, film, ${shots.length} screenshots`);
}
writeFileSync(join(import.meta.dirname, '..', 'src', 'data', 'media.json'), JSON.stringify(manifest, null, 2) + '\n');
