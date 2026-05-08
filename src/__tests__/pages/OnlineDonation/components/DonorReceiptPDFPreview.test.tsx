describe('DonorReceiptPDFPreview', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/OnlineDonation/components/DonorReceiptPDFPreview');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
