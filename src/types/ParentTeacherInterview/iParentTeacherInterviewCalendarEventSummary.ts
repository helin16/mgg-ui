type iParentTeacherInterviewCalendarEventSummary = {
  id: string;
  subject: string;
  startDateTime: string;
  endDateTime: string;
  organizer: {
    name: string;
    address: string;
  };
  isOnlineMeeting: boolean | null;
  teamsJoinUrl: string | null;
};

export default iParentTeacherInterviewCalendarEventSummary;
