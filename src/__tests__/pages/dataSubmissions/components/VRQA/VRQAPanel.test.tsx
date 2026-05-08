describe('VRQAPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/dataSubmissions/components/VRQA/VRQAPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
