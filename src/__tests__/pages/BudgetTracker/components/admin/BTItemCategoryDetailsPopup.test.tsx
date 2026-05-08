describe('BTItemCategoryDetailsPopup', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/BudgetTracker/components/admin/BTItemCategoryDetailsPopup');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
