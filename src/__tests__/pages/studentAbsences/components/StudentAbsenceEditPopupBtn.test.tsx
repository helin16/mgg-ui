describe('StudentAbsenceEditPopupBtn', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/studentAbsences/components/StudentAbsenceEditPopupBtn');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
