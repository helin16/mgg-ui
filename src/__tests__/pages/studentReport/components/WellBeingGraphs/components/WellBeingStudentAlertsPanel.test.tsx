describe('WellBeingStudentAlertsPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../../pages/studentReport/components/WellBeingGraphs/components/WellBeingStudentAlertsPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
