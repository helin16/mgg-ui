describe('JnrGraphHomeGroupPage', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../../../pages/studentReport/components/AcademicReports/DetailsComponents/pages/JnrGraphHomeGroupPage');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
