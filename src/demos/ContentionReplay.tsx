import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../lib/motion';
import { IconPlay, IconReset } from '../components/Icons';

// Replays the result of scripts/simulate-contention.mjs in Slotkeeper: six seeded members fire five requests
// each at one free slot. The measured outcome, locally and in CI, is one 201 and twenty-nine 409s. The page
// does not call a server; the order of the 409s is illustrative, the counts are not.

const USERS = ['demo', 'maya', 'tal', 'sophie', 'priya', 'avi'];
const REQUESTS = USERS.flatMap((u) => Array.from({ length: 5 }, (_, i) => ({ user: u, n: i + 1 })));
type S = 'idle' | 'pending' | '201' | '409';

export function ContentionReplay() {
  const reduced = useReducedMotion();
  const [states, setStates] = useState<S[]>(() => REQUESTS.map(() => 'idle'));
  const [phase, setPhase] = useState<'idle' | 'sent' | 'lock' | 'done'>('idle');
  const [winner, setWinner] = useState<number | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));

  function fire() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const win = Math.floor(Math.random() * REQUESTS.length);
    setWinner(win);
    if (reduced) {
      setStates(REQUESTS.map((_, i) => (i === win ? '201' : '409')));
      setPhase('done');
      return;
    }
    setStates(REQUESTS.map(() => 'pending'));
    setPhase('sent');
    later(500, () => setPhase('lock'));
    later(900, () => setStates((s) => s.map((x, i) => (i === win ? '201' : x))));
    const order = REQUESTS.map((_, i) => i).filter((i) => i !== win).sort(() => Math.random() - 0.5);
    order.forEach((i, k) => later(1150 + k * 55, () => setStates((s) => s.map((x, j) => (j === i ? '409' : x)))));
    later(1150 + order.length * 55 + 100, () => setPhase('done'));
  }

  function reset() {
    timers.current.forEach(clearTimeout);
    setStates(REQUESTS.map(() => 'idle'));
    setPhase('idle');
    setWinner(null);
  }

  const created = states.filter((s) => s === '201').length;
  const conflicts = states.filter((s) => s === '409').length;
  const who = winner !== null && states[winner] === '201' ? REQUESTS[winner].user : '';

  return (
    <div className="canvas cv-sk">
      <div className="canvas__label">
        <span>
          <span className="badge" style={{ color: 'var(--sk)' }}>Replay</span> of the measured result · no server is called
        </span>
        <span>POST /api/bookings × 30</span>
      </div>

      <div className="sk-arena">
        <div>
          <div className="sk-slot" aria-hidden="true">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} className={i === 4 ? (who ? 'target won' : 'target') : ''} data-who={i === 4 ? who : undefined} />
            ))}
          </div>
          <div className="sk-slot-label">
            <span>08:00</span>
            <span>Yarkon room · one free slot</span>
            <span>20:00</span>
          </div>
        </div>

        <div className="sk-requests" aria-hidden="true">
          {REQUESTS.map((r, i) => (
            <div key={i} className="sk-req" data-s={states[i]} title={`${r.user} #${r.n}`}>
              {states[i] === 'idle' ? r.user.slice(0, 2) : states[i] === 'pending' ? '…' : states[i]}
            </div>
          ))}
        </div>

        <div>
          <div className="sk-layers" aria-label="What each request passes through">
            <div data-on={phase !== 'idle'}>1 · user row lock + idempotency key</div>
            <div data-on={phase === 'lock' || phase === 'done'}>2 · pg_advisory_xact_lock(resource)</div>
            <div data-on={phase === 'done' || created > 0}>3 · EXCLUDE USING gist … period WITH &&</div>
          </div>
        </div>
      </div>

      <div className="canvas__foot">
        <button type="button" className="btn btn--small btn--fill" onClick={fire}>
          <IconPlay /> {phase === 'idle' ? 'Fire 30 requests' : 'Fire again'}
        </button>
        {phase !== 'idle' && (
          <button type="button" className="btn btn--small" onClick={reset}>
            <IconReset /> Reset
          </button>
        )}
        <div className="sk-tally" role="status" style={{ marginLeft: 'auto' }}>
          <span><b>{created}</b> × 201 booked{who ? ` (${who})` : ''}</span>
          <span><b>{conflicts}</b> × 409 “no longer free”</span>
          <span><b>0</b> × 500</span>
        </div>
      </div>
    </div>
  );
}
