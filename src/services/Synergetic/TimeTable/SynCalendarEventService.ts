import AppService, {iConfigParams} from '../../AppService';
import iPaginatedResult from '../../../types/iPaginatedResult';
import iSynCalendarEvent from '../../../types/Synergetic/TimeTable/iSynCalendarEvent';

const endPoint = '/syn/calendarEvent';

const getAll = (params: iConfigParams = {}, config?: iConfigParams): Promise<iPaginatedResult<iSynCalendarEvent>> => {
  return AppService.get(endPoint, params, config).then(resp => resp.data);
};

const SynCalendarEventService = {
  getAll,
};

export default SynCalendarEventService;
