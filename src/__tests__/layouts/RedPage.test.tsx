import '../testUtils/layoutModuleMocks';

describe('RedPage', () => {
  test('loads module exports', () => {
    const mod = require('../../layouts/RedPage');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
