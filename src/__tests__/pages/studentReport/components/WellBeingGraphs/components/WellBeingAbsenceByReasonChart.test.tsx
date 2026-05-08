describe('WellBeingAbsenceByReasonChart', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../../pages/studentReport/components/WellBeingGraphs/components/WellBeingAbsenceByReasonChart');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
