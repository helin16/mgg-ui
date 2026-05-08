describe('StudentAcademicEmailPopup', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../../pages/studentReport/components/AcademicReports/DetailsComponents/StudentAcademicEmailPopup');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
