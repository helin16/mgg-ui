describe('SchoolDaysAllPopupBtn', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/dataSubmissions/components/SchoolCensusData/SchoolDaysAllPopupBtn');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
