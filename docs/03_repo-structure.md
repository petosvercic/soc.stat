# 03 — Proposed Repository Structure (Implementation-Ready, No Code Yet)

This is a structural proposal for future delivery phases. It intentionally avoids implementation files.

```text
/
├── FOUNDATION.md (or canonical equivalent)
├── README.md
├── CONTRIBUTING.md
├── CODEX_WORKSTYLE.md
├── docs/
│   ├── 01_project-map.md
│   ├── 02_modules.md
│   ├── 03_repo-structure.md
│   ├── 04_decision-log.md
│   ├── foundation/
│   │   ├── manifesto.md
│   │   ├── axioms.md
│   │   ├── mantinels.md
│   │   ├── language-laws.md
│   │   ├── daily-flow.md
│   │   ├── gold-intent.md
│   │   └── production-checklist.md
│   └── adr/
│       └── (future architecture decision records)
├── specs/
│   ├── phase-1-foundation/
│   ├── phase-2-core-content/
│   ├── phase-2.5-gold/
│   ├── phase-3-social/
│   └── phase-4-production/
├── scripts/
│   ├── quality/
│   └── docs/
├── tests/
│   ├── language-guardrails/
│   ├── flow-compliance/
│   └── gold-rules/
└── .github/
    ├── pull_request_template.md
    └── workflows/
```

## Rationale
- **Foundation-first docs tree:** keeps conceptual constitution visible and split into stable references.
- **Phase-scoped specs:** prevents out-of-phase implementation and helps STOP/GO governance.
- **Dedicated compliance tests folders:** future checks can directly map to axioms, language laws, and gold boundaries.
- **ADR location:** preserves important trade-offs without replacing foundation truths.
- **Scripts separation:** encourages repeatable validation of docs quality and policy constraints.
- **GitHub templates/workflows:** institutionalizes traceability to foundation section + phase in review processes.

## Guardrail
This structure is planning-only and does not itself authorize product code before phase readiness.
