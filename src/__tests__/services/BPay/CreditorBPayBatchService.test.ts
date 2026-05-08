import ServiceTestHelper from '../../helper/ServiceTestHelper';
import AppService from '../../../services/AppService';
import CreditorBPayBatchService from '../../../services/BPay/CreditorBPayBatchService';

describe('CreditorBPayBatchService', () => {
  const endPoint = '/cBPay/batch';

  ServiceTestHelper.testCreate(endPoint, CreditorBPayBatchService.create);
  ServiceTestHelper.testGetAll(endPoint, CreditorBPayBatchService.getAll);
  ServiceTestHelper.testGet(endPoint, CreditorBPayBatchService.get);
  ServiceTestHelper.testUpdate(endPoint, CreditorBPayBatchService.update);
  ServiceTestHelper.testDeactivate(endPoint, CreditorBPayBatchService.deactivate);

  ServiceTestHelper.testCustom({
    name: 'getBatchList',
    serviceFn: CreditorBPayBatchService.getBatchList,
    appMethod: 'get',
    callArgs: [{page: 2}],
    expectedArgs: [
      endPoint,
      {
        page: 2,
        perPage: 9999999,
        sort: 'createdAt:DESC',
        where: JSON.stringify({isActive: true}),
      },
      undefined,
    ],
  });

  describe('getWorking', () => {
    test('prefers the first ungenerated batch', async () => {
      AppService.get = jest.fn().mockResolvedValueOnce({
        data: {
          data: [
            {id: 'generated', generatedAt: '2026-05-01'},
            {id: 'working', generatedAt: null},
            {id: 'later', generatedAt: ''},
          ],
        },
      }) as any;

      await expect(CreditorBPayBatchService.getWorking()).resolves.toEqual({
        id: 'working',
        generatedAt: null,
      });
    });

    test('falls back to the first batch or null', async () => {
      (AppService.get as any) = jest
        .fn()
        .mockResolvedValueOnce({
          data: {
            data: [
              {id: 'generated-1', generatedAt: '2026-05-01'},
              {id: 'generated-2', generatedAt: '2026-05-02'},
            ],
          },
        })
        .mockResolvedValueOnce({
          data: {
            data: [],
          },
        });

      await expect(CreditorBPayBatchService.getWorking()).resolves.toEqual({
        id: 'generated-1',
        generatedAt: '2026-05-01',
      });
      await expect(CreditorBPayBatchService.getWorking()).resolves.toBeNull();
    });
  });
});
