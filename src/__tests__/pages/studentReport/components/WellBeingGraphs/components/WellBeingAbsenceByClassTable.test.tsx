describe('WellBeingAbsenceByClassTable', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../../pages/studentReport/components/WellBeingGraphs/components/WellBeingAbsenceByClassTable');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
