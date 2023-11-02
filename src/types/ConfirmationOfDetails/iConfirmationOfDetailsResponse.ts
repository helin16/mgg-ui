import iVStudent from '../Synergetic/iVStudent';
import iSynCommunity from '../Synergetic/iSynCommunity';

type iConfirmationOfDetailsResponse = {
  id: number;
  StudentID: number;
  AuthorID: number;
  response: any | null;
  submittedAt: Date | string | null;
  submittedById: number;
  canceledAt: Date | string | null;
  canceledById: number | null;
  active: boolean;
  createdAt: Date | string | null;
  createdById: number;
  updatedAt: Date | string | null;
  updatedById: number;
  isCurrent: boolean;
  syncToSynAt: Date | string | null;
  syncToSynById: number | null;
  submittedResponse: any | null;
  Student?: iVStudent | null;
  SubmittedBy?: iSynCommunity | null;
  CanceledBy?: iSynCommunity | null;
  CreatedBy?: iSynCommunity | null;
  UpdatedBy?: iSynCommunity | null;
  SyncToSynBy?: iSynCommunity | null;
}

export default iConfirmationOfDetailsResponse;
