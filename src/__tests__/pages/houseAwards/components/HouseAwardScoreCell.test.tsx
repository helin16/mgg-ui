describe('HouseAwardScoreCell', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/houseAwards/components/HouseAwardScoreCell');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
