import ServiceTestHelper from '../helper/ServiceTestHelper';
import UserService from '../../services/UserService';

describe('UserService', () => {
  const endPoint = '/user';

  ServiceTestHelper.testCustom({
    name: 'getUsers',
    serviceFn: UserService.getUsers,
    appMethod: 'get',
    callArgs: [{fakeParams: 'value'}],
    expectedArgs: [endPoint, {fakeParams: 'value'}],
  });
  ServiceTestHelper.testCustom({
    name: 'deleteUser',
    serviceFn: UserService.deleteUser,
    appMethod: 'delete',
    callArgs: ['1', '2', '3'],
    expectedArgs: [`${endPoint}/1/2/3`],
  });
  ServiceTestHelper.testCustom({
    name: 'createUser',
    serviceFn: UserService.createUser,
    appMethod: 'post',
    callArgs: ['1', '2', '3', {fakeParams: 'value'}],
    expectedArgs: [`${endPoint}/1/2/3`, {fakeParams: 'value'}],
  });
  ServiceTestHelper.testCustom({
    name: 'updateUser',
    serviceFn: UserService.updateUser,
    appMethod: 'put',
    callArgs: ['1', '2', '3', {fakeParams: 'value'}],
    expectedArgs: [`${endPoint}/1/2/3`, {fakeParams: 'value'}],
  });
});
