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
};

export default iModule;
