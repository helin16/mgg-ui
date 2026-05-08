import ServiceTestHelper from '../../helper/ServiceTestHelper';
import HOYChatService from '../../../services/HOYChat/HOYChatService';

describe('HOYChatService', () => {
  const endPoint = '/hoyChat';

  ServiceTestHelper.testCustom({
    name: 'submitForm',
    serviceFn: HOYChatService.submitForm,
    appMethod: 'post',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/hoyChat/send", {"fakeParams":"value"}],
  });
});
