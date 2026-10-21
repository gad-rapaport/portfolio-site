import type { SVGProps } from 'react';

// One line style for every icon: 24 px grid, 2 px square-capped strokes, no fills except the mark.

type P = SVGProps<SVGSVGElement>;
const base = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'square' as const, 'aria-hidden': true };

// The GR mark: G and R in paper, the R's leg in lime. Traced from the logo artwork, 741 × 408 units.
export const GR_VIEWBOX = '0 0 741 408';
export const GR_PAPER = 'M120 0H372L282 90H127A36 36 0 0 0 91 126V283A36 36 0 0 0 127 319H261V250H153V163H357V408H120A120 120 0 0 1 0 288V120A120 120 0 0 1 120 0ZM401 0H577A125 125 0 0 1 577 250H484L397 163H575A36.5 36.5 0 0 0 575 90H311ZM392 186L489 283V408H392Z';
export const GR_LEG = 'M502 271H614L741 408H629Z';

export const GrMark = (p: P) => (
  <svg viewBox={GR_VIEWBOX} aria-hidden="true" {...p}>
    <path fill="var(--paper)" d={GR_PAPER} />
    <path fill="var(--lime)" d={GR_LEG} />
  </svg>
);

export const IconGitHub = (p: P) => (
  <svg {...base} {...p}>
    <path d="M9 19c-4 1.5-4-2-6-2.5M15 21v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.3 4.3 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const IconLinkedIn = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 4h16v16H4zM8 11v5M8 8v.01M12 16v-5M16 16v-3a2 2 0 0 0-4 0" />
  </svg>
);
export const IconMail = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 5h18v14H3zM3 6l9 7 9-7" />
  </svg>
);
export const IconArrow = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 12h13M13 6l6 6-6 6" />
  </svg>
);
export const IconDown = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 4v15M6 13l6 6 6-6" />
  </svg>
);
export const IconPlay = (p: P) => (
  <svg {...base} {...p}>
    <path d="M7 4l12 8-12 8z" />
  </svg>
);
export const IconPause = (p: P) => (
  <svg {...base} {...p}>
    <path d="M7 5v14M17 5v14" />
  </svg>
);
export const IconReset = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 4v6h6M4.6 15a8 8 0 1 0 1.9-8.4L4 10" />
  </svg>
);
export const IconStep = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 5l9 7-9 7zM18 5v14" />
  </svg>
);
export const IconCopy = (p: P) => (
  <svg {...base} {...p}>
    <path d="M8 8h12v12H8zM16 8V4H4v12h4" />
  </svg>
);
export const IconDoc = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h7" />
  </svg>
);
export const IconLayers = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5" />
  </svg>
);
export const IconClose = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 5l14 14M19 5L5 19" />
  </svg>
);
