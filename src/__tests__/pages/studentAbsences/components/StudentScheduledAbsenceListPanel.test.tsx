describe('StudentScheduledAbsenceListPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/studentAbsences/components/StudentScheduledAbsenceListPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
