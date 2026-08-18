# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Mentone Girls Grammar School's operational UI: a single React 18 + TypeScript app (Create React App / `react-scripts`, not ejected) that is either loaded standalone or embedded as remote modules inside the school's SchoolBox system. Deployed to Netlify.

## Commands

Package manager is Yarn (Yarn Berry via `.yarnrc.yml`).

- `yarn start` — run dev server at http://localhost:3000
- `yarn build` — production build to `build/`, then also builds `build/AppLoader/MggAppLoader.js` (see `build:appLoader`)
- `yarn test` — run Jest test suite once (`react-scripts test --watchAll=false`)
- `yarn test:watch` — Jest in watch mode
- Single test file: `yarn test:watch src/__tests__/components/SchoolCrest.test.tsx` (or pass a `-t "test name"` pattern to either test script)
- `yarn cypress:open` / `yarn cypress:run` — Cypress E2E, config in `cypress.config.ts`
- `yarn e2e-test` — installs deps, starts the dev server, runs Cypress, then tears the server down

Env vars live in `.env` (gitignored, see `.env.sample` for the shape). All must use the `REACT_APP_` prefix and degrade safely when absent — this is a repo rule, not just a CRA constraint. Key ones: `REACT_APP_API_END_POINT` (backend), `REACT_APP_TOKEN` (static app token), `REACT_APP_TINYMCE_API_KEY`, `REACT_APP_SENTRY_DSN`/`REACT_APP_TRACE_API_URLS` (optional Sentry).

## Engineering conventions (from `.specify/memory/constitution.md`)

These are enforced repo rules, not suggestions — treat violations as review blockers:

1. **Module-gated delivery**: every route/module exposed through the SchoolBox module surface must declare its route entry point, `moduleId`, and access model. Protected experiences must be wrapped in `ModuleAccessWrapper` (or an equivalent guard) rather than inventing a new access mechanism.
2. **Typed service boundaries**: components must go through `src/services/*` wrappers and `src/types/*` contracts. Calling `axios` directly from a page/component is forbidden unless you're extending the service layer in the same change. Auth headers/tokens/endpoints must flow through `AppService`, not be rebuilt ad hoc.
3. **Explicit async UX states**: any user-triggered async action needs explicit loading/success/error handling, surfaced via shared mechanisms (`Toaster`, validation components, `Page401`-style access-denied panels). No silent failures; prevent duplicate submission on long-running actions.
4. **School data/config safety**: minimise sensitive data (student/parent/staff/finance/donation) in browser storage, logs, and rendered HTML. Any `dangerouslySetInnerHTML`, token persistence, file upload, or third-party embed needs explicit justification and a sanitisation/origin/permission review.
5. **Risk-based verification**: shared helpers/reducers/hooks/data transforms need automated tests when behaviour changes; module access, routing, payments, exports, uploads, and other cross-system flows need a Cypress check or documented manual verification.

Also: reuse shared UI/hooks/helpers/layouts before adding new abstractions; keep local component state for screen-local behaviour and use Redux only for cross-app state that must survive route transitions; preserve Sentry init and toast notification wiring.

## Architecture

### Two build outputs from one `src/`

