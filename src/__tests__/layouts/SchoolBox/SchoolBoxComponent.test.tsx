import '../../testUtils/layoutModuleMocks';

describe('SchoolBoxComponent', () => {
  test('loads module exports', () => {
    const mod = require('../../../layouts/SchoolBox/SchoolBoxComponent');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
