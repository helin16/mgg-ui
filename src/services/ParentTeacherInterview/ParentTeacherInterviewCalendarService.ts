import AppService, {iConfigParams} from '../AppService';
import iParentTeacherInterviewCalendarEventsResponse from '../../types/ParentTeacherInterview/iParentTeacherInterviewCalendarEventsResponse';
import iParentTeacherInterviewCreateCalendarEventRequest from '../../types/ParentTeacherInterview/iParentTeacherInterviewCreateCalendarEventRequest';
import iParentTeacherInterviewCreateCalendarEventResponse from '../../types/ParentTeacherInterview/iParentTeacherInterviewCreateCalendarEventResponse';

const endPoint = '/parentTeacherInterview/calendarEvents';

type iParentTeacherInterviewCalendarEventsParams = {
  staffId: number;
  startDateTime: string;
  endDateTime: string;
};

const getCalendarEvents = async (
  params: iParentTeacherInterviewCalendarEventsParams,
  config?: iConfigParams
): Promise<iParentTeacherInterviewCalendarEventsResponse> => {
  const response = await AppService.get(endPoint, params, config);
  return response.data as iParentTeacherInterviewCalendarEventsResponse;
};

const createCalendarEvent = async (
  payload: iParentTeacherInterviewCreateCalendarEventRequest,
  config?: iConfigParams
): Promise<iParentTeacherInterviewCreateCalendarEventResponse> => {
  const response = await AppService.post(endPoint, payload, config);
  return response.data as iParentTeacherInterviewCreateCalendarEventResponse;
};

const ParentTeacherInterviewCalendarService = {
  getCalendarEvents,
  createCalendarEvent,
};

export default ParentTeacherInterviewCalendarService;
