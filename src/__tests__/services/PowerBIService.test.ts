import ServiceTestHelper from '../helper/ServiceTestHelper';
import AppService from '../../services/AppService';
import PowerBIService from '../../services/PowerBIService';

describe('PowerBIService', () => {
  const endPoint = '/powerBI';

  ServiceTestHelper.testCustom({
    name: 'getAccessToken',
    serviceFn: PowerBIService.getAccessToken,
    appMethod: 'post',
    callArgs: [],
    expectedArgs: [`${endPoint}/accessToken`, {}],
  });
  describe('getMSReports', () => {
    test('', async () => {
      AppService.get = jest.fn().mockResolvedValueOnce({
        data: {
          value: {fakeResp: 'value'},
        },
      }) as any;

      await expect(PowerBIService.getMSReports()).resolves.toEqual({fakeResp: 'value'});
      expect(AppService.get).toHaveBeenCalledWith(`${endPoint}/ms`, {});
    });
  });
  ServiceTestHelper.testGetAll(endPoint, PowerBIService.getAll);
  ServiceTestHelper.testCustom({
    name: 'getById',
    serviceFn: PowerBIService.getById,
    appMethod: 'get',
    callArgs: ['123', {fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
    expectedArgs: [`${endPoint}/123`, {fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
  });
  ServiceTestHelper.testCreate(endPoint, PowerBIService.create);
  ServiceTestHelper.testCustom({
    name: 'update',
    serviceFn: PowerBIService.update,
    appMethod: 'put',
    callArgs: ['123', {fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
    expectedArgs: [`${endPoint}/123`, {fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
  });
  ServiceTestHelper.testCustom({
    name: 'deactiveate',
    serviceFn: PowerBIService.deactiveate,
    appMethod: 'delete',
    callArgs: ['123', {fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
    expectedArgs: [`${endPoint}/123`, {fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
  });
});
