describe('BTLockdownPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/BudgetTracker/components/BTLockdownPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
