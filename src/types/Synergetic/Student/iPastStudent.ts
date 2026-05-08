import iSynCommunity from '../iSynCommunity';

type iPastStudent = {
  ID: number;
  CreatedDate: Date | string | null;
  CreatedBy: string | null;
  ModifiedDate: Date | string | null;
  ModifiedBy: string | null;
  LeftDate: Date | string | null;
  PeerYear: number;
  LastCampus: string;
  LastYearLevel: number;
  LastHouse: string;
  LastForm: string;
  EntryDate: Date | string | null;
  EntryCampus: string;
  EntryYearLevel: number;
  KnownNames: string;
  LeavingReason: string;
  VisaType: string;
  VisaExpiryDate: Date | string | null;
  PassportNo: string;
  BoardingHouse: string;
  LeavingDestination: string;
  DebtorID: number;
  LearningPathway: string;
  SIF3RefID: string | null;
  SynCommunity?: iSynCommunity;
};

export default iPastStudent;
