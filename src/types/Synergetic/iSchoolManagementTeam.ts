import iSynCommunity from './iSynCommunity';

export const SMT_SCHOOL_ROL_CODE_HEAD_OF_YEAR = 'HOY';
export const SMT_SCHOOL_ROL_CODE_HEAD_OF_JUNIOR_SCHOOL = 'HOJS';
export const SMT_SCHOOL_ROL_CODE_HEAD_OF_SENIOR_SCHOOL = 'HOSS';
export const SMT_SCHOOL_ROL_CODE_HEAD_OF_ELC = 'HOELC';

type iSchoolManagementTeam = {
  SchoolSeniorTeamID: number;
  FileYear: number;
  FileSemester: number;
  SSTStaffID: number;
  YearLevelCode: number | null;
  Comments: string;
  SchoolRoleCode: string;
  ActingStaffID1: number | null;
  ActingStaffID2: number | null;
  CreatedDate: Date;
  CreatedBy: number;
  ModifiedDate: Date | null;
  ModifiedBy: number | null;
  SynSSTStaff?: iSynCommunity;
  SynActingStaff1?: iSynCommunity;
  SynActingStaff2?: iSynCommunity;
  SynCreatedBy?: iSynCommunity;
  SynModifiedBy?: iSynCommunity;
};

export default iSchoolManagementTeam;
