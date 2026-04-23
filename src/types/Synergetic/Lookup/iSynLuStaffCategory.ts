
type iSynLuStaffCategory = {
  Code: string;
  Description: string;
  SynergyMeaning: string;


  ActiveFlag: boolean;
  ModifiedDate: Date | string | null;
  ModifiedUser: string;
  SetCentrallyFlag: boolean | null;
};

export default iSynLuStaffCategory;
