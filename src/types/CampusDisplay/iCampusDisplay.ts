import iBaseType from '../iBaseType';

type iCampusDisplay = iBaseType & {
  name: string;
  settings?: any | null;
};

export default iCampusDisplay;
