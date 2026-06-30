import iParentTeacherInterviewCalendarEventSummary from './iParentTeacherInterviewCalendarEventSummary';

type iParentTeacherInterviewCalendarEventsResponse = {
  staffId: number;
  staffOccupEmail: string;
  startDateTime: string;
  endDateTime: string;
  events: iParentTeacherInterviewCalendarEventSummary[];
};

export default iParentTeacherInterviewCalendarEventsResponse;
