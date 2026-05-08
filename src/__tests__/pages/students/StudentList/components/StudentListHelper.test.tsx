describe('StudentListHelper', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/students/StudentList/components/StudentListHelper');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
