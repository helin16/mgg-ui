describe('AdminEditReportYear', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/studentReport/components/Admin/AdminEditReportYear');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
