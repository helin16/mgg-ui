describe('BTLockDownAdminPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/BudgetTracker/components/admin/BTLockDownAdminPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
