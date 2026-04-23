type iSynLuFutureStatus = {
  Code: string;
  Description: string;

  SynergyMeaning: string;
  MergeCode: string;
  EnrolmentStatusColumn: string;
  EnrolmentStatusColumnHeading: string;
  RankingGroup: string;
  EnrolmentStatusColumn2: string;
  StatusSeq: number;
  ActiveFlag: boolean;
  ModifiedDate: string | Date | null;
  ModifiedUser: string;
  SetCentrallyFlag: boolean;
}

export default iSynLuFutureStatus;
