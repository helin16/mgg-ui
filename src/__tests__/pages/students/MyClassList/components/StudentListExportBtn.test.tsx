describe('StudentListExportBtn', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/students/MyClassList/components/StudentListExportBtn');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
