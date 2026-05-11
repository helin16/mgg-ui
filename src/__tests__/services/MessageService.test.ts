import ServiceTestHelper from '../helper/ServiceTestHelper';
import MessageService from '../../services/MessageService';

describe('MessageService', () => {
  ServiceTestHelper.testCustom({
    name: 'getMessages',
    serviceFn: MessageService.getMessages,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/message"),
  });
});
