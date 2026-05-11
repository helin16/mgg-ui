import ServiceTestHelper from '../../helper/ServiceTestHelper';
import ClipboardSessionService from '../../../services/Clipboard/ClipboardSessionService';

describe('ClipboardSessionService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: ClipboardSessionService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/clipboard/session"),
  });
  ServiceTestHelper.testCustom({
    name: 'get',
    serviceFn: ClipboardSessionService.get,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/clipboard/session"),
  });
});
