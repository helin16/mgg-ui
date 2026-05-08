describe('StudentAcademicSubjectPage', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../../../pages/studentReport/components/AcademicReports/DetailsComponents/pages/StudentAcademicSubjectPage');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
