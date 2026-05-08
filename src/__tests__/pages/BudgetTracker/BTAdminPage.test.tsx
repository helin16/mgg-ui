describe('BTAdminPage', () => {
  test('loads module exports', () => {
    const mod = require('../../../pages/BudgetTracker/BTAdminPage');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
