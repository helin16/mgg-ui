describe('ServiceHelper', () => {
  test('loads module exports', () => {
    const mod = require('../../helper/ServiceHelper');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
