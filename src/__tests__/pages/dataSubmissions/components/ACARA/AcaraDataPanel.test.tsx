describe('AcaraDataPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/dataSubmissions/components/ACARA/AcaraDataPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
