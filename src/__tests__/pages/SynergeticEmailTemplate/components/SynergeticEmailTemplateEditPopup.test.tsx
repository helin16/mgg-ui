describe('SynergeticEmailTemplateEditPopup', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/SynergeticEmailTemplate/components/SynergeticEmailTemplateEditPopup');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
