describe('BTUserAdminPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/BudgetTracker/components/admin/BTUserAdminPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
