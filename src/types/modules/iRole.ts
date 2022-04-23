
export const ROLE_ID_NORMAL = 1;
export const ROLE_ID_ADMIN = 2;

type iRole = {
  RoleID: number;
  RoleName: string;
  Acitve: boolean;
  CreatedAt: Date;
  CreatedById: number;
  UpdatedAt: Date;
  UpdatedById: number;
};

export default iRole;
