describe('MggDeviceLocalAccessWrapper', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/devices/components/MggDeviceLocalAccessWrapper');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
