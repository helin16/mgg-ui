# Feature Specification: Reliable Schoolbox Class Results Charts

**Feature Branch**: `019-fix-highcharts-conflict`  
**Created**: 2026-09-02  
**Status**: Draft  
**Input**: User description: "Ensure Schoolbox Class Results charts render reliably on the first normal page load without requiring a hard refresh, while preserving both Schoolbox charts and the custom application's charts and preventing the custom script from conflicting with Schoolbox's chart runtime."

## Clarifications

### Session 2026-09-02

- Q: Which browsers must pass the cached and uncached Class Results acceptance tests? → A: Current Chrome, Edge, Safari, and Firefox.
- Q: Where must a future chart-runtime failure be observable? → A: Browser developer console only.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Class Results on First Load (Priority: P1)

As a staff member viewing a class grades page, I can open the Class Results tab after a normal page load and immediately see the expected chart, so I do not need to know about or use a hard-refresh workaround.

**Why this priority**: The missing chart prevents staff from accessing core class performance information and is the reported production failure.

**Independent Test**: Open an affected class grades page in a fresh browser tab using a normal navigation or refresh, select Class Results, and verify that the expected chart is visible and usable without any additional reload.

**Acceptance Scenarios**:

1. **Given** an authenticated staff member opens an affected class grades page, **When** the page completes its first normal load and the staff member selects Class Results, **Then** the complete Class Results chart is displayed.
2. **Given** the custom application script is enabled on the Schoolbox page, **When** Schoolbox initializes the Class Results chart, **Then** chart initialization completes without a chart-runtime conflict.
3. **Given** an affected page is loaded repeatedly under both cached and uncached conditions, **When** Class Results is selected after each load, **Then** the chart is displayed consistently without requiring a hard refresh.

---

### User Story 2 - Preserve Custom Application Charts (Priority: P2)

As a user of the custom application, I can continue to view its existing reports and charts after the Schoolbox compatibility issue is resolved, so the fix does not trade one broken chart experience for another.

**Why this priority**: The custom application uses its own charting capability in existing reports, and those features must remain functional.

**Independent Test**: Open each custom report surface that contains a chart and verify that its expected chart renders with its existing data, labels, and interactions.

**Acceptance Scenarios**:

1. **Given** a user opens a custom report containing a chart, **When** the report finishes loading, **Then** its chart displays the expected data and remains interactive.
2. **Given** a browser session includes both Schoolbox pages and custom application pages, **When** the user navigates between them, **Then** charts on both surfaces continue to initialize correctly.

---

### User Story 3 - Maintain Other Schoolbox Page Behaviour (Priority: P3)

As a Schoolbox user, I can continue using non-chart functionality on pages where the custom script is loaded, so the compatibility change introduces no visible regressions elsewhere.

**Why this priority**: The custom script is loaded broadly, making regression protection necessary even on pages that do not display charts.

**Independent Test**: Perform smoke testing on representative Schoolbox pages where the custom script loads, including a class grades page and a non-chart page, and verify that normal page actions still work.

**Acceptance Scenarios**:

1. **Given** a Schoolbox page that does not contain a chart, **When** the custom script loads, **Then** the page retains its existing visible content and interactions.
2. **Given** a Schoolbox page containing another supported chart type, **When** the page loads normally, **Then** that chart continues to display without new chart-related errors.

### Edge Cases

- The custom script loads before Schoolbox has finished preparing its chart runtime.
- The custom script loads after Schoolbox has prepared its chart runtime but before Schoolbox creates the chart.
- Browser caching changes the relative completion order of Schoolbox resources and the custom script.
- A page contains multiple Schoolbox charts or multiple chart types, including statistical charts used by Class Results.
- A page contains no custom application mount point but still receives the shared custom script.
- A custom application report and Schoolbox-provided functionality are used within the same browser session.
- A Schoolbox release changes its internal chart package or resource-loading order while retaining the supported Class Results behaviour.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display the Schoolbox Class Results chart after the first normal load of an affected class grades page.
- **FR-002**: The system MUST NOT require users to perform a hard refresh, clear their cache, or repeat navigation to make the Class Results chart appear.
- **FR-003**: The custom application MUST coexist with Schoolbox's chart capability without replacing, disabling, or corrupting the chart capability Schoolbox uses.
- **FR-004**: Existing custom application charts MUST retain their current data presentation and user interactions.
- **FR-005**: The expected result MUST remain consistent whether relevant browser resources are cached or uncached.
- **FR-006**: The compatibility behaviour MUST cover every Schoolbox page on which the shared custom script loads, including pages without a custom application mount point.
- **FR-007**: Schoolbox chart types already supported on affected pages, including the statistical chart shown in Class Results, MUST continue to initialize successfully.
- **FR-008**: A chart failure MUST remain observable in the browser developer console so support staff can distinguish a Schoolbox chart problem from unrelated page errors; no centralized error-reporting change is required.
- **FR-009**: The affected surface is the authenticated Schoolbox class grades route and other authenticated Schoolbox pages receiving the shared custom script; existing Schoolbox access controls MUST remain unchanged.
- **FR-010**: No service-layer or shared data-type contract changes are required because the feature changes client-side runtime compatibility and does not add or alter data exchange.
- **FR-011**: No new user-visible loading, empty, validation, success, or error state is required; existing page states MUST remain unchanged and the chart MUST appear within the existing Class Results content area.
- **FR-012**: The feature MUST introduce no new environment variables, persisted storage, embedded third-party content, uploads, payments, or sensitive-data handling.
- **FR-013**: Verification MUST include repeated normal-load tests under both cached and uncached conditions in the current versions of Chrome, Edge, Safari, and Firefox, plus regression checks for both Schoolbox and custom application charts.
- **FR-014**: Verification MUST confirm that no chart-runtime conflict is reported during successful Class Results initialization.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In each of the current versions of Chrome, Edge, Safari, and Firefox, the Class Results chart appears successfully on the first normal load in 100% of at least 20 consecutive cached and 20 consecutive uncached test runs on the affected route.
- **SC-002**: In all acceptance tests, users can view Class Results with one page load and one tab selection, with zero hard refreshes or cache-clearing steps.
- **SC-003**: All currently supported custom application chart surfaces pass regression testing with their expected data, labels, and interactions intact.
- **SC-004**: Representative Schoolbox chart and non-chart pages show zero new visible regressions attributable to the compatibility change.
- **SC-005**: Successful test runs produce zero chart-runtime conflict errors while initializing the Class Results chart.

## Assumptions

- The problem is limited to interference between chart capabilities loaded into the same page; Schoolbox's underlying Class Results data remains available.
- Existing authentication and authorization for Schoolbox grades pages remain unchanged.
- The shared custom script will continue to be loaded on Schoolbox pages even when no custom application component is mounted.
- Existing custom application chart behaviour defines the regression baseline; redesigning those charts is outside this feature's scope.
- Changes to Schoolbox itself are outside the team's control, so the custom application must avoid interfering with Schoolbox-owned page capabilities.
- Manual testing against an authenticated Schoolbox environment is required because the production page and its resource-loading behaviour cannot be represented completely by isolated tests.
