import ServiceTestHelper from '../../helper/ServiceTestHelper';
import ClipboardTeamService from '../../../services/Clipboard/ClipboardTeamService';

describe('ClipboardTeamService', () => {
  const endPoint = '/clipboard/team';

  ServiceTestHelper.testGetAll(endPoint, ClipboardTeamService.getAll);
  ServiceTestHelper.testGet(endPoint, ClipboardTeamService.get);
});
