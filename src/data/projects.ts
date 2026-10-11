import media from './media.json';

// Single source of truth for every project on the page. Every number here comes from the project's own
// repository (README, STATUS, TESTING, MILESTONE_B) as of 2026-10-11; `source` fields say where.

export type LayerId = 'product' | 'hood' | 'build';
export type Tier = 'stage' | 'shelf';
export type NodeKind = 'ui' | 'api' | 'service' | 'data' | 'agent';

export interface ArchNode {
  id: string;
  label: string;
  kind: NodeKind;
  role: string;
  file?: string;
}

export interface Shot {
  file: string;
  alt: string;
  w: number;
  h: number;
}

export interface Project {
  id: string;
  name: string;
  specialty: string;
  tier: Tier;
  tagline: string;
  problem: string;
  built: string[];
  moment: string;
  stack: string[];
  evidence: { value: string; label: string }[];
  architecture: ArchNode[];
  decision: { title: string; choice: string; alternative: string; cost: string; source: string };
  build: { tests: { value: string; label: string }[]; checks: string[]; docs: { label: string; path: string }[] };
  repo: string | null;
  status: string;
  updated: string;
  film: string | null;
  poster: string | null;
  preview: string | null;
  shots: Shot[];
}

const GH = 'https://github.com/gad-rapaport';

type MediaId = keyof typeof media;

function shots(id: MediaId, list: [string, string][]): Shot[] {
  const sizes = media[id].screenshots as Record<string, { w: number; h: number }>;
  return list.map(([file, alt]) => ({ file: `/media/${id}/${file}.webp`, alt, ...sizes[file] }));
}

function filmMedia(id: MediaId) {
  return { film: `/media/${id}/film.mp4`, poster: `/media/${id}/poster.jpg`, preview: `/media/${id}/preview.webp` };
}

