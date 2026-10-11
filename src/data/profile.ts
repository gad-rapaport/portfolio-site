export const profile = {
  name: 'Gadi Rapaport',
  role: 'Software developer',
  email: 'dshrppury@gmail.com',
  github: 'https://github.com/gad-rapaport',
  linkedin: 'https://www.linkedin.com/in/gad-rapaport-a12988345',
  cvPath: '/gadi-rapaport-cv.pdf',
} as const;

declare global {
  const __HAS_CV__: boolean;
}

export const hasCv = __HAS_CV__;
