type iModule = {
  ModuleID: number;
  Name: string;
  Description: string;
  Active: boolean;
  CreatedAt: Date;
  CreatedById: number;
  UpdatedAt: Date;
  UpdatedById: number;
  settings?: any;
  // Feature 023: when true, the UI refuses to open this module while the SchoolBox
  // session is impersonating another user. Absent is treated as false.
  blockImpersonatedUser?: boolean;
};

export default iModule;
