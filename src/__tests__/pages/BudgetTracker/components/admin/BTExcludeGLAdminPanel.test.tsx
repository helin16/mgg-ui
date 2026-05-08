describe('BTExcludeGLAdminPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/BudgetTracker/components/admin/BTExcludeGLAdminPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
