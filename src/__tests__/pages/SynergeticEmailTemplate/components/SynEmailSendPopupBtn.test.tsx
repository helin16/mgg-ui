describe('SynEmailSendPopupBtn', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/SynergeticEmailTemplate/components/SynEmailSendPopupBtn');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
