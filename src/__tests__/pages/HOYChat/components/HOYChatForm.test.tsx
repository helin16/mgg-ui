describe('HOYChatForm', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/HOYChat/components/HOYChatForm');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
