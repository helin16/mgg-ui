describe('StudentAttendanceRateReportTable', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/reports/StudentAttendanceReport/components/StudentAttendanceRateReportTable');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
