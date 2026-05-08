describe('DonorReceiptList', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/OnlineDonation/components/DonorReceiptList');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
