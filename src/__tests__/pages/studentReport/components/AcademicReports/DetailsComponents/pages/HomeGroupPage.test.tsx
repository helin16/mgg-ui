describe('HomeGroupPage', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../../../pages/studentReport/components/AcademicReports/DetailsComponents/pages/HomeGroupPage');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
