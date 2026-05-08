describe('LocalMediaHelper', () => {
  test('loads module exports', () => {
    const mod = require('../../helper/LocalMediaHelper');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
