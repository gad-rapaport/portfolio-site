import { useEffect, useMemo, useRef, useState } from 'react';
import log from '../data/mission-log.json';
import { useReducedMotion } from '../lib/motion';
import { IconPause, IconPlay, IconReset, IconStep } from '../components/Icons';

// Replays DevMarshal's real Milestone B event log. Nothing here is generated: each row is an event the
// orchestrator wrote during the mission on 7–8 October 2026, only the playback speed is compressed.

interface Ev {
  seq: number;
  at: string;
  type: string;
  task: string | null;
  agent: 'codex' | 'claude' | null;
  summary: string;
}

const events = log.events as Ev[];

const TASKS = [
  { id: 'LEDGER-001', title: 'Add category totals' },
  { id: 'CSV-001', title: 'Add CSV import and export' },
  { id: 'REPORT-001', title: 'Add monthly summaries' },
];

interface Lane {
  state: string;
  label: string;
  agent: string;
  commit?: string;
}

const tone = (type: string) => {
  if (/PASSED|APPROVED|DONE|COMMIT|COMPLETED|SUCCEEDED|CREATED|ACCEPTED/.test(type) && type !== 'HUMAN_APPROVAL_REQUIRED') return 'ok';
  if (/FAILED|UNAVAILABLE|CHANGES|WAITING/.test(type)) return 'bad';
  if (/HUMAN/.test(type)) return 'human';
  return 'plain';
};

function lanesAt(n: number): Record<string, Lane> {
  const lanes: Record<string, Lane> = {};
  for (const t of TASKS) lanes[t.id] = { state: 'NONE', label: 'not planned yet', agent: '' };
  for (const e of events.slice(0, n)) {
    if (!e.task || !lanes[e.task]) continue;
    const l = lanes[e.task];
    const who = e.agent === 'claude' ? 'Claude Code' : e.agent === 'codex' ? 'Codex' : l.agent;
    switch (e.type) {
      case 'TASK_CREATED':
        Object.assign(l, { state: 'PLANNED', label: 'planned' });
        break;
      case 'AGENT_STARTED':
        Object.assign(l, { state: 'RUNNING', label: 'implementing', agent: `${who} · implementer` });
        break;
      case 'RUN_SUCCEEDED':
        if (/implementer/.test(e.summary)) Object.assign(l, { state: 'TESTING', label: 'DevMarshal runs the tests', agent: '' });
        break;
      case 'TEST_PASSED':
        Object.assign(l, { state: 'TESTING', label: e.summary.split(': ')[1] ?? 'passed' });
        break;
      case 'TEST_FAILED':
      case 'TASK_CHANGES_REQUESTED':
        Object.assign(l, { state: 'CHANGES', label: 'test failed → back to implementer' });
        break;
      case 'REVIEW_STARTED':
        Object.assign(l, { state: 'REVIEW', label: 'in review', agent: `${who} · reviewer` });
        break;
      case 'RUN_FAILED':
        if (/quota/.test(e.summary)) Object.assign(l, { state: 'WAITING', label: 'quota limit reached' });
        else Object.assign(l, { state: 'REVIEW', label: 'reviewer crashed, restarting' });
        break;
      case 'AGENT_UNAVAILABLE':
      case 'TASK_WAITING':
        Object.assign(l, { state: 'WAITING', label: 'waiting for the agent' });
        break;
      case 'TASK_HUMAN_REQUIRED':
        Object.assign(l, { state: 'HUMAN', label: 'loop protection: needs the owner', agent: '' });
        break;
      case 'HUMAN_APPROVED':
        Object.assign(l, { state: 'PLANNED', label: 'owner chose retry' });
        break;
      case 'REVIEW_APPROVED':
        Object.assign(l, { state: 'REVIEW', label: 'approved' });
        break;
      case 'TASK_DONE':
      case 'COMMIT_CREATED': {
        const commit = /checkpoint ([0-9a-f]{7})/.exec(e.summary)?.[1];
        Object.assign(l, { state: 'DONE', label: 'done', agent: commit ? `checkpoint ${commit}` : l.agent, commit });
        break;
      }
    }
  }
  return lanes;
}

const time = (iso: string) => iso.slice(11, 19);
const hoursBetween = (a: string, b: string) => (Date.parse(b) - Date.parse(a)) / 3_600_000;

