describe('SubjectDescriptionDiv', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../../../pages/studentReport/components/AcademicReports/DetailsComponents/sections/SubjectDescriptionDiv');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
