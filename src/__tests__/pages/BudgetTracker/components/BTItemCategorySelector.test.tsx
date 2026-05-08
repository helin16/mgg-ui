describe('BTItemCategorySelector', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/BudgetTracker/components/BTItemCategorySelector');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
