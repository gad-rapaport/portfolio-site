import { Fragment, useEffect, useRef, useState, type CSSProperties } from 'react';
import { asset } from '../data/asset';
import { hasCv, profile } from '../data/profile';
import { useLang, useProjects, useT } from '../i18n';
import { copyText, useToast } from '../lib/copy';
import { useReducedMotion } from '../lib/motion';
import { useMedia } from './MediaDialog';
import { IconArrow, IconCopy, IconDoc, IconDown, IconFacebook, IconGitHub, IconInstagram, IconLinkedIn, IconMail } from './Icons';

const icon: CSSProperties = { width: 20, verticalAlign: -4, marginInlineEnd: 8 };

export function Hero({ onOverview, onProject, ready }: { onOverview: () => void; onProject: (id: string) => void; ready: boolean }) {
  const delay = 80;
  const t = useT();
  const { all } = useProjects();
  const reduced = useReducedMotion();
  const collage = useRef<HTMLDivElement>(null);
  const [sk, pw, sp] = ['slotkeeper', 'planwright', 'signalpost'].map((id) => all.find((p) => p.id === id)!);
  const publicRepos = all.filter((p) => p.repo).length;

  // The windows lean toward the pointer, each at its own depth. Fine pointers only, never with reduced motion.
  useEffect(() => {
    const el = collage.current;
    if (!el || reduced || !window.matchMedia('(pointer: fine)').matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--mx', ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
        el.style.setProperty('--my', ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3));
      });
    };
    window.addEventListener('pointermove', onMove);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  let w = 0;
  const words = (line: string, cls?: string) =>
    line.split(' ').map((word, i) => (
      <Fragment key={`${word}-${i}`}>
        <span className="w">
          <span className={cls} style={{ ['--d' as string]: `${delay + w++ * 70}ms` }}>
            {word}
          </span>
        </span>{' '}
      </Fragment>
    ));

  return (
    <section className="hero" aria-labelledby="hero-title" data-wait={ready ? undefined : ''}>
      <div className="hero__glow" aria-hidden="true" />
      <div className="wrap hero__grid">
        <div>
          <p className="eyebrow rise" style={{ ['--d' as string]: `${delay}ms` }}>
            {t.name} — {t.role} · {t.cert}
          </p>
          <h1 id="hero-title" className="kinetic">
            {words(t.hero.h1[0])}
            {words(t.hero.h1[1])}
            {words(t.hero.h1[2], 'hot')}
            {words(t.hero.h1[3])}
          </h1>
          <p className="hero__lead rise" style={{ ['--d' as string]: `${delay + 650}ms` }}>
            {t.hero.lead}
          </p>
          <div className="hero__ctas rise" style={{ ['--d' as string]: `${delay + 800}ms` }}>
            <a className="btn btn--red" href="#work">
              {t.hero.explore} <IconDown />
            </a>
            <a
              className="btn"
              href="?view=overview"
              onClick={(e) => {
                e.preventDefault();
                onOverview();
              }}
            >
              {t.hero.overview} <IconArrow className="flip" />
            </a>
            <a className="btn" href="#contact">
              {t.hero.contact}
            </a>
          </div>
          <ul className="hero__facts rise" style={{ ['--d' as string]: `${delay + 950}ms` }}>
            <li><b>{all.length}</b> {t.hero.facts[0]}</li>
            <li><b>{publicRepos}</b> {t.hero.facts[1]}</li>
            <li><b>3</b> {t.hero.facts[2]}</li>
            <li><b>1</b> {t.hero.facts[3]}</li>
          </ul>
        </div>

        <div className="collage" ref={collage} aria-label={t.hero.windows} dir="ltr" style={{ ['--d' as string]: `${delay + 200}ms` }}>
          <div className="collage__slab" />
          <a className="win" style={{ ['--z' as string]: 1 }} href="?p=slotkeeper" onClick={(e) => { e.preventDefault(); onProject('slotkeeper'); }}>
            <div className="win__bar"><i /><i /><span>slotkeeper — 409</span></div>
            <img src={sk.poster!} alt={t.hero.skAlt} width={1920} height={1080} />
          </a>
          <a className="win win--log" style={{ ['--z' as string]: 2.2 }} href="?p=devmarshal" onClick={(e) => { e.preventDefault(); onProject('devmarshal'); }}>
            <div className="win__bar"><i /><i /><span>devmarshal — mission log</span></div>
            <ul className="minilog" aria-label={t.hero.logAria}>
              <li style={{ ['--i' as string]: 0 }}><span className="dim">20:55:59</span> <span className="bad">TEST_FAILED</span> CSV-001: 1 failed</li>
              <li style={{ ['--i' as string]: 1 }}><span className="dim">20:57:12</span> <span className="ok">TEST_PASSED</span> CSV-001: 15 passed</li>
              <li style={{ ['--i' as string]: 2 }}><span className="dim">20:57:36</span> <span className="ok">REVIEW_APPROVED</span> Codex</li>
              <li style={{ ['--i' as string]: 3 }}><span className="dim">20:58:03</span> <span className="bad">AGENT_UNAVAILABLE</span> quota</li>
              <li style={{ ['--i' as string]: 4 }}><span className="dim">07:32:58</span> MISSION_RUNNING resumed</li>
              <li style={{ ['--i' as string]: 5 }}><span className="dim">07:35:54</span> <span className="ok">MISSION_COMPLETED</span></li>
            </ul>
          </a>
          <a className="win" style={{ ['--z' as string]: 1.6 }} href="?p=planwright" onClick={(e) => { e.preventDefault(); onProject('planwright'); }}>
            <div className="win__bar"><i /><i /><span>planwright — compare</span></div>
            <img src={pw.poster!} alt={t.hero.pwAlt} width={1920} height={1080} />
          </a>
          <span className="visually-hidden">{t.hero.alsoIn}: {sp.name}, {sp.tagline}</span>
        </div>
      </div>
    </section>
  );
}

