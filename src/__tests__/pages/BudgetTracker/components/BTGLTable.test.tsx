describe('BTGLTable', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/BudgetTracker/components/BTGLTable');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
