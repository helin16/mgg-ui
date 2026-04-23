import iSynLuPastoralCareCategory from '../iSynLuPastoralCareCategory';

type iSynTPastoralCare = {
  PastoralCareSeq: number;
  ID: number;
  ClassCode: string;
  ItemDate: string;
  MethodCode: string;
  Details: string;
  PrivateDetails: string;
  InitiatorCode: string;
  TypeCode: string;
  CategoryCode: string;
  ClassificationCode: string;
  IsFollowUpFlag: boolean;
  FollowUpDate: Date | null;
  ConfidentialFlag: boolean;
  CreatedDate: Date;
  CreatedByID: number;
  ModifiedDate: Date;
  ModifiedByID: number;
  EmailSentDate: Date | null;
  EmailSentByID: number;
  DuplicateFromSeq: number | null;
  SubjectClassesSeq: number | null;
  SynLuPastoralCareCategory?: iSynLuPastoralCareCategory;
};

export default iSynTPastoralCare;