// Two crossing bands of real numbers from the projects. Decorative: the same facts are on the page as text.
export function Marquee() {
  const t = useT();
  const items = [...t.marquee, ...t.marquee];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__band marquee__band--ghost">
        <div className="marquee__track marquee__track--rev">
          {items.map((m, i) => (
            <span key={i}>{m}</span>
          ))}
        </div>
      </div>
      <div className="marquee__band">
        <div className="marquee__track">
          {items.map((m, i) => (
            <span key={i}>{m}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// The 15-second showreel (source in showreel/). Plays muted while on screen; never autoplays with reduced motion.
export function Showreel() {
  const t = useT();
  const reduced = useReducedMotion();
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = video.current;
    if (!v || reduced) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.35 });
    io.observe(v);
    return () => io.disconnect();
  }, [reduced]);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };
  const toggleSound = () => {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted && v.paused) v.play().catch(() => {});
  };

  return (
    <section className="section reel" id="showreel" aria-labelledby="reel-title">
      <div className="wrap">
        <div className="section__head">
          <div>
            <p className="eyebrow">{t.showreel.eyebrow}</p>
            <h2 id="reel-title" className="scroll-rise">{t.showreel.title}</h2>
          </div>
          <p>{t.showreel.intro}</p>
        </div>
        <figure className="reel__frame">
          <video
            ref={video}
            src={asset('media/showreel/showreel.mp4')}
            poster={asset('media/showreel/poster.jpg')}
            width={1920}
            height={1080}
            loop
            muted
            playsInline
            preload="metadata"
            aria-label={t.showreel.label}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onClick={toggle}
          />
          <figcaption className="reel__controls">
            <button type="button" className="btn btn--small" onClick={toggle} aria-pressed={playing}>
              {playing ? t.showreel.pause : t.showreel.play}
            </button>
            <button type="button" className="btn btn--small" onClick={toggleSound} aria-pressed={!muted}>
              {muted ? t.showreel.sound : t.showreel.mute}
            </button>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

export function Process() {
  const t = useT();
  return (
    <section className="section process" id="process" aria-labelledby="process-title">
      <div className="wrap">
        <div className="section__head">
          <div>
            <p className="eyebrow">{t.process.eyebrow}</p>
            <h2 id="process-title" className="scroll-rise">
              {t.process.title[0]}
              <br />
              {t.process.title[1]}
            </h2>
          </div>
          <p>{t.process.intro}</p>
        </div>

        <ol className="steps">
          {t.process.steps.map(([title, text], i) => (
            <li key={title} style={{ ['--i' as string]: i }}>
              <b>0{i + 1}</b>
              <strong>{title}</strong>
              <span>{text}</span>
            </li>
          ))}
        </ol>

        <div className="rules">
          <div>
            <h3>{t.process.rulesTitle}</h3>
            <ol>
              {t.process.rules.map(([b, s]) => (
                <li key={b}><b>{b}</b><span>{s}</span></li>
              ))}
            </ol>
          </div>
          <div>
            <h3>{t.process.commonTitle}</h3>
            <ul>
              {t.process.common.map(([b, s]) => (
                <li key={b}><b>{b}</b><span>{s}</span></li>
              ))}
            </ul>
          </div>
        </div>

        <p className="honest">
          <strong>{t.process.honestLead}</strong> {t.process.honest}
        </p>
      </div>
    </section>
  );
}

export function Credentials() {
  const t = useT();
  const open = useMedia();
  const d = profile.diploma;
  const showDiploma = () => open({ kind: 'image', src: d.src, alt: t.creds.certAlt, w: d.w, h: d.h, title: t.creds.certTitle, note: t.creds.redacted });
  return (
    <section className="section creds" id="education" aria-labelledby="creds-title">
      <div className="wrap creds__grid">
        <div>
          <p className="eyebrow">{t.creds.eyebrow}</p>
          <h2 id="creds-title" className="scroll-rise">
            {t.creds.title[0]}
            <br />
            <span className="hot">{t.creds.title[1]}</span>
          </h2>
          <div className="creds__card">
            <p className="creds__degree">{t.creds.degree}</p>
            <p className="creds__track">{t.creds.track}</p>
            <p>{t.creds.school}</p>
            <p>{t.creds.detail}</p>
            <dl className="creds__meta">
              <div><dt>{t.creds.eligible}</dt><dd>{t.creds.eligibleDate}</dd></div>
              <div><dt>MAHAT · ORT</dt><dd>{t.creds.issued}</dd></div>
            </dl>
            <div className="card__actions">
              <button type="button" className="btn btn--small btn--red" onClick={showDiploma}>{t.creds.view}</button>
              <a className="btn btn--small" href={profile.cv.en} target="_blank" rel="noreferrer" hrefLang="en"><IconDoc /> {t.creds.cvEn}</a>
              <a className="btn btn--small" href={profile.cv.he} target="_blank" rel="noreferrer" hrefLang="he"><IconDoc /> {t.creds.cvHe}</a>
            </div>
            <p className="creds__work">{t.creds.work}</p>
          </div>
        </div>
        <button type="button" className="diploma" onClick={showDiploma} aria-label={t.creds.view}>
          <img src={d.thumb} alt={t.creds.certAlt} width={480} height={679} loading="lazy" />
          <span className="diploma__stamp" aria-hidden="true">DEVOPS</span>
        </button>
      </div>
    </section>
  );
}

export function Contact() {
  const t = useT();
  const lang = useLang();
  const { all } = useProjects();
  const toast = useToast();
  async function copy() {
    toast((await copyText(profile.email)) ? t.contact.copied : t.contact.copyFailed(profile.email));
  }
  const other = lang === 'he' ? 'en' : 'he';
  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="wrap contact__grid">
        <h2 id="contact-title">{t.contact.title}</h2>
        <div className="contact__links">
          <div className="contact__row">
            <a href={`mailto:${profile.email}`} dir="ltr"><IconMail style={icon} />{profile.email}</a>
            <button type="button" className="btn btn--small" onClick={copy}>
              <IconCopy /> {t.contact.copy}
            </button>
          </div>
          <div className="contact__row">
            <a href={profile.github} target="_blank" rel="noreferrer" dir="ltr"><IconGitHub style={icon} />github.com/gr-buildstudio</a>
            <span className="mono">{t.contact.repos(all.filter((p) => p.repo).length)}</span>
          </div>
          <div className="contact__row">
            <a href={profile.linkedin} target="_blank" rel="noreferrer"><IconLinkedIn style={icon} />LinkedIn</a>
          </div>
          <div className="contact__row">
            <a href={profile.instagram} target="_blank" rel="noreferrer" dir="ltr"><IconInstagram style={icon} />@gr.buildstudio</a>
            <span className="mono">Instagram</span>
          </div>
          <div className="contact__row">
            <a href={profile.facebook} target="_blank" rel="noreferrer"><IconFacebook style={icon} />Facebook</a>
          </div>
          <div className="contact__row">
            {hasCv ? (
              <>
                <a href={profile.cv[lang]} target="_blank" rel="noreferrer"><IconDoc style={icon} />{t.contact.cv}</a>
                <a className="mono" href={profile.cv[other]} target="_blank" rel="noreferrer" hrefLang={other}>{t.contact.cvOther}</a>
              </>
            ) : (
              <a href={`mailto:${profile.email}?subject=${encodeURIComponent('CV request')}`}><IconDoc style={icon} />{t.contact.requestCv}</a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
