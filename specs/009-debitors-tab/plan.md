# Implementation Plan: Finance Debitors Tab

**Branch**: `009-debitors-tab` | **Date**: 2026-07-01 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/009-debitors-tab/spec.md`

**Note**: This plan is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Add a new `Debitors` tab to the existing Finance page that reuses the current module/page patterns, fetches paginated debtor records through typed service wrappers, lets finance users search by debtor and spouse details plus current student, and presents the results in the shared table component with explicit loading, empty, and failure states.

## Technical Context

**Language/Version**: TypeScript 4.9 + React 18  
**Primary Dependencies**: React Bootstrap, styled-components, axios via `AppService`, lodash, existing async selector components  
**Storage**: Backend API only; no new browser storage  
**Testing**: Jest + React Testing Library for page/panel behaviour, service tests for contract wrappers, manual Finance-module verification for authenticated data workflow  
**Target Platform**: React SPA used inside SchoolBox/remote module routing  
**Project Type**: Single-project web application  
**Performance Goals**: Initial debtor list and filtered searches return the first page within 5 seconds for normal finance data volumes; filter reset reflects the default result set within 5 seconds  
**Constraints**: Must stay inside the existing Finance page (`moduleId` 12), must use `src/services/*` + `src/types/*` boundaries, must reuse `src/components/common/Table.tsx`, must trigger searches only from explicit `Search`/`Reset Filters` actions, and must account for spouse email not being present in the current `vDebtor` contract  
**Scale/Scope**: One new Finance tab, one main panel component, one current-student filter control reuse or wrapper, typed debtor list row/state additions, focused tests for tab selection, search/reset, pagination, and service wiring

## Constitution Check

**Gate Status**: ✅ **PASS**

- ✅ **I. Module-Gated Delivery**: The feature stays inside the existing Finance module surface on `FinancePage` and continues to inherit `moduleId` `MGGS_MODULE_ID_FINANCE = 12` access through the current `Page`/`AdminPage` pattern. No new route or alternate entry path is introduced.
- ✅ **II. Typed Service Boundaries**: Backend interactions remain behind `src/services/Synergetic/Finance/SynVDebtorService.ts` and `src/services/Synergetic/Student/SynVStudentService.ts`, with any new debtor row/state contracts added under `src/types/*`.
- ✅ **III. Explicit Async UX States**: The plan defines loading, success, empty, filter-reset, pagination, and failure states for debtor search and current-student selection.
- ✅ **IV. School Data and Configuration Safety**: The feature reads authenticated finance/student data only, adds no browser persistence, env vars, uploads, embeds, or HTML injection paths, and keeps sensitive data exposure limited to authorized Finance views.
- ✅ **V. Risk-Based Verification**: The plan includes service tests, component/page tests, and documented manual verification for the authenticated Finance search workflow and pagination/reset behaviour.

## Project Structure

### Documentation (this feature)

```text
specs/009-debitors-tab/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── finance-debitors-service-interface.md
│   └── finance-debitors-ui-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── common/
│   ├── form/
│   └── student/
├── layouts/
├── pages/
│   └── Finance/
├── services/
│   └── Synergetic/
│       ├── Finance/
│       └── Student/
├── types/
│   ├── Synergetic/
│   │   ├── Finance/
│   │   └── Student/
│   └── modules/
└── __tests__/
    ├── pages/
    └── services/

cypress/
├── e2e/
└── support/
```

**Structure Decision**: Keep the feature inside the existing single React application and extend the current Finance page rather than adding a route. Reuse the shared `Table` component, the existing current-student async selector pattern, and the current Finance service/test layout. Add only the Finance-specific panel/component and any typed debtor row/view-model helpers required by the new tab.

## Phase 0: Research

**Status**: ✅ **COMPLETE**

See [research.md](research.md). Resolved decisions:

1. Keep the feature inside `src/pages/Finance/FinancePage.tsx` as a new tab under the existing Finance module.
2. Reuse `SynVDebtorService.getAll(...)` as the base service wrapper and extend it only if the UI needs an enriched debtor contract rather than bypassing the service layer.
3. Use explicit `Search` and `Reset Filters` actions rather than auto-search on typing or selection changes.
4. Use the selected current student `DebtorID` as the filter key.
5. Default the list sort order to debtor name ascending and page size to 10.
6. Treat spouse email as a contract gap that must be added to the debtor data source or composed by a planned service-layer enrichment before the UI can satisfy the display/search requirement.

## Phase 1: Design & Contracts

### Data Model

See [data-model.md](data-model.md) for entity fields, validation rules, and UI state transitions.

**Key entities**:
- `DebitorSearchCriteria`
- `DebitorListRow`
- `LinkedStudentSummary`
- `DebitorsListViewState`

### Contracts

See [contracts/finance-debitors-ui-contract.md](contracts/finance-debitors-ui-contract.md) and [contracts/finance-debitors-service-interface.md](contracts/finance-debitors-service-interface.md).

**Primary service interactions**:
- `SynVDebtorService.getAll(params)`
- `SynVStudentService.getVPastAndCurrentStudentAll(params)`

**Planned typed additions**:
- A Finance-specific debtor row/view model under `src/types/Synergetic/Finance/`
- If needed, an enriched service response contract that includes spouse email and linked-student summaries

### Planned Source Changes

**New files**:
- `src/pages/Finance/components/DebitorsListPanel.tsx`
- `src/types/Synergetic/Finance/iFinanceDebitorListRow.ts`
- `src/types/Synergetic/Finance/iFinanceDebitorSearchCriteria.ts`
- `src/types/Synergetic/Finance/iFinanceDebitorLinkedStudent.ts`

**Existing files modified**:
- `src/pages/Finance/FinancePage.tsx`
- `src/services/Synergetic/Finance/SynVDebtorService.ts`
- `src/types/Synergetic/Finance/iSynVDebtor.ts` or an adjacent enriched debtor contract if spouse email is added there
- `AGENTS.md`

## Phase 1 Completion Checklist

- [x] Technical context anchored to current repo/tooling
- [x] Constitution gate passed
- [x] Research decisions captured and clarifications resolved
- [x] Data model defined for debtor search, pagination, and row rendering
- [x] UI/service contracts documented
- [x] AGENTS plan reference updated
- [x] Post-design constitution check passed

## Post-Design Constitution Check

- Finance module surface and inherited `moduleId` access remain explicit and unchanged.  
  Status: PASS.
- All backend access stays in typed service wrappers, with the spouse-email gap tracked as a contract extension rather than component-level data assembly.  
  Status: PASS.
- Async states are designed for list load, search, reset, student option load, empty results, and failure.  
  Status: PASS.
- No new env vars, uploads, embeds, token persistence, or HTML rendering risks are introduced.  
  Status: PASS.
- Verification includes automated coverage for service and page/panel behaviour plus manual authenticated Finance validation.  
  Status: PASS.

## Next Steps

**Phase 2**: Run `/speckit.tasks` to break this plan into implementation tasks.  
**Implementation**: Build the Debitors tab/panel, extend debtor contracts as needed for spouse email and linked students, and add focused verification coverage.

## Complexity Tracking

No constitution violations are expected for this feature.
