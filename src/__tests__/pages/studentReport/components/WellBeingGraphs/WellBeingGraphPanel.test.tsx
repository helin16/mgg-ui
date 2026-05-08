describe('WellBeingGraphPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/studentReport/components/WellBeingGraphs/WellBeingGraphPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
