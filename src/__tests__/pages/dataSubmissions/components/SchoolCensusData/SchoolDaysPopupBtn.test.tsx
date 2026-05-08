describe('SchoolDaysPopupBtn', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/dataSubmissions/components/SchoolCensusData/SchoolDaysPopupBtn');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
