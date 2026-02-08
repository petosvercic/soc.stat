# 02 — Minimal System Modules (Foundation-Derived)

This module map is conceptual only. It defines responsibility boundaries for future implementation and prevents scope drift.

## 1) Daily Flow Orchestrator
**Purpose**
- Enforce the reference flow progression (state before entry, impulse, optional continuity signal, statement, decision, spectrum entry, micro-reflection, result, silence, optional extension, exit).

**Inputs**
- Current day context.
- Flow state transitions.
- User voluntary actions.

**Outputs**
- Next allowed flow step.
- Whether silence/optional continuation is presented.

**Must NOT do**
- Force completion or return.
- Add pressure loops or CTA-heavy behavior.
- Reframe flow as identity assessment.

---

## 2) Content & Spectra Engine
**Purpose**
- Host spectrum definitions, reflection prompts, statement-of-the-day content, and output naming primitives.

**Inputs**
- Active spectrum definition.
- Language constraints.
- Daily context marker.

**Outputs**
- Reflection units.
- Non-diagnostic result labels.
- Today-scoped textual content.

**Must NOT do**
- Produce diagnosis, treatment, or judgment.
- Emit identity-level claims (“who you are”).
- Introduce motivational pressure language.

---

## 3) Result Renderer
**Purpose**
- Convert reflection state into a visible “today” output designed for recognition without explanation burden.

**Inputs**
- Reflection responses.
- Output rules from content engine.

**Outputs**
- Final today-result representation.
- Silent absorption state (no forced next action).

**Must NOT do**
- Score human worth.
- Rank people or compare “better/worse.”
- Over-explain system logic.

---

## 4) Social Visibility Layer
**Purpose**
- Provide friend-facing derived visibility of current state while preserving optionality and non-judgment.

**Inputs**
- User-approved today output.
- Relationship/view permissions.

**Outputs**
- Friend-view representation.
- Visibility-safe abstraction.

**Must NOT do**
- Create social hierarchy or competitive mechanics.
- Expose permanent identity claims.
- Pressure users to explain themselves.

---

## 5) Gold Economy Module
**Purpose**
- Manage one-off curiosity actions for deeper view without converting depth into status.

**Inputs**
- Gold balance/events.
- Voluntary depth request type (deeper view, unblur, look-back, extra spectrum).

**Outputs**
- Authorized optional depth action.
- Updated gold state.

**Must NOT do**
- Reward performance or streak behavior.
- Change truth/value of core result.
- Gate baseline dignity/visibility behind payment.

---

## 6) Copy & Language Guardrails
**Purpose**
- Enforce communication laws across all user-facing text.

**Inputs**
- Candidate copy strings.
- Language policy rules from foundation.

**Outputs**
- Approved/rejected copy decision.
- Violation reasons (authoritative tone, diagnosis risk, identity language, pressure).

**Must NOT do**
- Allow ambiguous clinical or prescriptive text.
- Permit “must/should” pressure framing.
- Allow copy that fails the “quiet exit” test.
