import iSBSubmissionGradeGroup from './iSBSubmissionGradeGroup';

type iSBSubmissionGrade = {
  grade_id: number;
  submission_grade_group_id: number;
  lower_bound: number;
  _lower_bound: number;
  raw_grade: number;
  _raw_grade: number;
  caption: string;
  created_by: number | null;
  updated_by: number | null;
  created_at: Date | null;
  updated_at: Date | null;
  deleted_at: Date | null;
  SBSubmissionGradeGroup?: iSBSubmissionGradeGroup;
}

export default iSBSubmissionGrade;
