describe('StudentAcademicReportMenu', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../../pages/studentReport/components/AcademicReports/DetailsComponents/StudentAcademicReportMenu');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
