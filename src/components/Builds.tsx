import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useProjects, useT } from '../i18n';
import { useReducedMotion } from '../lib/motion';
import { useMedia } from './MediaDialog';
import { IconArrow, IconGitHub, IconPlay } from './Icons';

// All six projects on one horizontal track. The section is as tall as the track is wide: while it is on
// screen its inner frame stays pinned and the page's own vertical scroll moves the track sideways, so wheel,
// touch, keyboard and scrollbar all keep working. Focusing a card scrolls the page to it. With reduced motion
// the same cards are a plain vertical grid.

export function Builds({ onProject }: { onProject: (id: string) => void }) {
  const t = useT();
  const { all } = useProjects();
  const open = useMedia();
  const reduced = useReducedMotion();
  const rtl = t.dir === 'rtl';
  const section = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [distance, setDistance] = useState(0);
  const [index, setIndex] = useState(1);
  const pinned = !reduced;

  // How far the track has to travel: its width minus the visible width.
  useLayoutEffect(() => {
    if (!pinned) return;
    const measure = () => {
      if (!track.current || !frame.current) return;
      setDistance(Math.max(0, track.current.scrollWidth - frame.current.clientWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track.current!);
    ro.observe(frame.current!);
    return () => ro.disconnect();
  }, [pinned, all]);

  useEffect(() => {
    if (!pinned) return;
    let raf = 0;
    const update = () => {
      const el = section.current;
      if (!el || !track.current) return;
      const p = distance ? Math.min(1, Math.max(0, -el.getBoundingClientRect().top / distance)) : 0;
      track.current.style.transform = `translate3d(${(rtl ? 1 : -1) * p * distance}px, 0, 0)`;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      setIndex(Math.min(all.length, 1 + Math.round(p * (all.length - 1))));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pinned, distance, rtl, all.length]);

  // Keyboard users: tabbing into a card that is off to the side scrolls the page until it is in view.
  function onFocus(e: React.FocusEvent) {
    if (!pinned || !section.current || !track.current || !frame.current) return;
    const card = (e.target as HTMLElement).closest<HTMLElement>('.bcard');
    if (!card) return;
    frame.current.scrollLeft = 0; // focus may have scrolled the clipped frame; the track moves instead
    const fromStart = rtl ? track.current.scrollWidth - card.offsetLeft - card.offsetWidth : card.offsetLeft;
    const x = Math.min(distance, Math.max(0, fromStart - (frame.current.clientWidth - card.offsetWidth) / 2));
    const top = section.current.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + x, behavior: 'instant' as ScrollBehavior });
  }

  return (
    <section
      ref={section}
      className={`builds${pinned ? ' builds--pinned' : ''}`}
      id="more"
      aria-labelledby="more-title"
      style={pinned ? { height: `calc(100svh - var(--bar) + ${distance}px)` } : undefined}
    >
      <div className="builds__frame" ref={frame}>
        <div className="wrap builds__head">
          <div>
            <p className="eyebrow">{t.shelf.eyebrow}</p>
            <h2 id="more-title">{t.shelf.title}</h2>
          </div>
          <p className="builds__intro">{t.shelf.intro}</p>
        </div>

        <ul className="builds__track" ref={track} aria-label={t.shelf.listAria} onFocus={onFocus}>
          {all.map((p, i) => (
            <li className="bcard" key={p.id} aria-labelledby={`bcard-${p.id}`}>
              <div className="bcard__media">
                {p.preview ? (
                  <img src={p.preview} alt={t.shelf.previewAlt(p.name)} width={960} height={540} loading="lazy" />
                ) : (
                  <ul className="minilog bcard__log" dir="ltr" aria-hidden="true">
                    <li><span className="dim">20:53:51</span> AGENT_STARTED Codex planner</li>
                    <li><span className="dim">20:55:59</span> <span className="bad">TEST_FAILED</span> CSV-001: 1 failed</li>
                    <li><span className="dim">20:57:12</span> <span className="ok">TEST_PASSED</span> CSV-001: 15 passed</li>
                    <li><span className="dim">20:58:03</span> <span className="bad">AGENT_UNAVAILABLE</span> quota</li>
                    <li><span className="dim">07:32:58</span> MISSION_RUNNING resumed</li>
                    <li><span className="dim">07:35:54</span> <span className="ok">MISSION_COMPLETED</span></li>
                  </ul>
                )}
                <span className="bcard__num">0{i + 1}</span>
              </div>
              <div className="bcard__body">
                <p className="eyebrow">{p.specialty}</p>
                <h3 id={`bcard-${p.id}`}>{p.name}</h3>
                <p className="bcard__tag">{p.tagline}</p>
                <p className="bcard__hard"><strong>{t.shelf.hard}</strong> {p.moment}</p>
                <div className="bcard__proof">
                  <b>{p.evidence[0].value}</b>
                  <span>{p.evidence[0].label}</span>
                </div>
                <div className="bcard__actions">
                  {p.tier === 'stage' && (
                    <a
                      className="btn btn--small btn--lime"
                      href={`?p=${p.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onProject(p.id);
                      }}
                    >
                      {t.shelf.caseStudy} <IconArrow className="flip" />
                    </a>
                  )}
                  {p.film && (
                    <button type="button" className="btn btn--small btn--red" onClick={() => open({ kind: 'film', src: p.film!, poster: p.poster!, title: t.media.filmTitle(p.name), repo: p.repo })}>
                      <IconPlay className="flip" /> {t.shelf.film}
                    </button>
                  )}
                  {p.repo ? (
                    <a className="btn btn--small" href={p.repo} target="_blank" rel="noreferrer">
                      <IconGitHub /> {t.shelf.code}
                    </a>
                  ) : (
                    <span className="bcard__private">{t.shelf.privateRepo}</span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>

        {pinned && (
          <div className="wrap builds__meter" aria-hidden="true">
            <span className="builds__count">{t.shelf.counter(index, all.length)}</span>
            <span className="builds__bar">
              <span ref={bar} />
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
