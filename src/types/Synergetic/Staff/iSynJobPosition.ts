type iSynJobPosition = {
  JobPositionCode: string;
  Description: string;
  CategoryCode: string;
  Overview: string | null;
  ActiveFlag: boolean;
  FTERequired: number;
  AutoLevelIncrementFlag: boolean;
  JobPositionsSeq: number;
  AwardCode: string;
  ReportsToJobPositionsSeq: number | null;
}

export default iSynJobPosition;
