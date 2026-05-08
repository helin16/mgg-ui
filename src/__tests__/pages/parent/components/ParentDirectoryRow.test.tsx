describe('ParentDirectoryRow', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/parent/components/ParentDirectoryRow');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
