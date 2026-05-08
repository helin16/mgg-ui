describe('CommentsDiv', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../../../pages/studentReport/components/AcademicReports/DetailsComponents/sections/CommentsDiv');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
