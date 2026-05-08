describe('ReportedYearsList', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/studentReport/components/AcademicReports/ReportedYearsList');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