export const projects: Project[] = [
  {
    id: 'devmarshal',
    name: 'DevMarshal',
    specialty: 'AI tooling · orchestration',
    tier: 'stage',
    tagline: 'Codex and Claude Code, working as one engineering team on your repository.',
    problem:
      'With several AI coding agents, the developer becomes the message bus: copy the plan from one tool to the next, run the tests, paste the failures back, decide what to commit. DevMarshal takes that job.',
    built: [
      'Roles (planner, implementer, reviewer, debugger) assigned to installed agent CLIs: Codex, Claude Code, Gemini CLI, Ollama.',
      'It runs the tests itself and trusts exit codes, not the agent’s report.',
      'Every mission works in its own managed Git worktree; your checkout is never touched. Each approved task becomes one checkpoint commit.',
      'Every external effect is journalled, so a crash at any line is reconciled on restart instead of repeated blindly.',
      'A Hebrew and English UI with live state, approvals, notifications, a diagnostics bundle and a Windows installer.',
    ],
    moment:
      'On 7–8 October 2026 a real three-task mission ran end to end with no manual message passing: one failed test fixed in the loop, a Claude Code quota limit waited out and resumed by itself, and three reviewer crashes stopped by loop protection instead of committing.',
    stack: ['Python 3.12', 'FastAPI', 'SQLite', 'asyncio', 'React', 'TypeScript', 'Vite', 'SSE', 'PyInstaller', 'Inno Setup'],
    evidence: [
      { value: '3 / 3', label: 'tasks done in the first real mission, 3 checkpoint commits' },
      { value: '213', label: 'events in the exported mission log' },
      { value: '57', label: 'architecture decisions recorded with alternatives' },
      { value: '20', label: 'orchestration scenarios in CI on Windows and Linux' },
    ],
    architecture: [
      { id: 'ui', label: 'React UI', kind: 'ui', role: 'Mission control, tasks, Git timeline, approvals. REST for commands, a server-sent event stream for live state. Shows real values or “unknown”, never invented ones.' },
      { id: 'api', label: 'api', kind: 'api', role: 'HTTP and SSE on 127.0.0.1 only, session cookie and Host allowlist, request validation, error-to-message mapping. No workflow logic.' },
      { id: 'engine', label: 'orchestration.engine', kind: 'service', role: 'A persisted reconciler: one loop per active mission decides the next step, enforces loop guards, gates and scheduling. Never calls a provider or Git directly.' },
      { id: 'validation', label: 'validation', kind: 'service', role: 'The only test authority. Runs user-approved commands and reports NOT_RUN, PASSED, FAILED or UNAVAILABLE from exit codes.' },
      { id: 'gitops', label: 'gitops', kind: 'service', role: 'The only module that runs git, through a subcommand allowlist. Worktrees, diffs, risk classification, checkpoint commits with Task-Id trailers.' },
      { id: 'agents', label: 'agents.supervisor', kind: 'agent', role: 'One adapter contract for every CLI. Owns child processes, classifies failures (crash, quota, timeout), backs off between restarts.' },
      { id: 'persistence', label: 'SQLite', kind: 'data', role: 'State tables and an append-only event log written in the same transaction, plus the effect journal used for crash recovery.' },
    ],
    decision: {
      title: 'An agent saying “tests pass” is a claim',
      choice: 'PASSED and FAILED come only from commands the validation subsystem runs itself. Agents can suggest commands and explain failures, never report the result.',
      alternative: 'Parse the agent’s own summary of its test run, as most wrappers do.',
      cost: 'A project without runnable tests shows NOT_RUN, which looks worse.',
      source: 'DEC-015, DEC-016 (implement → test → review, so reviewers never spend tokens on failing code)',
    },
    build: {
      tests: [
        { value: '264', label: 'Python, Vitest and Playwright test functions' },
        { value: '20', label: 'mandatory orchestration scenarios' },
        { value: 'axe', label: 'on every screen, RTL and 390 px checks' },
      ],
      checks: [
        'Kill tests: the process is hard-killed mid-mission and must recover',
        'Installer install, upgrade with migration, and uninstall tested in CI',
        'A test enforces that the core never names a brand or a provider',
        'Sanitized diagnostics bundle with a preview before it is saved',
      ],
      docs: [
        { label: 'MASTER.md — the constitution every agent works under', path: '' },
        { label: 'DECISIONS.md — 57 decisions', path: '' },
        { label: 'MILESTONE_B.md — the first real mission', path: '' },
      ],
    },
    repo: null,
    status: 'V1 for private use',
    updated: '2026-10-10',
    film: null,
    poster: null,
    preview: null,
    shots: [],
  },
  {
    id: 'slotkeeper',
    name: 'Slotkeeper',
    specialty: 'Backend',
    tier: 'stage',
    tagline: 'Booking for rooms, desks and equipment where two people can never hold the same slot.',
    problem:
      'Shared offices book meeting rooms, desks and equipment across time zones. When two people press Book on the same slot at the same moment, exactly one must win, and the other must get a clear answer, not a 500 or a duplicate.',
    built: [
      'Day and week schedules per office, in the office’s own time zone, with DST handled.',
      'Opening hours, booking horizon, steps and per-user limits enforced on the server.',
      'Idempotency keys, so a retried request never books twice.',
      'Maintenance blocks that can cancel conflicting bookings in the same transaction, with an activity log.',
    ],
    moment: '30 simultaneous requests for one slot give exactly 1 booking and 29 clean 409 responses, locally and in CI.',
    stack: ['TypeScript', 'Fastify', 'PostgreSQL 18', 'React', 'Zod', 'Docker', 'Playwright'],
    evidence: [
      { value: '30 → 1', label: 'simultaneous requests, one booking, 29 × 409' },
      { value: '0', label: 'failures in 6 full staggered-overlap runs after the lock fix' },
      { value: '23/25 h', label: 'days handled on DST change dates' },
    ],
    architecture: [
      { id: 'ui', label: 'React schedule UI', kind: 'ui', role: 'Day and week views, tap-to-book with no dragging, booking dialog, phone layout.', file: 'web' },
      { id: 'routes', label: 'Fastify routes', kind: 'api', role: 'Sessions, validation with Zod, OpenAPI contract, ISO instants with offsets in and out.', file: 'server/src/routes.ts' },
      { id: 'service', label: 'reservations service', kind: 'service', role: 'One transaction per booking: lock the user, record the idempotency key, check the window, take an advisory lock on the resource, insert, log.', file: 'server/src/modules/reservations/service.ts' },
      { id: 'time', label: 'domain/time', kind: 'service', role: 'Local wall-clock to instants with Intl only: ambiguous autumn times resolve earlier, non-existent spring times move forward.', file: 'server/src/domain/time.ts' },
      { id: 'db', label: 'PostgreSQL', kind: 'data', role: 'EXCLUDE USING gist (resource_id WITH =, period WITH &&) WHERE status = active. The database itself refuses overlaps.', file: 'server/migrations/001_init.sql' },
    ],
    decision: {
      title: 'A lock in front of the constraint',
      choice: 'Take pg_advisory_xact_lock(resource) before inserting, and retry 40P01/40001 at most three times.',
      alternative: 'Rely on the exclusion constraint alone.',
      cost: 'Writers of one resource are serialised. Without the lock, concurrent overlapping inserts deadlocked inside the exclusion index: the staggered test produced intermittent 500s in 2 of 6 runs.',
      source: 'docs/DECISIONS.md#isolation-and-locking',
    },
    build: {
      tests: [
        { value: '20', label: 'unit' },
        { value: '26', label: 'integration against real PostgreSQL' },
        { value: '6', label: 'end-to-end in a browser' },
      ],
      checks: ['30-request contention simulation', 'Gitleaks over the full history', 'Dependency audit and image vulnerability report', 'Actions pinned to commit SHAs'],
      docs: [
        { label: 'DECISIONS.md', path: 'docs/DECISIONS.md' },
        { label: 'ARCHITECTURE.md', path: 'docs/ARCHITECTURE.md' },
        { label: 'openapi.yaml', path: 'docs/openapi.yaml' },
      ],
    },
    repo: `${GH}/slotkeeper`,
    status: 'v0.1.0',
    updated: '2026-10-04',
    ...filmMedia('slotkeeper'),
    shots: shots('slotkeeper', [
      ['day', 'Slotkeeper day schedule for one office, free and taken slots per resource'],
      ['week', 'Slotkeeper week view for one resource'],
      ['booking-dialog', 'Booking dialog with start time and duration'],
      ['mobile-day', 'Slotkeeper day schedule on a phone'],
    ]),
  },
  {
    id: 'planwright',
    name: 'Planwright',
    specialty: 'Frontend',
    tier: 'stage',
    tagline: 'Branch a budget into what-if scenarios and compare them, entirely in the browser.',
    problem:
      'A small business owner weighing two decisions needs to see each one’s effect on cash, side by side, without copying spreadsheets that drift apart the moment the baseline changes.',
    built: [
      'Scenarios branch from the baseline and from each other, and store only what they change.',
      'Undo and redo for every change, including deletes and imports; typing in one field is one step.',
      'Works offline after the first visit, with an explicit “New version: reload” prompt.',
      'Versioned JSON export and import with migration, CSV export that neutralises spreadsheet formulas, a print report.',
    ],
    moment: 'Change the rent in the baseline and every scenario that has not overridden it updates; each branch’s change list is exactly what it assumes.',
    stack: ['React', 'TypeScript', 'Vite', 'Zod', 'Service worker', 'nginx', 'Playwright'],
    evidence: [
      { value: '117 KB', label: 'compressed JavaScript before the editor renders' },
      { value: 'offline', label: 'after the first visit, checked with two builds' },
      { value: '8', label: 'scenarios at most, branched to any depth' },
    ],
    architecture: [
      { id: 'ui', label: 'React UI', kind: 'ui', role: 'Branch editor, compare view with a keyboard-readable chart, print view, light and dark.', file: 'src/ui' },
      { id: 'store', label: 'StoreProvider', kind: 'service', role: 'History<Workspace> reducer: immutable snapshots that share unchanged branches, coalesced edits, announcements for undo.', file: 'src/state/store.tsx' },
      { id: 'scenario', label: 'domain/scenario', kind: 'service', role: 'resolve() folds the lineage’s changes over the baseline; edit rules and orphan pruning.', file: 'src/domain/scenario.ts' },
      { id: 'engine', label: 'domain/engine', kind: 'service', role: 'project(items, months, opening) → monthly rows and a summary, pure functions.', file: 'src/domain/engine.ts' },
      { id: 'io', label: 'file format', kind: 'api', role: 'Export, parse, migrate and validate with Zod; CSV with formula neutralising.', file: 'src/io' },
      { id: 'storage', label: 'localStorage + Cache Storage', kind: 'data', role: 'Debounced autosave in the browser; the service worker caches the app for offline use.', file: 'src/sw/sw.js' },
    ],
    decision: {
      title: 'Scenarios store changes, not copies',
      choice: 'Each scenario is a list of explicit changes (set, add, remove, opening balance). resolve() is a fold over the lineage.',
      alternative: 'Copy the whole plan per scenario, or compute diffs after the fact.',
      cost: 'Edit rules are needed: a value set back to the parent’s removes the override, structural edits prune changes that point at nothing.',
      source: 'docs/DECISIONS.md#scenarios-store-changes-not-copies',
    },
    build: {
      tests: [
        { value: '65', label: 'unit' },
        { value: '15', label: 'end-to-end, desktop and phone' },
        { value: 'budget', label: 'bundle size checked in CI' },
      ],
      checks: ['axe accessibility checks in E2E', 'Offline and update prompt checked with two builds', 'Gitleaks over the full history', 'CSP and security headers in nginx'],
      docs: [
        { label: 'DECISIONS.md', path: 'docs/DECISIONS.md' },
        { label: 'ARCHITECTURE.md', path: 'docs/ARCHITECTURE.md' },
        { label: 'FILE-FORMAT.md', path: 'docs/FILE-FORMAT.md' },
      ],
    },
    repo: `${GH}/planwright`,
    status: 'v0.1.0',
    updated: '2026-10-04',
    ...filmMedia('planwright'),
    shots: shots('planwright', [
      ['compare', 'Planwright comparing the closing balance of four scenarios'],
      ['plan-branch', 'Branch editor with changed fields marked'],
      ['compare-dark', 'Compare view in the dark theme'],
      ['mobile', 'Planwright on a phone'],
    ]),
  },
  {
    id: 'signalpost',
    name: 'Signalpost',
    specialty: 'DevOps · network security',
    tier: 'stage',
    tagline: 'Uptime monitoring and a status page that cannot be turned into an SSRF tool.',
    problem:
      'A monitoring tool makes requests on an administrator’s behalf. Pointed at the cloud metadata address or the internal network, it becomes a way in. Signalpost has to watch services without ever becoming that.',
    built: [
      'Scheduled HTTP checks with expected status, keyword and slow thresholds.',
      'Incidents open after N failed checks in a row and resolve after M good ones; a public status page without JavaScript.',
      'Every outbound request: host and port allowlist, DNS answers validated, connection pinned to the checked address, no redirects, body capped.',
      'Health and readiness endpoints, optional Prometheus metrics and signed webhooks, retention with daily rollups, online backups with verified restores.',
    ],
    moment: 'A request to 169.254.169.254 is refused in the form with an explanation. A failure drill opens three incidents within about a minute and resolves them after recovery.',
    stack: ['TypeScript', 'Fastify', 'SQLite (WAL)', 'node:http with pinned lookup', 'Prometheus', 'Docker'],
    evidence: [
      { value: '3', label: 'incidents opened by the drill within about a minute, all resolved' },
      { value: 'every push', label: 'backup and restore run in CI' },
      { value: '0', label: 'redirects followed' },
    ],
    architecture: [
      { id: 'web', label: 'Status page and admin', kind: 'ui', role: 'Server-rendered HTML with escaping templates; the public page shows names only, never URLs or error details.', file: 'src/web' },
      { id: 'app', label: 'app.ts', kind: 'api', role: 'Routes, sessions, CSRF, security headers, /healthz, /readyz, /metrics.', file: 'src/app.ts' },
      { id: 'scheduler', label: 'scheduler', kind: 'service', role: 'Due-check loop with a concurrency limit; opens and resolves incidents, sends webhooks in the background.', file: 'src/monitor/scheduler.ts' },
      { id: 'policy', label: 'net/policy', kind: 'service', role: 'URL rules, allowlist, DNS validation: loopback, link-local, metadata, private and reserved ranges refused.', file: 'src/net/policy.ts' },
      { id: 'probe', label: 'net/probe', kind: 'service', role: 'One check: connects to exactly the validated address, TLS verified against the name, one deadline, 64 KB cap.', file: 'src/net/probe.ts' },
      { id: 'db', label: 'SQLite', kind: 'data', role: 'Checks, daily rollups updated in the same transaction, incidents, audit log; online backups.', file: 'src/monitor/repo.ts' },
    ],
    decision: {
      title: 'Its own HTTP client instead of fetch',
      choice: 'node:http and node:https with a custom lookup and agent: false — resolve once, check every address, connect to exactly that one.',
      alternative: 'fetch (undici), which follows redirects by default, resolves names itself and hides the connection.',
      cost: 'About 250 lines of policy and probe code to own and test.',
      source: 'docs/DECISIONS.md#own-http-client-instead-of-fetch',
    },
    build: {
      tests: [
        { value: '64', label: 'unit' },
        { value: '27', label: 'integration' },
        { value: '9', label: 'end-to-end' },
      ],
      checks: ['Failure drill and backup/restore in CI', 'Signed webhooks verified by a receiver', 'Hardened containers: non-root, read-only, no capabilities', 'Runbooks for operators'],
      docs: [
        { label: 'SECURITY.md', path: 'docs/SECURITY.md' },
        { label: 'DECISIONS.md', path: 'docs/DECISIONS.md' },
        { label: 'RUNBOOKS.md', path: 'docs/RUNBOOKS.md' },
      ],
    },
    repo: `${GH}/signalpost`,
    status: 'v0.1.0',
    updated: '2026-10-04',
    ...filmMedia('signalpost'),
    shots: shots('signalpost', [
      ['status', 'Signalpost public status page, all systems operational'],
      ['status-outage', 'The same status page during a failure drill'],
      ['policy-blocked', 'A monitor for a metadata address refused by the outbound policy'],
      ['admin-monitors', 'Admin overview of monitors'],
    ]),
  },
  {
    id: 'fieldline',
    name: 'Fieldline',
    specialty: 'Full Stack',
    tier: 'shelf',
    tagline: 'Service requests and field work for a maintenance team, with roles enforced on the server.',
    problem: 'A small maintenance team tracks requests, tasks and technicians in one place, with rules that stop a request being resolved before its work is done.',
    built: [
      'Three roles enforced on the server; a status machine with legal transitions only.',
      'Resolving needs every task done and a resolution note.',
      'Concurrent edits never overwrite silently: a stale save gets a 409 and a side-by-side comparison.',
      'A dashboard computed from the live tables.',
    ],
    moment: 'Two people edit the same request; the second sees a conflict view instead of losing the first person’s change.',
    stack: ['TypeScript', 'Fastify', 'PostgreSQL', 'React', 'Docker'],
    evidence: [
      { value: '409', label: 'and a comparison view on concurrent edits' },
      { value: '84', label: 'tests: 27 unit, 49 integration, 8 E2E' },
    ],
    architecture: [],
    decision: { title: '', choice: '', alternative: '', cost: '', source: '' },
    build: { tests: [], checks: [], docs: [] },
    repo: `${GH}/fieldline`,
    status: 'v0.1.0',
    updated: '2026-10-04',
    ...filmMedia('fieldline'),
    shots: shots('fieldline', [
      ['dashboard', 'Fieldline dashboard: open work, overdue, technician load'],
      ['request-detail', 'A service request with its tasks'],
    ]),
  },
  {
    id: 'airwise',
    name: 'Airwise',
    specialty: 'Integrations · data',
    tier: 'shelf',
    tagline: 'Air quality across ten cities from one validated request, honest when the provider is down.',
    problem: 'An external API is slow, rate-limited and sometimes down. The app still has to answer, and say how old its answer is.',
    built: [
      'Ten locations in one provider request, validated against a strict schema.',
      'Timeouts, retries with jittered backoff, Retry-After, a call budget, a circuit breaker and request coalescing.',
      'Every view shows where the data came from and how old it is.',
      'An accessible SVG chart with markers and direct labels, or an equivalent table.',
    ],
    moment: 'Switch the provider off and the app shows saved data with its age instead of an error.',
    stack: ['Python', 'FastAPI', 'SQLite', 'React', 'SVG', 'Docker'],
    evidence: [
      { value: '1', label: 'provider request for all ten cities' },
      { value: '82', label: 'tests: 59 Python, 16 web, 7 E2E' },
    ],
    architecture: [],
    decision: { title: '', choice: '', alternative: '', cost: '', source: '' },
    build: { tests: [], checks: [], docs: [] },
    repo: `${GH}/airwise`,
    status: 'v0.1.0',
    updated: '2026-10-04',
    ...filmMedia('airwise'),
    shots: shots('airwise', [
      ['overview', 'Airwise overview of ten cities'],
      ['daily-aqi', 'Daily air quality index with forecast'],
    ]),
  },
];

export const stageProjects = projects.filter((p) => p.tier === 'stage');
export const shelfProjects = projects.filter((p) => p.tier === 'shelf');
export const findProject = (id: string | null) => stageProjects.find((p) => p.id === id) ?? stageProjects[0];
