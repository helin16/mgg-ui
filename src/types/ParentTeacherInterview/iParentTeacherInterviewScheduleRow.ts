import iParentTeacherInterviewCalendarEventSummary from './iParentTeacherInterviewCalendarEventSummary';
import iParentTeacherInterviewCreateCalendarEventResponse from './iParentTeacherInterviewCreateCalendarEventResponse';

export type ParentTeacherInterviewRetrievalStatus =
  | 'IDLE'
  | 'LOADING'
  | 'READY'
  | 'EMPTY'
  | 'FAILED';

type iParentTeacherInterviewScheduleRow = {
  staffId: number;
  staffName: string;
  staffCode: string;
  staffEmail: string | null;
  startDateTime: string | null;
  endDateTime: string | null;
  retrievalStatus: ParentTeacherInterviewRetrievalStatus;
  retrievalMessage: string | null;
  retrievalRangeKey?: string | null;
  events: iParentTeacherInterviewCalendarEventSummary[];
  createStatus?: 'IDLE' | 'SUBMITTING' | 'CREATED' | 'EXISTS' | 'FAILED';
  createMessage?: string | null;
  createResult?: iParentTeacherInterviewCreateCalendarEventResponse | null;
};

export default iParentTeacherInterviewScheduleRow;
