import { useCallback, useEffect, useMemo, useState } from 'react';
import { findProject, projects, stageProjects } from './data/projects';
import { profile, hasCv } from './data/profile';
import { useUrlState } from './lib/url';
import { copyText, ToastContext } from './lib/copy';
import { MediaProvider } from './components/MediaDialog';
import { Footer, Intro, TopBar } from './components/Chrome';
import { Contact, Hero, Process, Shelf } from './components/Sections';
import { Studio } from './components/Studio';
import { Overview } from './components/Overview';
import { CommandPalette, type Command } from './components/CommandPalette';

const scrollToId = (id: string) =>
  requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }));

export function App() {
  const [url, setUrl] = useUrlState();
  const [palette, setPalette] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const project = findProject(url.project);

  const showToast = useCallback((m: string) => setToast(m), []);
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(t);
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

  const commands = useMemo<Command[]>(
    () => [
      ...stageProjects.map((p) => ({ id: p.id, label: p.name, hint: p.specialty, run: () => openProject(p.id) })),
      ...projects
        .filter((p) => p.tier === 'shelf')
        .map((p) => ({ id: p.id, label: p.name, hint: `${p.specialty} · code`, run: () => window.open(p.repo!, '_blank', 'noopener') })),
      { id: 'overview', label: 'Quick overview', hint: 'one page', run: openOverview },
      { id: 'process', label: 'How I build with AI', hint: 'process', run: () => { openStudio(); scrollToId('process'); } },
      { id: 'contact', label: 'Contact', hint: 'email, GitHub, LinkedIn', run: goContact },
      { id: 'copy', label: 'Copy email address', hint: profile.email, run: async () => showToast((await copyText(profile.email)) ? 'Email copied' : profile.email) },
      { id: 'cv', label: hasCv ? 'Open CV' : 'Request CV by email', hint: 'CV', run: () => window.open(hasCv ? profile.cvPath : `mailto:${profile.email}?subject=CV%20request`, '_blank') },
      { id: 'github', label: 'GitHub profile', hint: 'github.com/gad-rapaport', run: () => window.open(profile.github, '_blank', 'noopener') },
    ],
    [openProject, openOverview, openStudio, goContact, showToast],
  );

  return (
    <ToastContext.Provider value={showToast}>
      <MediaProvider>
        <a className="skip-link" href={url.view === 'overview' ? '#main' : '#work'}>
          Skip to {url.view === 'overview' ? 'content' : 'projects'}
        </a>
        <Intro />
        <TopBar view={url.view} onPalette={() => setPalette(true)} onOverview={openOverview} onStudio={openStudio} />

        {url.view === 'overview' ? (
          <Overview onProject={openProject} />
        ) : (
          <main id="main">
            <Hero onOverview={openOverview} onProject={openProject} />
            <Studio
              project={project}
              layer={url.layer}
              onProject={(id) => setUrl({ project: id, layer: 'product' })}
              onLayer={(layer) => setUrl({ project: project.id, layer }, 'replace')}
            />
            <Shelf />
            <Process />
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
      </MediaProvider>
    </ToastContext.Provider>
  );
}
