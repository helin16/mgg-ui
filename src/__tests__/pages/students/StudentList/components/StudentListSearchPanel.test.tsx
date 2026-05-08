describe('StudentListSearchPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/students/StudentList/components/StudentListSearchPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
