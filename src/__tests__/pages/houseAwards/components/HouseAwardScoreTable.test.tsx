describe('HouseAwardScoreTable', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/houseAwards/components/HouseAwardScoreTable');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
