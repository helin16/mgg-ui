import ServiceTestHelper from '../../helper/ServiceTestHelper';
import MailGunService from '../../../services/MailGun/MailGunService';

describe('MailGunService', () => {
  const endPoint = '/mailgun';

  ServiceTestHelper.testCustom({
    name: 'sendHtml',
    serviceFn: MailGunService.sendHtml,
    appMethod: 'post',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/mailgun/send/html", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
