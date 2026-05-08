import ServiceTestHelper from '../../helper/ServiceTestHelper';
import HouseAwardScoreService from '../../../services/HouseAwards/HouseAwardScoreService';

describe('HouseAwardScoreService', () => {
  ServiceTestHelper.testCustom({
    name: 'getScores',
    serviceFn: HouseAwardScoreService.getScores,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/houseAwards/score", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'createScore',
    serviceFn: HouseAwardScoreService.createScore,
    appMethod: 'post',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/houseAwards/score", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'deleteScore',
    serviceFn: HouseAwardScoreService.deleteScore,
    appMethod: 'delete',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/houseAwards/score/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'awardScores',
    serviceFn: HouseAwardScoreService.awardScores,
    appMethod: 'post',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/houseAwards/score/award", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
