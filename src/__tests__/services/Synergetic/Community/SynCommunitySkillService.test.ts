import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import AppService from '../../../../services/AppService';
import SynCommunitySkillService from '../../../../services/Synergetic/Community/SynCommunitySkillService';

describe('SynCommunitySkillService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynCommunitySkillService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/syn/communitySkill"),
  });

  ServiceTestHelper.testCustom({
    name: 'updateSkillExpiryDate',
    serviceFn: SynCommunitySkillService.updateSkillExpiryDate,
    appMethod: 'put',
    callArgs: [45, 'CPR', '2027-08-19'],
    expectedArgs: ['/syn/communitySkill/45/CPR', {ExpiryDate: '2027-08-19'}],
  });

  describe('bulkUpdateSkillExpiryDate', () => {
    it('calls updateSkillExpiryDate for every staffId and returns settled results, including partial failures', async () => {
      const putMock = jest
        .fn()
        .mockResolvedValueOnce({data: {SkillSeq: 1, ID: 45, SkillCode: 'CPR', ExpiryDate: '2027-08-19'}})
        .mockRejectedValueOnce(new Error('boom'))
        .mockResolvedValueOnce({data: {SkillSeq: 3, ID: 67, SkillCode: 'CPR', ExpiryDate: '2027-08-19'}});
      AppService.put = putMock as any;

      const results = await SynCommunitySkillService.bulkUpdateSkillExpiryDate([45, 46, 67], 'CPR', '2027-08-19');

      expect(putMock).toHaveBeenCalledTimes(3);
      expect(putMock).toHaveBeenNthCalledWith(1, '/syn/communitySkill/45/CPR', {ExpiryDate: '2027-08-19'});
      expect(putMock).toHaveBeenNthCalledWith(2, '/syn/communitySkill/46/CPR', {ExpiryDate: '2027-08-19'});
      expect(putMock).toHaveBeenNthCalledWith(3, '/syn/communitySkill/67/CPR', {ExpiryDate: '2027-08-19'});

      expect(results[0]).toEqual({
        status: 'fulfilled',
        value: {SkillSeq: 1, ID: 45, SkillCode: 'CPR', ExpiryDate: '2027-08-19'},
      });
      expect(results[1].status).toBe('rejected');
      expect(results[2]).toEqual({
        status: 'fulfilled',
        value: {SkillSeq: 3, ID: 67, SkillCode: 'CPR', ExpiryDate: '2027-08-19'},
      });
    });
  });
});
