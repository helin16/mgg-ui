import ServiceTestHelper from '../../helper/ServiceTestHelper';
import HouseAwardScoreService from '../../../services/HouseAwards/HouseAwardScoreService';

describe('HouseAwardScoreService', () => {
  ServiceTestHelper.testCustom({
    name: 'getScores',
    serviceFn: HouseAwardScoreService.getScores,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/houseAwards/score"),
  });
  ServiceTestHelper.testCustom({
    name: 'createScore',
    serviceFn: HouseAwardScoreService.createScore,
    appMethod: 'post',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/houseAwards/score"),
  });
  ServiceTestHelper.testCustom({
    name: 'deleteScore',
    serviceFn: HouseAwardScoreService.deleteScore,
    appMethod: 'delete',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/houseAwards/score"),
  });
  ServiceTestHelper.testCustom({
    name: 'awardScores',
    serviceFn: HouseAwardScoreService.awardScores,
    appMethod: 'post',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/houseAwards/score/award"),
  });
});
