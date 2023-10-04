import iSynLuPastoralCareType from './Synergetic/Lookup/iSynLuPastoralCareType';

type iSynLuPastoralCareCategory = {
  Code: string;
  Description: string;
  PastoralCareTypeCode: string;
  SortOrder: number;
  ActiveFlag: boolean;
  ModifiedDate: Date | null;
  ModifiedUser: string;
  SetCentrallyFlag: boolean | null;
  SynLuPastoralCareType?: iSynLuPastoralCareType;
};

export default iSynLuPastoralCareCategory;
