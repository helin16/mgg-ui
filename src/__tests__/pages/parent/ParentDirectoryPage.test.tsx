describe('ParentDirectoryPage', () => {
  test('loads module exports', () => {
    const mod = require('../../../pages/parent/ParentDirectoryPage');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
