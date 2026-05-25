import iBaseType from '../iBaseType';

type iClipboardIncidentStudent = {
  id: number;
  firstName: string;
  legalFirstName: string | null;
  lastName: string;
  smsId: string | null;
  sisId?: string | null;
};

type iClipboardIncidentStaff = {
  id?: number;
  firstName?: string | null;
  lastName?: string | null;
};

type iClipboardIncident = iBaseType & {
  location: string | null;
  studentConcerned: iClipboardIncidentStudent | null;
  dateTime: string | null;
  concussionStatus: 'none' | 'potential' | 'confirmed' | 'any' | string;
  archived: boolean;
  Diagnosis: string | null;
  IncidentTypeDescription: string | null;
  RestrictedEndDate: Date | string | null;
  ReviewDate: Date | string | null;
  Comments: string | null;
  IncidentDescription: string | null;
  staff?: iClipboardIncidentStaff | null;
  staffMember?: iClipboardIncidentStaff | null;
};

export default iClipboardIncident;
