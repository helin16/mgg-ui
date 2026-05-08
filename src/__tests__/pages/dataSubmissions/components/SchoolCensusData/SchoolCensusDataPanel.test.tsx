describe('SchoolCensusDataPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/dataSubmissions/components/SchoolCensusData/SchoolCensusDataPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
