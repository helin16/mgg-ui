describe('BTItemEditPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/BudgetTracker/components/BTItemEditPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
