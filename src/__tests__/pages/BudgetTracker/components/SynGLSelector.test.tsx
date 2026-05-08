describe('SynGLSelector', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/BudgetTracker/components/SynGLSelector');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
