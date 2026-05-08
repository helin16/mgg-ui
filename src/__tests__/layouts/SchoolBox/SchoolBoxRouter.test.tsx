import '../../testUtils/layoutModuleMocks';

describe('SchoolBoxRouter', () => {
  test('loads module exports', () => {
    const mod = require('../../../layouts/SchoolBox/SchoolBoxRouter');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
