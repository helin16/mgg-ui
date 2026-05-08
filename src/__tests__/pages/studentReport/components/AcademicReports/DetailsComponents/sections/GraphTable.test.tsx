describe('GraphTable', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../../../pages/studentReport/components/AcademicReports/DetailsComponents/sections/GraphTable');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
