import ServiceTestHelper from '../helper/ServiceTestHelper';
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
  ServiceTestHelper.testCustom({
    name: 'getMSReports',
    serviceFn: PowerBIService.getMSReports,
    appMethod: 'get',
    callArgs: [],
    expectedArgs: [`${endPoint}/ms`, {}],
    response: {value: {fakeResp: 'value'}},
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
