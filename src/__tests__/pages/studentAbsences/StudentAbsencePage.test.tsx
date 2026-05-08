describe('StudentAbsencePage', () => {
  test('loads module exports', () => {
    const mod = require('../../../pages/studentAbsences/StudentAbsencePage');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
