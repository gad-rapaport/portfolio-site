import { useId, useState } from 'react';
import { useLang, useT } from '../i18n';

// Illustrates Planwright's core rule (src/domain/scenario.ts): a scenario stores only its changes, and
// resolve() folds the changes of its lineage over the baseline. The amounts are made up for the example.

type LineId = 'sales' | 'rent' | 'materials' | 'apprentice';
type ScenarioId = 'base' | 'apprentice' | 'space';
interface Line {
  id: LineId;
  amount: number;
}
type Change = { kind: 'set'; id: LineId; amount: number } | { kind: 'add'; line: Line };
interface Scenario {
  id: ScenarioId;
  parent: ScenarioId | null;
  color: string;
  changes: Change[];
}

const SCENARIOS: Scenario[] = [
  { id: 'base', parent: null, color: '#2f6fdf', changes: [] },
  { id: 'apprentice', parent: 'base', color: '#1f9d6b', changes: [{ kind: 'add', line: { id: 'apprentice', amount: -7500 } }] },
  {
    id: 'space',
    parent: 'apprentice',
    color: '#e0782f',
    changes: [
      { kind: 'set', id: 'rent', amount: -11500 },
      { kind: 'set', id: 'sales', amount: 31000 },
    ],
  },
];

function lineage(id: ScenarioId): Scenario[] {
  const s = SCENARIOS.find((x) => x.id === id)!;
  return s.parent ? [...lineage(s.parent), s] : [s];
}

function resolve(base: Line[], id: ScenarioId) {
  let lines = base.map((l) => ({ ...l, own: false }));
  for (const s of lineage(id)) {
    for (const c of s.changes) {
      if (c.kind === 'add') lines = [...lines, { ...c.line, own: s.id === id }];
      else lines = lines.map((l) => (l.id === c.id ? { ...l, amount: c.amount, own: s.id === id } : l));
    }
  }
  return lines;
}

export function BranchDemo() {
  const t = useT();
  const b = t.branch;
  const lang = useLang();
  const [rent, setRent] = useState(7600);
  const id = useId();
  const nf = new Intl.NumberFormat(lang === 'he' ? 'he-IL' : 'en-US');
  const fmt = (n: number) => `${n < 0 ? '−' : ''}${nf.format(Math.abs(n))}`;
  const base: Line[] = [
    { id: 'sales', amount: 26000 },
    { id: 'rent', amount: -rent },
    { id: 'materials', amount: -6200 },
  ];

  return (
    <div className="canvas cv-pw">
      <div className="canvas__label">
        <span>
          <span className="badge" style={{ color: '#1f55c0' }}>{b.badge}</span> {b.label}
        </span>
        <span>{b.net}</span>
      </div>

      <div className="pw-board">
        <div className="pw-control">
          <label htmlFor={id}>
            {b.rent} <b>{nf.format(rent)}</b> {b.perMonth}
          </label>
          <input id={id} type="range" min={5000} max={11000} step={100} value={rent} onChange={(e) => setRent(Number(e.target.value))} />
        </div>

        <div className="pw-row">
          {SCENARIOS.map((s) => {
            const lines = resolve(base, s.id);
            const net = lines.reduce((a, l) => a + l.amount, 0);
            return (
              <section className="pw-sheet" key={s.id} style={{ ['--c' as string]: s.color }} aria-label={b.scenarios[s.id]}>
                <strong className="pw-name">{b.scenarios[s.id]}</strong>
                <small>{s.parent ? b.changes(s.changes.length, b.scenarios[s.parent]) : b.lineCount(lines.length)}</small>
                {lines.map((l) => (
                  <div className="pw-line" key={l.id} data-own={l.own}>
                    <span>{b.lines[l.id]}</span>
                    <span className="pw-amount" key={l.amount} dir="ltr">{fmt(l.amount)}</span>
                  </div>
                ))}
                <div className="pw-total">
                  <span>{b.total}</span>
                  <b data-neg={net < 0} key={net} dir="ltr">{fmt(net)}</b>
                </div>
              </section>
            );
          })}
        </div>

        <p className="pw-note">{b.note}</p>
      </div>
    </div>
  );
}
