type iSynLuForm ={
  FormSeq: number;
  Code: string;
  Description: string;
  HomeRoom: string;
  StaffName: string;
  ID: number;
  ActiveFlag: boolean;
  TransitionalFlag: boolean;
  ModifiedDate: Date | null;
  ModifiedUser: string;
  SetCentrallyFlag: boolean | null;
}

export default iSynLuForm;
