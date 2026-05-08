describe('BTItemBulkCreatePanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/BudgetTracker/components/BTItemBulkCreatePanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
