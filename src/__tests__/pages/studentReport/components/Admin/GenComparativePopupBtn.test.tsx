describe('GenComparativePopupBtn', () => {
  test('loads module exports', () => {
    const mod = require('../../../../../pages/studentReport/components/Admin/GenComparativePopupBtn');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
