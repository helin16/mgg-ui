# Quickstart: Clipboard Music Sync Management UI Development

**Feature**: [Clipboard Music Sync Management UI](spec.md) | **Plan**: [plan.md](plan.md) | **Data Model**: [data-model.md](data-model.md)  
**Date**: 2026-06-15

## Overview

This quickstart guides developers through implementing the Clipboard Music Sync Management UI. The feature creates a dashboard page (similar to Finance) to display Clipboard teams and their sessions, with the ability to manually trigger student roster syncs.

## Development Workflow

### Phase 1: Setup & Type Definitions (15-20 min)

1. **Create new type**: `src/types/Clipboard/iClipboardSyncMessage.ts`
   - Copy from [contracts/clipboard-sync-service-interface.md](contracts/clipboard-sync-service-interface.md#new-type-iclipboardsyncmessage)
   - This represents the sync job response from `POST /clipboard/syncMusic`

2. **Create new service**: `src/services/Clipboard/ClipboardMusicSyncService.ts`
   - Copy from [contracts/clipboard-sync-service-interface.md](contracts/clipboard-sync-service-interface.md#new-service-create)
   - Implements `triggerSync(teamId?)` and optionally `pollSyncStatus(messageId)`
   - Wraps the POST endpoint with error handling via Toaster

**Verify**:
```bash
cd /Users/helin/git/MentoneGirls/mgg-ui
npm run tsc -- --noEmit  # Type check
```

---

### Phase 2: Create Page & Layout Components (30-40 min)

1. **Create main page**: `src/pages/Clipboard/ClipboardMusicSyncPage.tsx`
   - Wrap with `Page` component (title, moduleId, admin page)
   - Use React Bootstrap `Tabs` and `Tab` components (follow Finance pattern)
   - Tab key: `TAB_MUSIC_SYNC = "MUSIC_SYNC"`
   - Load teams on mount via `ClipboardTeamService.getAll()`
   - Pass teams array to `ClipboardTeamsListPanel`

2. **Create list panel**: `src/pages/Clipboard/components/ClipboardTeamsListPanel.tsx`
   - Props: `teams`, `isLoading`, `error`, `onSyncClick`
   - Render table with columns: Team Name, Session Title, Last Sync Time, Sync Button
   - State: `selectedTeamId` (for expand/collapse)
   - On team expand: fetch session details via `ClipboardSessionService.get(teamId)`
   - Render `ClipboardSessionDetailsPanel` for expanded rows

3. **Create session details panel**: `src/pages/Clipboard/components/ClipboardSessionDetailsPanel.tsx`
   - Props: `session` (iClipboardSession)
   - Display: title, startDateTime, endDateTime, activity, assignedStaff, attendees count

4. **Create confirmation popup**: `src/pages/Clipboard/components/ClipboardSyncConfirmPopup.tsx`
   - Props: `show`, `teamName`, `onConfirm`, `onCancel`
   - Use React Bootstrap `Modal` component
   - On confirm: call `ClipboardMusicSyncService.triggerSync(teamId)`
   - Display loading spinner during API call
   - Close popup after API returns (success or error)

**Key Patterns** (from Finance):
- Use `PageLoadingSpinner` during initial load
- Use `Toaster.success()` and `Toaster.error()` for feedback
- Use `styled-components` for custom styling
- Import icons from `react-bootstrap-icons`

**Verify**:
```bash
npm run tsc -- --noEmit  # Type check
npm run build              # Build check
```

---

### Phase 3: Route Integration (10-15 min)

1. **Update `src/App.tsx`**:
   - Add route: `<Route path={URL_CLIPBOARD_MUSIC_SYNC} element={<ClipboardMusicSyncPage />} />`
   - Define `URL_CLIPBOARD_MUSIC_SYNC` constant (e.g., `/modules/remote/:code/clipboard/music-sync`)

2. **Update `src/Url.ts`**:
   - Export `URL_CLIPBOARD_MUSIC_SYNC` constant

3. **Update `src/layouts/SchoolBoxRouter.tsx`** (if routing through SchoolBox):
   - Add route handler for Clipboard music sync page
   - Ensure module access check is applied

**Verify**:
```bash
npm run build  # Build succeeds
# Manual test: Navigate to /modules/remote/[code]/clipboard/music-sync
```

---

### Phase 4: Unit Tests (20-30 min)

Create test files following project patterns:

1. **`src/__tests__/services/Clipboard/ClipboardMusicSyncService.test.ts`**
   - Mock `axios` and `Toaster`
   - Test `triggerSync()` success and error scenarios
   - Verify error messages are toasted

2. **`src/__tests__/pages/Clipboard/ClipboardMusicSyncPage.test.tsx`**
   - Mock child components (use ComponentTestHelper pattern)
   - Test page renders with correct Page props (moduleId, title)
   - Test tab structure

3. **`src/__tests__/pages/Clipboard/components/ClipboardTeamsListPanel.test.tsx`**
   - Test team table renders with correct columns
   - Test expand/collapse behavior
   - Test Sync button click opens popup

4. **`src/__tests__/pages/Clipboard/components/ClipboardSyncConfirmPopup.test.tsx`**
   - Test confirm button triggers service call
   - Test cancel button closes popup
   - Test loading state during API call

**Run tests**:
```bash
npm run test -- src/__tests__/services/Clipboard/ClipboardMusicSyncService.test.ts
npm run test -- src/__tests__/pages/Clipboard/
```

---

### Phase 5: End-to-End Tests (Cypress) (15-20 min)

Create `cypress/e2e/Clipboard/ClipboardMusicSync.cy.ts`:

```typescript
describe('Clipboard Music Sync Feature', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/modules/remote/schoolbox-code/clipboard/music-sync');
  });

  it('displays list of clipboard teams on page load', () => {
    cy.get('table').should('exist');
    cy.get('tbody tr').should('have.length.greaterThan', 0);
    cy.get('tbody tr').first().within(() => {
      cy.get('td').eq(0).should('contain.text', 'Team Name');
      cy.get('td').eq(3).find('button').should('contain.text', 'Sync');
    });
  });

  it('allows user to trigger music sync and receive feedback', () => {
    cy.get('tbody tr').first().within(() => {
      cy.get('button:contains("Sync")').click();
    });

    // Verify confirmation popup appears
    cy.get('[role="dialog"]').should('exist');
    cy.get('[role="dialog"]').within(() => {
      cy.get('button:contains("Confirm Sync")').click();
    });

    // Verify success toast
    cy.get('[role="alert"]').should('contain.text', 'Sync triggered');
  });

  it('prevents duplicate submissions by disabling sync button', () => {
    cy.get('tbody tr').first().within(() => {
      const syncButton = cy.get('button:contains("Sync")');
      syncButton.click();
      cy.get('[role="dialog"]').within(() => {
        cy.get('button:contains("Confirm Sync")').click();
      });
      syncButton.should('be.disabled');
    });
  });

  it('displays error message on sync failure', () => {
    // Mock API to return error
    cy.intercept('POST', '/clipboard/syncMusic', { statusCode: 500, body: { message: 'Server error' } });
    cy.get('tbody tr').first().within(() => {
      cy.get('button:contains("Sync")').click();
    });
    cy.get('[role="dialog"]').within(() => {
      cy.get('button:contains("Confirm Sync")').click();
    });
    cy.get('[role="alert"]').should('contain.text', 'Sync failed');
  });
});
```

**Run Cypress**:
```bash
npm run cypress:open
# Select ClipboardMusicSync.cy.ts and run
```

---

### Phase 6: Manual Testing & Validation (10-15 min)

1. **Functional validation**:
   - [ ] Load page and verify teams list appears within 5 seconds
   - [ ] Expand a team and verify session details display
   - [ ] Click "Sync" button and verify confirmation popup appears
   - [ ] Confirm sync and verify success toast
   - [ ] Verify last sync timestamp updates in table

2. **Access control validation**:
   - [ ] Access page as Clipboard admin user (should work)
   - [ ] Access page as non-admin user (should show permission error or block access)
   - [ ] Verify page requires Clipboard module role

3. **Error handling validation**:
   - [ ] Disable backend API, reload page, verify error message
   - [ ] Try sync with invalid team, verify error feedback
   - [ ] Test duplicate sync submission (button should disable)

---

## Directory Structure Reference

```
src/
├── pages/Clipboard/
│   ├── ClipboardMusicSyncPage.tsx          # Main page
│   └── components/
│       ├── ClipboardTeamsListPanel.tsx      # Team list table
│       ├── ClipboardSessionDetailsPanel.tsx # Session info
│       └── ClipboardSyncConfirmPopup.tsx    # Confirmation modal
│
├── services/Clipboard/
│   ├── ClipboardTeamService.ts             # Existing (reuse)
│   ├── ClipboardSessionService.ts          # Existing (reuse)
│   └── ClipboardMusicSyncService.ts        # NEW (create)
│
├── types/Clipboard/
│   ├── iClipboardTeam.ts                   # Existing (reuse)
│   ├── iClipboardSession.ts                # Existing (reuse)
│   └── iClipboardSyncMessage.ts            # NEW (create)
│
└── __tests__/
    ├── services/Clipboard/ClipboardMusicSyncService.test.ts
    └── pages/Clipboard/
        ├── ClipboardMusicSyncPage.test.tsx
        └── components/
            ├── ClipboardTeamsListPanel.test.tsx
            ├── ClipboardSessionDetailsPanel.test.tsx
            └── ClipboardSyncConfirmPopup.test.tsx

cypress/
└── e2e/Clipboard/
    └── ClipboardMusicSync.cy.ts
```

---

## Dependencies & Imports Reference

### Common Imports (per Finance pattern)

```typescript
// React & state
import React, { useState, useEffect, useCallback } from 'react';

// React Bootstrap
import { Tab, Tabs, Table, Button, Modal, Spinner } from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';

// Styling
import styled from 'styled-components';

// Existing components
import Page from '../../layouts/Page';
import PageLoadingSpinner from '../../components/common/PageLoadingSpinner';
import PopupModal from '../../components/common/PopupModal';

// Services
import ClipboardTeamService from '../../services/Clipboard/ClipboardTeamService';
import ClipboardSessionService from '../../services/Clipboard/ClipboardSessionService';
import ClipboardMusicSyncService from '../../services/Clipboard/ClipboardMusicSyncService';
import Toaster from '../../services/Toaster';

// Types
import iClipboardTeam from '../../types/Clipboard/iClipboardTeam';
import iClipboardSession from '../../types/Clipboard/iClipboardSession';
import iClipboardSyncMessage from '../../types/Clipboard/iClipboardSyncMessage';
import { MGGS_MODULE_ID_CLIP_BOARD } from '../../types/modules/iModuleUser';
```

---

## Debugging Tips

1. **Teams not loading**: Check network tab for GET `/clipboard/team` response; verify `ClipboardTeamService.getAll()` is being called on mount.

2. **Sync button not working**: Check that `ClipboardMusicSyncService.triggerSync()` is being called; verify API endpoint and auth headers via network tab.

3. **Popup not appearing**: Verify `ClipboardSyncConfirmPopup` is being rendered and `show` prop is true on button click.

4. **Toasts not showing**: Check that `Toaster.success()` and `Toaster.error()` are being called; verify Toaster service is initialized globally.

5. **Type errors**: Run `npm run tsc -- --noEmit` to catch TypeScript errors; check that new types are exported correctly.

---

## Acceptance Criteria Checklist

- [ ] Page renders within 5 seconds (SC-001)
- [ ] All 10+ teams visible without pagination lag (SC-002)
- [ ] User receives sync feedback within 30 seconds (SC-003)
- [ ] Sync completion updates team status in table (SC-004)
- [ ] Duplicate submissions prevented via button disable (SC-005)
- [ ] Page meets accessibility standards (SC-006)
- [ ] All unit tests pass
- [ ] All Cypress e2e tests pass
- [ ] Manual validation complete
