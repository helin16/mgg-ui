describe('StudentAbsenceCreatePage', () => {
  test('loads module exports', () => {
    const mod = require('../../../pages/studentAbsences/StudentAbsenceCreatePage');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
