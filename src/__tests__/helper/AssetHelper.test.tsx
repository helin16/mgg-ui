describe('AssetHelper', () => {
  test('loads module exports', () => {
    const mod = require('../../helper/AssetHelper');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
