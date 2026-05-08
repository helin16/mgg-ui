describe('RefelectionDiv', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../../../pages/studentReport/components/AcademicReports/DetailsComponents/sections/RefelectionDiv');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
