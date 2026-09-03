# Contract: Impersonation helper + Redux `app` slice

## `src/helper/ImpersonationHelper.ts` (NEW)

```ts
// Single source of truth for the SchoolBox host-page signal.
// Confirmed by spike 2026-09-03 (research.md R2); change here only on SchoolBox upgrade.
export const SCHOOLBOX_IMPERSONATION_GLOBAL = {
  objectPath: 'schoolboxUser',                       // dotted path from window
  isImpersonating: (o: any): boolean => o?.impersonated === true,
};
```

| Export | Signature | Behaviour |
|---|---|---|
| `isImpersonating` | `() => boolean` | `window.schoolboxUser?.impersonated === true`, via `SCHOOLBOX_IMPERSONATION_GLOBAL`. Pure, wrapped in try/catch, returns `false` on any error. |
| `isEmbeddedInSchoolBox` | `() => boolean` | `true` iff `#mgg-root[data-url]` is non-empty **or** `location.pathname` starts with `/modules/remote/`. |
| `resolveImpersonation` | `() => boolean` | `isImpersonating()` → `true`. Else if `isEmbeddedInSchoolBox()` **and** (`window.schoolboxUser` missing **or** `typeof window.schoolboxUser.impersonated !== 'boolean'`) → emit **one** Sentry warning (`captureMessage('[impersonation] window.schoolboxUser not usable while embedded', 'warning')`), return `false`. Else return `false` silently. Idempotent warning (module-level `let warned = false`). |

> `window.schoolboxUser` also carries `communityLogin` (parent/community portal login) —
> that is **not** impersonation; only `impersonated` is read.

Rules:
- No network calls. No throws. No PII in the Sentry message.
- Fail open everywhere (`false`) — this is defence-in-depth, not a security boundary
  (spec FR-010/FR-011).

## `src/redux/reduxers/app.slice.ts` (EDIT)

```ts
export type AppState = {
  isProd?: boolean;
  backendSchoolBoxUrl?: string;
  isImpersonating?: boolean;   // NEW
};

// NEW action
setImpersonation: (state, action: PayloadAction<{ isImpersonating: boolean }>) =>
  ({ ...state, isImpersonating: action.payload.isImpersonating });

export const { setIsProd, setImpersonation } = AppSlice.actions;
```

## `src/App.tsx` (EDIT — boot effect)

In the existing `Router` `useEffect` (next to `PingService.ping()`):

```ts
dispatch(setImpersonation({ isImpersonating: ImpersonationHelper.resolveImpersonation() }));
```

Synchronous, runs once on mount. No await, no ordering dependency on `ping()`.

## `src/components/module/ModuleAccessWrapper.tsx` (EDIT)

- `const isImpersonating = useSelector((s: RootState) => s.app.isImpersonating) === true;`
- In the effect, `Promise.all([AuthService.canAccessModule(moduleId), MggsModuleService.getModule(moduleId)])`.
- Before the role checks: if `module?.blockImpersonatedUser === true && isImpersonating`
  → set state so the render path returns
  `accessDenyPanel ?? <Page401 description={<h4>This module is unavailable while you are
  logged in as another user. Return to your own account to continue.</h4>} btns={btns} />`.
- `silentMode` still returns `null` when denied.
- `getModule` rejection → `Toaster.showApiError(err)` (existing) and treat
  `blockImpersonatedUser` as `false` (fail open).

## Test contract

Jest (`mgg-ui`, `nvm use 20`):
- `__tests__/helper/ImpersonationHelper.test.ts` — global present+impersonating → `true`;
  global present+normal → `false`; embedded + global missing → `false` **and**
  `Sentry.captureMessage` called once; not-embedded + global missing → `false` and
  **not** called; second call does not warn again.
- `__tests__/redux/app.slice.test.ts` — `setImpersonation(true/false)` sets
  `state.app.isImpersonating`; does not disturb `isProd` / `backendSchoolBoxUrl`.
- `__tests__/components/module/ModuleAccessWrapper.test.tsx` — `blockImpersonatedUser` +
  impersonating → renders `Page401`, not children; `blockImpersonatedUser` + not
  impersonating + role ok → renders children; no flag + impersonating → renders children;
  spinner while `getModule` pending.

Jest (`mggs-api`, `nvm use 18`):
- migration test — after the new mirror migration, `uMGGSModules` has
  `blockImpersonatedUser` defaulting to `false`; `down` removes it.
- controller test — `GET /syn/mggsModule/:ModuleID` response includes
  `blockImpersonatedUser`.
