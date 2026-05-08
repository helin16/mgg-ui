describe('OnlineDonationListPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/OnlineDonation/components/OnlineDonationListPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
