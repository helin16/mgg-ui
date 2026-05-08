describe('ComparativeSection', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../../../pages/studentReport/components/AcademicReports/DetailsComponents/sections/ComparativeSection');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
