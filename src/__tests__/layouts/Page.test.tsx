import '../testUtils/layoutModuleMocks';

describe('Page', () => {
  test('loads module exports', () => {
    const mod = require('../../layouts/Page');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
