describe('CoverLetterPage', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../../../pages/studentReport/components/AcademicReports/DetailsComponents/pages/CoverLetterPage');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
