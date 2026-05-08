describe('BTItemsTable', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/BudgetTracker/components/BTItemsTable');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
