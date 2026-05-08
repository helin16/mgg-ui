describe('AcaraDataList', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/dataSubmissions/components/ACARA/AcaraDataList');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
