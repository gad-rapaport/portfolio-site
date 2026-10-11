// Condenses DevMarshal's real Milestone B event log (docs/evidence/bl1004-events.jsonl in the private
// repository) into src/data/mission-log.json for the replay on the page. Bookkeeping events (effect journal,
// process start/run) are dropped; every kept event keeps its original sequence number and timestamp.
//
//   node scripts/build-mission-log.mjs [path/to/bl1004-events.jsonl]
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const source = process.argv[2] ?? 'C:/dev/deadpool/docs/evidence/bl1004-events.jsonl';
const keep = new Set([
  'MISSION_CREATED', 'WORKTREE_CREATED', 'AGENT_STARTED', 'REVIEW_STARTED', 'RUN_SUCCEEDED', 'RUN_FAILED',
  'TASK_CREATED', 'PLAN_PROPOSED', 'HUMAN_APPROVAL_REQUIRED', 'HUMAN_APPROVED', 'TEST_PASSED', 'TEST_FAILED',
  'TASK_CHANGES_REQUESTED', 'REVIEW_APPROVED', 'COMMIT_CREATED', 'AGENT_UNAVAILABLE', 'TASK_WAITING',
  'MISSION_RUNNING', 'TASK_HUMAN_REQUIRED', 'MISSION_COMPLETED', 'TASK_DONE',
]);
const agentName = (s) => s.replace(/\bCLAUDE CODE\b/g, 'Claude Code').replace(/\bCODEX\b/g, 'Codex')
  .replace(/^claude /, 'Claude Code ').replace(/^codex /, 'Codex ');

const events = readFileSync(source, 'utf8').trim().split('\n').map((l) => JSON.parse(l))
  .filter((e) => keep.has(e.type))
  .filter((e) => !(e.type === 'MISSION_RUNNING' && e.summary.startsWith('plan accepted')))
  .map((e) => {
    let summary = agentName(e.summary);
    if (e.type === 'MISSION_CREATED') summary = 'M-2026-001: build three features in a small ledger library, each as its own task';
    if (e.type === 'WORKTREE_CREATED') summary = 'mission worktree ready on mission/M-2026-001 (your checkout is not touched)';
    if (summary.length > 150) summary = summary.slice(0, 147).trimEnd() + '…';
    const agent = /Claude Code/.test(summary) ? 'claude' : /Codex/.test(summary) ? 'codex' : null;
    return { seq: e.seq, at: e.at, type: e.type, task: e.task_id, agent, summary };
  });

const out = join(import.meta.dirname, '..', 'src', 'data', 'mission-log.json');
writeFileSync(out, JSON.stringify({ source: 'docs/evidence/bl1004-events.jsonl', total: 213, events }, null, 1) + '\n');
console.log(`${events.length} of 213 events kept`);
