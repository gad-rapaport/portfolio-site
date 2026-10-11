import { useCallback, useEffect, useState } from 'react';
import type { LayerId } from '../data/projects';

// The page keeps the open project, layer and view in the address, so a link can be sent straight to one
// project and the back button returns to where the reader was.

export interface UrlState {
  view: 'studio' | 'overview';
  project: string | null;
  layer: LayerId;
}

const layers: LayerId[] = ['product', 'hood', 'build'];

function read(): UrlState {
  const q = new URLSearchParams(window.location.search);
  const layer = q.get('l') as LayerId | null;
  return {
    view: q.get('view') === 'overview' ? 'overview' : 'studio',
    project: q.get('p'),
    layer: layer && layers.includes(layer) ? layer : 'product',
  };
}

function write(s: UrlState) {
  const q = new URLSearchParams();
  if (s.view === 'overview') q.set('view', 'overview');
  if (s.view === 'studio' && s.project) q.set('p', s.project);
  if (s.view === 'studio' && s.project && s.layer !== 'product') q.set('l', s.layer);
  const search = q.toString();
  return `${window.location.pathname}${search ? `?${search}` : ''}`;
}

export function useUrlState() {
  const [state, setState] = useState<UrlState>(read);

  useEffect(() => {
    const onPop = () => setState(read());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const update = useCallback((next: Partial<UrlState>, mode: 'push' | 'replace' = 'push') => {
    setState((prev) => {
      const s = { ...prev, ...next };
      const url = write(s);
      if (url !== `${window.location.pathname}${window.location.search}`) {
        if (mode === 'push') window.history.pushState(null, '', url);
        else window.history.replaceState(null, '', url);
      }
      return s;
    });
  }, []);

  return [state, update] as const;
}
