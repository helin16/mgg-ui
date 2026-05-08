import ServiceTestHelper from '../../helper/ServiceTestHelper';
import HOYChatService from '../../../services/HOYChat/HOYChatService';

describe('HOYChatService', () => {
  ServiceTestHelper.testCustom({
    name: 'submitForm',
    serviceFn: HOYChatService.submitForm,
    appMethod: 'post',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/hoyChat/send", {"fakeParams":"value"}],
  });
});
