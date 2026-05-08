import iSynLuLearningPathway from '../Lookup/iSynLuLearningPathway';
import iVStudent from './iVStudent';

type iSynStudentYear = {
  StudentYearsSeq: number;
  FileYear: number;
  ID: number;
  Status: string;
  StatusNextYear: string;
  StudentCampus: string;
  YearLevel: number;
  YearLevelSort: number;
  House: string;
  Form: string;
  LeavingDate: Date | string | null;
  ReturningDate: Date | string | null;
  SchoolFTE: number;
  TravelAllowanceFlag: boolean;
  IBFlag: boolean;
  StudentYearsGUID: string;
  SIF3RefID: string;
  LearningPathway: string;
  SynVStudentAll?: iVStudent;
  SynLuLearningPathway?: iSynLuLearningPathway;
};

export default iSynStudentYear;
