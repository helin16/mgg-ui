import { iAutoCompleteSingle } from "../../common/AutoComplete";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import SelectBox from "../../common/SelectBox";
import iCampusDisplay from "../../../types/CampusDisplay/iCampusDisplay";
import CampusDisplayService from "../../../services/CampusDisplay/CampusDisplayService";

type iCampusDisplaySelector = {
  placeholder?: string;
  isMulti?: boolean;
  values?: iAutoCompleteSingle[] | string[];
  onSelect?: (
    campus: iAutoCompleteSingle | null | iAutoCompleteSingle[]
  ) => void;
  allowClear?: boolean;
  showIndicator?: boolean;
  className?: string;
  isDisabled?: boolean;
};

export const translateToOption = (display: iCampusDisplay) => {
  return { value: display.id, data: display, label: display.name };
};

const CampusDisplaySelector = ({
  placeholder,
  values,
  onSelect,
  allowClear,
  className,
  isDisabled = false,
  showIndicator = true,
  isMulti = false
}: iCampusDisplaySelector) => {
  const [optionMap, setOptionMap] = useState<{
    [key: string]: iAutoCompleteSingle;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    if (Object.keys(optionMap).length > 0) {
      return;
    }
    setIsLoading(true);
    CampusDisplayService.getAll({
      where: JSON.stringify({
        isActive: true
      }),
      perPage: 999999
    })
      .then(resp => {
        if (isCancelled === true) {
          return;
        }
        setOptionMap(
          (resp.data || []).reduce((map, display) => {
            return {
              ...map,
              [display.id]: translateToOption(display)
            };
          }, {})
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
    return () => {
      isCancelled = true;
    };
  }, [optionMap]);

  const getSelectedValues = () => {
    if (!values) {
      return null;
    }
    if (values?.length <= 0) {
      return [];
    }
    return values.map(value => {
      if (typeof value === "string") {
        return value in optionMap
          ? optionMap[value]
          : { value, label: value, data: null };
      }
      return value;
    });
  };

  if (isLoading === true) {
    return <Spinner animation={"border"} size={"sm"} />;
  }
  return (
    <SelectBox
      placeholder={placeholder}
      isDisabled={isDisabled}
      options={Object.values(optionMap)}
      isMulti={isMulti}
      className={className}
      onChange={onSelect}
      value={getSelectedValues()}
      isClearable={allowClear}
      showDropdownIndicator={showIndicator}
    />
  );
};

export default CampusDisplaySelector;
