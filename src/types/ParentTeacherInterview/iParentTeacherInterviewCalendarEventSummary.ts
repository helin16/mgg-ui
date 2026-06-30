type iParentTeacherInterviewCalendarEventSummary = {
  id: string;
  subject: string;
  startDateTime: string;
  endDateTime: string;
  organizer: {
    name: string;
    address: string;
  };
  isAllDay?: boolean | null;
  isOnlineMeeting: boolean | null;
  teamsJoinUrl: string | null;
};

export default iParentTeacherInterviewCalendarEventSummary;
