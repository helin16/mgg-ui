import '../../../testUtils/layoutModuleMocks';

describe('MedicalPosterGenBtn', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/medicalReports/components/MedicalPosterGenBtn');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
