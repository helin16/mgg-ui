type iSynFileSemester = {
  FileYear: number;
  FileSemester: number;
  ActualSemester: number;
  ActivatedFlag: boolean;
  SystemCurrentFlag: boolean;
  StartDate: string;
  EndDate: string;
  ReportsPrintedFlag: boolean;
  AuthorStoppedFlag: boolean;
  FileSemestersSeq: number;
  SynergyMeaning: string;
  AnnualAssessmentsFlag: boolean;
  CommPortalResultsPublishAfterDate: string;
  CommPortalCurrentFlag: boolean;
  Description: string;
  SeasonType: string;
  SeasonActiveFlag: boolean;
  SIF3RefID: string;
};

export default iSynFileSemester;
