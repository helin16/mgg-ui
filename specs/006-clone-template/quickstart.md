# Quickstart: Clone Email Template

## Prerequisites

- Use the repo root: `/Users/helin/git/MentoneGirls/mgg-ui`
- Install dependencies with `yarn install`
- Ensure the user can access the Synergetic Email Template manager module

## Automated Verification

Run the focused template list test file:

```bash
CI=true yarn test --runTestsByPath src/__tests__/pages/SynergeticEmailTemplate/components/SynergeticEmailTemplateList.test.tsx
```

If clone behavior is covered in adjacent component tests as implementation expands, run
those focused paths as well.

## Manual Verification

1. Start the app with `yarn start`.
2. Open the Synergetic Email Template manager module.
3. Confirm each template row shows `Send`, `Clone`, and `Archive` in that order.
4. Click `Clone` for a template and verify the modal opens.
5. Attempt to confirm with an empty name and verify validation blocks submission.
6. Enter a valid new name with `New Style` unchecked, confirm, and verify:
   - success feedback is shown
   - the source template is unchanged
   - a separate cloned template appears after refresh
   - the clone does not show the `New Style?` indicator
7. Repeat with `New Style` checked and verify the clone shows the `New Style?` indicator.
8. Clone a source template that already uses `New Style` with `New Style` checked and
   verify the clone preserves the source builder design data.
9. Clone a source template that does not use `New Style` with `New Style` checked and
   verify the clone succeeds without requiring builder-design conversion from HTML.
10. Trigger an API failure path if practical and verify:
   - the error is surfaced to the user
   - the modal stays open for retry or cancel
   - duplicate confirm clicks are blocked while the request is active

## Notes

- No new environment variables or external configuration are expected for this feature.
- The clone flow should reuse current template create/list behavior rather than introduce
  a separate management screen.
- This feature does not add HTML-to-builder conversion; builder design is copied only when
  the source template already has `templateObj` data.
