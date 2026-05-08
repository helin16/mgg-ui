describe('SchoolCensusDataExportHelper', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/dataSubmissions/components/SchoolCensusData/SchoolCensusDataExportHelper');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
