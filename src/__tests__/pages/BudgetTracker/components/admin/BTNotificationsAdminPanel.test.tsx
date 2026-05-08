describe('BTNotificationsAdminPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/BudgetTracker/components/admin/BTNotificationsAdminPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
