describe('MyClassList', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/students/MyClassList/components/MyClassList');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
