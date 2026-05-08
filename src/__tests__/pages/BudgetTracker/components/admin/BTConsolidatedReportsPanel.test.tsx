describe('BTConsolidatedReportsPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/BudgetTracker/components/admin/BTConsolidatedReportsPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
