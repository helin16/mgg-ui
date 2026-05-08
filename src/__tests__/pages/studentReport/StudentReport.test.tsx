describe('StudentReport', () => {
  test('loads module exports', () => {
    const mod = require('../../../pages/studentReport/StudentReport');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
