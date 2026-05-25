import ServiceTestHelper from '../../helper/ServiceTestHelper';
import ClipboardIncidentService from '../../../services/Clipboard/ClipboardIncidentService';
import TestHelper from '../../helper/TestHelper';
import {HEADER_NAME_SELECTING_FIELDS} from '../../../services/AppService';

const INCIDENT_SELECT_FIELDS = [
  'id',
  'dateTime',
  'returnToPlayDate',
  'returnToPlayReason',
  'RestrictedEndDate',
  'ReviewDate',
  'concussionStatus',
  'archived',
  'staff',
  'staffMember',
  'studentConcerned',
].join(',');

describe('ClipboardIncidentService', () => {
  const {fakeParams, fakeConfig} = TestHelper.getFakeParams();

  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: ClipboardIncidentService.getAll,
    appMethod: 'get',
    callArgs: [fakeParams, fakeConfig],
    expectedArgs: [
      '/clipboard/incident',
      fakeParams,
      {
        ...fakeConfig,
        headers: {
          ...fakeConfig.headers,
          [HEADER_NAME_SELECTING_FIELDS]: INCIDENT_SELECT_FIELDS,
        },
      },
    ],
  });

  ServiceTestHelper.testCustom({
    name: 'get',
    serviceFn: ClipboardIncidentService.get,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId('/clipboard/incident'),
  });
});
