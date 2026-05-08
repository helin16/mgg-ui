import ServiceTestHelper from '../../helper/ServiceTestHelper';
import ClipboardTeamService from '../../../services/Clipboard/ClipboardTeamService';

describe('ClipboardTeamService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: ClipboardTeamService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/clipboard/team", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'get',
    serviceFn: ClipboardTeamService.get,
    appMethod: 'get',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/clipboard/team/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});
