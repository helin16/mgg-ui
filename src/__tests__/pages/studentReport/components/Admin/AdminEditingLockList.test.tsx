describe('AdminEditingLockList', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/studentReport/components/Admin/AdminEditingLockList');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
