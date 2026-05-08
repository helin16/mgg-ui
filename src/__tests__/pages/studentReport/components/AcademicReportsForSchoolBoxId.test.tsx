describe('AcademicReportsForSchoolBoxId', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/studentReport/components/AcademicReportsForSchoolBoxId');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
