import iModule from './iModule';
import iRole from './iRole';
import iSynCommunity from '../Synergetic/iSynCommunity';

export const MODULE_ID_STUDENT_REPORT = 1;
export const MODULE_ID_COD_ADMIN = 2;
export const MODULE_ID_ALUMNI_REQUEST = 3;
export const MODULE_ID_OPEROO_SAFETY_ALERTS = 4;
export const MODULE_ID_HOUSE_AWARDS = 5;

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
};

export default iModuleUser;
