describe('ExpiringCreditCardsPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/Finance/components/SynDebtorPaymentMethod/ExpiringCreditCardsPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
