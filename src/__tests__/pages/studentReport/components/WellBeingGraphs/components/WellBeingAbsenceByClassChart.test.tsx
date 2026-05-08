describe('WellBeingAbsenceByClassChart', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../../pages/studentReport/components/WellBeingGraphs/components/WellBeingAbsenceByClassChart');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
