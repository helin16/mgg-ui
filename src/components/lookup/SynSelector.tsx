import { iAutoCompleteSingle } from "../common/AutoComplete";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import SelectBox from "../common/SelectBox";
import Toaster from "../../services/Toaster";
import { iConfigParams } from "../../services/AppService";

export type iSynSelector<T extends any> = {
  values?: iAutoCompleteSingle[] | string[];
  onSelect?: (
    selected: iAutoCompleteSingle | iAutoCompleteSingle[] | null
  ) => void;
  allowClear?: boolean;
  showIndicator?: boolean;
  isMulti?: boolean;
  classname?: string;
  isDisabled?: boolean;
  getOptionsData: (params?: iConfigParams) => Promise<T[]>;
  getLabel: (
    model: T
  ) => {
    key: string;
    option: iAutoCompleteSingle;
  };
};

const SynLuAbsenceReasonSelector = <T extends any>({
  isDisabled,
  values,
  onSelect,
  allowClear,
  classname,
  getLabel,
  getOptionsData,
  showIndicator = true,
  isMulti = false
}: iSynSelector<T>) => {
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
    getOptionsData()
      .then(resp => {
        if (isCancelled) {
          return;
        }
        setOptionsMap(
          resp.reduce((map, data) => {
            const { key, option } = getLabel(data);
            return {
              ...map,
              [key]: option
            };
          }, {})
        );
      })
      .catch(err => {
        if (isCancelled) {
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
  }, [optionsMap, getLabel, getOptionsData]);

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

  if (isLoading === true) {
    return <Spinner animation={"border"} size={"sm"} />;
  }

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
