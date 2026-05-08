import '../testUtils/layoutModuleMocks';

describe('AdminPageTabs', () => {
  test('loads module exports', () => {
    const mod = require('../../layouts/AdminPageTabs');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
