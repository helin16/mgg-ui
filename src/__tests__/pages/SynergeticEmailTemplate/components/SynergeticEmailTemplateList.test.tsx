describe('SynergeticEmailTemplateList', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/SynergeticEmailTemplate/components/SynergeticEmailTemplateList');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
