import ServiceTestHelper from '../helper/ServiceTestHelper';
import AuthService from '../../services/AuthService';
import AppService from '../../services/AppService';

describe('AuthService', () => {
  const endPoint = '/auth';

  ServiceTestHelper.testCustom({
    name: 'authSchoolBox',
    serviceFn: AuthService.authSchoolBox,
    appMethod: 'post',
    callArgs: ['123', 'schoolbox-user', '123', 'secret'],
    expectedArgs: [
      `${endPoint}/schoolbox`,
      {
        synId: '123',
        schoolBoxUser: 'schoolbox-user',
        time: '123',
        key: 'secret',
      },
    ],
  });

  ServiceTestHelper.testCustom({
    name: 'canAccessModule',
    serviceFn: AuthService.canAccessModule,
    appMethod: 'get',
    callArgs: ['123'],
    expectedArgs: [`${endPoint}/canAccess?moduleId=123`],
  });

  describe('isModuleRole', () => {
    test('checks the requested role access', async () => {
      AppService.get = jest.fn().mockResolvedValueOnce({
        data: {
          3: {canAccess: true},
          4: {canAccess: false},
        },
      }) as any;

      await expect(AuthService.isModuleRole(10, 3)).resolves.toBe(true);
      await expect(AuthService.isModuleRole(10, 4)).resolves.toBe(false);
      await expect(AuthService.isModuleRole(10, 5)).resolves.toBe(false);
    });
  });
});
