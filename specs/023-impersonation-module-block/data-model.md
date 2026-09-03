# Phase 1 Data Model: Impersonation Detection & Per-Module Block

## Entity: MggModule (`uMGGSModules`)

Existing entity. One field added.

| Field | Type | Null | Default | Notes |
|---|---|---|---|---|
| ModuleID | int (PK, identity) | no | — | unchanged |
| Name | nvarchar | no | — | unchanged |
| Description | nvarchar | no | `''` | unchanged |
| Active | bit | no | `1` | unchanged |
| CreatedAt / UpdatedAt | datetime | no | CURRENT_TIMESTAMP | unchanged |
| CreatedById / UpdatedById | int | no | — | unchanged |
| settings | text (JSON string) | yes | `null` | unchanged |
| **blockImpersonatedUser** | **bit** | **no** | **`0` (false)** | **NEW.** When true, the MGG UI refuses to open this module while the session is impersonating another user. |

**Validation / rules**
- `blockImpersonatedUser` is always present after migration; existing rows backfill to
  `false` via the column default.
- No referential constraints. No state machine.
- Set outside the app this iteration (DBA / direct DB). `PUT /syn/mggsModule/:ModuleID`
  will accept it (spread in `CRUDHelper.updateModel`) but no MGG UI screen sends it.

**API surface**
- `GET /syn/mggsModule/:ModuleID` returns the field automatically (`CRUDHelper.getModel`
  serialises the full instance once the Sequelize model declares the attribute).
- No new endpoint. `/auth/canAccess` and `/auth/schoolbox` unchanged.

**Sequelize model** (`mggs-api/src/models/Modules/SynMggsModule.ts`)
- `SynMggsModuleModel` interface: add `blockImpersonatedUser: boolean;`
- `.define()` attributes: add
  `blockImpersonatedUser: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }`

**UI type** (`mgg-ui/src/types/modules/iModule.ts`)
- add `blockImpersonatedUser?: boolean;` (optional on the type so older API responses and
  fixtures without the field are still valid; treated as `false` when absent).

---

## Entity: App impersonation flag (Redux `app` slice)

Derived, in-memory, session-scoped. Not persisted, not transmitted.

| Field | Type | Default | Source |
|---|---|---|---|
| `AppState.isImpersonating` | `boolean \| undefined` | `undefined` → treated as `false` until boot resolves it | `ImpersonationHelper.resolveImpersonation()` run once in `App.tsx` boot effect |

**Reducer** (`mgg-ui/src/redux/reduxers/app.slice.ts`)
- `AppState`: add `isImpersonating?: boolean`.
- New action `setImpersonation(state, action: PayloadAction<{ isImpersonating: boolean }>)`
  → `{ ...state, isImpersonating: action.payload.isImpersonating }`.
- Export `setImpersonation` alongside `setIsProd`.

**Lifecycle**
1. App boots → `App.tsx` effect dispatches `setImpersonation` with the resolved boolean.
2. Consumers (`ModuleAccessWrapper`, any future consumer) read
   `useSelector(s => s.app.isImpersonating) === true`.
3. SchoolBox impersonation start/stop navigates the page → app re-boots → flag re-resolved.
   No live update without a reboot (accepted, per spec Edge Cases).

---

## Derived rule: module access decision (`ModuleAccessWrapper`)

Given `canAccessByRole` (existing), `module.blockImpersonatedUser`, `app.isImpersonating`:

| `blockImpersonatedUser` | `isImpersonating` | `canAccessByRole` | Result |
|---|---|---|---|
| true | true | any | **Deny** — `Page401` with impersonation message (FR-006) |
| true | false | true | Allow (unchanged) |
| true | false | false | Deny — existing role `Page401` (unchanged) |
| false / absent | any | true | Allow (unchanged) |
| false / absent | any | false | Deny — existing role `Page401` (unchanged) |

Loading: `Spinner` until **both** `canAccessModule` and `getModule` resolve (existing
spinner reused). Error on `getModule`: surface via `Toaster.showApiError` (existing
pattern) and fail open on the impersonation branch (treat `blockImpersonatedUser` as
`false`) so an API blip does not lock a legitimate user out.
