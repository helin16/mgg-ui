import ServiceTestHelper from '../../helper/ServiceTestHelper';
import EmailService from '../../../services/Email/EmailService';

describe('EmailService', () => {
  ServiceTestHelper.testCustom({
    name: 'sendHtml',
    serviceFn: EmailService.sendHtml,
    appMethod: 'post',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/email/send/html"),
  });
});