export function MissionReplay() {
  const reduced = useReducedMotion();
  const [n, setN] = useState(reduced ? events.length : 3);
  const [playing, setPlaying] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  // Start playing the first time the replay is on screen; never with reduced motion.
  useEffect(() => {
    if (reduced || !rootRef.current) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        setPlaying(true);
      }
    }, { threshold: 0.15 });
    io.observe(rootRef.current);
    return () => io.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (!playing) return;
    if (n >= events.length) {
      setPlaying(false);
      return;
    }
    const prev = events[n - 1];
    const next = events[n];
    const pause = prev && hoursBetween(prev.at, next.at) > 1 ? 1600 : 520;
    const t = window.setTimeout(() => setN((x) => x + 1), pause);
    return () => window.clearTimeout(t);
  }, [playing, n]);

  useEffect(() => {
    const el = feedRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [n]);

  const lanes = useMemo(() => lanesAt(n), [n]);
  const shown = events.slice(0, n);
  const commits = shown.filter((e) => e.type === 'COMMIT_CREATED').length;
  const runs = shown.filter((e) => e.type === 'AGENT_STARTED' || e.type === 'REVIEW_STARTED' || (e.type === 'RUN_SUCCEEDED' && e.summary.startsWith('plan'))).length;
  const done = n >= events.length;

  return (
    <div className="canvas cv-dm" ref={rootRef}>
      <div className="canvas__label">
        <span>
          <span className="badge" style={{ color: 'var(--lime)' }}>Replay</span>{' '}
          real event log · mission M-2026-001 · 7–8 Oct 2026 · times UTC
        </span>
        <span className="dm-agents" aria-label="Agents">
          <span className="codex">Codex: planner, reviewer</span>
          <span className="claude">Claude Code: implementer</span>
        </span>
      </div>

      <div className="dm-lanes">
        {TASKS.map((t) => {
          const l = lanes[t.id];
          return (
            <div className="dm-lane" key={t.id}>
              <div className="dm-lane__id">{t.id}</div>
              <div className="dm-lane__title">{t.title}</div>
              <span className="dm-state" data-s={l.state}>{l.label}</span>
              <div className="dm-lane__agent">{l.agent}</div>
            </div>
          );
        })}
      </div>

      <div className="dm-feed" ref={feedRef} role="log" tabIndex={0} aria-live={playing ? 'off' : 'polite'} aria-label="Mission events">
        <ol>
        {shown.map((e, i) => {
          const prev = shown[i - 1];
          const gap = prev && hoursBetween(prev.at, e.at) > 1;
          return (
            <FeedRow key={e.seq} e={e} gap={gap ? Math.round(hoursBetween(prev.at, e.at) * 10) / 10 : 0} />
          );
        })}
        </ol>
      </div>

      <div className="canvas__foot">
        <button type="button" className="btn btn--small" onClick={() => (done ? (setN(1), setPlaying(true)) : setPlaying((p) => !p))}>
          {playing ? <IconPause /> : done ? <IconReset /> : <IconPlay />}
          {playing ? 'Pause' : done ? 'Replay again' : 'Play'}
        </button>
        <button type="button" className="btn btn--small" onClick={() => { setPlaying(false); setN((x) => Math.min(events.length, x + 1)); }} disabled={done}>
          <IconStep /> Step
        </button>
        <button type="button" className="btn btn--small" onClick={() => { setPlaying(false); setN(events.length); }} disabled={done}>
          Jump to end
        </button>
        <span className="mono" style={{ marginLeft: 'auto', color: 'var(--muted)' }}>
          {n}/{events.length} shown · agent runs {runs} · commits {commits}
        </span>
      </div>
      <p className="visually-hidden">
        {events.length} of the {log.total} events in {log.source}; effect-journal and process bookkeeping events are hidden.
      </p>
    </div>
  );
}

function FeedRow({ e, gap }: { e: Ev; gap: number }) {
  return (
    <>
      {gap > 0 && (
        <li className="dm-gap" aria-label={`${gap} hours later`}>
          ⋯ {gap} h later: the provider’s quota window reset, a health check returned READY ⋯
        </li>
      )}
      <li data-tone={tone(e.type)}>
        <time dateTime={e.at}>{time(e.at)}</time>
        <span className="dm-type">{e.type}</span>
        <span>{e.summary}</span>
      </li>
    </>
  );
}
