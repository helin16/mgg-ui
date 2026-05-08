import '../../testUtils/layoutModuleMocks';

describe('MedicalReportPage', () => {
  test('loads module exports', () => {
    const mod = require('../../../pages/medicalReports/MedicalReportPage');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
