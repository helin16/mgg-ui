import ServiceTestHelper from '../../helper/ServiceTestHelper';
import HOYChatService from '../../../services/HOYChat/HOYChatService';

describe('HOYChatService', () => {
  ServiceTestHelper.testCustom({
    name: 'submitForm',
    serviceFn: HOYChatService.submitForm,
    appMethod: 'post',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/hoyChat/send"),
  });
});
