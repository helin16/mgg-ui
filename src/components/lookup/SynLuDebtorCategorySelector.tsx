import SynSelector, { iSynSelector } from "./SynSelector";
import ISynLuDebtorFeeCategory from "../../types/Synergetic/Lookup/iSynLuDebtorFeeCategory";
import SynLuDebtorFeeCategoryService from "../../services/Synergetic/Finance/SynLuDebtorFeeCategoryService";
import { useCallback } from "react";

type iSynLuDebtorCategorySelector = Omit<
  iSynSelector<ISynLuDebtorFeeCategory>,
  "getLabel" | "getOptionsData"
>;

const SynLuDebtorFeeCategorySelector = (props: iSynLuDebtorCategorySelector) => {
  return (
    <SynSelector
      {...props}
      getLabel={(data: ISynLuDebtorFeeCategory) => ({
        key: data.Code,
        option: {
          value: data.Code,
          label: `${data.Description || ""}`.trim(),
          data
        }
      })}
      getOptionsData={useCallback(
        async params =>
          SynLuDebtorFeeCategoryService.getAll(params ? {
            where: JSON.stringify({ ...params })
          } : undefined),
        []
      )}
    />
  );
};

export default SynLuDebtorFeeCategorySelector;
