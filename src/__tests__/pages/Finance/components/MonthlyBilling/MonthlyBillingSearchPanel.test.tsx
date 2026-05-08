describe('MonthlyBillingSearchPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/Finance/components/MonthlyBilling/MonthlyBillingSearchPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
