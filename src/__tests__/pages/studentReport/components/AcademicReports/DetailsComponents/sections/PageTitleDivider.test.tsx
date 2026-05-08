describe('PageTitleDivider', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../../../pages/studentReport/components/AcademicReports/DetailsComponents/sections/PageTitleDivider');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
