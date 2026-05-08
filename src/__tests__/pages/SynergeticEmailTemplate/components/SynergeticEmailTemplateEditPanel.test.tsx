describe('SynergeticEmailTemplateEditPanel', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/SynergeticEmailTemplate/components/SynergeticEmailTemplateEditPanel');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
