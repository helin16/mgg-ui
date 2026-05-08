describe('MonthlyBillingReportPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/Finance/components/MonthlyBilling/MonthlyBillingReportPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
