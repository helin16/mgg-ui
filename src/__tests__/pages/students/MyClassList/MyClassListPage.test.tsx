describe('MyClassListPage', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/students/MyClassList/MyClassListPage');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
