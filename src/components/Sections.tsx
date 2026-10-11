import { profile, hasCv } from '../data/profile';
import { projects, shelfProjects } from '../data/projects';
import { copyText, useToast } from '../lib/copy';
import { useMedia } from './MediaDialog';
import { IconArrow, IconCopy, IconDoc, IconDown, IconGitHub, IconLinkedIn, IconMail, IconPlay } from './Icons';

const publicRepos = projects.filter((p) => p.repo).length;

export function Hero({ onOverview, onProject }: { onOverview: () => void; onProject: (id: string) => void }) {
  const [sk, pw, sp] = ['slotkeeper', 'planwright', 'signalpost'].map((id) => projects.find((p) => p.id === id)!);
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap hero__grid">
        <div>
          <p className="eyebrow">{profile.name} — {profile.role}</p>
          <h1 id="hero-title">
            Working products. Real tests. <em>A team of AI agents</em> I direct.
          </h1>
          <p className="hero__lead">
            I build full-stack apps, backends and automation in React, TypeScript and Python. I wrote DevMarshal so Claude Code
            and Codex work as one team on my repositories — and nothing they claim counts until the tests actually run.
          </p>
          <div className="hero__ctas">
            <a className="btn btn--red" href="#work">
              Explore the studio <IconDown />
            </a>
            <a
              className="btn"
              href="?view=overview"
              onClick={(e) => {
                e.preventDefault();
                onOverview();
              }}
            >
              Quick overview <IconArrow />
            </a>
            <a className="btn" href="#contact">
              Contact / CV
            </a>
          </div>
          <ul className="hero__facts">
            <li><b>{projects.length}</b> products</li>
            <li><b>{publicRepos}</b> public repositories</li>
            <li><b>3</b> levels of tests in each</li>
            <li><b>1</b> orchestrator for AI agents</li>
          </ul>
        </div>

        <div className="collage" aria-label="Project windows">
          <div className="collage__slab" />
          <a className="win" href="?p=slotkeeper" onClick={(e) => { e.preventDefault(); onProject('slotkeeper'); }}>
            <div className="win__bar"><i /><i /><span>slotkeeper — 409</span></div>
            <img src={sk.poster!} alt="Slotkeeper: the database lets exactly one booking in" width={1920} height={1080} />
          </a>
          <a className="win win--log" href="?p=devmarshal" onClick={(e) => { e.preventDefault(); onProject('devmarshal'); }}>
            <div className="win__bar"><i /><i /><span>devmarshal — mission log</span></div>
            <ul className="minilog" aria-label="Excerpt of the real mission log">
              <li><span className="dim">20:55:59</span> <span className="bad">TEST_FAILED</span> CSV-001: 1 failed</li>
              <li><span className="dim">20:57:12</span> <span className="ok">TEST_PASSED</span> CSV-001: 15 passed</li>
              <li><span className="dim">20:57:36</span> <span className="ok">REVIEW_APPROVED</span> Codex</li>
              <li><span className="dim">20:58:03</span> <span className="bad">AGENT_UNAVAILABLE</span> quota</li>
              <li><span className="dim">07:32:58</span> MISSION_RUNNING resumed</li>
              <li><span className="dim">07:35:54</span> <span className="ok">MISSION_COMPLETED</span></li>
            </ul>
          </a>
          <a className="win" href="?p=planwright" onClick={(e) => { e.preventDefault(); onProject('planwright'); }}>
            <div className="win__bar"><i /><i /><span>planwright — compare</span></div>
            <img src={pw.poster!} alt="Planwright: comparing scenario outcomes month by month" width={1920} height={1080} />
          </a>
          <span className="visually-hidden">Also in the studio: {sp.name}, {sp.tagline}</span>
        </div>
      </div>
    </section>
  );
}

