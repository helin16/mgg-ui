describe('AcaraDataHelper', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/dataSubmissions/components/ACARA/AcaraDataHelper');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
