import { useEffect, useState } from 'react';
import { profile } from '../data/profile';
import { GR_PATH, GrMark, IconGitHub, IconLinkedIn } from './Icons';
import { useReducedMotion } from '../lib/motion';

export function TopBar({ onPalette, onOverview, onStudio, view }: { onPalette: () => void; onOverview: () => void; onStudio: () => void; view: 'studio' | 'overview' }) {
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
          <span>{profile.name}</span>
        </a>
        <nav aria-label="Main">
          {view === 'studio' ? (
            <>
              <a href="#work">Work</a>
              <a href="#process">How I build</a>
            </>
          ) : (
            <a
              href="./"
              onClick={(e) => {
                e.preventDefault();
                onStudio();
              }}
            >
              Studio
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
            Quick overview
          </a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="topbar__tools">
          <button type="button" className="kbd-btn" onClick={onPalette} aria-label="Open the command palette">
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

// The GR mark comes apart into three layers (interface, service, data) and settles back. It plays once per
// session, can be skipped, and never runs with reduced motion. Content is already rendered underneath it.
export function Intro() {
  const reduced = useReducedMotion();
  const [show, setShow] = useState(() => {
    try {
      return !sessionStorage.getItem(SEEN) && !new URLSearchParams(location.search).has('p');
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!show) return;
    try {
      sessionStorage.setItem(SEEN, '1');
    } catch {
      /* storage blocked: the intro just plays again next time */
    }
    const t = window.setTimeout(() => setShow(false), 1350);
    const skip = (e: KeyboardEvent) => e.key === 'Escape' && setShow(false);
    window.addEventListener('keydown', skip);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('keydown', skip);
    };
  }, [show]);

  if (!show || reduced) return null;
  return (
    <div className="intro" aria-hidden="true" onClick={() => setShow(false)}>
      <div className="intro__mark">
        {[0, 1, 2].map((i) => (
          <div className="intro__slice" key={i}>
            <svg viewBox="0 0 23 14">
              <path fillRule="evenodd" d={GR_PATH} />
            </svg>
          </div>
        ))}
        <div className="intro__labels">
          <span>interface</span>
          <span>service</span>
          <span>data</span>
        </div>
      </div>
      <button type="button" className="btn btn--small intro__skip" tabIndex={-1} onClick={() => setShow(false)}>
        Skip
      </button>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <span>© 2026 {profile.name}</span>
        <span>Built with React, TypeScript and Vite · fonts Space Grotesk and JetBrains Mono (OFL)</span>
      </div>
    </footer>
  );
}
