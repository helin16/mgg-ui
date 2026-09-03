import * as Sentry from '@sentry/react';

/**
 * Feature 023 - reuse notes:
 * - Only `src/App.tsx` calls `resolveImpersonation()` (once, at boot). Its result is
 *   dispatched into the Redux `app` slice (`app.isImpersonating`).
 * - Every other consumer MUST read `useSelector(s => s.app.isImpersonating)` - do NOT
 *   call this helper again or re-inspect `window`.
 *
 * Detection signal (confirmed by spike 2026-09-03 on mconnect.mentonegirls.vic.edu.au):
 * SchoolBox exposes `window.schoolboxUser` on every page; `impersonated === true` while a
 * staff member is "logged in as" another user. `communityLogin` is a separate concept
 * (parent/community portal) and is not read. If a future SchoolBox upgrade renames this,
 * SCHOOLBOX_IMPERSONATION_GLOBAL below is the single line to change.
 */
export const SCHOOLBOX_IMPERSONATION_GLOBAL = {
  // Dotted path from `window` to the SchoolBox user/context object.
  objectPath: 'schoolboxUser',
  // Truthiness rule applied to that object.
  isImpersonating: (o: any): boolean => o?.impersonated === true,
};

const getGlobalObject = (): any => {
  try {
    return SCHOOLBOX_IMPERSONATION_GLOBAL.objectPath
      .split('.')
      .reduce((acc: any, key) => (acc == null ? acc : acc[key]), window as any);
  } catch {
    return undefined;
  }
};

/**
 * True when the current SchoolBox session is impersonating another user.
 * Pure, reads `window`, never throws - fails open (returns false) on any error.
 */
const isImpersonating = (): boolean => {
  try {
    return SCHOOLBOX_IMPERSONATION_GLOBAL.isImpersonating(getGlobalObject()) === true;
  } catch {
    return false;
  }
};

/**
 * True when the app booted through the SchoolBox module surface (injected into the
 * SchoolBox page by the app loader, or served at `/modules/remote/:code`).
 */
const isEmbeddedInSchoolBox = (): boolean => {
  try {
    const dataUrl = document.getElementById('mgg-root')?.getAttribute('data-url') || '';
    if (`${dataUrl}`.trim() !== '') {
      return true;
    }
    return `${window.location.pathname || ''}`.startsWith('/modules/remote/');
  } catch {
    return false;
  }
};

// Module-level guard: warn at most once per page load.
let warned = false;

/**
 * Resolve the impersonation flag once at boot.
 * - Impersonating -> true.
 * - Not impersonating, but embedded and `window.schoolboxUser` is missing / `impersonated`
 *   is not a boolean -> emit one Sentry warning (a SchoolBox upgrade likely broke the
 *   signal), then false (fail open per FR-011).
 * - Otherwise -> false silently (standalone / non-embedded boot is expected).
 */
const resolveImpersonation = (): boolean => {
  if (isImpersonating()) {
    return true;
  }

  let usable = false;
  try {
    const globalObj = getGlobalObject();
    usable = globalObj != null && typeof globalObj.impersonated === 'boolean';
  } catch {
    usable = false;
  }
  if (!usable && isEmbeddedInSchoolBox() && !warned) {
    warned = true;
    try {
      Sentry.captureMessage(
        '[impersonation] window.schoolboxUser not usable while embedded',
        'warning',
      );
    } catch {
      // Sentry not initialised (no REACT_APP_SENTRY_DSN) or unavailable - ignore.
    }
  }
  return false;
};

const ImpersonationHelper = {
  SCHOOLBOX_IMPERSONATION_GLOBAL,
  isImpersonating,
  isEmbeddedInSchoolBox,
  resolveImpersonation,
};

export default ImpersonationHelper;
