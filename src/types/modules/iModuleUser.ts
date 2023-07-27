import iModule from './iModule';
import iRole from './iRole';
import iSynCommunity from '../Synergetic/iSynCommunity';

export const MGGS_MODULE_ID_STUDENT_REPORT = 1;
export const MGGS_MODULE_ID_COD = 2;
export const MGGS_MODULE_ID_ALUMNI_REQUEST = 3;
export const MGGS_MODULE_ID_OPEROO_SAFETY_ALERTS = 4;
export const MGGS_MODULE_ID_HOUSE_AWARDS = 5;
export const MGGS_MODULE_ID_BUDGET_TRACKER = 6;
export const MGGS_MODULE_ID_STUDENT_ABSENCES = 7;
export const MGGS_MODULE_ID_FUNNEL = 8;
export const MGGS_MODULE_ID_SCHOOL_DATA_SUBMISSION = 9;
export const MGGS_MODULE_ID_MGG_APPS = 10;
export const MGGS_MODULE_ID_MGG_APP_DEVICES = 11;
export const MGGS_MODULE_ID_FINANCE = 12;
export const MGGS_MODULE_ID_REPORTS_STUDENT_ATTENDANCE_RATE = 13;

export const MGGS_MODULE_ID_ONLINE_DONATION = 14;

type iModuleUser = {
  ID: number;
  SynergeticID: number;
  RoleID: number;
  ModuleID: number;
  Active: boolean;
  CreatedAt: Date;
  CreatedById: number;
  UpdatedAt: Date;
  UpdatedById: number;
  Module?: iModule;
  Role?: iRole;
  SynCommunity?: iSynCommunity;
  settings: any | null;
};

export default iModuleUser;
