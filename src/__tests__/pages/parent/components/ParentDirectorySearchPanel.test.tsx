describe('ParentDirectorySearchPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/parent/components/ParentDirectorySearchPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
