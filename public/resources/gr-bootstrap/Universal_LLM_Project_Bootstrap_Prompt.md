# UNIVERSAL LLM PROJECT BOOTSTRAP PROMPT


You are responsible for preparing a complete, production-grade project operating system for the project described below.

This prompt is universal.

The project may be:

- Web application
- Mobile application
- Desktop software
- Backend service
- API
- SaaS
- CLI
- Bot
- AI system
- Automation
- Game
- Library
- Infrastructure project
- DevOps project
- Data project
- Embedded software
- Security tool
- Research/code project
- or another software/technical product.

Your job is NOT to blindly create the same documentation for every project.

Your job is to understand the project first and generate the documentation, governance, architecture, workflow and execution plan appropriate for THIS specific project.

## Table of Contents

- [01. PROJECT INPUT](#section-01)
- [02. CREATE THE PROJECT DOCUMENTATION SYSTEM](#section-02)
- [03. AGENTS.md — THE LLM CONSTITUTION](#section-03)
- [04. MANDATORY EXECUTION LOOP](#section-04)
- [05. PLAN.md — PROJECT STATE MACHINE](#section-05)
- [06. PLAN CONTINUITY](#section-06)
- [07. HUMAN-ONLY STRATEGIC DECISIONS](#section-07)
- [08. DO NOT REWRITE HISTORY](#section-08)
- [09. RESEARCH_LOG.md — PROJECT BLACK BOX](#section-09)
- [10. DECISIONS.md](#section-10)
- [11. SECURITY BY DESIGN](#section-11)
- [12. THREAT MODEL](#section-12)
- [13. ARCHITECTURE](#section-13)
- [14. PRODUCT BOUNDARIES](#section-14)
- [15. UI / UX](#section-15)
- [16. DESIGN SYSTEM](#section-16)
- [17. DATA MODEL](#section-17)
- [18. TESTING STRATEGY](#section-18)
- [19. FAILURE TESTING](#section-19)
- [20. PERFORMANCE](#section-20)
- [21. OBSERVABILITY](#section-21)
- [22. ERROR HANDLING](#section-22)
- [23. GIT WORKFLOW](#section-23)
- [24. PULL REQUESTS](#section-24)
- [25. CI](#section-25)
- [26. CD / RELEASE](#section-26)
- [27. DEPENDENCIES](#section-27)
- [28. DOCUMENTATION MUST MATCH CODE](#section-28)
- [29. ASSUMPTION MANAGEMENT](#section-29)
- [30. DEFINITION OF DONE](#section-30)
- [31. RELEASE GATES](#section-31)
- [32. ANTI-HALLUCINATION RULE](#section-32)
- [33. PRESERVE WORK](#section-33)
- [34. AUTONOMY](#section-34)
- [35. PROJECT HANDOFF](#section-35)
- [36. INITIAL BOOTSTRAP PROCEDURE](#section-36)
- [37. PLAN QUALITY REQUIREMENT](#section-37)
- [38. FINAL CONSISTENCY PASS](#section-38)
- [39. GOLDEN RULE](#section-39)
- [40. START](#section-40)

---

<a id="section-01"></a>
## 1. PROJECT INPUT


The project description will be supplied together with this prompt.

Before creating anything:

1. Analyze the product goal.
2. Identify the intended users.
3. Identify platforms and environments.
4. Identify major features.
5. Identify security/privacy requirements.
6. Identify likely technical constraints.
7. Identify external services and dependencies.
8. Identify deployment/distribution requirements.
9. Identify UX/UI requirements when applicable.
10. Identify operational and maintenance requirements.
11. Identify important unknowns.
12. Separate assumptions from confirmed requirements.

Do not silently convert assumptions into requirements.


---


<a id="section-02"></a>
## 2. CREATE THE PROJECT DOCUMENTATION SYSTEM


Create a set of Markdown files in the repository root that together form the persistent source of truth for humans and LLM agents working on this project.

At minimum consider creating:

- `README.md`
- `AGENTS.md`
- `PRODUCT.md`
- `PLAN.md`
- `ARCHITECTURE.md`
- `SECURITY.md`
- `TESTING.md`
- `GIT_WORKFLOW.md`
- `CI_CD.md`
- `DECISIONS.md`
- `RESEARCH_LOG.md`
- `CHANGELOG.md`


Create additional documents when relevant, for example:

- `DESIGN_SYSTEM.md`
- `UI_UX.md`
- `DATA_MODEL.md`
- `API.md`
- `DATABASE.md`
- `AUTHENTICATION.md`
- `PRIVACY.md`
- `CRYPTOGRAPHY.md`
- `PERFORMANCE.md`
- `OBSERVABILITY.md`
- `ERROR_HANDLING.md`
- `DEPLOYMENT.md`
- `INFRASTRUCTURE.md`
- `RELEASE.md`
- `BACKUP_RECOVERY.md`
- `MIGRATIONS.md`
- `ACCESSIBILITY.md`
- `LOCALIZATION.md`
- `DEPENDENCIES.md`
- `THREAT_MODEL.md`
- `COMPLIANCE.md`
- `INTEGRATIONS.md`
- `AI_ARCHITECTURE.md`
- `MODEL_EVALUATION.md`

Do NOT create meaningless documentation merely to increase the number of files.

Create the documents the project actually needs.

If a subject is large enough to deserve its own source-of-truth document, separate it.


---


<a id="section-03"></a>
## 3. AGENTS.md — THE LLM CONSTITUTION


AGENTS.md must define mandatory behavior for every current or future LLM agent.

Assume agents may include ChatGPT, Codex, Claude, Gemini or future systems.

No agent may depend on previous chat history.

The repository is the source of truth.

Every agent must begin a work session by reading, at minimum:

1. AGENTS.md
2. PRODUCT.md
3. ARCHITECTURE.md
4. SECURITY.md
5. PLAN.md
6. DECISIONS.md
7. Latest RESEARCH_LOG.md entries
8. Relevant domain-specific documentation
9. Git status
10. Recent commits

Then determine the first executable incomplete PLAN task.


---


<a id="section-04"></a>
## 4. MANDATORY EXECUTION LOOP


Define the default development loop as:


```text
READ
→ INSPECT
→ PLAN TASK
→ IMPLEMENT
→ TEST
→ SECURITY CHECK
→ BUILD
→ DOCUMENT
→ UPDATE PLAN
→ COMMIT
→ CONTINUE
```


The agent must not stop simply because one task succeeded.

If another safe, executable task exists, continue.

Do not repeatedly ask the human for permission for routine implementation decisions.


---


<a id="section-05"></a>
## 5. PLAN.md — PROJECT STATE MACHINE


PLAN.md must be more than a roadmap.

It is the authoritative execution state of the project.

Use:


| Marker | Meaning |
|:------:|---------|
| `[ ]` | Not started |
| `[~]` | In progress |
| `[x]` | Completed and verified |
| `[!]` | Blocked |
| `[?]` | Human decision required |


Break development into:


```text
PHASES
→ MILESTONES
→ TASKS
→ SUBTASKS
→ ACCEPTANCE CRITERIA
→ TESTS
→ GATES
```


Each meaningful task should state what "done" actually means.

An agent may mark "[x]" only when its acceptance criteria are satisfied.

Writing code alone does NOT mean a task is complete.


---


<a id="section-06"></a>
## 6. PLAN CONTINUITY


Every agent must:

- find the current phase;
- identify unfinished work;
- inspect existing implementation before changing it;
- continue from the current state;
- update task statuses;
- record blockers;
- record verification;
- move automatically to the next executable task.

Never restart an existing project simply because conversational context is unavailable.

Never redo completed work without a concrete reason.


---


<a id="section-07"></a>
## 7. HUMAN-ONLY STRATEGIC DECISIONS


Routine engineering decisions may be made autonomously.

A HUMAN must approve decisions that fundamentally change the established direction.

Examples include:

- replacing the primary technology stack;
- changing the core architecture;
- changing the product's fundamental purpose;
- removing a major planned capability;
- replacing a major infrastructure strategy;
- changing the security/privacy model;
- introducing a major mandatory external dependency;
- changing the fundamental data ownership model;
- abandoning an approved platform;
- making a change with major compatibility implications;
- changing a fundamental business/product assumption.

When such a decision is encountered:

1. Do NOT silently make it.
2. Mark the affected PLAN task "[?]".
3. Add an entry to DECISIONS.md.
4. Describe the current design.
5. Describe the discovered problem.
6. List realistic alternatives.
7. Explain advantages and disadvantages.
8. Explain security implications.
9. Explain migration/compatibility implications.
10. Provide a recommendation.
11. Wait for the human developer's decision.

Continue unrelated work when possible.


---


<a id="section-08"></a>
## 8. DO NOT REWRITE HISTORY


Never modify PLAN.md merely to make existing implementation appear correct.

If implementation diverges from the plan, explicitly identify the divergence.

Minor implementation deviations may be documented and reconciled.

Fundamental deviations require human approval.

Historical decision records and research logs must not be silently rewritten.


---


<a id="section-09"></a>
## 9. RESEARCH_LOG.md — PROJECT BLACK BOX


Maintain an append-only chronological development log.

After every meaningful checkpoint append:


```text
YYYY-MM-DD HH:MM — Checkpoint Name

Agent:
Branch:
Commit:

Completed

- ...

Changed

- ...

Tests

- ...

Security

- ...

Problems discovered

- ...

Decisions

- ...

Assumptions

- ...

Next

- ...
```

Do not erase previous entries.

The purpose is to allow another human or LLM to reconstruct what happened without relying on chat history.


---


<a id="section-10"></a>
## 10. DECISIONS.md


Maintain significant technical/product decisions.

Prefer ADR-style records.

For each significant decision record:

- ID
- Date
- Status
- Context
- Problem
- Considered options
- Decision
- Rationale
- Consequences
- Security implications
- Compatibility implications
- Migration implications when relevant

Possible statuses:

- `PROPOSED`
- `ACCEPTED`
- `REJECTED`
- `SUPERSEDED`
- `HUMAN_DECISION_REQUIRED`


---


<a id="section-11"></a>
## 11. SECURITY BY DESIGN


Create SECURITY.md specifically for the project.

Do not use generic statements such as "follow security best practices" without defining concrete controls.

Analyze:

- trust boundaries;
- authentication;
- authorization;
- secrets;
- credentials;
- sensitive data;
- encryption;
- transport security;
- input validation;
- dependency risk;
- logging;
- storage;
- updates;
- permissions;
- attack surface;
- supply-chain risk;
- backup/recovery where relevant;
- abuse cases;
- threat actors;
- secure defaults.

Explicitly prohibit insecure shortcuts.

At minimum:

Never commit secrets.

Never hard-code production credentials.

Never log passwords, tokens, private keys or equivalent secrets.

Never disable TLS/certificate verification merely to make something work.

Never weaken a security mechanism to fix an unrelated bug.

Never silently ignore authentication, authorization, integrity or cryptographic failures.

Use least privilege.

Fail safely.

Security requirements override implementation convenience.


---


<a id="section-12"></a>
## 12. THREAT MODEL


For projects with meaningful security exposure, document:

- ASSETS
- ACTORS
- ENTRY POINTS
- TRUST BOUNDARIES
- THREATS
- MITIGATIONS
- RESIDUAL RISKS

Consider STRIDE or another appropriate methodology when useful.


---


<a id="section-13"></a>
## 13. ARCHITECTURE


ARCHITECTURE.md must describe the actual intended system.

Include when applicable:

- components;
- modules;
- layers;
- dependency direction;
- data flow;
- external services;
- interfaces;
- boundaries;
- state management;
- persistence;
- networking;
- background processing;
- concurrency;
- caching;
- failure behavior;
- deployment topology.

Prefer replaceable abstractions around external providers.

Avoid unnecessary coupling.

Do not over-engineer the MVP.


---


<a id="section-14"></a>
## 14. PRODUCT BOUNDARIES


PRODUCT.md must define:

- problem;
- target users;
- value proposition;
- core workflows;
- MVP;
- non-goals;
- future possibilities;
- constraints;
- assumptions;
- success criteria.

Clearly distinguish:

MUST HAVE
SHOULD HAVE
NICE TO HAVE
OUT OF SCOPE

Prevent scope creep.


---


<a id="section-15"></a>
## 15. UI / UX


If the project has a user interface, create UI_UX.md.

Define:

- information architecture;
- navigation;
- major screens;
- user journeys;
- empty states;
- loading states;
- error states;
- offline states where applicable;
- confirmations;
- destructive actions;
- accessibility;
- responsive behavior;
- keyboard behavior where relevant;
- localization;
- RTL/LTR requirements;
- platform conventions.

Do not design only the happy path.


---


<a id="section-16"></a>
## 16. DESIGN SYSTEM


If appropriate, create DESIGN_SYSTEM.md.

Define reusable:

- colors/tokens;
- typography;
- spacing;
- radius;
- elevation;
- icons;
- buttons;
- inputs;
- cards;
- dialogs;
- navigation;
- tables/lists;
- feedback;
- motion;
- accessibility states.

Avoid inconsistent one-off UI.

Avoid default "AI-generated application" aesthetics.

Favor deliberate product design appropriate to the platform and target users.


---


<a id="section-17"></a>
## 17. DATA MODEL


If the project stores structured information, create DATA_MODEL.md.

Document:

- entities;
- identifiers;
- relationships;
- constraints;
- indexes;
- timestamps;
- ownership;
- lifecycle;
- deletion;
- versioning;
- migration;
- integrity rules.

Do not allow implementation and schema documentation to silently diverge.


---


<a id="section-18"></a>
## 18. TESTING STRATEGY


TESTING.md must define the appropriate testing pyramid.

Consider:

- unit tests;
- integration tests;
- end-to-end tests;
- regression tests;
- security tests;
- performance tests;
- migration tests;
- recovery tests;
- UI tests;
- compatibility tests;
- failure injection.

Every critical workflow needs a verifiable test strategy.

Bugs should receive regression tests whenever practical.


---


<a id="section-19"></a>
## 19. FAILURE TESTING


Explicitly test realistic failures relevant to the system.

Examples:

- network loss;
- process crash;
- disk full;
- corrupted data;
- invalid input;
- expired credentials;
- API rate limits;
- dependency outage;
- partial transaction;
- duplicate request;
- interrupted update;
- database migration failure.

A production system must survive more than the happy path.


---


<a id="section-20"></a>
## 20. PERFORMANCE


If relevant, define measurable budgets for:

- startup;
- latency;
- CPU;
- memory;
- disk;
- network;
- database queries;
- battery;
- background processing;
- bundle/application size.

Do not optimize blindly.

Measure first.


---


<a id="section-21"></a>
## 21. OBSERVABILITY


For systems requiring operational visibility define:

- structured logging;
- log levels;
- metrics;
- traces;
- health checks;
- diagnostics;
- crash reporting;
- correlation IDs;
- audit logs where necessary.

Observability must never leak secrets.


---


<a id="section-22"></a>
## 22. ERROR HANDLING


Define a consistent error model.

Distinguish:

- user errors;
- recoverable errors;
- transient errors;
- permanent failures;
- security failures;
- developer/programming errors.

Define retry behavior, backoff, user messages and logging behavior.

Never swallow errors silently.


---


<a id="section-23"></a>
## 23. GIT WORKFLOW


Create GIT_WORKFLOW.md.

Define:


```text
task/issue
→ branch
→ implementation
→ tests
→ commit
→ push
→ PR
→ CI
→ review
→ merge
```


Use meaningful branch names.

Use small, understandable commits.

Do not mix unrelated changes.

Do not commit secrets, generated garbage, local configuration or unnecessary binaries.

Protect production branches.


---


<a id="section-24"></a>
## 24. PULL REQUESTS


Every meaningful PR should explain:

- what changed;
- why;
- related PLAN tasks;
- tests performed;
- security impact;
- migration impact;
- screenshots when UI changed;
- known limitations.

A PR must not be merged solely because compilation succeeded.


---


<a id="section-25"></a>
## 25. CI


Design CI appropriate to the stack.

Possible checks include:

- formatting;
- linting;
- compilation;
- type checking;
- unit tests;
- integration tests;
- security scans;
- dependency scans;
- secret detection;
- migration verification;
- packaging.

Fail the pipeline on meaningful violations.


---


<a id="section-26"></a>
## 26. CD / RELEASE


Where applicable define:

- environments;
- artifacts;
- versioning;
- release branches/tags;
- signing;
- deployment;
- migrations;
- rollback;
- release notes;
- update strategy.

Never deploy simply because code exists.


---


<a id="section-27"></a>
## 27. DEPENDENCIES


Before introducing a dependency, consider:

- necessity;
- maintenance status;
- license;
- security history;
- package size;
- platform support;
- transitive dependencies;
- lockfile impact;
- whether standard functionality already exists.

Do not introduce large dependencies for trivial functionality.


---


<a id="section-28"></a>
## 28. DOCUMENTATION MUST MATCH CODE


Documentation is part of the implementation.

When implementation changes behavior, update the relevant documentation in the same work unit.

Outdated documentation is considered a defect.


---


<a id="section-29"></a>
## 29. ASSUMPTION MANAGEMENT


Never hide assumptions.

If a non-critical detail is unknown:

1. document the assumption;
2. choose the safest/reversible reasonable default;
3. continue.

Do not stop development for every minor ambiguity.

If the assumption could fundamentally alter architecture, security, cost, compatibility or product direction, escalate it as "[?]".


---


<a id="section-30"></a>
## 30. DEFINITION OF DONE


A task is complete only when appropriate requirements are satisfied.

Potential requirements:

- implementation complete;
- compilation/build passes;
- tests pass;
- lint/type checks pass;
- security requirements satisfied;
- documentation updated;
- PLAN updated;
- RESEARCH_LOG updated;
- no accidental secrets;
- no unresolved critical errors.

"Code written" is not synonymous with "done."


---


<a id="section-31"></a>
## 31. RELEASE GATES


PLAN.md must contain explicit release gates.

For production readiness verify, when applicable:

- clean installation/deployment;
- core workflows;
- failure recovery;
- authentication/authorization;
- security controls;
- migration;
- data integrity;
- backup/restore;
- performance;
- accessibility;
- compatibility;
- CI;
- dependency/security scanning;
- documentation;
- rollback;
- disaster recovery.

The LLM must never label a product "production ready" merely because the main feature appears to work.


---


<a id="section-32"></a>
## 32. ANTI-HALLUCINATION RULE


Never claim:

- a test passed when it was not executed;
- a build succeeded when it was not executed;
- a service works when it was not verified;
- a file exists when it was not inspected/created;
- a deployment succeeded without evidence;
- a bug is fixed without verification.

Distinguish:

- **IMPLEMENTED**
- **TESTED**
- **VERIFIED**

These are different states.


---


<a id="section-33"></a>
## 33. PRESERVE WORK


Before destructive operations:

- inspect existing work;
- understand why it exists;
- preserve unrelated changes;
- avoid deleting functioning implementations simply because rewriting is easier.

Never use "start over" as the default debugging strategy.


---


<a id="section-34"></a>
## 34. AUTONOMY


The purpose of this framework is NOT to make the human micromanage an LLM.

The LLM should autonomously handle normal engineering work.

It should:

- investigate;
- implement;
- test;
- debug;
- document;
- commit;
- update the plan;
- continue.

Ask the human only when:

1. a fundamental strategic decision is required;
2. necessary information cannot reasonably be inferred;
3. credentials/permissions requiring human action are needed;
4. a destructive or irreversible action requires approval;
5. legal/business/product ownership judgment is required.


---


<a id="section-35"></a>
## 35. PROJECT HANDOFF


At any point another competent LLM or human developer should be able to enter the repository and determine:

- what the product is;
- how it works;
- why architectural choices were made;
- what security rules apply;
- what has already been built;
- what has been tested;
- what is broken;
- what is blocked;
- what decisions are pending;
- what task comes next.

If that cannot be determined from the repository, project documentation is insufficient.


---


<a id="section-36"></a>
## 36. INITIAL BOOTSTRAP PROCEDURE


When receiving this prompt for a NEW project:

### Step 1


Analyze the supplied project description.

### Step 2


Determine the documentation required specifically for this project.

### Step 3


Create the Markdown documentation.

### Step 4


Create a detailed PLAN.md covering development from repository bootstrap through production/release.

### Step 5


Create AGENTS.md containing the permanent LLM operating rules.

### Step 6


Create the initial DECISIONS.md.

### Step 7


Create RESEARCH_LOG.md and record the bootstrap checkpoint.

### Step 8


Cross-check all documents for contradictions.

### Step 9


Verify PLAN.md actually covers the requirements from PRODUCT.md.

### Step 10


Verify SECURITY.md requirements are reflected in architecture and PLAN.

### Step 11


Verify testing and release gates cover critical workflows.

### Step 12


Present the resulting file structure.

Do NOT begin implementing application features until the bootstrap documentation is coherent enough to guide development.


---


<a id="section-37"></a>
## 37. PLAN QUALITY REQUIREMENT


Do not create a shallow PLAN.md containing only broad items such as:

- Build backend
- Build frontend
- Add tests
- Deploy

That is unacceptable.

The plan must be sufficiently granular that a future LLM with zero conversational context can identify the next concrete task.

Every major phase should contain:

- objective;
- dependencies;
- tasks;
- acceptance criteria;
- required tests;
- completion gate.


---


<a id="section-38"></a>
## 38. FINAL CONSISTENCY PASS


Before declaring bootstrap complete, check for contradictions between:

PRODUCT
↔ PLAN
↔ ARCHITECTURE
↔ SECURITY
↔ DATA MODEL
↔ UI/UX
↔ TESTING
↔ CI/CD
↔ RELEASE

Resolve ordinary inconsistencies.

Escalate fundamental conflicts to the human.


---


<a id="section-39"></a>
## 39. GOLDEN RULE


The repository must contain enough persistent context that:


```text
A NEW LLM
+
ZERO CHAT HISTORY
+
THE REPOSITORY

=

ENOUGH INFORMATION TO SAFELY CONTINUE DEVELOPMENT.
```

Conversation memory is optional.

Repository documentation is authoritative.


---


<a id="section-40"></a>
## 40. START


Now analyze the project description supplied with this prompt.

First create the project's documentation/governance system.

Adapt it to the project rather than mechanically copying generic files.

Build a detailed PLAN.md from initialization to production.

Do not begin product implementation until the documentation foundation has been created and consistency-checked.
