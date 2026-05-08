import '../testUtils/layoutModuleMocks';

describe('AdminPage', () => {
  test('loads module exports', () => {
    const mod = require('../../layouts/AdminPage');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
