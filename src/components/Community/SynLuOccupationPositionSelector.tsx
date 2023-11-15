import {iAutoCompleteSingle} from '../common/AutoComplete';
import {useEffect, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import iSynLuOccupationPosition from '../../types/Synergetic/Lookup/iSynLuOccupationPosition';
import SelectBox from '../common/SelectBox';
import Toaster from '../../services/Toaster';
import SynLuOccupationPositionService from '../../services/Synergetic/Lookup/SynLuOccupationPositionService';

type iLuOccupationPositionSelector = {
  values?: iAutoCompleteSingle[] | string[];
  onSelect?: (LuOccupationPosition: iAutoCompleteSingle | iAutoCompleteSingle[] | null) => void;
  allowClear?: boolean;
  showIndicator?: boolean;
  showCode?: boolean;
  isMulti?: boolean;
  className?: string;
  limitCodes?: string[];
  isDisabled?: boolean;
};

const getLabel = (luOccupationPosition: iSynLuOccupationPosition, showCode = true) => {
  if (showCode !== true) {
    return `${luOccupationPosition.Description}`.trim();
  }
  return `${luOccupationPosition.Code} - ${luOccupationPosition.Description}`.trim();
}
export const translateLuOccupationPositionToOption = (LuOccupationPosition: iSynLuOccupationPosition, showCode = true) => {
  return {value: LuOccupationPosition.Code, data: LuOccupationPosition, label: getLabel(LuOccupationPosition, showCode)}
}

const SynLuOccupationPositionSelector = ({isDisabled, values, onSelect, limitCodes = [], allowClear, className, showCode = true, showIndicator = true, isMulti = false}: iLuOccupationPositionSelector) => {
  const [optionsMap, setOptionsMap] = useState<{[key: string]: iAutoCompleteSingle}>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    const whereObj = {
      ...(limitCodes?.length > 0 ? {Code: limitCodes} : {}),
      ActiveFlag: true,
    }
    SynLuOccupationPositionService.getAll({
        ...(Object.keys(whereObj).length > 0 ? {where: JSON.stringify(whereObj)} : {}),
        sort: 'Code:ASC',
      })
      .then(resp => {
        if (isCancelled === true) { return }
        setOptionsMap(resp
          .filter(LuOccupationPosition => `${LuOccupationPosition.Code || ''}`.trim() !== '')
          .reduce((map, LuOccupationPosition) => {
          return {
            ...map,
            [LuOccupationPosition.Code]: translateLuOccupationPositionToOption(LuOccupationPosition, showCode),
          };
        }, {}))
      })
      .catch(err => {
        if (isCancelled === true) { return }
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCancelled === true) { return }
        setIsLoading(false);
      })
    return () => {
      isCancelled = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading === true) {
    return <Spinner animation={'border'} size={'sm'}/>;
  }

  const getSelectedValues = () => {
    if (!values) {
      return null;
    }
    if (values?.length <= 0) {
      return [];
    }
    return values.map(value => {
      if(typeof value === 'string') {
        return (value in optionsMap ? optionsMap[value] : {value, label: value, data: null})
      }
      return value;
    })
  }

  const getOptions = () => {
    return Object.values(optionsMap)
      .sort((opt1, opt2) => {
        if (!opt1.data || !opt2.data) {
          return 1;
        }
        return opt1.data.Code > opt2.data.Code ? 1 : -1;
      })
  }

  return (
    <SelectBox
      isDisabled={isDisabled}
      className={className}
      options={getOptions()}
      isMulti={isMulti}
      onChange={onSelect}
      value={getSelectedValues()}
      isClearable={allowClear}
      showDropdownIndicator={showIndicator}
    />
  )
};

export default SynLuOccupationPositionSelector;
