import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { stageProjects, type LayerId, type NodeKind, type Project } from '../data/projects';
import { MissionReplay } from '../demos/MissionReplay';
import { ContentionReplay } from '../demos/ContentionReplay';
import { BranchDemo } from '../demos/BranchDemo';
import { StatusCompare } from '../demos/StatusCompare';
import { useMedia } from './MediaDialog';
import { IconLayers, IconPlay } from './Icons';
import { useReducedMotion } from '../lib/motion';

const LAYERS: { id: LayerId; label: string }[] = [
  { id: 'product', label: 'Product' },
  { id: 'hood', label: 'Under the hood' },
  { id: 'build', label: 'Build process' },
];

interface Props {
  project: Project;
  layer: LayerId;
  onProject: (id: string) => void;
  onLayer: (id: LayerId) => void;
}

export function Studio({ project, layer, onProject, onLayer }: Props) {
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function onRailKey(e: KeyboardEvent, i: number) {
    const n = stageProjects.length;
    const next = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? (i + 1) % n : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? (i - 1 + n) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1;
    if (next < 0) return;
    e.preventDefault();
    onProject(stageProjects[next].id);
    tabs.current[next]?.focus();
  }

  return (
    <section className="section studio" id="work" aria-labelledby="work-title">
      <div className="wrap">
        <div className="section__head">
          <div>
            <p className="eyebrow">The studio · 4 case studies</p>
            <h2 id="work-title">Open a project.</h2>
          </div>
          <p>
            Each one opens in three layers: the product, what is under the hood, and how it was built. Every number comes from the
            project’s own tests and documents. Use the arrow keys to move between projects.
          </p>
        </div>

        <div className="rail" role="tablist" aria-label="Projects">
          {stageProjects.map((p, i) => (
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
              {i === 0 && <span className="rail__flag">FLAGSHIP</span>}
            </button>
          ))}
        </div>

        <div className="stage" id="stage" role="tabpanel" aria-labelledby={`tab-${project.id}`}>
          <div className="stage__canvas">
            <Canvas project={project} />
            <Gallery project={project} />
          </div>
          <div className="stage__panel">
            <div className="stage__title">
              <h3>{project.name}</h3>
              <p>{project.tagline}</p>
              <div className="stage__meta">
                <span>{project.status}</span>
                <span>updated {project.updated}</span>
                {project.repo ? (
                  <a href={project.repo} target="_blank" rel="noreferrer">
                    github.com/gad-rapaport/{project.id} ↗
                  </a>
                ) : (
                  <span>code: private repository, walkthrough on request</span>
                )}
              </div>
            </div>

            <div className="layers" role="tablist" aria-label={`${project.name} layers`}>
              {LAYERS.map((l) => (
                <button
                  key={l.id}
                  role="tab"
                  id={`layer-${l.id}`}
                  aria-selected={l.id === layer}
                  aria-controls="layer-panel"
                  onClick={() => onLayer(l.id)}
                >
                  {l.label}
                </button>
              ))}
            </div>

            <div className="layer" id="layer-panel" role="tabpanel" aria-labelledby={`layer-${layer}`} tabIndex={0}>
              {layer === 'product' && <ProductLayer p={project} />}
              {layer === 'hood' && <HoodLayer p={project} key={project.id} />}
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
  const open = useMedia();
  if (!project.film && project.shots.length === 0) return null;
  return (
    <div className="canvas__foot" style={{ borderTop: '1px solid var(--line)', alignItems: 'stretch', padding: 0 }}>
      {project.film && (
        <button
          type="button"
          className="btn btn--small btn--red"
          style={{ margin: '14px 0 14px 14px', alignSelf: 'center' }}
          onClick={() => open({ kind: 'film', src: project.film!, poster: project.poster!, title: `${project.name} — product film`, repo: project.repo })}
        >
          <IconPlay /> Watch the film
        </button>
      )}
      <div className="gallery" aria-label={`${project.name} screenshots`} role="group">
        {project.shots.map((s) => (
          <button key={s.file} type="button" aria-label={`Enlarge: ${s.alt}`} onClick={() => open({ kind: 'image', ...s, src: s.file, title: project.name })}>
            <img src={s.file} alt={s.alt} width={s.w} height={s.h} loading="lazy" style={{ width: 'auto' }} />
          </button>
        ))}
      </div>
    </div>
  );
}

function Evidence({ items }: { items: { value: string; label: string }[] }) {
  return (
    <dl className="evidence">
      {items.map((e) => (
        <div key={e.label}>
          <dt>{e.value}</dt>
          <dd>{e.label}</dd>
        </div>
      ))}
    </dl>
  );
}

function ProductLayer({ p }: { p: Project }) {
  return (
    <>
      <h4>The problem</h4>
      <p>{p.problem}</p>
      <h4>What I built</h4>
      <ul>
        {p.built.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      <h4>The moment to look for</h4>
      <p>{p.moment}</p>
      <Evidence items={p.evidence} />
    </>
  );
}

const KIND_ORDER: NodeKind[] = ['ui', 'api', 'service', 'agent', 'data'];
const KIND_LABEL: Record<NodeKind, string> = { ui: 'UI', api: 'API', service: 'Services', agent: 'Agents', data: 'Data' };

function HoodLayer({ p }: { p: Project }) {
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
      const t = Math.min(1, (now - start.current) / 600);
      setProgress(t);
      if (t < 1) raf.current = requestAnimationFrame(tick);
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
      <h4>The system</h4>
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
          <IconLayers /> Reveal the system <span className="mono" style={{ opacity: 0.7 }}>hold or click</span>
        </button>
      )}
      <div className="arch" data-revealed={revealed}>
        {kinds.map((k, i) => (
          <div className="arch__row" key={k}>
            <span className="arch__kind">{KIND_LABEL[k]}</span>
            <div className="arch__nodes">
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
            <strong>{node.label}</strong> — {node.role}
            {node.file && p.repo && (
              <div>
                <a href={`${p.repo}/tree/main/${node.file}`} target="_blank" rel="noreferrer">
                  {node.file} ↗
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      <h4>A decision worth reading</h4>
      <figure className="decision">
        <h5>{p.decision.title}</h5>
        <dl>
          <dt>chose</dt>
          <dd>{p.decision.choice}</dd>
          <dt>instead of</dt>
          <dd>{p.decision.alternative}</dd>
          <dt>price</dt>
          <dd>{p.decision.cost}</dd>
        </dl>
        <small>
          {p.repo ? (
            <a href={`${p.repo}/blob/main/${p.decision.source}`} target="_blank" rel="noreferrer">
              {p.decision.source} ↗
            </a>
          ) : (
            p.decision.source
          )}
        </small>
      </figure>

      <h4>Stack</h4>
      <ul className="chips">
        {p.stack.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </>
  );
}

function BuildLayer({ p }: { p: Project }) {
  return (
    <>
      <h4>How it was built</h4>
      <ol className="pipeline" aria-label="Process">
        <li>written spec + rules</li>
        <li>plan</li>
        <li>small change</li>
        <li>diff review</li>
        <li>tests</li>
        <li>decision record</li>
      </ol>
      <p>
        {p.id === 'devmarshal'
          ? 'Built with Claude Code and Codex working under MASTER.md, a constitution in the repository that every agent reads first: one backlog task at a time, its validation run for real, expensive decisions written down before the code. DevMarshal now runs that loop itself.'
          : 'Built with Claude Code and Codex from a written brief. The agents wrote code; the acceptance gate was the test suite and CI, and every trade-off went into DECISIONS.md with the alternative that was rejected.'}
      </p>
      <h4>Tests</h4>
      <Evidence items={p.build.tests} />
      <h4>Checked on every push</h4>
      <ul>
        {p.build.checks.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
      <h4>Read next</h4>
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
