describe('SchoolBoxHelper', () => {
  test('loads module exports', () => {
    const mod = require('../../helper/SchoolBoxHelper');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
