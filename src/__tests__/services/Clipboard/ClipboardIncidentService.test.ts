import ServiceTestHelper from '../../helper/ServiceTestHelper';
import ClipboardIncidentService from '../../../services/Clipboard/ClipboardIncidentService';

describe('ClipboardIncidentService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: ClipboardIncidentService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs('/clipboard/incident'),
  });

  ServiceTestHelper.testCustom({
    name: 'get',
    serviceFn: ClipboardIncidentService.get,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId('/clipboard/incident'),
  });
});
