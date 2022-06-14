import iVStaff from './iVStaff';

type iSynSubjectClassesResultLock = {
  SubjectClassesResultLockSeq: number;
  StaffID: number;
  SubjectClassesSeq: number;
  DateTimeExpire: Date;
  AppName: string;
  GUID: string;
  SynVStaff?: iVStaff;
};

export default iSynSubjectClassesResultLock;
