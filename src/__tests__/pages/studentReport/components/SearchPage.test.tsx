describe('SearchPage', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/studentReport/components/SearchPage');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
