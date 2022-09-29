import iBaseType from '../iBaseType';

export const OPEROO_STATUS_SAFETY_ALERT_NEW = 'NEW';
export const OPEROO_STATUS_SAFETY_ALERT_UPDATED = 'UPDATED';

type iOperooSafetyAlert = iBaseType & {
  studentId: number;
  operooRecordId: number;
  operooRecordCheckSum: string | null;
  operooRecord: any;
  status: string;
  ignoredAt: Date | null;
  ignoredById: number | null;
  syncdAt: Date | null;
  syncdById: number | null;
}

export default iOperooSafetyAlert;
