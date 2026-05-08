describe('LearningAreaGraph', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../../../pages/studentReport/components/AcademicReports/DetailsComponents/sections/LearningAreaGraph');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
