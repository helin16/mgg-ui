describe('DonorReceiptsSendingPopup', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/OnlineDonation/components/DonorReceiptsSendingPopup');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
