import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynCommunicationTemplateService from '../../../services/Synergetic/SynCommunicationTemplateService';

describe('SynCommunicationTemplateService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynCommunicationTemplateService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/communicationTemplate"),
  });
  ServiceTestHelper.testCustom({
    name: 'getById',
    serviceFn: SynCommunicationTemplateService.getById,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/syn/communicationTemplate"),
  });
  ServiceTestHelper.testCustom({
    name: 'create',
    serviceFn: SynCommunicationTemplateService.create,
    appMethod: 'post',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/communicationTemplate"),
  });
  ServiceTestHelper.testCustom({
    name: 'update',
    serviceFn: SynCommunicationTemplateService.update,
    appMethod: 'put',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/syn/communicationTemplate"),
  });
  ServiceTestHelper.testCustom({
    name: 'upload',
    serviceFn: SynCommunicationTemplateService.upload,
    appMethod: 'post',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/communicationTemplate/upload"),
  });
});
