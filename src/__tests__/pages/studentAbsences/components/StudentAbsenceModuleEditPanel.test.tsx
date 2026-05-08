describe('StudentAbsenceModuleEditPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/studentAbsences/components/StudentAbsenceModuleEditPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
