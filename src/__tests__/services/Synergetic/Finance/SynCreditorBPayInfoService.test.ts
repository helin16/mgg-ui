import AppService from '../../../../services/AppService';
import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynCreditorBPayInfoService from '../../../../services/Synergetic/Finance/SynCreditorBPayInfoService';

describe('SynCreditorBPayInfoService', () => {
  const endPoint = '/syn/creditorBPayInfo';

  ServiceTestHelper.testCreate(endPoint, SynCreditorBPayInfoService.create);
  ServiceTestHelper.testGetAll(endPoint, SynCreditorBPayInfoService.getAll);
  ServiceTestHelper.testUpdate(endPoint, SynCreditorBPayInfoService.update);
  ServiceTestHelper.testDeactivate(endPoint, SynCreditorBPayInfoService.deactivate);

  describe('getActiveByCreditorId', () => {
    test('filters inactive creditor records', async () => {
      AppService.get = jest.fn().mockResolvedValueOnce({
        data: {
          data: [
            {CreditorID: 1, IsActive: true},
            {CreditorID: 1},
            {CreditorID: 1, IsActive: false},
          ],
        },
      }) as any;

      await expect(SynCreditorBPayInfoService.getActiveByCreditorId(1)).resolves.toEqual([
        {CreditorID: 1, IsActive: true},
        {CreditorID: 1},
      ]);
    });
  });
});
