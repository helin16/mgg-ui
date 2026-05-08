type iSynVGeneralLedger = {
  GLYear: number;
  GLCode: string;
  GLDescription: string;
  GLCurrentBalance: number;
  GLStartYearBalance: number;
  GLLastYearMovement: number;
  GLTaxCode: string;
  GLClassificationCode: string;
  GLClassificationDesciption: string | null;
  GLDivisionCode: string | null;
  GLDivisionDescription: string | null;
  GLCostCentreCode: string;
  GLCostCentreDescription: string | null;
  GLComment: string;
  GLActiveFlag: boolean;
  GLAllowJournalsFlag: string;
  GLJournalEntryMessage: string;
};

export default iSynVGeneralLedger;
