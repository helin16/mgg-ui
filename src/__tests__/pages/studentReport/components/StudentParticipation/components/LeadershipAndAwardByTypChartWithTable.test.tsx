describe('LeadershipAndAwardByTypChartWithTable', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../../pages/studentReport/components/StudentParticipation/components/LeadershipAndAwardByTypChartWithTable');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
