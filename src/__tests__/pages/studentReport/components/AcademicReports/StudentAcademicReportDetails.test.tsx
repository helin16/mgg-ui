describe('StudentAcademicReportDetails', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/studentReport/components/AcademicReports/StudentAcademicReportDetails');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
