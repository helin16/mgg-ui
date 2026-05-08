describe('StudentAbsenceEditPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/studentAbsences/components/StudentAbsenceEditPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
