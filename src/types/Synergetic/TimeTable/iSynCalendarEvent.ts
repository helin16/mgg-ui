type iSynCalendarEvent = {
  CalendarSeq: number;
  CalendarDate: Date | string | null;
  CalendarType: string;
  FileType: string;
  ClassCampus: string;
  ClassCode: string;
  Location: string;
  LocationContact: string;
  Description: string;
  Comment: string;
  Result: string;
}

export default iSynCalendarEvent;
