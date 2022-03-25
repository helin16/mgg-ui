/* eslint-disable import/no-cycle */

import iBaseType from '../iBaseType';

type iUser = iBaseType & {
  firstName: string;
  lastName: string;
  schoolBoxGroupId: number;
  schoolBoxId: number;
  synergyId: number;
};

export default iUser;
