describe('AssessmentTasksDiv', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../../../pages/studentReport/components/AcademicReports/DetailsComponents/sections/AssessmentTasksDiv');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
