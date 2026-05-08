describe('PickupPageLayout', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/assets/components/PickupPageLayout');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
