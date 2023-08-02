import iSynJobPosition from './iSynJobPosition';

type iSynStaffJobPosition = {
  StaffJobPositionsSeq: number;
  ID: number;
  JobLevel: string;
  JobLevelNextIncrementDate: Date | string | null;
  StartDate: Date | string | null;
  EndDate: Date | string | null;
  AppointmentLetter: string | null;
  FTE: number;
  JobLevelNextIncrementYears: number;
  JobPositionsSeq: number | null;
  AwardLevelCode: string;
  NextReviewDate: Date | string | null;
  OverrideReportsToJobPositionsSeq: number | null;
  StaffJobPositionsGUID: string;
  SIF3RefID: string | null;
  SynJobPosition?: iSynJobPosition | null;
  OverrideReportsToJobPosition?: iSynJobPosition | null;
}

export default iSynStaffJobPosition;
