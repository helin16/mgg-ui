import ServiceTestHelper from '../../helper/ServiceTestHelper';
import ClipboardTeamService from '../../../services/Clipboard/ClipboardTeamService';

describe('ClipboardTeamService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: ClipboardTeamService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/clipboard/team"),
  });
  ServiceTestHelper.testCustom({
    name: 'get',
    serviceFn: ClipboardTeamService.get,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/clipboard/team"),
  });
});
