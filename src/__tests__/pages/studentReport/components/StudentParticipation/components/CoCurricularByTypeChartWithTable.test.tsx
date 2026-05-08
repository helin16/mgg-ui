describe('CoCurricularByTypeChartWithTable', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../../pages/studentReport/components/StudentParticipation/components/CoCurricularByTypeChartWithTable');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
