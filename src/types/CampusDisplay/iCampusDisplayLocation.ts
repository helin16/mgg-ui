import iBaseType from '../iBaseType';
import iCampusDisplay from './iCampusDisplay';

type iCampusDisplayLocation = iBaseType & {
  displayId: string;
  name: string;
  settings?: any | null;
  version?: number | null;
  CampusDisplay?: iCampusDisplay;
};

export default iCampusDisplayLocation;
