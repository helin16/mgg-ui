describe('WellBeingGraphDetailsPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../../pages/studentReport/components/WellBeingGraphs/components/WellBeingGraphDetailsPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
