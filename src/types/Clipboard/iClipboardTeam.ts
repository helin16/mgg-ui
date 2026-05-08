import iBaseType from '../iBaseType';

type iClipboardTeam = iBaseType & {
  name: string | null;
  classCode: string | null;
  isHidden: boolean;
  externalId: string | null;
  externalObj: any | null;
  checkSum: string | null;
};

export default iClipboardTeam;
