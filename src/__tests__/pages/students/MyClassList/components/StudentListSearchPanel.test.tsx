describe('StudentListSearchPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/students/MyClassList/components/StudentListSearchPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
