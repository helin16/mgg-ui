import SynSelector, { iSynSelector } from "./SynSelector";
import iSynLuFund from "../../types/Synergetic/Lookup/iSynLuFund";
import SynLuFundService from "../../services/Synergetic/Lookup/SynLuFundService";
import { useCallback } from "react";

type iSynLuFundSelector = Omit<
  iSynSelector<iSynLuFund>,
  "getLabel" | "getOptionsData"
>;

const SynLuFundSelector = (props: iSynLuFundSelector) => {
  return (
    <SynSelector
      {...props}
      getLabel={(data: iSynLuFund) => ({
        key: data.Code,
        option: {
          value: data.Code,
          label: `${data.Description || ""}`.trim(),
          data
        }
      })}
      getOptionsData={useCallback(
        async params =>
          SynLuFundService.getAll({
            where: JSON.stringify({ ...params, ActiveFlag: true })
          }),
        []
      )}
    />
  );
};

export default SynLuFundSelector;
