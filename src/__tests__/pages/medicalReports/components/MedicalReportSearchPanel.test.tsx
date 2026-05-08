describe('MedicalReportSearchPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/medicalReports/components/MedicalReportSearchPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
