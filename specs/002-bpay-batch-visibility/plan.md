# Implementation Plan: BPay Batch Visibility

**Branch**: `002-bpay-batch-visibility` | **Date**: 2026-04-22 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-bpay-batch-visibility/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Change the existing Finance > BPay Batching tab from an always-open creation form into a
two-state workflow: default to listing all existing BPay batches, and only reveal the
existing batch-creation panel when the user explicitly clicks `+ New Batch`. The work will
reuse the current Finance module tab and BPay service layer, introduce explicit list
loading/empty/error states, guard create-mode entry while the list is unresolved, refresh
the list after add or cancel, and add a `Cancel` path that returns the user to the batch
list without leaving the tab.

## Technical Context

**Language/Version**: TypeScript 4.9 on React 18.3.1  
**Primary Dependencies**: react-bootstrap, styled-components, axios, react-toastify  
**Storage**: N/A in browser beyond existing session/token helpers; batch data remains backend-managed via API  
**Testing**: Jest via react-scripts for helper/state logic; documented manual validation for the Finance tab flow  
**Target Platform**: Browser-based internal school operations UI embedded in the Finance module  
**Project Type**: Single-project web application  
**Performance Goals**: Users should see a clear batch-list state within normal Finance-tab load time and switch to create mode in one interaction  
**Constraints**: Must preserve `MGGS_MODULE_ID_FINANCE` access rules, keep backend access in `src/services/*`, avoid direct `axios` in UI, and show explicit loading/empty/failure feedback  
**Scale/Scope**: One existing Finance tab, one BPay panel refactor, and any supporting view helpers/components needed to render the default list safely

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Affected surface is identified as `src/pages/Finance/FinancePage.tsx` inside the existing
  Finance module tab, and access remains enforced through `Page` with
  `MGGS_MODULE_ID_FINANCE`.
- Backend interactions remain behind `src/services/BPay/*`; if the current batch payload is
  sufficient, no new API contracts are required beyond the existing typed BPay batch types.
- The design includes explicit loading, empty, success, validation, and failure behavior for
  the batch-list load and create-panel visibility transition.
- The feature stays inside the Finance batching workflow, introduces no new env vars,
  tokens, uploads, embeds, or HTML rendering paths, and should not expose extra creditor or
  finance data in the default list.
- Verification will combine automated coverage for extracted panel-state logic with a
  documented manual validation path for list visibility, `+ New Batch`, and `Cancel`.

## Project Structure

### Documentation (this feature)

```text
specs/002-bpay-batch-visibility/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── bpay-batch-visibility.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── BPay/
│   └── common/
├── helper/
├── pages/
│   └── Finance/
├── services/
│   └── BPay/
├── types/
│   └── BPay/
└── __tests__/

cypress/
└── e2e/
```

**Structure Decision**: Keep the feature inside the current `src/` application. Rework
`src/components/BPay/CreditorBPayPanel.tsx` to manage list-versus-create visibility, reuse
`src/components/BPay/BPayBatchResultPanel.tsx` or a sibling view component for the default
list presentation, keep the Finance tab entry in `src/pages/Finance/FinancePage.tsx`, and
continue using the existing BPay service/type files under `src/services/BPay/` and
`src/types/BPay/`.

## Complexity Tracking

No constitution violations are currently required.
