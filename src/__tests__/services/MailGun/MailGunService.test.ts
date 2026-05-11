import ServiceTestHelper from '../../helper/ServiceTestHelper';
import MailGunService from '../../../services/MailGun/MailGunService';

describe('MailGunService', () => {
  ServiceTestHelper.testCustom({
    name: 'sendHtml',
    serviceFn: MailGunService.sendHtml,
    appMethod: 'post',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/mailgun/send/html"),
  });
});
