import ServiceTestHelper from '../../helper/ServiceTestHelper';
import ClipboardSessionService from '../../../services/Clipboard/ClipboardSessionService';

describe('ClipboardSessionService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: ClipboardSessionService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/clipboard/session", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'get',
    serviceFn: ClipboardSessionService.get,
    appMethod: 'get',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/clipboard/session/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
