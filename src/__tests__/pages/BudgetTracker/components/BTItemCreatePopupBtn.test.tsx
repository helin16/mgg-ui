describe('BTItemCreatePopupBtn', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/BudgetTracker/components/BTItemCreatePopupBtn');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
