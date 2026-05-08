describe('AdminPageHeader', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/studentReport/components/Admin/AdminPageHeader');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
