describe('SchoolCensusAbsenceSummaryDiv', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/dataSubmissions/components/SchoolCensusData/SchoolCensusAbsenceSummaryDiv');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
