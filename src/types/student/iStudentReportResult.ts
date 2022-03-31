export const STUDENT_REPORT_SUBJECT_NAME_COMPARATIVE_ANALYSIS = 'Comparative Analysis';

export const STUDENT_REPORT_RESULT_FILE_TYPE_ACADEMIC = 'A';

export const STUDENT_REPORT_RESULT_ASSESS_AREA_TYPE_ACHIEVEMENT_STANDARDS = 'AS';
export const STUDENT_REPORT_RESULT_ASSESS_AREA_TYPE_OVERALL_ASSESSMENT_JNR = 'OAGRADEJNR';
export const STUDENT_REPORT_RESULT_ASSESS_AREA_TYPE_APPROACHES_TO_LEARNING = 'APPLRN';
export const STUDENT_REPORT_RESULT_ASSESS_AREA_TYPE_KNOWLEDGE_AND_SKILLS = 'KS';
export const STUDENT_REPORT_RESULT_ASSESS_AREA_TYPE_ATTITUDE_AND_MANAGEMENT = 'ATTITUDE';
export const STUDENT_REPORT_RESULT_ASSESS_AREA_TYPE_REFLECT = 'REFLECT';

type iStudentReportResult = {
  isHomeGroup: boolean;
  FileType: string;
  FileYear: number;
  FileSemester: number;
  ID: number;
  StudentID: number;
  ClassColumn: number;
  ClassCampus: string;
  ClassCode: string;
  ActiveFlag: boolean;
  AssessableFlag: boolean;
  UnitsAdjustment: number;
  UnitsTotal: number;
  Status: string;
  InterviewRequested: string;
  AuthorApprovedFlag: boolean;
  EditorApprovedFlag: boolean;
  PrintApprovedFlag: boolean;
  ClassComment: string;
  ClassDescription: string;
  ClassLearningAreaCode: string;
  ClassLearningAreaDescription: string;
  ClassLearningAreaActiveFlag: boolean;
  ClassLearningAreaReportSortSeq: number;
  AssessmentCode: string;
  AssessHeading: string;
  AssessUnitName: string;
  AssessOverview: string;
  AssessReportStyle: string;
  AssessInterimReportStyle: string;
  AssessCommentsUsedFlag: boolean;
  AssessTopicCommentsUsedFlag: boolean;
  AssessProgressiveFlag: boolean;
  AssessPrintSelectableFlag: boolean;
  OverrideReportSortSeq: number;
  AssessAreaResultType: string;
  AssessAreaResultTypeShortDesc: string;
  AssessAreaResultTypeSort: number;
  AssessAreaResultGroup: string;
  AssessAreaResultGroupDescription: string;
  AssessAreaResultGroupLockedFlag: boolean;
  AssessAreaSeq: number;
  UnderlayFollowingAreaFlag: boolean;
  AreaBlockEndFlag: boolean;
  AutoPickFlag: boolean;
  AssessAreaHeading: string;
  StudentYearLevel: number;
  StudentYearLevelDescription: string;
  StudentYearLevelSort: number;
  StudentYearLevelCoordinator: string;
  StudentStatus: string;
  StudentBoarder: string;
  StudentBoarderType: string;
  StudentBoardingHouse: string;
  StudentHouse: string;
  StudentHouseDescription: string;
  StudentHouseHeadOfHouse: string;
  StudentForm: string;
  StudentFormDescription: string;
  StudentFormHomeRoom: string;
  StudentFormStaffName: string;
  StudentFormStaffID: number;
  StudentTutor: string;
  StudentTutorDescription: string;
  StudentTutorName: string;
  StaffName: string;
  StaffMailName: string;
  StaffTitle: string;
  StaffNameInternal: string;
  StaffNameExternal: string;
  StaffLegalFullName: string;
  StaffInitials: string;
  StaffPreferred: string;
  StaffPreferredFormal: string;
  StaffGiven1: string;
  StaffGiven2: string;
  StaffSurname: string;
  AssessmentComment: string | null;
  ActualSemester: number;
  StaffID: number;
  SchoolStaffCode: string;
  StudentStudiesCode: string;
  StudentGovernmentStudentNumber: string;
  ClassDefaultPrintFlag: boolean;
  AssessAreaResultTypeSynergyMeaning: string;
  SubjectComment: string | null;
  AssessResultGroupSort: number;
  AssessResultGroupDescription: string;
  StudentBirthDate: Date;
  ClassType: string;
  ClassTypeDescription: string;
  HomeroomTeacher: string;
  TopicComment: string | null;
  AssessResultsResult: string | null;
  AssessResultDescription: string | null;
  AssessAreaMaskCode: string;
  // ClassNormalYearLevel: null,
  // AssessAreaOverallFlag: boolean;
  // AssessAreaOverallSeq: number;
  // AssessAreaNumericFlag: boolean;
  // AssessDefaultValue: string;
  // AssessAreaEntryFlag: boolean;
  // AssessAreaPrintFlag: boolean;
  // AssessAreaCalculatedFlag: boolean;
  // AssessAreaMarkOutOf: number;
  // AssessAreaWeightingFactor: 1,
  // AssessAreaSummariseToSeq: null,
  // AssessAreaHdgAbbrev1: string;
  // AssessAreaHdgAbbrev2: string;
  // AssessAreaOverview: null,
  // AssessAreaResultEntryFlag: boolean;
  // AssessAreaResultPrintFlag: boolean;
  // AssessAreaDefaultClassification: string;
  // AssessAreaExternalLinkSeq: 0,
  // AssessAreaResultMin: null,
  // AssessAreaResultMax: null,
  // AssessAreaResultAverage: null,
  // AssessAreaResultVariance: null,
  // AssesAreaResultStandardDeviation: null,
  // AssessAreaResultMaskPercentUseForCalc: null,
  // AssessAreaResultMaskPercentGreaterEqualThan: null,
  // AssessAreaResultMaskPercentLessThan: null,
  // AssessTargetResultMin: null,
  // AssessTargetResultMax: null,
  // AssessResultsResultDate: null,
  // AssessResultsOverrideFlag: null,
  // AssessResultsTopicComment: null,
  // AssessResultsTopicCommentExistsFlag: 0,
  // AssessResultsPrintSelectFlag: null,
  // AssessResultsClassification: null,
  // AssessResultClassificationDescription: null,
  // AssessCommentsCommentType: null,
  // AssessCommentsStaffID: null,
  // AssessCommentsComment: null,
  // AssessCommentExistsFlag: 0,
  // CurrentSemesterOnlyFlag: 0,
  // StudentNameInternal: string;
  // StudentNameExternal: string;
  // StudentLegalFullName: string;
  // StudentSurname: string;
  // StudentGiven1: string;
  // StudentGiven2: string;
  // StudentInitials: string;
  // StudentPreferred: string;
  // StudentPreferredFormal: string;
  // StudentGender: string;
  // StudentCampus: string;
  // StudentCampusDescription: string;
  // StudentIBFlag: boolean;
  // StudentFullFeeFlag: boolean;
  // StudentIntendsTertiaryFlag: boolean;
  // StudentEntryDate: Date
  // StudentLeavingDate: null,
  // StudentLeavingReason: string;
  // StudentLeavingDestination: string;
  // StudentReturningDate: Date | null;
  // ClassStartDate: null,
  // ClassStopDate: null,
  // StudentCoursesSeq: number | null,
  // StudentClassesSeq: 5461,
  // SubjectAssessmentsSeq: 1801,
  // SubjectClassesSeq: 7259,
  // ShortCourseFlag: boolean;
  // SubjectAssessmentAreaGUID: 21564,
  // StudentSubSchool: null,
};

export default iStudentReportResult
