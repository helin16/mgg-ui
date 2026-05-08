import ServiceTestHelper from '../../helper/ServiceTestHelper';
import EmailTemplateService from '../../../services/Email/EmailTemplateService';

describe('EmailTemplateService', () => {
  const endPoint = '/emailTemplate';

  ServiceTestHelper.testGetAll(endPoint, EmailTemplateService.getAll);
  ServiceTestHelper.testGet(endPoint, EmailTemplateService.getById);
  ServiceTestHelper.testCreate(endPoint, EmailTemplateService.create);
  ServiceTestHelper.testUpdate(endPoint, EmailTemplateService.update);
  ServiceTestHelper.testDeactivate(endPoint, EmailTemplateService.deactivate);
});
