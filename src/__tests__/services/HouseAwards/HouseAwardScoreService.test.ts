import ServiceTestHelper from '../../helper/ServiceTestHelper';
import HouseAwardScoreService from '../../../services/HouseAwards/HouseAwardScoreService';

describe('HouseAwardScoreService', () => {
  const endPoint = '/houseAwards/score';

  ServiceTestHelper.testGetAll(endPoint, HouseAwardScoreService.getScores);
  ServiceTestHelper.testCreate(endPoint, HouseAwardScoreService.createScore);
  ServiceTestHelper.testDeactivate(endPoint, HouseAwardScoreService.deleteScore);
  ServiceTestHelper.testCustom({
    name: 'awardScores',
    serviceFn: HouseAwardScoreService.awardScores,
    appMethod: 'post',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/houseAwards/score/award", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
