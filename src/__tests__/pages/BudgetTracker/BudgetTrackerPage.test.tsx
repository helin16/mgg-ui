describe('BudgetTrackerPage', () => {
  test('loads module exports', () => {
    const mod = require('../../../pages/BudgetTracker/BudgetTrackerPage');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
