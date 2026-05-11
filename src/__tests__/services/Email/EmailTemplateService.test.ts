import ServiceTestHelper from '../../helper/ServiceTestHelper';
import EmailTemplateService from '../../../services/Email/EmailTemplateService';

describe('EmailTemplateService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: EmailTemplateService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/emailTemplate"),
  });
  ServiceTestHelper.testCustom({
    name: 'getById',
    serviceFn: EmailTemplateService.getById,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/emailTemplate"),
  });
  ServiceTestHelper.testCustom({
    name: 'create',
    serviceFn: EmailTemplateService.create,
    appMethod: 'post',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/emailTemplate"),
  });
  ServiceTestHelper.testCustom({
    name: 'update',
    serviceFn: EmailTemplateService.update,
    appMethod: 'put',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/emailTemplate"),
  });
  ServiceTestHelper.testCustom({
    name: 'deactivate',
    serviceFn: EmailTemplateService.deactivate,
    appMethod: 'delete',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/emailTemplate"),
  });
});
