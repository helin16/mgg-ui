describe('CoCurricularActivitiesDiv', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../../../pages/studentReport/components/AcademicReports/DetailsComponents/sections/CoCurricularActivitiesDiv');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
