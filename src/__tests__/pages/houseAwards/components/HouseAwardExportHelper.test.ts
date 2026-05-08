describe('HouseAwardExportHelper', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/houseAwards/components/HouseAwardExportHelper');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
