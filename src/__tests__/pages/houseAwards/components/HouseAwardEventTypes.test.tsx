describe('HouseAwardEventTypes', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/houseAwards/components/HouseAwardEventTypes');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
