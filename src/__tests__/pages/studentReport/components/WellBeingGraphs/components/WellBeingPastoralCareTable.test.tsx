describe('WellBeingPastoralCareTable', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../../pages/studentReport/components/WellBeingGraphs/components/WellBeingPastoralCareTable');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
