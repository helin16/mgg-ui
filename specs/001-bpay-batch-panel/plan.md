# Implementation Plan: BPay Batch Panel

**Branch**: `001-bpay-batch-panel` | **Date**: 2026-04-22 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-bpay-batch-panel/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Add an operational panel to the existing Finance > BPay Batching tab so finance users can
search for a creditor, resolve one active BPay record, enter an amount, and add that
entry into a current BPay batch. The design will reuse the existing creditor autocomplete,
shared table and toast patterns, and extend the BPay service/type layer so the UI can
create or reuse batches, sections, and section items based on creditor grouping rules.

## Technical Context

**Language/Version**: TypeScript 4.9 on React 18.3.1  
**Primary Dependencies**: react-bootstrap, styled-components, react-select/AsyncSelect, axios, react-toastify  
**Storage**: N/A in browser beyond existing token/session helpers; primary persistence is backend-managed via API  
**Testing**: Jest via react-scripts for shared logic; Cypress is available for E2E, with documented manual validation expected for this finance flow  
**Target Platform**: Browser-based internal school operations UI embedded in the Finance module  
**Project Type**: Single-project web application  
**Performance Goals**: Creditor lookup and BPay record resolution should feel interactive for finance users and complete normal add flows in under 2 minutes  
**Constraints**: Must preserve Finance module access rules, use `src/services/*` and `src/types/*`, prevent duplicate submissions, and avoid exposing sensitive creditor payment details outside the batching flow  
**Scale/Scope**: One new panel inside the existing Finance page, plus supporting BPay types/services and finance-specific UI state management

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Affected surface is identified as `src/pages/Finance/FinancePage.tsx` and the existing
  Finance module route; access remains enforced through the existing `Page` wrapper using
  `MGGS_MODULE_ID_FINANCE`.
- Backend interactions will use shared wrappers in `src/services/BPay/*`,
  `src/services/Synergetic/Finance/*`, and typed contracts in `src/types/*`.
- The design includes loading, automatic selection, empty-state, validation, success, and
  failure handling for creditor lookup, BPay record selection, and add actions.
- Sensitive finance data is limited to the batching workflow, uses existing service-layer
  auth headers, and introduces no new env vars, embeds, uploads, or HTML rendering paths.
- Verification will include automated coverage for any new pure data/selection logic and a
  documented manual validation flow for the end-to-end batch creation path.

## Project Structure

### Documentation (this feature)

```text
specs/001-bpay-batch-panel/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── bpay-batch-panel.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── BPay/
│   ├── common/
│   └── synCreditor/
├── helper/
├── pages/
│   └── Finance/
├── services/
│   ├── BPay/
│   └── Synergetic/Finance/
├── types/
│   ├── BPay/
│   └── Synergetic/Finance/
└── __tests__/

cypress/
└── e2e/
```

**Structure Decision**: Keep all changes inside the existing single `src/` app. Place the
new batching panel and any supporting view components in `src/components/BPay/`, reuse the
existing Finance tab entry in `src/pages/Finance/FinancePage.tsx`, and extend the current
BPay and Synergetic finance services/types rather than introducing a new state layer.

## Complexity Tracking

No constitution violations are currently required.
