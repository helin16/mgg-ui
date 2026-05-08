describe('BTGLListPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/BudgetTracker/components/BTGLListPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
