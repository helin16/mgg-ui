describe('ExpiringCreditCardsTable', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/Finance/components/SynDebtorPaymentMethod/ExpiringCreditCardsTable');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
