describe('AcaraDataExportHelper', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/dataSubmissions/components/ACARA/AcaraDataExportHelper');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
