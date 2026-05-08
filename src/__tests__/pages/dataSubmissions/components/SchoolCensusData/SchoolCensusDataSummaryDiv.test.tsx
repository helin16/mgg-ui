describe('SchoolCensusDataSummaryDiv', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/dataSubmissions/components/SchoolCensusData/SchoolCensusDataSummaryDiv');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
