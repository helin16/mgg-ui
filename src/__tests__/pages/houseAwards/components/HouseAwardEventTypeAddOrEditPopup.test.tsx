describe('HouseAwardEventTypeAddOrEditPopup', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/houseAwards/components/HouseAwardEventTypeAddOrEditPopup');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
