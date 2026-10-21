import { hasCv, profile } from '../data/profile';
import { useLang, useProjects, useT } from '../i18n';
import { useMedia } from './MediaDialog';

// The short path: everything an interviewer needs on one calm page, no motion and no pinned scenes.
// It is also the fallback for reduced motion and slow devices.

export function Overview({ onProject }: { onProject: (id: string) => void }) {
  const t = useT();
  const o = t.overview;
  const lang = useLang();
  const { all } = useProjects();
  const open = useMedia();
  const d = profile.diploma;
  return (
    <main className="overview" id="main">
      <div className="wrap">
        <p className="eyebrow" style={{ color: 'var(--muted-ink)' }}>{o.eyebrow}</p>
        <h1>{t.name}</h1>
        <p className="lead">{o.lead}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <a className="btn" href={`mailto:${profile.email}`} dir="ltr">{profile.email}</a>
          <a className="btn" href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
          <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a className="btn" href={profile.instagram} target="_blank" rel="noreferrer">Instagram</a>
          {hasCv ? (
            <a className="btn" href={profile.cv[lang]} target="_blank" rel="noreferrer">{t.contact.cv}</a>
          ) : (
            <a className="btn" href={`mailto:${profile.email}?subject=${encodeURIComponent('CV request')}`}>{t.contact.requestCv}</a>
          )}
        </div>

        <h2>{o.education}</h2>
        <p className="ov-edu">
          <strong>{t.creds.degree} — {t.creds.track}</strong>
          <span>{t.creds.school} {t.creds.eligible} {t.creds.eligibleDate}.</span>
          <button
            type="button"
            className="linklike"
            onClick={() => open({ kind: 'image', src: d.src, alt: t.creds.certAlt, w: d.w, h: d.h, title: t.creds.certTitle, note: t.creds.redacted })}
          >
            {t.creds.view}
          </button>
        </p>

        <h2>{o.projects}</h2>
        <ul className="ov-list">
          {all.map((p) => (
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
                    {o.caseStudy}
                  </a>
                )}
                {p.repo ? (
                  <a href={p.repo} target="_blank" rel="noreferrer">{o.code}</a>
                ) : (
                  <span>{o.private}</span>
                )}
              </div>
            </li>
          ))}
        </ul>

        <h2>{o.skills}</h2>
        <div className="ov-skills">
          {o.skillList.map(([name, proof]) => (
            <div key={name}>
              <b>{name}</b>
              <span>{proof}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
