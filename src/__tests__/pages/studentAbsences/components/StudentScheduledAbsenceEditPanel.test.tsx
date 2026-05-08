describe('StudentScheduledAbsenceEditPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/studentAbsences/components/StudentScheduledAbsenceEditPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
