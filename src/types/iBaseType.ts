import iUser from './user/iUser';

type iBaseType = {
  id: string;
  isActive: boolean;
  createdAt: string;
  createdById: string;
  updatedAt: string;
  updatedById: string;
  CreatedBy?: iUser;
  UpdatedBy?: iUser;
};

export default iBaseType;
