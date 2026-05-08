describe('AdminReportList', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/studentReport/components/Admin/AdminReportList');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
