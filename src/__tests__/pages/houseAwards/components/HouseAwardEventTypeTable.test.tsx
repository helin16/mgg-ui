describe('HouseAwardEventTypeTable', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/houseAwards/components/HouseAwardEventTypeTable');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
