export const SYN_LU_LEARNING_PATHWAY_IB = 'IB';
export const SYN_LU_LEARNING_PATHWAY_VCAL = 'VCAL';
export const SYN_LU_LEARNING_PATHWAY_VCE = 'VCE';

type iSynLuLearningPathway = {
  Code: string;
  Description: string;
  SynergyMeaning: string;
  ActiveFlag: boolean;
  SetCentrallyFlag: boolean;
  ModifiedDate: Date | string;
  ModifiedUser: string;
  DefaultFlag: boolean;
};

export default iSynLuLearningPathway;
