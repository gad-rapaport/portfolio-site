import { useEffect, useMemo, useRef, useState } from 'react';
import log from '../data/mission-log.json';
import { useReducedMotion } from '../lib/motion';
import { useT } from '../i18n';
import type { Strings } from '../i18n/strings';
import { IconPause, IconPlay, IconReset, IconStep } from '../components/Icons';

// Replays DevMarshal's real Milestone B event log. Nothing here is generated: each row is an event the
// orchestrator wrote during the mission on 7–8 October 2026, only the playback speed is compressed.
// The log rows stay in English in both languages, as they were written.

interface Ev {
  seq: number;
  at: string;
  type: string;
  task: string | null;
  agent: 'codex' | 'claude' | null;
  summary: string;
}

const events = log.events as Ev[];
const TASKS = ['LEDGER-001', 'CSV-001', 'REPORT-001'];

type StateKey = keyof Strings['mission']['states'];
interface Lane {
  state: string;
  key: StateKey;
  raw?: string;
  agent: 'codex' | 'claude' | null;
  role: 'implementer' | 'reviewer' | null;
  commit?: string;
}

const tone = (type: string) => {
  if (type === 'HUMAN_APPROVAL_REQUIRED') return 'human';
  if (/PASSED|APPROVED|DONE|COMMIT|COMPLETED|SUCCEEDED|CREATED|ACCEPTED/.test(type)) return 'ok';
  if (/FAILED|UNAVAILABLE|CHANGES|WAITING/.test(type)) return 'bad';
  if (/HUMAN/.test(type)) return 'human';
  return 'plain';
};

function lanesAt(n: number): Record<string, Lane> {
  const lanes: Record<string, Lane> = {};
  for (const t of TASKS) lanes[t] = { state: 'NONE', key: 'none', agent: null, role: null };
  for (const e of events.slice(0, n)) {
    if (!e.task || !lanes[e.task]) continue;
    const l = lanes[e.task];
    const set = (state: string, key: StateKey, extra: Partial<Lane> = {}) => Object.assign(l, { state, key, raw: undefined, ...extra });
    switch (e.type) {
      case 'TASK_CREATED':
        set('PLANNED', 'planned');
        break;
      case 'AGENT_STARTED':
        set('RUNNING', 'implementing', { agent: e.agent, role: 'implementer' });
        break;
      case 'RUN_SUCCEEDED':
        if (/implementer/.test(e.summary)) set('TESTING', 'testing', { agent: null, role: null });
        break;
      case 'TEST_PASSED':
        set('TESTING', 'testing', { raw: e.summary.split(': ')[1] });
        break;
      case 'TEST_FAILED':
      case 'TASK_CHANGES_REQUESTED':
        set('CHANGES', 'failed');
        break;
      case 'REVIEW_STARTED':
        set('REVIEW', 'review', { agent: e.agent, role: 'reviewer' });
        break;
      case 'RUN_FAILED':
        if (/quota/.test(e.summary)) set('WAITING', 'quota');
        else set('REVIEW', 'crashed');
        break;
      case 'AGENT_UNAVAILABLE':
      case 'TASK_WAITING':
        set('WAITING', 'waiting');
        break;
      case 'TASK_HUMAN_REQUIRED':
        set('HUMAN', 'human', { agent: null, role: null });
        break;
      case 'HUMAN_APPROVED':
        set('PLANNED', 'retry');
        break;
      case 'REVIEW_APPROVED':
        set('REVIEW', 'approved');
        break;
      case 'TASK_DONE':
      case 'COMMIT_CREATED':
        set('DONE', 'done', { agent: null, role: null, commit: /checkpoint ([0-9a-f]{7})/.exec(e.summary)?.[1] ?? l.commit });
        break;
    }
  }
  return lanes;
}

const time = (iso: string) => iso.slice(11, 19);
const hoursBetween = (a: string, b: string) => (Date.parse(b) - Date.parse(a)) / 3_600_000;

