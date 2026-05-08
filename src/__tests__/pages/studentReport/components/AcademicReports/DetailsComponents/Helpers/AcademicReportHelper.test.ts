describe('AcademicReportHelper', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../../../pages/studentReport/components/AcademicReports/DetailsComponents/Helpers/AcademicReportHelper');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
