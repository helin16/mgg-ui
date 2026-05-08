describe('UnSyncdStudentAbsenceListPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/studentAbsences/components/UnSyncdStudentAbsenceListPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
