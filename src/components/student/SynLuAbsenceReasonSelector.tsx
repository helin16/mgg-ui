import { iAutoCompleteSingle } from "../common/AutoComplete";
import { useEffect, useState } from "react";
import { Badge, Spinner } from "react-bootstrap";
import SelectBox from "../common/SelectBox";
import Toaster from "../../services/Toaster";
import iSynLuAbsenceReason from "../../types/StudentAbsence/iSynLuAbsenceReason";
import SynLuAbsenceReasonService from "../../services/Synergetic/Lookup/SynLuAbsenceReasonService";
import { OP_OR } from "../../helper/ServiceHelper";
import { STUDENT_ABSENCE_REASON_CODE_OTHER } from "../../types/StudentAbsence/iStudentAbsence";
import { FlexContainer } from "../../styles";

type iSynLuAbsenceReasonSelector = {
  values?: iAutoCompleteSingle[] | string[];
  absenceTypeCodes?: string[];
  onSelect?: (
    SynLuAbsenceReason: iAutoCompleteSingle | iAutoCompleteSingle[] | null
  ) => void;
  allowClear?: boolean;
  showIndicator?: boolean;
  isMulti?: boolean;
  classname?: string;
  isDisabled?: boolean;
  addOtherRegardless?: boolean;
};

const getLabel = (SynLuAbsenceReason: iSynLuAbsenceReason) => {
  // return `${SynLuAbsenceReason.Code} - ${SynLuAbsenceReason.Description}`;
  return (
    <FlexContainer className={"gap-2"}>
      <div>
        {SynLuAbsenceReason.Code} - {SynLuAbsenceReason.Description}
      </div>
      {`${SynLuAbsenceReason.AbsenceTypeCode || ""}`.trim() === "" ? null : (
        <Badge bg={"secondary"}>{SynLuAbsenceReason.AbsenceTypeCode}</Badge>
      )}
    </FlexContainer>
  );
};
export const translateSynLuAbsenceReasonToOption = (
  SynLuAbsenceReason: iSynLuAbsenceReason
) => {
  return {
    value: SynLuAbsenceReason.Code,
    data: SynLuAbsenceReason,
    label: getLabel(SynLuAbsenceReason)
  };
};

const SynLuAbsenceReasonSelector = ({
  isDisabled,
  values,
  onSelect,
  allowClear,
  classname,
  absenceTypeCodes = [],
  showIndicator = true,
  isMulti = false,
  addOtherRegardless = false
}: iSynLuAbsenceReasonSelector) => {
  const [optionsMap, setOptionsMap] = useState<{
    [key: string]: iAutoCompleteSingle;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (Object.keys(optionsMap).length > 0) {
      return;
    }
    let isCancelled = false;
    setIsLoading(true);
    const whereOrObjArr = [];
    if (absenceTypeCodes?.length > 0) {
      whereOrObjArr.push({ AbsenceTypeCode: absenceTypeCodes });
    }
    if (addOtherRegardless === true) {
      whereOrObjArr.push({ Code: STUDENT_ABSENCE_REASON_CODE_OTHER });
    }
    // @ts-ignore
    SynLuAbsenceReasonService.getAll({
      where: JSON.stringify({
        ActiveFlag: true,
        ...(whereOrObjArr.length === 0
          ? {}
          : whereOrObjArr.length === 1
          ? whereOrObjArr[0]
          : { [OP_OR]: whereOrObjArr })
      }),
      sort: "Description:ASC"
    })
      .then(resp => {
        if (isCancelled === true) {
          return;
        }
        setOptionsMap(
          resp.reduce((map, SynLuAbsenceReason) => {
            return {
              ...map,
              [SynLuAbsenceReason.Code]: translateSynLuAbsenceReasonToOption(
                SynLuAbsenceReason
              )
            };
          }, {})
        );
      })
      .catch(err => {
        if (isCancelled === true) {
          return;
        }
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCancelled === true) {
          return;
        }
        setIsLoading(false);
      });
    return () => {
      isCancelled = true;
    };
  }, [optionsMap, absenceTypeCodes, addOtherRegardless]);

  if (isLoading === true) {
    return <Spinner animation={"border"} size={"sm"} />;
  }

  const getSelectedValues = () => {
    if (!values) {
      return null;
    }
    if (values?.length <= 0) {
      return [];
    }
    return values.map(value => {
      if (typeof value === "string" || typeof value === "number") {
        return value in optionsMap
          ? optionsMap[value]
          : { value, label: value, data: null };
      }
      return value;
    });
  };

  const getOptions = () => {
    return Object.values(optionsMap).sort((opt1, opt2) => {
      if (!opt1.data || !opt2.data) {
        return 1;
      }
      return opt1.data.Code > opt2.data.SynLuAbsenceReasonSort ? 1 : -1;
    });
  };

  return (
    <SelectBox
      className={classname}
      options={getOptions()}
      isMulti={isMulti}
      onChange={onSelect}
      value={getSelectedValues()}
      isClearable={allowClear}
      isDisabled={isDisabled}
      showDropdownIndicator={showIndicator}
    />
  );
};

export default SynLuAbsenceReasonSelector;
