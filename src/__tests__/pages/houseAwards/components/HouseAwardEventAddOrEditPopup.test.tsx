describe('HouseAwardEventAddOrEditPopup', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/houseAwards/components/HouseAwardEventAddOrEditPopup');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
