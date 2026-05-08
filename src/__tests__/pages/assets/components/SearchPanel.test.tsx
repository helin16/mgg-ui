describe('SearchPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/assets/components/SearchPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
