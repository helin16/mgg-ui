import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynCalendarEventService from '../../../../services/Synergetic/TimeTable/SynCalendarEventService';

describe('SynCalendarEventService', () => {
  const endPoint = '/syn/calendarEvent';

  ServiceTestHelper.testGetAll(endPoint, SynCalendarEventService.getAll);
});
