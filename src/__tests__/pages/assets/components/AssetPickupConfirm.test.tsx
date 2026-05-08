describe('AssetPickupConfirm', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/assets/components/AssetPickupConfirm');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
