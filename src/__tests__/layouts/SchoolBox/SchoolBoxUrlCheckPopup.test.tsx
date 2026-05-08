import '../../testUtils/layoutModuleMocks';

describe('SchoolBoxUrlCheckPopup', () => {
  test('loads module exports', () => {
    const mod = require('../../../layouts/SchoolBox/SchoolBoxUrlCheckPopup');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
