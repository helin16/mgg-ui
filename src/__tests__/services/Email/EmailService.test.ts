import ServiceTestHelper from '../../helper/ServiceTestHelper';
import EmailService from '../../../services/Email/EmailService';

describe('EmailService', () => {
  const endPoint = '/email';

  ServiceTestHelper.testCustom({
    name: 'sendHtml',
    serviceFn: EmailService.sendHtml,
    appMethod: 'post',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/email/send/html", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
