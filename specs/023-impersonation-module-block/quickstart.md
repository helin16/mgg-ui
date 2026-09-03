# Quickstart / Validation: Impersonation Detection & Per-Module Block

Node: `mgg-ui` needs Node >=20 (`nvm use 20`); `mggs-api` needs Node >=18 (`nvm use 18`).
Run every command below on the matching version.

## Prerequisites

- `mgg-ui` on branch `023-impersonation-module-block`, deps installed (`yarn`).
- `mggs-api` checkout at `../mggs-api`, deps installed.
- Spike outcome from [research.md](./research.md) R2 recorded into
  `SCHOOLBOX_IMPERSONATION_GLOBAL` in `src/helper/ImpersonationHelper.ts` (or the feature
  ships fail-open with the placeholder and this is done as a follow-up).

## 1. API — column + model

```bash
cd ../mggs-api
nvm use 18
# after adding the model field + tests/migrations/SynergeticDB/<ts>-add-blockImpersonatedUser-to-SynMggsModule.js
npm test -- SynMggsModule
```

Expected: migration test shows `uMGGSModules.blockImpersonatedUser` present, default
`false`, `down` removes it; controller test shows `GET /syn/mggsModule/:ModuleID` returns
`blockImpersonatedUser`.

Production: hand `contracts/synergetic-alter.sql` to IT/DBA to apply to the Synergetic DB.
Confirm afterwards: `SELECT ModuleID, blockImpersonatedUser FROM dbo.uMGGSModules;` → every
row `0`.

## 2. UI — unit tests

```bash
cd <mgg-ui>
nvm use 20
yarn test src/__tests__/helper/ImpersonationHelper.test.ts \
          src/__tests__/redux/app.slice.test.ts \
          src/__tests__/components/module/ModuleAccessWrapper.test.tsx
```

Expected: all green. Covers FR-014 (helper + slice) and the `ModuleAccessWrapper` deny
branch.

## 3. UI — end-to-end / manual SchoolBox check (FR-015)

Pick a low-risk module to flag (e.g. a reporting module). In the Synergetic DB:
`UPDATE dbo.uMGGSModules SET blockImpersonatedUser = 1 WHERE ModuleID = <id>;`

| # | Steps | Expected |
|---|---|---|
| 1 | As staff (not impersonating), open the flagged module via SchoolBox | Module opens normally |
| 2 | SchoolBox → "log in as" a student/parent → open the flagged module (`window.schoolboxUser.impersonated === true`) | `Page401` panel: "unavailable while you are logged in as another user"; module screen never renders |
| 3 | While impersonating, open a **non**-flagged module | Opens normally (no impersonation effect) |
| 4 | End impersonation ("return to your account"), reopen the flagged module | Opens normally |
| 5 | Load the app **standalone** (not embedded) — `window.schoolboxUser` absent | Flagged module opens (fail open); **no** Sentry warning |
| 6 | Embedded, but with `window.schoolboxUser` deleted / `impersonated` non-boolean | Flagged module opens (fail open); **one** Sentry warning `[impersonation] window.schoolboxUser not usable while embedded` |

Revert the flag afterwards:
`UPDATE dbo.uMGGSModules SET blockImpersonatedUser = 0 WHERE ModuleID = <id>;`

A Cypress spec (`cypress/e2e/impersonation-module-block.cy.ts`) can automate #1–#4 by
stubbing `window.schoolboxUser` and the `GET /syn/mggsModule/:id` response;
#5–#6 are covered by the Jest helper test. If Cypress automation of the SchoolBox host is
impractical, record steps #1–#6 above as the documented manual verification.

## 4. Regression sanity

```bash
cd <mgg-ui> && nvm use 20 && yarn test
```

Expected: full suite green — no existing `ModuleAccessWrapper` / `app.slice` test broken.