export function MissionReplay() {
  const t = useT();
  const m = t.mission;
  const reduced = useReducedMotion();
  const [n, setN] = useState(reduced ? events.length : 3);
  const [playing, setPlaying] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  // Start playing the first time the replay is on screen; never with reduced motion.
  useEffect(() => {
    if (reduced || !rootRef.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          setPlaying(true);
        }
      },
      { threshold: 0.15 },
    );
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
    const timer = window.setTimeout(() => setN((x) => x + 1), pause);
    return () => window.clearTimeout(timer);
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
  const progress = n / events.length;

  return (
    <div className="canvas cv-dm" ref={rootRef}>
      <div className="canvas__label">
        <span>
          <span className="badge" style={{ color: 'var(--lime)' }}>{m.badge}</span> {m.label}
        </span>
        <span className="dm-agents" aria-label={m.agentsAria}>
          <span className="codex">{m.codex}</span>
          <span className="claude">{m.claude}</span>
        </span>
      </div>

      <div className="dm-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>

      <div className="dm-lanes">
        {TASKS.map((id, i) => {
          const l = lanes[id];
          const who = l.agent ? `${l.agent === 'claude' ? 'Claude Code' : 'Codex'} · ${l.role ? m[l.role] : ''}` : l.commit ? `checkpoint ${l.commit}` : '';
          return (
            <div className="dm-lane" key={id} data-s={l.state}>
              <div className="dm-lane__id" dir="ltr">{id}</div>
              <div className="dm-lane__title">{m.tasks[i]}</div>
              <span className="dm-state" data-s={l.state} key={`${l.state}-${l.key}`}>
                {l.raw ?? m.states[l.key]}
              </span>
              <div className="dm-lane__agent" dir="ltr">{who}</div>
            </div>
          );
        })}
      </div>

      <div className="dm-feed" ref={feedRef} role="log" tabIndex={0} dir="ltr" aria-live={playing ? 'off' : 'polite'} aria-label={m.feedAria}>
        <ol>
          {shown.map((e, i) => {
            const prev = shown[i - 1];
            const gap = prev && hoursBetween(prev.at, e.at) > 1 ? Math.round(hoursBetween(prev.at, e.at) * 10) / 10 : 0;
            return (
              <FeedRow key={e.seq} e={e} gap={gap} gapText={m.gap(gap)} gapAria={m.gapAria(gap)} rtl={t.dir === 'rtl'} />
            );
          })}
        </ol>
      </div>

      <div className="canvas__foot">
        <button type="button" className="btn btn--small" onClick={() => (done ? (setN(1), setPlaying(true)) : setPlaying((p) => !p))}>
          {playing ? <IconPause /> : done ? <IconReset /> : <IconPlay className="flip" />}
          {playing ? m.pause : done ? m.again : m.play}
        </button>
        <button type="button" className="btn btn--small" onClick={() => { setPlaying(false); setN((x) => Math.min(events.length, x + 1)); }} disabled={done}>
          <IconStep className="flip" /> {m.step}
        </button>
        <button type="button" className="btn btn--small" onClick={() => { setPlaying(false); setN(events.length); }} disabled={done}>
          {m.end}
        </button>
        <span className="mono" style={{ marginInlineStart: 'auto', color: 'var(--muted)' }}>
          {m.counter(n, events.length, runs, commits)}
        </span>
      </div>
      <p className="visually-hidden">{m.note(events.length, log.total, log.source)}</p>
    </div>
  );
}

function FeedRow({ e, gap, gapText, gapAria, rtl }: { e: Ev; gap: number; gapText: string; gapAria: string; rtl: boolean }) {
  return (
    <>
      {gap > 0 && (
        <li className="dm-gap" aria-label={gapAria} dir={rtl ? 'rtl' : 'ltr'}>
          {gapText}
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
