describe('StudentAbsenceSyncToSynergeticPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/studentAbsences/components/StudentAbsenceSyncToSynergeticPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
