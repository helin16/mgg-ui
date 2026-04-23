type iSynLuSchool = {
  Code: string;
  Description: string;
  Address1: string;
  Address2: string;
  Address3: string;
  Suburb: string;
  State: string;
  PostCode: string;
  Phone: string;
  Fax: string;
  Email: string;
  CountryCode: string;
  RSBNumber: string;
  Type: string;
  SchoolID: number;
  PrincipalID: number;
  ExternalSystemType: string;
  ExternalSystemCode: string;
  ActiveFlag: boolean;
  PrincipalName: string;
  AssociatedSchoolFlag: boolean;
  CompetitorSchoolFlag: boolean;
  FeederSchoolFlag: boolean;
  ShareAppInfoFlag: boolean;
  SortOrder: number;
  ModifiedDate: Date | string | null;
  ModifiedUser: string;
  SetCentrallyFlag: boolean;
}

export default iSynLuSchool;
