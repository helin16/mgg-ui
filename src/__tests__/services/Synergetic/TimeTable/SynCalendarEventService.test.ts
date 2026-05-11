import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynCalendarEventService from '../../../../services/Synergetic/TimeTable/SynCalendarEventService';

describe('SynCalendarEventService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynCalendarEventService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/calendarEvent"),
  });
});
