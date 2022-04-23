export const SYN_LEARNING_AREA_FILE_TYPE_A = 'A';
export const SYN_LEARNING_AREA_FILE_TYPE_B = 'B';

type iSynLearningArea = {
  LearningAreasSeq: number;
  FileType: string;
  LearningAreaCode: string;
  Description: string;
  ActiveFlag: boolean;
  ReportSortSeq: number;
};

export default iSynLearningArea;
