describe('SchoolCensusDataAttendancePopupBtn', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/dataSubmissions/components/SchoolCensusData/SchoolCensusDataAttendancePopupBtn');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
