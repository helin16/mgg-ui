type iSynConstituency = {
  ConstitSeq: number;
  ID: number;
  ConstitCode: string;
  DateJoined: Date | string | null;
  ActiveCode: string;
  RelatedID: number;
  RelatedCampus: string;
  RelatedFromDate: Date | string | null;
  RelatedToDate: Date | string | null;
  NewsletterRequiredFlag: boolean;
  SynDatabaseCode: string;
  ModifiedDate: Date | string | null;
  ModifiedBy: string;
}

export default iSynConstituency;
