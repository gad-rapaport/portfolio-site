import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { hasCv, profile } from './data/profile';
import { useUrlState, urlFor } from './lib/url';
import { copyText, ToastContext } from './lib/copy';
import { LangContext, localize, rememberLang } from './i18n';
import { strings } from './i18n/strings';
import { projects } from './data/projects';
import { MediaProvider, useMedia } from './components/MediaDialog';
import { Footer, Intro, TopBar, useIntro } from './components/Chrome';
import { Contact, Credentials, Hero, Marquee, Process, Showreel } from './components/Sections';
import { Builds } from './components/Builds';
import { Studio } from './components/Studio';
import { Overview } from './components/Overview';
import { CommandPalette, type Command } from './components/CommandPalette';

const scrollToId = (id: string) => requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }));

export function App() {
  const [url, setUrl] = useUrlState();
  useLayoutEffect(() => rememberLang(url.lang), [url.lang]);
  return (
    <LangContext.Provider value={url.lang}>
      <MediaProvider>
        <Page url={url} setUrl={setUrl} />
      </MediaProvider>
    </LangContext.Provider>
  );
}

function Page({ url, setUrl }: { url: ReturnType<typeof useUrlState>[0]; setUrl: ReturnType<typeof useUrlState>[1] }) {
  const t = strings[url.lang];
  const openMedia = useMedia();
  const [palette, setPalette] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const introWanted = useIntro();
  const [intro, setIntro] = useState(introWanted);
  const [heroReady, setHeroReady] = useState(!introWanted);
  const localized = useMemo(() => projects.map((p) => localize(p, url.lang)), [url.lang]);
  const stage = localized.filter((p) => p.tier === 'stage');
  const project = stage.find((p) => p.id === url.project) ?? stage[0];

  const showToast = useCallback((m: string) => setToast(m), []);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  // A shared link to a project opens with that project on stage.
  useEffect(() => {
    if (url.view === 'studio' && url.project) scrollToId('work');
    // Only on first load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPalette((p) => !p);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const openProject = useCallback(
    (id: string) => {
      setUrl({ view: 'studio', project: id, layer: 'product' });
      scrollToId('work');
    },
    [setUrl],
  );
  const openOverview = useCallback(() => {
    setUrl({ view: 'overview' });
    window.scrollTo({ top: 0 });
  }, [setUrl]);
  const openStudio = useCallback(() => setUrl({ view: 'studio', project: null, layer: 'product' }), [setUrl]);
  const goContact = useCallback(() => scrollToId('contact'), []);
  const other = url.lang === 'he' ? 'en' : 'he';
  const switchLang = useCallback(() => setUrl({ lang: other }, 'replace'), [setUrl, other]);
  const showDiploma = useCallback(() => {
    const d = profile.diploma;
    openMedia({ kind: 'image', src: d.src, alt: t.creds.certAlt, w: d.w, h: d.h, title: t.creds.certTitle, note: t.creds.redacted });
  }, [openMedia, t]);
  const endIntro = useCallback(() => setIntro(false), []);
  const revealHero = useCallback(() => setHeroReady(true), []);

  const commands = useMemo<Command[]>(() => {
    const p = t.palette;
    return [
      ...stage.map((x) => ({ id: x.id, label: x.name, hint: x.specialty, run: () => openProject(x.id) })),
      ...localized
        .filter((x) => x.tier === 'shelf')
        .map((x) => ({ id: x.id, label: x.name, hint: `${x.specialty} · ${p.code}`, run: () => window.open(x.repo!, '_blank', 'noopener') })),
      { id: 'overview', label: p.overview, hint: p.overviewHint, run: openOverview },
      { id: 'process', label: p.process, hint: p.processHint, run: () => { openStudio(); scrollToId('process'); } },
      { id: 'diploma', label: p.diploma, hint: 'MAHAT · DevOps', run: showDiploma },
      { id: 'contact', label: p.contact, hint: p.contactHint, run: goContact },
      { id: 'copy', label: p.copy, hint: profile.email, run: async () => showToast((await copyText(profile.email)) ? t.contact.copied : profile.email) },
      { id: 'cv', label: p.cv, hint: 'PDF', run: () => window.open(hasCv ? profile.cv[url.lang] : `mailto:${profile.email}?subject=CV%20request`, '_blank') },
      { id: 'lang', label: p.lang, hint: other.toUpperCase(), run: switchLang },
      { id: 'github', label: p.github, hint: 'github.com/gr-buildstudio', run: () => window.open(profile.github, '_blank', 'noopener') },
      { id: 'instagram', label: p.instagram, hint: 'instagram.com/gr.buildstudio', run: () => window.open(profile.instagram, '_blank', 'noopener') },
    ];
  }, [t, stage, localized, openProject, openOverview, openStudio, goContact, showToast, showDiploma, switchLang, other, url.lang]);

  return (
    <ToastContext.Provider value={showToast}>
      <a className="skip-link" href={url.view === 'overview' ? '#main' : '#work'}>
        {url.view === 'overview' ? t.skipContent : t.skipProjects}
      </a>
      {intro && <Intro onReveal={revealHero} onDone={endIntro} />}
      <TopBar
        view={url.view}
        langHref={urlFor({ ...url, lang: other })}
        onLang={switchLang}
        onPalette={() => setPalette(true)}
        onOverview={openOverview}
        onStudio={openStudio}
      />

      {url.view === 'overview' ? (
        <Overview onProject={openProject} />
      ) : (
        <main id="main">
          <Hero onOverview={openOverview} onProject={openProject} ready={heroReady} />
          <Marquee />
          <Showreel />
          <Studio
            project={project}
            layer={url.layer}
            onProject={(id) => setUrl({ project: id, layer: 'product' })}
            onLayer={(layer) => setUrl({ project: project.id, layer }, 'replace')}
          />
          <Builds onProject={openProject} />
          <Process />
          <Credentials />
        </main>
      )}
      <Contact />
      <Footer />

      <CommandPalette open={palette} onClose={() => setPalette(false)} commands={commands} />
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </ToastContext.Provider>
  );
}
