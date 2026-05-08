import iBaseType from '../iBaseType';

type iClipboardSession = iBaseType & {
  title: string;
  synUserId: number | null;
  schoolBoxCalendarEventId: number | null;
  clipboardId: number | null;
  clipboardUserId: number | null;
  clipboardTeamId: number | null;
  startDate: Date | string | null;
  endDate: Date | string | null;
  isAllDayEvent: boolean | null;
  isCancelled: boolean;
  externalObj: any | null;
  externalObjSum: string | null;
};

export default iClipboardSession;
