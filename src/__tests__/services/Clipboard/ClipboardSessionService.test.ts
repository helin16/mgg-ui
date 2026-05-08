import ServiceTestHelper from '../../helper/ServiceTestHelper';
import ClipboardSessionService from '../../../services/Clipboard/ClipboardSessionService';

describe('ClipboardSessionService', () => {
  const endPoint = '/clipboard/session';

  ServiceTestHelper.testGetAll(endPoint, ClipboardSessionService.getAll);
  ServiceTestHelper.testGet(endPoint, ClipboardSessionService.get);
});
