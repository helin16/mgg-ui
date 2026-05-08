describe('OverallGradeDiv', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../../../pages/studentReport/components/AcademicReports/DetailsComponents/sections/OverallGradeDiv');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
