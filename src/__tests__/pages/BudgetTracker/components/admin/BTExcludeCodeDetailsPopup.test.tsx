describe('BTExcludeCodeDetailsPopup', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/BudgetTracker/components/admin/BTExcludeCodeDetailsPopup');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
