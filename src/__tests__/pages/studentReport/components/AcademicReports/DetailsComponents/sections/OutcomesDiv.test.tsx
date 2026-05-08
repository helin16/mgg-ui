describe('OutcomesDiv', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../../../pages/studentReport/components/AcademicReports/DetailsComponents/sections/OutcomesDiv');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
