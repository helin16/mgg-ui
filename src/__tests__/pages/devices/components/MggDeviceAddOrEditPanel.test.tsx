describe('MggDeviceAddOrEditPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/devices/components/MggDeviceAddOrEditPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
