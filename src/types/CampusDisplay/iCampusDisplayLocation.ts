import iBaseType from '../iBaseType';
import iCampusDisplay from './iCampusDisplay';

type iCampusDisplayLocation = iBaseType & {
  displayId: string;
  name: string;
  settings?: any | null;
  CampusDisplay?: iCampusDisplay;
};

export default iCampusDisplayLocation;
