describe('BTLockDownCreatePopup', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/BudgetTracker/components/admin/BTLockDownCreatePopup');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
