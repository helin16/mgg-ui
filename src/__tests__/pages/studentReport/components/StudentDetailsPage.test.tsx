describe('StudentDetailsPage', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/studentReport/components/StudentDetailsPage');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
