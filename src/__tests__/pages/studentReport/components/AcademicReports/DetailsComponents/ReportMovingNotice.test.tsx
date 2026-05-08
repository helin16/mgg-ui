describe('ReportMovingNotice', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../../pages/studentReport/components/AcademicReports/DetailsComponents/ReportMovingNotice');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
