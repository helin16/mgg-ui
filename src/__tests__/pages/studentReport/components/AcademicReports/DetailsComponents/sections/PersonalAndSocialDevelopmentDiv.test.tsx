describe('PersonalAndSocialDevelopmentDiv', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../../../pages/studentReport/components/AcademicReports/DetailsComponents/sections/PersonalAndSocialDevelopmentDiv');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
