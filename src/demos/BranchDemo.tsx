import { useId, useState } from 'react';

// Illustrates Planwright's core rule (src/domain/scenario.ts): a scenario stores only its changes, and
// resolve() folds the changes of its lineage over the baseline. The amounts are made up for the example.

interface Line {
  id: string;
  name: string;
  amount: number;
}
type Change = { kind: 'set'; id: string; amount: number } | { kind: 'add'; line: Line };
interface Scenario {
  id: string;
  name: string;
  parent: string | null;
  color: string;
  changes: Change[];
}

const SCENARIOS: Scenario[] = [
  { id: 'base', name: 'Baseline', parent: null, color: '#2f6fdf', changes: [] },
  {
    id: 'apprentice',
    name: 'Hire an apprentice',
    parent: 'base',
    color: '#1f9d6b',
    changes: [{ kind: 'add', line: { id: 'apprentice', name: 'Apprentice wage', amount: -7500 } }],
  },
  {
    id: 'space',
    name: 'Apprentice + bigger space',
    parent: 'apprentice',
    color: '#e0782f',
    changes: [
      { kind: 'set', id: 'rent', amount: -11500 },
      { kind: 'set', id: 'sales', amount: 31000 },
    ],
  },
];

function lineage(id: string): Scenario[] {
  const s = SCENARIOS.find((x) => x.id === id)!;
  return s.parent ? [...lineage(s.parent), s] : [s];
}

function resolve(base: Line[], id: string) {
  let lines = base.map((l) => ({ ...l, own: false }));
  for (const s of lineage(id)) {
    for (const c of s.changes) {
      if (c.kind === 'add') lines = [...lines, { ...c.line, own: s.id === id }];
      else lines = lines.map((l) => (l.id === c.id ? { ...l, amount: c.amount, own: s.id === id } : l));
    }
  }
  return lines;
}

const fmt = (n: number) => `${n < 0 ? '−' : ''}${Math.abs(n).toLocaleString('en-US')}`;

export function BranchDemo() {
  const [rent, setRent] = useState(7600);
  const id = useId();
  const base: Line[] = [
    { id: 'sales', name: 'Sales', amount: 26000 },
    { id: 'rent', name: 'Workshop rent', amount: -rent },
    { id: 'materials', name: 'Materials', amount: -6200 },
  ];

  return (
    <div className="canvas cv-pw">
      <div className="canvas__label">
        <span>
          <span className="badge" style={{ color: '#1f55c0' }}>Illustration</span> of resolve() · made-up amounts
        </span>
        <span>monthly net</span>
      </div>

      <div className="pw-board">
        <div className="pw-control">
          <label htmlFor={id}>
            Baseline workshop rent: <b>{rent.toLocaleString('en-US')}</b> / month
          </label>
          <input id={id} type="range" min={5000} max={11000} step={100} value={rent} onChange={(e) => setRent(Number(e.target.value))} />
        </div>

        <div className="pw-row">
          {SCENARIOS.map((s) => {
            const lines = resolve(base, s.id);
            const net = lines.reduce((a, l) => a + l.amount, 0);
            return (
              <section className="pw-sheet" key={s.id} style={{ ['--c' as string]: s.color }} aria-label={s.name}>
                <strong className="pw-name">{s.name}</strong>
                <small>{s.parent ? `${s.changes.length} change${s.changes.length > 1 ? 's' : ''} · from ${SCENARIOS.find((x) => x.id === s.parent)!.name}` : `${lines.length} lines`}</small>
                {lines.map((l) => (
                  <div className="pw-line" key={l.id} data-own={l.own}>
                    <span>{l.name}</span>
                    <span>{fmt(l.amount)}</span>
                  </div>
                ))}
                <div className="pw-total">
                  <span>net</span>
                  <b data-neg={net < 0}>{fmt(net)}</b>
                </div>
              </section>
            );
          })}
        </div>

        <p className="pw-note">
          Move the rent: the apprentice branch follows the baseline because it never changed the rent. The bigger-space branch
          set its own rent, so it stays put. A branch is only the list marked <b>●</b> — that list is also what the printed
          report explains.
        </p>
      </div>
    </div>
  );
}
