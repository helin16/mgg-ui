describe('StudentAcademicDocManList', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../../pages/studentReport/components/AcademicReports/DetailsComponents/StudentAcademicDocManList');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
