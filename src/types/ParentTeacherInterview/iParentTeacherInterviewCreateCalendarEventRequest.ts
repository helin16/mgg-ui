type iParentTeacherInterviewCreateCalendarEventRequest = {
  staffId: number;
  subject: string;
  bodyText: string;
  startDateTime: string;
  endDateTime: string;
  isAllDay?: boolean;
};

export default iParentTeacherInterviewCreateCalendarEventRequest;
