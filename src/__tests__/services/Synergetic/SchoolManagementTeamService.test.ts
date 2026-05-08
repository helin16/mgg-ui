import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SchoolManagementTeamService from '../../../services/Synergetic/SchoolManagementTeamService';

describe('SchoolManagementTeamService', () => {
  ServiceTestHelper.testCustom({
    name: 'getSchoolManagementTeams',
    serviceFn: SchoolManagementTeamService.getSchoolManagementTeams,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/smt", {"fakeParams":"value"}],
  });
  ServiceTestHelper.testCustom({
    name: 'create',
    serviceFn: SchoolManagementTeamService.create,
    appMethod: 'post',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/smt", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'copyAllPreviousToCurrent',
    serviceFn: SchoolManagementTeamService.copyAllPreviousToCurrent,
    appMethod: 'post',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/smt/copyToCurrent", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'update',
    serviceFn: SchoolManagementTeamService.update,
    appMethod: 'put',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/smt/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'remove',
    serviceFn: SchoolManagementTeamService.remove,
    appMethod: 'delete',
    callArgs: ["123", {"fakeParams":"value"}],
    expectedArgs: ["/smt/123", {"fakeParams":"value"}],
  });
});
