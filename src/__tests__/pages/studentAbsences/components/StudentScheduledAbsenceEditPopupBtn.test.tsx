describe('StudentScheduledAbsenceEditPopupBtn', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/studentAbsences/components/StudentScheduledAbsenceEditPopupBtn');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
