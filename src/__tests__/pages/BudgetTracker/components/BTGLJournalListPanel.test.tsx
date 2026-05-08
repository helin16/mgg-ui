describe('BTGLJournalListPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/BudgetTracker/components/BTGLJournalListPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
