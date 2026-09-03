# Contract: `GET /syn/mggsModule/:ModuleID`

Existing endpoint (`mggs-api` `src/controllers/MggsModule/SynMggsModuleController.ts`).
This feature only **adds a field** to the response body. No request change, no status-code
change, no new endpoint.

## Request

```
GET /syn/mggsModule/:ModuleID
Headers: X-MGGS-TOKEN: <app token>        (AuthHelper.validateViaAppToken)
```

`ModuleID` — numeric module id (`MGGS_MODULE_ID_*`).

## Response `200`

Full `uMGGSModules` row. Fields relevant here:

```jsonc
{
  "ModuleID": 12,
  "Name": "Finance",
  "Description": "...",
  "Active": true,
  "settings": { /* module-specific JSON or null */ },
  "blockImpersonatedUser": false      // NEW - boolean, always present after migration
}
```

- `blockImpersonatedUser`: `true` → the MGG UI must refuse to open this module during an
  impersonated session. `false` (default for every pre-existing row) → no impersonation
  effect.

## Consumer expectations (`mgg-ui`)

- `MggsModuleService.getModule(moduleId)` resolves to `iModule` including
  `blockImpersonatedUser?: boolean`.
- Absent/`undefined` (older API build, test fixture) MUST be treated as `false`.
- `ModuleAccessWrapper` calls this once per guarded mount (via `Promise.all` with
  `AuthService.canAccessModule`).

## Backward compatibility

- Clients that ignore the field are unaffected.
- `PUT /syn/mggsModule/:ModuleID` (module admin only) will persist `blockImpersonatedUser`
  if present in the body (existing `...data` spread) — not exercised by the UI this
  iteration, harmless if it is later.
