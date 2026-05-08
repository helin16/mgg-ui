import '../../testUtils/layoutModuleMocks';

describe('SchoolBoxDebugInfo', () => {
  test('loads module exports', () => {
    const mod = require('../../../layouts/SchoolBox/SchoolBoxDebugInfo');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
