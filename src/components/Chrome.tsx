import { useEffect, useState } from 'react';
import { profile } from '../data/profile';
import { asset } from '../data/asset';
import { useT } from '../i18n';
import { GR_LEG, GR_PAPER, GR_VIEWBOX, GrMark, IconGitHub, IconLinkedIn } from './Icons';
import { useReducedMotion } from '../lib/motion';

interface TopBarProps {
  view: 'studio' | 'overview';
  langHref: string;
  onPalette: () => void;
  onOverview: () => void;
  onStudio: () => void;
  onLang: () => void;
}

export function TopBar({ onPalette, onOverview, onStudio, onLang, langHref, view }: TopBarProps) {
  const t = useT();
  const mac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
  return (
    <header className="topbar">
      <div className="wrap topbar__inner">
        <a
          className="brand"
          href="./"
          onClick={(e) => {
            e.preventDefault();
            onStudio();
            window.scrollTo({ top: 0 });
          }}
        >
          <GrMark />
          <span>{t.name}</span>
        </a>
        <nav aria-label={t.nav.aria}>
          {view === 'studio' ? (
            <>
              <a href="#work">{t.nav.work}</a>
              <a href="#process">{t.nav.process}</a>
            </>
          ) : (
            <a
              href="./"
              onClick={(e) => {
                e.preventDefault();
                onStudio();
              }}
            >
              {t.nav.studio}
            </a>
          )}
          <a
            href="?view=overview"
            aria-current={view === 'overview' ? 'page' : undefined}
            onClick={(e) => {
              e.preventDefault();
              onOverview();
            }}
          >
            {t.nav.overview}
          </a>
          <a href="#contact">{t.nav.contact}</a>
        </nav>
        <div className="topbar__tools">
          <a
            className="lang-btn"
            href={langHref}
            hrefLang={t.dir === 'rtl' ? 'en' : 'he'}
            aria-label={t.switchLabel}
            onClick={(e) => {
              e.preventDefault();
              onLang();
            }}
          >
            {t.switchTo}
          </a>
          <button type="button" className="kbd-btn" onClick={onPalette} aria-label={t.nav.palette}>
            {mac ? '⌘' : 'Ctrl'} K
          </button>
          <a className="icon-btn" href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub">
            <IconGitHub />
          </a>
          <a className="icon-btn" href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <IconLinkedIn />
          </a>
        </div>
      </div>
    </header>
  );
}

const SEEN = 'gr-intro-seen';
export const INTRO_MS = 3000;

// The GR mark comes apart into three labelled layers (interface, service, data), holds long enough to read,
// settles back and wipes away. Once per session, skippable by click, Escape or the button, and never with
// reduced motion. The page is already rendered underneath it.
export function useIntro() {
  const reduced = useReducedMotion();
  const [show] = useState(() => {
    try {
      return !sessionStorage.getItem(SEEN) && !new URLSearchParams(location.search).has('p');
    } catch {
      return false;
    }
  });
  return show && !reduced;
}

export function Intro({ onReveal, onDone }: { onReveal: () => void; onDone: () => void }) {
  const t = useT();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.setItem(SEEN, '1');
    } catch {
      /* storage blocked: the intro just plays again next time */
    }
    const reveal = window.setTimeout(onReveal, INTRO_MS - 650);
    const timer = window.setTimeout(onDone, INTRO_MS);
    const skip = (e: KeyboardEvent) => e.key === 'Escape' && setLeaving(true);
    window.addEventListener('keydown', skip);
    return () => {
      window.clearTimeout(reveal);
      window.clearTimeout(timer);
      window.removeEventListener('keydown', skip);
    };
  }, [onReveal, onDone]);

  useEffect(() => {
    if (!leaving) return;
    onReveal();
    const timer = window.setTimeout(onDone, 450);
    return () => window.clearTimeout(timer);
  }, [leaving, onReveal, onDone]);

  return (
    <div className={`intro${leaving ? ' intro--leaving' : ''}`} aria-hidden="true" onClick={() => setLeaving(true)}>
      <div className="intro__curtain" />
      <div className="intro__stage">
        <div className="intro__mark" dir="ltr">
          {[0, 1, 2].map((i) => (
            <div className="intro__slice" key={i}>
              <svg viewBox={GR_VIEWBOX}>
                <path d={GR_PAPER} />
                <path className="intro__leg" d={GR_LEG} />
              </svg>
            </div>
          ))}
          <div className="intro__labels">
            {t.intro.layers.map((l, i) => (
              <span key={l} style={{ ['--i' as string]: i }}>
                <b>0{i + 1}</b> {l}
              </span>
            ))}
          </div>
        </div>
        <p className="intro__name">{t.name}</p>
        <p className="intro__line">{t.intro.line}</p>
      </div>
      <button type="button" className="btn btn--small intro__skip" tabIndex={-1} onClick={() => setLeaving(true)}>
        {t.intro.skip}
      </button>
    </div>
  );
}

export function Footer() {
  const t = useT();
  return (
    <footer className="footer">
      <div className="footer__banner" aria-hidden="true">
        <img
          src={asset('media/banner.webp')}
          srcSet={`${asset('media/banner-1200.webp')} 1200w, ${asset('media/banner.webp')} 2056w`}
          sizes="100vw"
          alt=""
          width={2056}
          height={765}
          loading="lazy"
        />
      </div>
      <div className="wrap">
        <span>© 2026 {t.name}</span>
        <span>{t.footer.built}</span>
      </div>
    </footer>
  );
}
