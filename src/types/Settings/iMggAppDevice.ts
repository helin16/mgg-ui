import iBaseType from '../iBaseType';
import iMggApp from './iMggApp';

type iMggAppDevice = iBaseType & {
  name: string;
  description: string | null;
  settings: any;
  appId: string;
  code: string;
  location: string;
  make: string;
  model: string;
  deviceId: string;
  MggApp?: iMggApp;
};

export default iMggAppDevice;
