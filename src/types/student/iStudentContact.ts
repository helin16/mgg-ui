export const STUDENT_CONTACT_TYPE_SC1 = 'SC1';
export const STUDENT_CONTACT_TYPE_SC2 = 'SC2';
export const STUDENT_CONTACT_TYPE_SC3 = 'SC3';
export const STUDENT_CONTACT_TYPE_SCT = 'SCT';

export type iStudentContact = {
  ID: number;
  ContactType: string;
  LinkedID: number;
  LinkedIDSeq: number;
  PrimaryOnlyFlag: boolean;
  NormalMailFlag: boolean;
  ReportsFlag: boolean;
  ParentFlag: boolean;
  LivesWithFlag: boolean;
  ModifiedDate: Date;
  ModifiedBy: string;
  SIF3RefID: string;
  StudentContactsSeq: number;
  SpouseSIF3RefID: string;
}

export default iStudentContact;
