describe('StudentListResultPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/students/MyClassList/components/StudentListResultPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
