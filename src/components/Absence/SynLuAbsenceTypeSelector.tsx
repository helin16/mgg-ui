import { iAutoCompleteSingle } from "../common/AutoComplete";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import SelectBox from "../common/SelectBox";
import Toaster from "../../services/Toaster";
import { OP_OR } from "../../helper/ServiceHelper";
import { FlexContainer } from "../../styles";
import iSynLuAbsenceType from '../../types/Synergetic/Absence/iSynLuAbsenceType';
import SynLuAbsenceTypeService from '../../services/Synergetic/Lookup/SynLuAbsenceTypeService';

type iSynLuAbsenceTypeSelector = {
  values?: iAutoCompleteSingle[] | string[];
  absenceTypeCodes?: string[];
  onSelect?: (
    SynLuAbsenceType: iAutoCompleteSingle | iAutoCompleteSingle[] | null
  ) => void;
  allowClear?: boolean;
  showIndicator?: boolean;
  isMulti?: boolean;
  classname?: string;
  isDisabled?: boolean;
  addOtherRegardless?: boolean;
};

const getLabel = (SynLuAbsenceType: iSynLuAbsenceType) => {
  return (
    <FlexContainer>
      {SynLuAbsenceType.Code} - {SynLuAbsenceType.Description}
    </FlexContainer>
  );
};
export const translateSynLuAbsenceTypeToOption = (
  luAbsenceType: iSynLuAbsenceType
) => {
  return {
    value: luAbsenceType.Code,
    data: luAbsenceType,
    label: getLabel(luAbsenceType)
  };
};

const SynLuAbsenceTypeSelector = ({
  isDisabled,
  values,
  onSelect,
  allowClear,
  classname,
  absenceTypeCodes = [],
  showIndicator = true,
  isMulti = false,
}: iSynLuAbsenceTypeSelector) => {
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
      whereOrObjArr.push({ Code: absenceTypeCodes });
    }
    // @ts-ignore
    SynLuAbsenceTypeService.getAll({
      where: JSON.stringify({
        ActiveFlag: true,
        ...(whereOrObjArr.length === 0
          ? {}
          : whereOrObjArr.length === 1
          ? whereOrObjArr[0]
          : { [OP_OR]: whereOrObjArr })
      }),
    })
      .then(resp => {
        if (isCancelled === true) {
          return;
        }
        setOptionsMap(
          resp.reduce((map, luAbsenceType) => {
            return {
              ...map,
              [luAbsenceType.Code]: translateSynLuAbsenceTypeToOption(
                luAbsenceType
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
  }, [optionsMap, absenceTypeCodes]);

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
      return opt1.data.Code > opt2.data.Code ? 1 : -1;
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

export default SynLuAbsenceTypeSelector;
