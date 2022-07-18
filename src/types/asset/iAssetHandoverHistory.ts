import iBaseType from '../iBaseType';
import iSynCommunity from '../Synergetic/iSynCommunity';

type iAssetHandOverHistory = iBaseType & {
  handoverById: number | null;
  receivedById: number | null;
  receiverSignature: string;
  handoverAt?: Date;
  assetRecordId: string;
  assetRecordSnapshot: any;
  updateResultFromJira: any;
  receivedBy?: iSynCommunity;
  handoverBy?: iSynCommunity;
};

export default iAssetHandOverHistory;
