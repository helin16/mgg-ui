describe('StudentList', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/students/StudentList/components/StudentList');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
