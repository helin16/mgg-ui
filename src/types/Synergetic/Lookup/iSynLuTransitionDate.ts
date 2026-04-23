type iSynLuTransitionDate = {
  FileYear: number;
  TransitionStartAt: Date | string;
  TransitionEndAt: Date | string;
  ModifiedAt: Date | string | null;
  ModifiedBy: string | null;
}

export default iSynLuTransitionDate;
