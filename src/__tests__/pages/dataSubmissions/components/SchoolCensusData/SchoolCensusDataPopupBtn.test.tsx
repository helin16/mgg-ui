describe('SchoolCensusDataPopupBtn', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/dataSubmissions/components/SchoolCensusData/SchoolCensusDataPopupBtn');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
