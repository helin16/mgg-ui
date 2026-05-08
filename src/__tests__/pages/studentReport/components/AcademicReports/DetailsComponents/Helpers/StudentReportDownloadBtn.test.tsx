describe('StudentReportDownloadBtn', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../../../pages/studentReport/components/AcademicReports/DetailsComponents/Helpers/StudentReportDownloadBtn');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
