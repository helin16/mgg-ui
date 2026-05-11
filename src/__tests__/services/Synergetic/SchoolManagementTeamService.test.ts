import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SchoolManagementTeamService from '../../../services/Synergetic/SchoolManagementTeamService';

describe('SchoolManagementTeamService', () => {
  ServiceTestHelper.testCustom({
    name: 'getSchoolManagementTeams',
    serviceFn: SchoolManagementTeamService.getSchoolManagementTeams,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/smt"),
  });
  ServiceTestHelper.testCustom({
    name: 'create',
    serviceFn: SchoolManagementTeamService.create,
    appMethod: 'post',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/smt"),
  });
  ServiceTestHelper.testCustom({
    name: 'copyAllPreviousToCurrent',
    serviceFn: SchoolManagementTeamService.copyAllPreviousToCurrent,
    appMethod: 'post',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/smt/copyToCurrent"),
  });
  ServiceTestHelper.testCustom({
    name: 'update',
    serviceFn: SchoolManagementTeamService.update,
    appMethod: 'put',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/smt"),
  });
  ServiceTestHelper.testCustom({
    name: 'remove',
    serviceFn: SchoolManagementTeamService.remove,
    appMethod: 'delete',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgsWithId('/smt'),
  });
});
