describe('PATDataList', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/students/MyClassList/components/PATDataList');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
