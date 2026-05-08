describe('SchoolCensusDataSearchPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/dataSubmissions/components/SchoolCensusData/SchoolCensusDataSearchPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
