describe('StudentListPage', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/students/StudentList/StudentListPage');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
