import iBaseType from '../iBaseType';

type iPowerBIReport = iBaseType & {
  name: string | null;
  description: string | null;
  externalId: string| null;
  externalObj: any | null;
  settings: any | null;
}

export default iPowerBIReport;
