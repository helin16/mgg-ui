import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynCommunicationTemplateService from '../../../services/Synergetic/SynCommunicationTemplateService';

describe('SynCommunicationTemplateService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynCommunicationTemplateService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/communicationTemplate", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'getById',
    serviceFn: SynCommunicationTemplateService.getById,
    appMethod: 'get',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/communicationTemplate/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'create',
    serviceFn: SynCommunicationTemplateService.create,
    appMethod: 'post',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/communicationTemplate", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'update',
    serviceFn: SynCommunicationTemplateService.update,
    appMethod: 'put',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/communicationTemplate/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'upload',
    serviceFn: SynCommunicationTemplateService.upload,
    appMethod: 'post',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/communicationTemplate/upload", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
