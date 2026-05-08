describe('StudentAttendanceRateDownloadHelper', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/reports/StudentAttendanceReport/components/StudentAttendanceRateDownloadHelper');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
