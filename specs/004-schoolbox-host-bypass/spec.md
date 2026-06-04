# Feature Specification: SchoolBox Host Bypass

**Feature Branch**: `004-schoolbox-host-bypass`  
**Created**: 2026-06-04  
**Status**: Draft  
**Input**: User description: "need to allow browser to NOT force to schoolbox remote for the SchoolBox mobile devices flow when the hostname, ie: www.google.com, is defined in the module.settings in `MGGS_MODULE_ID_MGG_APP_DEVICES`; we need to have a look in to SchoolBoxAppLoader for this."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Honour approved external device hosts (Priority: P1)

When a user opens the mobile devices module through a SchoolBox-linked URL that points to
an externally approved hostname, the browser keeps the user on that approved host instead
of forcing the route through the embedded SchoolBox replacement flow.

**Why this priority**: This is the requested behavior change. Without it, approved external
device flows cannot be reached as intended.

**Independent Test**: Open the mobile devices route using a SchoolBox-linked URL whose
hostname appears in the configured devices-module hostname list, and confirm the user stays
on that approved external host instead of the loader handing control to the in-app
replacement flow.

**Acceptance Scenarios**:

1. **Given** the incoming SchoolBox-linked URL targets the mobile devices route and its
   hostname matches a hostname configured for the devices module, **When** the route is
   opened, **Then** the browser keeps the external-host experience and the SchoolBox loader
   does not switch that request into the in-app replacement flow.
2. **Given** an approved external-host request is opened, **When** the page loads,
   **Then** the user reaches the intended devices flow without a redirect loop or a blank
   page.

---

### User Story 2 - Keep existing routing for unapproved hosts (Priority: P2)

When a SchoolBox-linked URL points to a hostname that has not been approved for the mobile
devices module, users continue to receive the current loader and in-app routing behavior.

**Why this priority**: The bypass must stay tightly bounded. Unapproved hosts should not
quietly change routing behavior.

**Independent Test**: Open the same mobile devices route using a hostname that is not in
the configured devices-module hostname list, and confirm the current SchoolBoxRouter
behavior is unchanged.

**Acceptance Scenarios**:

1. **Given** the incoming SchoolBox-linked URL targets the mobile devices route and its
   hostname is not configured for the devices module, **When** the route is opened,
   **Then** the system applies the current in-app routing behavior.
2. **Given** the incoming SchoolBox-linked URL targets any other in-app route,
   **When** the route is opened, **Then** the new hostname rule does not bypass the
   existing behavior for that unrelated route.

---

### User Story 3 - Fail closed when settings are incomplete (Priority: P3)

When the devices-module hostname settings are missing, empty, or malformed, the route still
opens using the existing behavior rather than breaking navigation.

**Why this priority**: Route decisions based on configuration must degrade safely. Bad
settings should not strand users on an error page.

**Independent Test**: Clear or corrupt the configured hostname list for the devices module,
open a SchoolBox-linked mobile devices URL, and confirm the route continues using the
current behavior without navigation failure.

**Acceptance Scenarios**:

1. **Given** the devices-module hostname setting is missing or empty, **When** the route is
   opened, **Then** the system uses the existing in-app routing behavior.
2. **Given** the devices-module hostname setting contains invalid values, **When** the
   route is opened, **Then** valid entries are still considered and invalid entries do not
   cause the route to fail.

### Edge Cases

- The incoming remote URL cannot be parsed into a valid hostname.
- The configured hostname list contains mixed case, leading or trailing whitespace, or
  duplicate values.
- The remote URL uses a subdomain that is not an exact configured match.
- The devices-module hostname setting is present but contains non-hostname text.
- The user opens a non-devices SchoolBox route using a hostname that is approved only for
  the devices module.
- The configuration is unavailable at the moment the loader must decide whether to hide the
  original SchoolBox iframe and boot the in-app replacement.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST treat the affected surface as the SchoolBox mobile devices
  entry flow associated with `MGGS_MODULE_ID_MGG_APP_DEVICES`, including the loader step
  that decides whether to replace the original SchoolBox-hosted content.
- **FR-002**: The system MUST evaluate the hostname of the incoming SchoolBox-linked URL
  before the loader hides the original SchoolBox iframe or hands the request to the in-app
  mobile devices replacement.
- **FR-003**: The system MUST allow the browser to remain on the external-host experience
  when the incoming hostname exactly matches a hostname configured in the devices module
  settings.
- **FR-004**: The system MUST keep the current loader and in-app routing behavior when the
  incoming hostname does not match a configured devices-module hostname.
- **FR-005**: The system MUST apply hostname matching in a case-insensitive way and ignore
  accidental surrounding whitespace in stored hostname values.
- **FR-006**: The system MUST scope this bypass rule to the mobile devices module only and
  MUST NOT let an approved devices hostname change routing for unrelated routes.
- **FR-007**: The system MUST source the approved hostname list from the existing
  `module.settings` data for `MGGS_MODULE_ID_MGG_APP_DEVICES`.
- **FR-008**: The system MUST support more than one approved hostname for the devices
  module.
- **FR-009**: The system MUST fail closed when the hostname configuration is missing,
  unreadable, or invalid by keeping the existing routing behavior.
- **FR-010**: The system MUST preserve the current module access rules and MUST NOT use the
  hostname bypass to grant access a user would not otherwise have.
- **FR-011**: The system MUST avoid redirect loops, blank pages, or broken navigation while
  the loader decides whether to apply the bypass.
- **FR-012**: The system MUST continue to use the existing visible loading and error
  behavior for route entry when the bypass is not applied or cannot be applied.
- **FR-013**: The feature MUST not require new environment variables, browser storage, or
  third-party credentials beyond the existing devices-module configuration source.
- **FR-014**: The feature MUST not broaden the user data exposed in the mobile devices flow
  beyond what is already shown today.

### Key Entities *(include if feature involves data)*

- **Devices Module Hostname Setting**: The configured list of external hostnames that are
  approved to bypass the forced in-app SchoolBox replacement for the mobile devices module.
- **Incoming SchoolBox-Linked URL**: The routed request whose hostname and path determine
  whether the browser should stay on the external host or switch to the in-app page.
- **Loader Decision Point**: The SchoolBox entry step that inspects the original embedded
  request and decides whether to preserve that host experience or boot the in-app
  replacement.
- **Routing Decision**: The outcome that either preserves the external-host experience or
  applies the existing in-app SchoolBoxRouter behavior.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In manual validation, 100% of mobile devices links using an approved hostname
  keep the user on the intended external-host experience.
- **SC-002**: In manual validation, 100% of mobile devices links using an unapproved
  hostname continue to follow the existing in-app routing behavior.
- **SC-003**: In sampled validation cases, malformed or empty hostname settings do not
  produce a redirect loop, blank page, or route-entry failure.
- **SC-004**: Support staff can verify hostname changes for the devices module by updating
  configuration once and seeing the routing decision change on the next route entry without
  any additional deployment step.

## Assumptions

- The approved-hostname values are maintained through existing devices-module configuration
- Hostname approval is based on exact hostname matching rather than wildcard-domain
  matching, unless later clarified during planning.
- The feature only changes routing behavior for the mobile devices module and does not add a
  new admin surface for unrelated modules.
- The existing SchoolBox-linked URL format and loader flow remain the source of the
  incoming hostname and path used for the routing decision.
- Manual SchoolBox/UAT verification remains necessary for the final browser-navigation
  check because the behavior depends on route entry context.
