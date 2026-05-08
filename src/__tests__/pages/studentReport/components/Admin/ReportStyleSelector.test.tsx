describe('ReportStyleSelector', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/studentReport/components/Admin/ReportStyleSelector');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
