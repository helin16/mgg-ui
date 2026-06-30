import iParentTeacherInterviewCalendarEventSummary from './iParentTeacherInterviewCalendarEventSummary';

type iParentTeacherInterviewCreateCalendarEventResponse = {
  staffId: number;
  staffOccupEmail: string;
  outcome: 'CREATED' | 'EXISTS' | 'FAILED';
  auditMessageId: string;
  event: iParentTeacherInterviewCalendarEventSummary | null;
  failureCategory?: 'VALIDATION' | 'PERMISSION' | 'TARGET_INELIGIBLE' | 'GRAPH' | null;
  message: string;
};

export default iParentTeacherInterviewCreateCalendarEventResponse;
