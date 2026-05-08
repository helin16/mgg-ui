describe('SchoolCensusTable', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/dataSubmissions/components/SchoolCensusData/SchoolCensusTable');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
