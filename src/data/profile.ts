export const profile = {
  email: 'dshrppury@gmail.com',
  github: 'https://github.com/gad-rapaport',
  linkedin: 'https://www.linkedin.com/in/gad-rapaport-a12988345',
  cv: { en: '/gadi-rapaport-cv.pdf', he: '/gadi-rapaport-cv-he.pdf' },
  diploma: { src: '/media/certificate.webp', thumb: '/media/certificate-thumb.webp', w: 1190, h: 1684 },
} as const;

declare global {
  const __HAS_CV__: boolean;
}

export const hasCv = __HAS_CV__;
