import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SchoolManagementTeamService from '../../../services/Synergetic/SchoolManagementTeamService';

describe('SchoolManagementTeamService', () => {
  const endPoint = '/smt';

  ServiceTestHelper.testGetAll(endPoint, SchoolManagementTeamService.getSchoolManagementTeams);
  ServiceTestHelper.testCreate(endPoint, SchoolManagementTeamService.create);
  ServiceTestHelper.testCustom({
    name: 'copyAllPreviousToCurrent',
    serviceFn: SchoolManagementTeamService.copyAllPreviousToCurrent,
    appMethod: 'post',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/smt/copyToCurrent", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testUpdate(endPoint, SchoolManagementTeamService.update);
  ServiceTestHelper.testDeactivate(endPoint, SchoolManagementTeamService.remove);
});
