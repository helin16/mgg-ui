describe('StudentAttendanceRatePopup', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/reports/StudentAttendanceReport/components/StudentAttendanceRatePopup');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
