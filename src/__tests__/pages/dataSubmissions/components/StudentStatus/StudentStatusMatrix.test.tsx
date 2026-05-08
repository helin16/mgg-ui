describe('StudentStatusMatrix', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/dataSubmissions/components/StudentStatus/StudentStatusMatrix');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
