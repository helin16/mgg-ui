import '../../testUtils/layoutModuleMocks';

describe('SchoolBoxUrls', () => {
  test('loads module exports', () => {
    const mod = require('../../../layouts/SchoolBox/SchoolBoxUrls');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