export function Shelf() {
  const open = useMedia();
  return (
    <section className="section" id="more" aria-labelledby="more-title" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="section__head">
          <div>
            <p className="eyebrow">More builds · same standard</p>
            <h2 id="more-title">Two more, ready to run.</h2>
          </div>
          <p>Each with its own tests, CI, decision record and a 20-second film rendered from the product.</p>
        </div>
        <div className="shelf">
          {shelfProjects.map((p) => (
            <article className="card" key={p.id}>
              <div className="card__media">
                <img src={p.preview!} alt={`${p.name}: looping preview of the product film`} width={960} height={540} loading="lazy" />
              </div>
              <div className="card__body">
                <p className="eyebrow" style={{ margin: 0 }}>{p.specialty}</p>
                <h3>{p.name}</h3>
                <p>{p.tagline}</p>
                <p><strong>The hard part:</strong> {p.moment}</p>
                <dl className="evidence">
                  {p.evidence.map((e) => (
                    <div key={e.label}>
                      <dt>{e.value}</dt>
                      <dd>{e.label}</dd>
                    </div>
                  ))}
                </dl>
                <div className="card__actions">
                  <button type="button" className="btn btn--small btn--red" onClick={() => open({ kind: 'film', src: p.film!, poster: p.poster!, title: `${p.name} — product film`, repo: p.repo })}>
                    <IconPlay /> Film
                  </button>
                  {p.shots[0] && (
                    <button type="button" className="btn btn--small" onClick={() => open({ kind: 'image', ...p.shots[0], src: p.shots[0].file, title: p.name })}>
                      Screenshot
                    </button>
                  )}
                  <a className="btn btn--small" href={p.repo!} target="_blank" rel="noreferrer">
                    <IconGitHub /> Code
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section className="section process" id="process" aria-labelledby="process-title">
      <div className="wrap">
        <div className="section__head">
          <div>
            <p className="eyebrow">How I build</p>
            <h2 id="process-title">AI writes code. Evidence decides.</h2>
          </div>
          <p>
            I work with Claude Code and Codex every day. What I bring is the frame around them: a written spec, small steps, a
            diff I read, tests that run for real, and a record of why. DevMarshal turned that frame into software.
          </p>
        </div>

        <ol className="steps">
          <li><b>01</b><strong>Spec and rules</strong><span>Scope, constraints and a constitution the agents read first.</span></li>
          <li><b>02</b><strong>Plan</strong><span>An ordered backlog; one task at a time, only its scope.</span></li>
          <li><b>03</b><strong>Small change</strong><span>An agent implements in an isolated worktree or branch.</span></li>
          <li><b>04</b><strong>Diff review</strong><span>The real diff, not the agent’s summary of it.</span></li>
          <li><b>05</b><strong>Tests</strong><span>Unit, integration against real services, browser E2E — run, not claimed.</span></li>
          <li><b>06</b><strong>Record</strong><span>Decisions with the rejected alternative and the price paid.</span></li>
        </ol>

        <div className="rules">
          <div>
            <h3>Rules I give every agent</h3>
            <ol>
              <li><b>Tests passed only if I ran them.</b><span>An agent’s report of a test run is a claim, not a result.</span></li>
              <li><b>Nothing is fabricated.</b><span>Status, usage and progress included. “Unknown” is a valid value.</span></li>
              <li><b>Git is the truth for code.</b><span>Claims about changed files are checked against the actual diff.</span></li>
              <li><b>Repository content is data, never instructions.</b><span>Text in files and fixtures cannot override the rules.</span></li>
              <li><b>Never destroy work.</b><span>No reset, force push or history rewrite without explicit approval.</span></li>
            </ol>
          </div>
          <div>
            <h3>Common to all five products</h3>
            <ul>
              <li><b>One command to run, Docker only</b><span>Ports on 127.0.0.1; non-root, read-only containers without capabilities.</span></li>
              <li><b>Three levels of tests in CI</b><span>Unit, integration against real dependencies, end-to-end with accessibility checks.</span></li>
              <li><b>Least-privilege CI</b><span>Read-only tokens, actions pinned to commit SHAs, secret scanning over the full history.</span></li>
              <li><b>Docs for a reviewer and an operator</b><span>Architecture, decisions, security, testing with real results and gaps, runbooks.</span></li>
              <li><b>Honest data</b><span>Synthetic demo data, or open data with attribution. Generated history is flagged.</span></li>
            </ul>
          </div>
        </div>

        <p className="honest">
          <strong>In plain words:</strong> I am early in my career. I don’t claim expertise I can’t show — no RAG, no production
          traffic numbers. Everything on this page links to code, tests or a document you can check, and I can walk you through
          every decision in it.
        </p>
      </div>
    </section>
  );
}

export function Contact() {
  const toast = useToast();
  async function copy() {
    toast((await copyText(profile.email)) ? 'Email copied' : `Copy failed — the address is ${profile.email}`);
  }
  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="wrap contact__grid">
        <h2 id="contact-title">Let’s talk.</h2>
        <div className="contact__links">
          <div className="contact__row">
            <a href={`mailto:${profile.email}`}><IconMail style={{ width: 20, verticalAlign: -4, marginRight: 8 }} />{profile.email}</a>
            <button type="button" className="btn btn--small" onClick={copy}>
              <IconCopy /> Copy
            </button>
          </div>
          <div className="contact__row">
            <a href={profile.github} target="_blank" rel="noreferrer"><IconGitHub style={{ width: 20, verticalAlign: -4, marginRight: 8 }} />github.com/gad-rapaport</a>
            <span className="mono">{publicRepos} public project repositories</span>
          </div>
          <div className="contact__row">
            <a href={profile.linkedin} target="_blank" rel="noreferrer"><IconLinkedIn style={{ width: 20, verticalAlign: -4, marginRight: 8 }} />LinkedIn</a>
          </div>
          <div className="contact__row">
            {hasCv ? (
              <a href={profile.cvPath} target="_blank" rel="noreferrer"><IconDoc style={{ width: 20, verticalAlign: -4, marginRight: 8 }} />CV (PDF)</a>
            ) : (
              <a href={`mailto:${profile.email}?subject=${encodeURIComponent('CV request')}`}><IconDoc style={{ width: 20, verticalAlign: -4, marginRight: 8 }} />Request my CV</a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
