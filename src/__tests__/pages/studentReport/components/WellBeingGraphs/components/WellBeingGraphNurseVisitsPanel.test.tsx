describe('WellBeingGraphNurseVisitsPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../../pages/studentReport/components/WellBeingGraphs/components/WellBeingGraphNurseVisitsPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
