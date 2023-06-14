import iBaseType from '../iBaseType';

type iMggAppDevice = iBaseType & {
  name: string;
  description: string | null;
  settings: any;
  appId: string;
  code: string;
  location: string;
  make: string;
  model: string;
  macAddress: string;
};

export default iMggAppDevice;
