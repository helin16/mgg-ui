describe('MggDeviceList', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/devices/components/MggDeviceList');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
