describe('HouseAwardEventTable', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/houseAwards/components/HouseAwardEventTable');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
