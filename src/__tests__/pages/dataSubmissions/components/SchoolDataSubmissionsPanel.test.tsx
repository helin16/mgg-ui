describe('SchoolDataSubmissionsPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/dataSubmissions/components/SchoolDataSubmissionsPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
