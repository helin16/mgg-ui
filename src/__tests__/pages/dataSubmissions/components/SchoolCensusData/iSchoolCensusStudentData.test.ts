describe('iSchoolCensusStudentData', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/dataSubmissions/components/SchoolCensusData/iSchoolCensusStudentData');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
