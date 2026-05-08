describe('BTItemsDownloadPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/BudgetTracker/components/admin/BTItemsDownloadPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
