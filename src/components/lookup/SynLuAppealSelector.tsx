import SynSelector, { iSynSelector } from "./SynSelector";
import iSynLuAppeal from "../../types/Synergetic/Lookup/iSynLuAppeal";
import SynLuAppealService from "../../services/Synergetic/Lookup/SynLuAppealService";
import { useCallback } from "react";

type iSynLuAppealSelector = Omit<
  iSynSelector<iSynLuAppeal>,
  "getLabel" | "getOptionsData"
>;

const SynLuAppealSelector = (props: iSynLuAppealSelector) => {
  return (
    <SynSelector
      {...props}
      getLabel={(data: iSynLuAppeal) => ({
        key: data.Code,
        option: {
          value: data.Code,
          label: `${data.Description || ""}`.trim(),
          data
        }
      })}
      getOptionsData={useCallback(
        async params =>
          SynLuAppealService.getAll({
            where: JSON.stringify({ ...params, ActiveFlag: true })
          }),
        []
      )}
    />
  );
};

export default SynLuAppealSelector;
