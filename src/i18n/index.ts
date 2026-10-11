import { createContext, useContext, useMemo } from 'react';
import { projects, type Project } from '../data/projects';
import { projectsHe } from './projects.he';
import { strings, type Lang } from './strings';

export type { Lang } from './strings';

export const LangContext = createContext<Lang>('en');
export const useLang = () => useContext(LangContext);
export const useT = () => strings[useLang()];

const STORE = 'gr-lang';

export function initialLang(): Lang {
  const q = new URLSearchParams(window.location.search).get('lang');
  if (q === 'he' || q === 'en') return q;
  try {
    const saved = localStorage.getItem(STORE);
    if (saved === 'he' || saved === 'en') return saved;
  } catch {
    /* storage blocked: fall back to English */
  }
  return 'en';
}

export function rememberLang(lang: Lang) {
  try {
    localStorage.setItem(STORE, lang);
  } catch {
    /* not remembered; the URL still carries it */
  }
  document.documentElement.lang = lang;
  document.documentElement.dir = strings[lang].dir;
  document.title = lang === 'he' ? 'גדי רפפורט — סטודיו' : 'Gadi Rapaport — Build Studio';
}

export function localize(p: Project, lang: Lang): Project {
  const h = lang === 'he' ? projectsHe[p.id] : undefined;
  if (!h) return p;
  return {
    ...p,
    specialty: h.specialty,
    status: h.status ?? p.status,
    tagline: h.tagline,
    problem: h.problem,
    built: h.built.length ? h.built : p.built,
    moment: h.moment,
    evidence: p.evidence.map((e, i) => ({ value: h.evidenceValues?.[i] ?? e.value, label: h.evidence[i] ?? e.label })),
    architecture: p.architecture.map((n) => ({ ...n, role: h.roles[n.id] ?? n.role })),
    decision: h.decision.title ? { ...p.decision, ...h.decision } : p.decision,
    build: {
      tests: p.build.tests.map((t, i) => ({ value: h.testValues?.[i] ?? t.value, label: h.tests[i] ?? t.label })),
      checks: h.checks.length ? h.checks : p.build.checks,
      docs: p.build.docs.map((d, i) => ({ ...d, label: h.docs[i] ?? d.label })),
    },
    shots: p.shots.map((s, i) => ({ ...s, alt: h.shots[i] ?? s.alt })),
  };
}

export function useProjects() {
  const lang = useLang();
  return useMemo(() => {
    const all = projects.map((p) => localize(p, lang));
    return {
      all,
      stage: all.filter((p) => p.tier === 'stage'),
      shelf: all.filter((p) => p.tier === 'shelf'),
      find: (id: string | null) => all.filter((p) => p.tier === 'stage').find((p) => p.id === id) ?? all[0],
    };
  }, [lang]);
}
