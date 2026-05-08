import '../testUtils/layoutModuleMocks';

describe('SchoolBoxLayout', () => {
  test('loads module exports', () => {
    const mod = require('../../layouts/SchoolBoxLayout');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
