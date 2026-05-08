describe('HouseAwardScoreBulkCheckBox', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/houseAwards/components/HouseAwardScoreBulkCheckBox');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
