describe('HOYChatModuleSettings', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/HOYChat/components/HOYChatModuleSettings');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
