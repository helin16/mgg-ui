import SynSelector, { iSynSelector } from "./SynSelector";
import iSynLuConstituency from "../../types/Synergetic/Lookup/iSynLuConstituency";
import SynLuConstituencyService from "../../services/Synergetic/Lookup/SynLuConstituencyService";
import { useCallback } from "react";

type iSynLuConstituencySelector = Omit<
  iSynSelector<iSynLuConstituency>,
  "getLabel" | "getOptionsData"
>;

const SynLuConstituencySelector = (props: iSynLuConstituencySelector) => {
  return (
    <SynSelector
      {...props}
      getLabel={(data: iSynLuConstituency) => ({
        key: data.Code,
        option: {
          value: data.Code,
          label: [`${data.Code || ""}`.trim(), `${data.Description || ""}`.trim()].join(' ').trim(),
          data
        }
      })}
      getOptionsData={useCallback(
        async params =>
          SynLuConstituencyService.getAll({
            where: JSON.stringify({ ...params, ActiveFlag: true }),
            perPage: 9999999,
          }),
        []
      )}
    />
  );
};

export default SynLuConstituencySelector;
