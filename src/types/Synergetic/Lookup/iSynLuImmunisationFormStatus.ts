type iSynLuImmunisationFormStatus = {
  Code: string;
  Description: string;
  CEOCode: string;
  ExternalSystemType: string;
  ExternalSystemCode: string;
  ModifiedDate: Date | string | null;
  ModifiedUser: string;
  SetCentrallyFlag: boolean | null;
  SynergyMeaning: string;
}

export default iSynLuImmunisationFormStatus;
