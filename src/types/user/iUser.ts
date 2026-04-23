/* eslint-disable import/no-cycle */

import iBaseType from '../iBaseType';
import iSynCommunity from '../Synergetic/iSynCommunity';
import iSynFileSemester from '../Synergetic/iSynFileSemester';

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
  isTeacher?: boolean;
  isCasualStaff?: boolean;
};

export default iUser;
