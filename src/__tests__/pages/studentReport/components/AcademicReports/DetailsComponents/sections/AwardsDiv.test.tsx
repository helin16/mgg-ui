describe('AwardsDiv', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../../../pages/studentReport/components/AcademicReports/DetailsComponents/sections/AwardsDiv');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
