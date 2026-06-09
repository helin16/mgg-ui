# Implementation Plan: Clone Email Template

**Branch**: `006-clone-template` | **Date**: 2026-06-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-clone-template/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Add a `Clone` row action to the Synergetic Email Template manager between `Send` and
`Archive`, open a confirmation modal that captures a new template name and `New Style`
selection, create a new template from the selected source template using the existing
template services, copy builder `templateObj` data when cloning an existing new-style
template into another new-style template, and refresh the list with explicit loading,
validation, success, and failure feedback.

## Technical Context

**Language/Version**: TypeScript 4.9 in a React 18.3.1 application  
**Primary Dependencies**: React, react-bootstrap, styled-components, react-bootstrap-icons, Redux auth state, Jest, React Testing Library  
**Storage**: N/A  
**Testing**: Jest component tests in `src/__tests__/pages/SynergeticEmailTemplate/components/` and existing service tests  
**Target Platform**: Browser-based SchoolBox/remote module UI for Synergetic Email Template management  
**Project Type**: Single React application  
**Performance Goals**: Preserve current list-load responsiveness and keep clone confirmation and list refresh within the existing user-visible interaction pattern  
**Constraints**: Must preserve `MGGS_MODULE_ID_SYN_EMAIL_TEMPLATE` access, reuse existing `SynCommunicationTemplateService` and `EmailTemplateService` boundaries, avoid new env vars or storage, keep `Send` and `Archive` behavior unchanged, copy `templateObj` only when the source already has builder data and the clone is marked `New Style`, avoid HTML-to-builder conversion in this feature, and prevent duplicate clone submissions while async work is in progress  
**Scale/Scope**: One module page, one template list component, one clone modal interaction, existing template create/list services, and focused Jest coverage for the list workflow

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Confirm the affected route, module surface, and `moduleId` are identified, and document
  how access control will be enforced.
- Confirm all backend interactions use existing or planned `src/services/*` wrappers and
  typed contracts in `src/types/*`.
- Confirm loading, success, empty, validation, and failure states are designed for each
  user-triggered async flow.
- Confirm any sensitive-data, env-var, embed, upload, token, or HTML-rendering risk is
  called out with mitigation.
- Confirm verification covers changed shared logic with automated tests and covers
  cross-system workflows with Cypress or documented manual validation.

- The affected route and module surface are identified as
  `SynergeticEmailTemplateManagerPage` and its `SynergeticEmailTemplateList` tab under
  `MGGS_MODULE_ID_SYN_EMAIL_TEMPLATE`; existing `Page`, `AdminPage`, and SchoolBox
  `ModuleAccessWrapper` enforcement remain unchanged.
- Backend interactions stay within the existing typed service wrappers
  `SynCommunicationTemplateService` and `EmailTemplateService`, with current shared types
  `iSynCommunicationTemplate` and `iEmailTemplate`; no direct `axios` usage or new env
  configuration is planned.
- The user-triggered async flow is the clone modal submission; the plan includes disabled
  duplicate confirmation while saving, validation for blank names, success toast plus list
  refresh on completion, and visible API error handling through the existing toaster path.
- The feature introduces no new sensitive-data domains, no browser storage, no new
  uploads, no new embeds, and no broader use of rendered HTML beyond copying the existing
  template content already handled by the current template editor flow; builder design data
  is copied only between existing `EmailTemplateService` records and is not synthesized
  from HTML in this iteration.
- Verification will add focused Jest coverage for the template list clone workflow and
  document manual validation for list ordering, success/error handling, and `New Style`
  clone outcomes.

## Project Structure

### Documentation (this feature)

```text
specs/006-clone-template/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── synergetic-email-template-clone.md
└── tasks.md
```

### Source Code (repository root)
```text
src/
├── components/
│   └── common/
│       └── DeleteConfirm/
├── layouts/
│   ├── Page.tsx
│   └── SchoolBox/
├── pages/
│   └── SynergeticEmailTemplate/
│       ├── SynergeticEmailTemplateManagerPage.tsx
│       ├── SynergeticEmailTemplateManagerAdminPage.tsx
│       └── components/
│           ├── SynergeticEmailTemplateList.tsx
│           ├── SynergeticEmailTemplateEditPanel.tsx
│           └── SynEmailSendPopupBtn.tsx
├── services/
│   ├── Email/
│   │   └── EmailTemplateService.ts
│   ├── Synergetic/
│   │   └── SynCommunicationTemplateService.ts
│   └── Toaster.ts
├── redux/
│   └── makeReduxStore.ts
├── types/
│   ├── Email/
│   │   └── iEmailTemplate.ts
│   ├── modules/
│   └── Synergetic/
│       └── iSynCommunicationTemplate.ts
└── __tests__/
    └── pages/
        └── SynergeticEmailTemplate/
            └── components/
                └── SynergeticEmailTemplateList.test.tsx
```

**Structure Decision**: Keep the implementation within the existing Synergetic Email
Template module. The row-action and modal state changes belong in
`src/pages/SynergeticEmailTemplate/components/SynergeticEmailTemplateList.tsx`. The clone
flow will reuse `SynCommunicationTemplateService` and `EmailTemplateService` instead of
adding new domain modules. Verification belongs in the existing template-list component
test file under `src/__tests__/pages/SynergeticEmailTemplate/components/`.

## Complexity Tracking

No constitution violations are currently required.
