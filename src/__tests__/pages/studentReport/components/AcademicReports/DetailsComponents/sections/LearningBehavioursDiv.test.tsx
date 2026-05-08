describe('LearningBehavioursDiv', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../../../pages/studentReport/components/AcademicReports/DetailsComponents/sections/LearningBehavioursDiv');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
