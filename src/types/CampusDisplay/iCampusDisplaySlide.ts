import iBaseType from '../iBaseType';
import iAsset from '../asset/iAsset';
import iCampusDisplay from './iCampusDisplay';

type iCampusDisplaySlide = iBaseType & {
  displayId: string;
  assetId: string;
  sortOrder: number;
  settings?: any | null;
  Asset?: iAsset;
  CampusDisplay?: iCampusDisplay;
};

export default iCampusDisplaySlide;
