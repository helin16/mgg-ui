describe('HouseAwardScoreBoard', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/houseAwards/components/HouseAwardScoreBoard');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
