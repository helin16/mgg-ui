/* eslint-disable import/no-cycle */

import iBaseType from '../iBaseType';
import iSynCommunity from '../community/iSynCommunity';
import iSynFileSemester from '../community/iSynFileSemester';

type iUser = iBaseType & {
  firstName: string;
  lastName: string;
  schoolBoxGroupId: number;
  schoolBoxId: number;
  synergyId: number;
  SynCommunity?: iSynCommunity;
  SynCurrentFileSemester?: iSynFileSemester;
  isStaff?: boolean;
  isParent?: boolean;
  isStudent?: boolean;
};

export default iUser;
