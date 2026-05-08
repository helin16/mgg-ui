describe('ComparativeAnalysisPage', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../../../pages/studentReport/components/AcademicReports/DetailsComponents/pages/ComparativeAnalysisPage');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
