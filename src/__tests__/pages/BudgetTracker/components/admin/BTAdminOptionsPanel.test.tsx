describe('BTAdminOptionsPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/BudgetTracker/components/admin/BTAdminOptionsPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
