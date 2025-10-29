import SynSelector, { iSynSelector } from "./SynSelector";
import { useCallback } from "react";
import SynLuFutureStatusService from '../../services/Synergetic/Lookup/SynLuFutureStatusService';
import iSynLuFutureStatus from '../../types/Synergetic/Lookup/iSynLuFutureStatus';

type iSynLuFutureStatusSelector = Omit<
  iSynSelector<iSynLuFutureStatus>,
  "getLabel" | "getOptionsData"
>;

const SynLuFutureStatusSelector = (props: iSynLuFutureStatusSelector) => {
  return (
    <SynSelector
      {...props}
      getLabel={(data: iSynLuFutureStatus) => ({
        key: data.Code,
        option: {
          value: data.Code,
          label: `${data.Description || ""}`.trim(),
          data
        }
      })}
      getOptionsData={useCallback(
        async params =>
          SynLuFutureStatusService.getAll({
            where: JSON.stringify({ ...params, ActiveFlag: true })
          }),
        []
      )}
    />
  );
};

export default SynLuFutureStatusSelector;
