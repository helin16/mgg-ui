describe('AcaraDataPanelHelper', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/dataSubmissions/components/ACARA/AcaraDataPanelHelper');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
