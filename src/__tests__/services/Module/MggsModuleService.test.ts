import ServiceTestHelper from '../../helper/ServiceTestHelper';
import MggsModuleService from '../../../services/Module/MggsModuleService';

describe('MggsModuleService', () => {
  const endPoint = '/syn/mggsModule';

  ServiceTestHelper.testCustom({
    name: 'getModule',
    serviceFn: MggsModuleService.getModule,
    appMethod: 'get',
    callArgs: ['123', {fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
    expectedArgs: [`${endPoint}/123`, {fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
  });

  ServiceTestHelper.testCustom({
    name: 'updateModule',
    serviceFn: MggsModuleService.updateModule,
    appMethod: 'put',
    callArgs: ['123', {fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
    expectedArgs: [`${endPoint}/123`, {fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
  });
});
