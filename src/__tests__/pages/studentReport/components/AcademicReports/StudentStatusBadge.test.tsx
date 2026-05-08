describe('StudentStatusBadge', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/studentReport/components/AcademicReports/StudentStatusBadge');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