- **Main SPA** — entry `src/index.tsx` → `src/App.tsx`. A `BrowserRouter` with a handful of standalone public routes (asset pickup, online donation, campus display, ENews) declared in `App.tsx` using constants from `src/Url.ts`, plus a catch-all `/modules/remote/:code` route handled by `SchoolBoxLayout`.
- **AppLoader** — a separately-compiled, non-webpack bundle (`AppLoader/src/MggAppLoader.ts`, compiled by `build:appLoader` with `tsc` + `uglifyjs` straight to `build/AppLoader/MggAppLoader.js`) that legacy SchoolBox pages include as a plain `<script>` tag. It calls into `src/LoadComponents.tsx`, which does manual `ReactDOM.render()` into specific DOM query selectors already present on SchoolBox-rendered pages (e.g. `[mgg-app-loader="online-donation"]`, or DOM nodes it locates/creates near SchoolBox's own attendance-modify markup for Clipboard alerts). See `AppLoader/README.md` and `AppLoader/Samples/*.html` for how host pages wire this up.

### SchoolBox remote-module routing

Most of the "real" app lives behind `/modules/remote/:code`, not React Router's normal route table:

1. `SchoolBoxLayout` (`src/layouts/SchoolBoxLayout.tsx`) decodes a base64 `code` param (or reads a `data-url` attribute off `#mgg-root`) into a remote SchoolBox URL, extracts a base64-encoded internal path from it, and hands off to `SchoolBoxComponent`.
2. `SchoolBoxComponent` renders `SchoolBoxRouter` (`src/layouts/SchoolBox/SchoolBoxRouter.tsx`), which is a big `switch` over that decoded `path` (constants centralised in `SchoolBoxUrls.ts`) mapping each SchoolBox page to a React page component — typically wrapped in `<ModuleAccessWrapper moduleId={MGGS_MODULE_ID_...}>`.
3. Module IDs are defined as numeric constants in `src/types/modules/iModuleUser.ts` (`MGGS_MODULE_ID_*`). `ModuleAccessWrapper` (`src/components/module/ModuleAccessWrapper.tsx`) calls `AuthService.canAccessModule(moduleId)`, shows a `Spinner` while resolving, and renders `Page401` if access is denied — this is the standard per-module access-control pattern to follow for new modules.

When adding a new SchoolBox-embedded feature: add a URL constant to `SchoolBoxUrls.ts`, add a module ID constant to `iModuleUser.ts`, add a `case` in `SchoolBoxRouter.tsx` wrapped in `ModuleAccessWrapper`, and build the page under `src/pages/<Feature>/`.

### Service / type / state layering

- `src/services/AppService.ts` is the single axios wrapper: builds request URLs from `REACT_APP_API_END_POINT`, injects the `X-MGGS-TOKEN` header (`REACT_APP_TOKEN`) and a bearer token from `LocalStorageService`, and exposes `get/post/put/delete/uploadImage`. Feature services (`src/services/<Domain>/*`) call through this rather than using `axios` directly.
- Domain services and their corresponding types are organised in parallel trees: `src/services/<Domain>/` and `src/types/<Domain>/` (e.g. `BPay`, `Finance`-adjacent Synergetic services, `HouseAwards`, `PowerBI`, `StudentAbsences`, `Synergetic`). When adding backend calls, follow this pairing rather than inlining fetch logic in components.
- Redux (`src/redux/makeReduxStore.ts`) is intentionally small: `app.slice` (prod flag / SchoolBox backend URL, set from `PingService.ping()` at app boot) and `auth.slice` (current user). It's for cross-route app state only — component-local state should stay local per the constitution rule above.

### Testing conventions

- Jest (via `react-scripts test`) + React Testing Library; `testMatch` restricts tests to `src/**/*.test.{js,jsx,ts,tsx}`.
- Manual mocks live in sibling `__mocks__/` directories next to the real module across `components/`, `layouts/`, `services/`, etc. They are opt-in — a test only gets the mock by calling `jest.mock('<relative path to the real module>')` (no factory needed, since Jest resolves the adjacent manual mock). Check for an existing `__mocks__` file before hand-rolling a mock for a shared component/service/layout.
- Cypress specs live under `cypress/`; `cypress.config.ts` reads `PUBLIC_URL` for `baseUrl` and `CYPRESS_PROJECT_ID` for the dashboard project.

### Spec Kit workflow

This repo uses GitHub Spec Kit (`.specify/`) for planned feature work: numbered feature folders under `specs/NNN-feature-name/` each carry `spec.md`, `plan.md`, `research.md`, `data-model.md`, `tasks.md`, `quickstart.md`, and `contracts/`. `.specify/memory/constitution.md` is the source of truth for the engineering conventions above — check it directly if a rule seems to have changed. Spec Kit slash-command skills are available under `.agents/skills/speckit-*`.
