import iSBFolder from './iSBFolder';

type iSBSubmissionBox = {
  id: number;
  assessment_id: number;
  category: number;
  type_deprecated: number;
  owner: number;
  publish_date: Date;
  open_date: Date;
  date: Date;
  late_date: Date;
  accept_submission: boolean;
  multi_submission: boolean;
  description: string;
  name: string;
  weight: number;
  mark_type: number;
  submission_grade_group_id: number;
  max_mark: number;
  mark_visibility: number;
  skip_unsubmitted: boolean;
  use_rubric: boolean;
  _rubric_mark_per_capability: boolean;
  rubric_capability_mark_type_id: number;
  rubric_capability_grade_group_id: null,
  rubric_mark_range: boolean;
  self_reviewability: string;
  similarity_check_enabled: boolean;
  external_id: number | null;
  Folder?: iSBFolder
};

export default iSBSubmissionBox
