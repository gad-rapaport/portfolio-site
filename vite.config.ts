import { existsSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The CV button turns into a download as soon as the file exists; until then it asks by email.
const hasCv = existsSync(new URL('./public/gadi-rapaport-cv.pdf', import.meta.url));

// GitHub Pages serves the site under /portfolio-site/; the workflow sets BASE_PATH. Locally it is /.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  define: { __HAS_CV__: JSON.stringify(hasCv) },
  server: { host: '127.0.0.1', port: 8110 },
  preview: { host: '127.0.0.1', port: 8110 },
});
