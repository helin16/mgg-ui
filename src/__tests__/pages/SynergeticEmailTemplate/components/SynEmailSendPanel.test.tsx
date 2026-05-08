describe('SynEmailSendPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/SynergeticEmailTemplate/components/SynEmailSendPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
