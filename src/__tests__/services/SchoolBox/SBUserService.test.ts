import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SBUserService from '../../../services/SchoolBox/SBUserService';
import AppService from '../../../services/AppService';

describe('SBUserService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SBUserService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/sb/user"),
  });

  test('getBySynergeticId queries by externalId and returns the first user', async () => {
    const fakeUser = {id: 101, externalId: '40430', username: 'student.user'} as any;
    AppService.get = jest.fn().mockResolvedValueOnce({
      data: {
        data: [fakeUser],
      },
    }) as any;

    const result = await SBUserService.getBySynergeticId('40430');

    expect(AppService.get).toHaveBeenCalledWith('/sb/user', {
      filter: JSON.stringify({externalId: '40430'}),
      limit: 1,
    });
    expect(result).toEqual(fakeUser);
  });

  test('getBySynergeticId returns null for blank ids', async () => {
    AppService.get = jest.fn() as any;

    const result = await SBUserService.getBySynergeticId('');

    expect(AppService.get).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
