import '../../../testUtils/layoutModuleMocks';

describe('MedicalReportExportDropdown', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/medicalReports/components/MedicalReportExportDropdown');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
