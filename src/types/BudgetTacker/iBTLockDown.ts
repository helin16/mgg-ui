import iSynCommunity from '../Synergetic/iSynCommunity';

type iBTLockDown = {
  year: number;
  lockdown: Date;
  created_by_id: number;
  created_at: Date;
  updated_by_id: number;
  CreatedBy?: iSynCommunity;
  updated_at: Date;
  UpdatedBy?: iSynCommunity;
};

export default iBTLockDown;
