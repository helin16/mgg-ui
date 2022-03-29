/* eslint-disable import/no-cycle */

import iBaseType from '../iBaseType';
import iSynCommunity from '../community/iSynCommunity';

type iUser = iBaseType & {
  firstName: string;
  lastName: string;
  schoolBoxGroupId: number;
  schoolBoxId: number;
  synergyId: number;
  SynCommunity?: iSynCommunity;
};

export default iUser;
