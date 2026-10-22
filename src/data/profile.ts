import { asset } from './asset';

export const profile = {
  email: 'dshrppury@gmail.com',
  github: 'https://github.com/gr-buildstudio',
  linkedin: 'https://www.linkedin.com/in/gad-rapaport-a12988345',
  instagram: 'https://www.instagram.com/gr.buildstudio/',
  facebook: 'https://www.facebook.com/profile.php?id=61582673460726',
  cv: { en: asset('gadi-rapaport-cv.pdf'), he: asset('gadi-rapaport-cv-he.pdf') },
  diploma: { src: asset('media/certificate.webp'), thumb: asset('media/certificate-thumb.webp'), w: 1190, h: 1684 },
} as const;

declare global {
  const __HAS_CV__: boolean;
}

export const hasCv = __HAS_CV__;
