describe('OnlineDonationModuleSettingsPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/OnlineDonation/components/OnlineDonationModuleSettingsPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
