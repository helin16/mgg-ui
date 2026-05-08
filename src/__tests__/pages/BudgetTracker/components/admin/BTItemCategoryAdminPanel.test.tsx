describe('BTItemCategoryAdminPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/BudgetTracker/components/admin/BTItemCategoryAdminPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
