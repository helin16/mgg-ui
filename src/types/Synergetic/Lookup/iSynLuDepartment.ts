
type iSynLuDepartment = {
  Code: string;
  Campus: string;
  Description: string;
  Location: string;
  HeadOfDepartment: string;
  HeadOfDepartmentID: number;
  Phone: string;
  ActiveFlag: boolean;
  ModifiedDate: Date | string | null;
  ModifiedUser: string;
  SetCentrallyFlag: boolean | null;
};

export default iSynLuDepartment;
