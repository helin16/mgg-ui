import iBaseType from '../iBaseType';

type iMggApp = iBaseType & {
  name: string;
  description: string | null;
  settings: any;
  token: string;
  expiresAt: Date | string | null;
  type: string;
};

export default iMggApp;
