describe('EnrolmentManagementAdminSettings', () => {
  test('loads module exports', () => {
    const mod = require('../../../../pages/Enrollments/components/EnrolmentManagementAdminSettings');
    const exported = mod.default || mod;

    expect(exported).toBeTruthy();
  });
});
