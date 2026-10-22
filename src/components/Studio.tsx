import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { LayerId, NodeKind, Project } from '../data/projects';
import { useProjects, useT } from '../i18n';
import { MissionReplay } from '../demos/MissionReplay';
import { ContentionReplay } from '../demos/ContentionReplay';
import { BranchDemo } from '../demos/BranchDemo';
import { StatusCompare } from '../demos/StatusCompare';
import { useMedia } from './MediaDialog';
import { IconLayers, IconPlay } from './Icons';
import { useReducedMotion } from '../lib/motion';

const LAYERS: LayerId[] = ['product', 'hood', 'build'];

interface Props {
  project: Project;
  layer: LayerId;
  onProject: (id: string) => void;
  onLayer: (id: LayerId) => void;
}

export function Studio({ project, layer, onProject, onLayer }: Props) {
  const t = useT();
  const { stage } = useProjects();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function onRailKey(e: KeyboardEvent, i: number) {
    const n = stage.length;
    const rtl = t.dir === 'rtl';
    const fwd = e.key === 'ArrowDown' || e.key === (rtl ? 'ArrowLeft' : 'ArrowRight');
    const back = e.key === 'ArrowUp' || e.key === (rtl ? 'ArrowRight' : 'ArrowLeft');
    const next = fwd ? (i + 1) % n : back ? (i - 1 + n) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1;
    if (next < 0) return;
    e.preventDefault();
    onProject(stage[next].id);
    tabs.current[next]?.focus();
  }

  return (
    <section className="section studio" id="work" aria-labelledby="work-title">
      <div className="wrap">
        <div className="section__head">
          <div>
            <p className="eyebrow">{t.studio.eyebrow}</p>
            <h2 id="work-title" className="scroll-rise">{t.studio.title}</h2>
          </div>
          <p>{t.studio.intro}</p>
        </div>

        <div className="rail" role="tablist" aria-label={t.studio.tabs}>
          {stage.map((p, i) => (
            <button
              key={p.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              id={`tab-${p.id}`}
              aria-selected={p.id === project.id}
              aria-controls="stage"
              tabIndex={p.id === project.id ? 0 : -1}
              onClick={() => onProject(p.id)}
              onKeyDown={(e) => onRailKey(e, i)}
            >
              <span className="rail__num">0{i + 1}</span>
              <span className="rail__name">{p.name}</span>
              <span className="rail__spec">{p.specialty}</span>
              {i === 0 && <span className="rail__flag">{t.studio.flagship}</span>}
            </button>
          ))}
        </div>

        <div className="stage" id="stage" role="tabpanel" aria-labelledby={`tab-${project.id}`}>
          <div className="stage__canvas" key={project.id}>
            <Canvas project={project} />
            <Gallery project={project} />
            <span className="stage__wipe" aria-hidden="true" />
          </div>
          <div className="stage__panel" key={`panel-${project.id}`}>
            <div className="stage__title">
              <h3>{project.name}</h3>
              <p>{project.tagline}</p>
              <div className="stage__meta">
                <span>{project.status}</span>
                <span>
                  {t.studio.updated} {project.updated}
                </span>
                {project.repo ? (
                  <a href={project.repo} target="_blank" rel="noreferrer" dir="ltr">
                    github.com/gr-buildstudio/{project.id} ↗
                  </a>
                ) : (
                  <span>{t.studio.privateCode}</span>
                )}
              </div>
            </div>

            <div className="layers" role="tablist" aria-label={t.studio.layersAria(project.name)}>
              {LAYERS.map((l) => (
                <button key={l} role="tab" id={`layer-${l}`} aria-selected={l === layer} aria-controls="layer-panel" onClick={() => onLayer(l)}>
                  {t.studio.layers[l]}
                </button>
              ))}
            </div>

            <div className="layer" id="layer-panel" role="tabpanel" aria-labelledby={`layer-${layer}`} tabIndex={0} key={layer}>
              {layer === 'product' && <ProductLayer p={project} />}
              {layer === 'hood' && <HoodLayer p={project} />}
              {layer === 'build' && <BuildLayer p={project} />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Canvas({ project }: { project: Project }) {
  switch (project.id) {
    case 'devmarshal':
      return <MissionReplay />;
    case 'slotkeeper':
      return <ContentionReplay />;
    case 'planwright':
      return <BranchDemo />;
    case 'signalpost':
      return <StatusCompare before={project.shots[0]} after={project.shots[1]} />;
    default:
      return null;
  }
}

function Gallery({ project }: { project: Project }) {
  const t = useT();
  const open = useMedia();
  if (!project.film && project.shots.length === 0) return null;
  return (
    <div className="canvas__foot canvas__foot--gallery">
      {project.film && (
        <button
          type="button"
          className="btn btn--small btn--red"
          onClick={() => open({ kind: 'film', src: project.film!, poster: project.poster!, title: t.media.filmTitle(project.name), repo: project.repo })}
        >
          <IconPlay className="flip" /> {t.studio.watchFilm}
        </button>
      )}
      <div className="gallery" aria-label={t.studio.shotsAria(project.name)} role="group">
        {project.shots.map((s) => (
          <button key={s.file} type="button" aria-label={`${t.studio.enlarge}: ${s.alt}`} onClick={() => open({ kind: 'image', ...s, src: s.file, title: project.name })}>
            <img src={s.file} alt="" width={s.w} height={s.h} loading="lazy" style={{ width: 'auto' }} />
          </button>
        ))}
      </div>
    </div>
  );
}

function Evidence({ items }: { items: { value: string; label: string }[] }) {
  return (
    <dl className="evidence">
      {items.map((e, i) => (
        <div key={e.label} style={{ ['--i' as string]: i }}>
          <dt>{e.value}</dt>
          <dd>{e.label}</dd>
        </div>
      ))}
    </dl>
  );
}

function ProductLayer({ p }: { p: Project }) {
  const t = useT();
  return (
    <>
      <h4>{t.studio.problem}</h4>
      <p>{p.problem}</p>
      <h4>{t.studio.built}</h4>
      <ul>
        {p.built.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      <h4>{t.studio.moment}</h4>
      <p>{p.moment}</p>
      <Evidence items={p.evidence} />
    </>
  );
}

const KIND_ORDER: NodeKind[] = ['ui', 'api', 'service', 'agent', 'data'];

function HoodLayer({ p }: { p: Project }) {
  const t = useT();
  const reduced = useReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(p.architecture[0]?.id);
  const raf = useRef(0);
  const start = useRef(0);

  // Press and hold for about 600 ms to build the system layer by layer; a click or Enter reveals it at once.
  function holdStart() {
    if (revealed || reduced) return;
    start.current = performance.now();
    const tick = (now: number) => {
      const x = Math.min(1, (now - start.current) / 600);
      setProgress(x);
      if (x < 1) raf.current = requestAnimationFrame(tick);
      else setRevealed(true);
    };
    raf.current = requestAnimationFrame(tick);
  }
  function holdCancel() {
    cancelAnimationFrame(raf.current);
    if (!revealed) setProgress(0);
  }
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const node = p.architecture.find((n) => n.id === active);
  const kinds = KIND_ORDER.filter((k) => p.architecture.some((n) => n.kind === k));
  const visibleKinds = revealed ? kinds.length : Math.floor(progress * kinds.length + 0.001);

  return (
    <>
      <h4>{t.studio.system}</h4>
      {!revealed && (
        <button
          type="button"
          className="btn btn--small reveal"
          style={{ ['--p' as string]: progress }}
          onPointerDown={holdStart}
          onPointerUp={holdCancel}
          onPointerLeave={holdCancel}
          onPointerCancel={holdCancel}
          onClick={() => setRevealed(true)}
        >
          <span className="reveal__fill" />
          <IconLayers /> {t.studio.reveal} <span className="mono" style={{ opacity: 0.7 }}>{t.studio.revealHint}</span>
        </button>
      )}
      <div className="arch" data-revealed={revealed}>
        {kinds.map((k, i) => (
          <div className="arch__row" key={k} style={{ ['--i' as string]: i }}>
            <span className="arch__kind">{t.studio.kinds[k]}</span>
            <div className="arch__nodes" dir="ltr">
              {p.architecture
                .filter((n) => n.kind === k)
                .map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    className="arch__node"
                    aria-pressed={n.id === active}
                    onClick={() => setActive(n.id)}
                    tabIndex={revealed ? 0 : -1}
                    style={!revealed && i < visibleKinds ? { opacity: 1, transform: 'none' } : undefined}
                  >
                    {n.label}
                  </button>
                ))}
            </div>
          </div>
        ))}
        {revealed && node && (
          <div className="arch__detail" aria-live="polite">
            <strong dir="ltr">{node.label}</strong> — {node.role}
            {node.file && p.repo && (
              <div>
                <a href={`${p.repo}/tree/main/${node.file}`} target="_blank" rel="noreferrer" dir="ltr">
                  {node.file} ↗
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      <h4>{t.studio.decision}</h4>
      <figure className="decision">
        <h5>{p.decision.title}</h5>
        <dl>
          <dt>{t.studio.chose}</dt>
          <dd>{p.decision.choice}</dd>
          <dt>{t.studio.instead}</dt>
          <dd>{p.decision.alternative}</dd>
          <dt>{t.studio.price}</dt>
          <dd>{p.decision.cost}</dd>
        </dl>
        <small dir="ltr">
          {p.repo ? (
            <a href={`${p.repo}/blob/main/${p.decision.source}`} target="_blank" rel="noreferrer">
              {p.decision.source} ↗
            </a>
          ) : (
            p.decision.source
          )}
        </small>
      </figure>

      <h4>{t.studio.stack}</h4>
      <ul className="chips" dir="ltr">
        {p.stack.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </>
  );
}

function BuildLayer({ p }: { p: Project }) {
  const t = useT();
  return (
    <>
      <h4>{t.studio.howBuilt}</h4>
      <ol className="pipeline" aria-label={t.studio.pipelineAria}>
        {t.studio.pipeline.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      <p>{p.id === 'devmarshal' ? t.studio.buildDm : t.studio.buildOther}</p>
      <h4>{t.studio.tests}</h4>
      <Evidence items={p.build.tests} />
      <h4>{t.studio.checks}</h4>
      <ul>
        {p.build.checks.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
      <h4>{t.studio.readNext}</h4>
      <ul>
        {p.build.docs.map((d) =>
          p.repo && d.path ? (
            <li key={d.label}>
              <a href={`${p.repo}/blob/main/${d.path}`} target="_blank" rel="noreferrer">
                {d.label} ↗
              </a>
            </li>
          ) : (
            <li key={d.label}>{d.label}</li>
          ),
        )}
      </ul>
    </>
  );
}
