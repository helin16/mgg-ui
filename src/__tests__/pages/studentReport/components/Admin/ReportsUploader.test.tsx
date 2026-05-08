describe('ReportsUploader', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/studentReport/components/Admin/ReportsUploader');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
