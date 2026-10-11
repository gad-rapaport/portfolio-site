import { hasCv, profile } from '../data/profile';
import { projects } from '../data/projects';

// The short path: everything an interviewer needs on one calm page, no motion and no pinned scenes.
// It is also the fallback for reduced motion and slow devices.

const skills = [
  { name: 'Backend and databases', proof: 'Slotkeeper: exclusion constraints, advisory locks, idempotency; Fieldline: roles and conflicts on the server' },
  { name: 'Frontend', proof: 'Planwright: state design, undo/redo, offline, accessibility, a size budget' },
  { name: 'APIs and integration', proof: 'Airwise: schema validation, retries, circuit breaker, call budget' },
  { name: 'DevOps and security', proof: 'Signalpost: SSRF-safe outbound policy, backups, drills; hardened Docker and CI in all five' },
  { name: 'Working with AI agents', proof: 'DevMarshal: orchestrating Codex and Claude Code with real validation and crash recovery' },
  { name: 'Testing', proof: 'Unit, integration against real services and Playwright E2E with axe, in CI for every project' },
];

export function Overview({ onProject }: { onProject: (id: string) => void }) {
  return (
    <main className="overview" id="main">
      <div className="wrap">
        <p className="eyebrow" style={{ color: 'var(--muted-ink)' }}>Quick overview</p>
        <h1>{profile.name}</h1>
        <p className="lead">
          Software developer, early in my career. Full-stack apps, backends and automation in React, TypeScript and Python, with
          PostgreSQL, SQLite and Docker. I work with Claude Code and Codex, and I built the tool that runs them as a team.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <a className="btn" href={`mailto:${profile.email}`}>{profile.email}</a>
          <a className="btn" href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
          <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          {hasCv ? (
            <a className="btn" href={profile.cvPath} target="_blank" rel="noreferrer">CV (PDF)</a>
          ) : (
            <a className="btn" href={`mailto:${profile.email}?subject=${encodeURIComponent('CV request')}`}>Request CV</a>
          )}
        </div>

        <h2>Projects</h2>
        <ul className="ov-list">
          {projects.map((p) => (
            <li key={p.id}>
              <div>
                <strong>{p.name}</strong>
                <small>{p.specialty}</small>
              </div>
              <p>
                {p.tagline}
                <span className="proof">{p.evidence[0].value} — {p.evidence[0].label}</span>
              </p>
              <div className="ov-links">
                {p.tier === 'stage' && (
                  <a
                    href={`?p=${p.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onProject(p.id);
                    }}
                  >
                    Case study
                  </a>
                )}
                {p.repo ? (
                  <a href={p.repo} target="_blank" rel="noreferrer">Code ↗</a>
                ) : (
                  <span>private repo</span>
                )}
              </div>
            </li>
          ))}
        </ul>

        <h2>Skills, with the proof</h2>
        <div className="ov-skills">
          {skills.map((s) => (
            <div key={s.name}>
              <b>{s.name}</b>
              <span>{s.proof}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
