import iSBUser from './iSBUser';
import iSBSubmissionBox from './iSBSubmissionBox';

type iSBSubmissionReturn = {
  id: number;
  box_id: number;
  marker: number;
  owner: number;
  review_route: string;
  student_submission_id: number | null;
  comment: string;
  mark: string;
  norm_mark: number;
  resubmission_required: boolean;
  created_at: Date;
  published_at: Date | null,
  updated_at: Date;
  deleted_at: Date | null;
  Owner?: iSBUser;
  SubmissionBox?: iSBSubmissionBox;
};

export default iSBSubmissionReturn
