describe('BTGLDetailsPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/BudgetTracker/components/BTGLDetailsPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
