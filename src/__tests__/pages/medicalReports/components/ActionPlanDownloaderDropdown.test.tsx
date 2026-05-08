describe('ActionPlanDownloaderDropdown', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/medicalReports/components/ActionPlanDownloaderDropdown');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
