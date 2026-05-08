describe('LearningAgencyDiv', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../../../pages/studentReport/components/AcademicReports/DetailsComponents/sections/LearningAgencyDiv');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
