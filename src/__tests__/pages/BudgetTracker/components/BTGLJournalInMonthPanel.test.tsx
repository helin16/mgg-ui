describe('BTGLJournalInMonthPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/BudgetTracker/components/BTGLJournalInMonthPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
