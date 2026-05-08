describe('ComparativeGraphPage', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../../../pages/studentReport/components/AcademicReports/DetailsComponents/pages/ComparativeGraphPage');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
