import iBaseType from '../iBaseType';
import iCampusDisplay from './iCampusDisplay';
import iCampusDisplayLocation from './iCampusDisplayLocation';

type iCampusDisplaySchedule = iBaseType & {
  displayId: string
  locationId: string,
  startDate: string | null,
  endDate: string | null,
  startTime: string | null,
  endTime: string | null,
  mon: boolean,
  tue: boolean,
  wed: boolean,
  thu: boolean,
  fri: boolean,
  sat: boolean,
  sun: boolean,
  CampusDisplay?: iCampusDisplay,
  CampusDisplayLocation?: iCampusDisplayLocation,
};

export default iCampusDisplaySchedule
