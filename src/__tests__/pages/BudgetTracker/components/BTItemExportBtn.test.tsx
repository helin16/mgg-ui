describe('BTItemExportBtn', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/BudgetTracker/components/BTItemExportBtn');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
