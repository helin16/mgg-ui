import {iAutoCompleteSingle} from '../common/AutoComplete';
import {useEffect, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import iSynLuQualificationLevel from '../../types/Synergetic/Lookup/iSynLuQualificationLevel';
import SelectBox from '../common/SelectBox';
import Toaster from '../../services/Toaster';
import SynLuQualificationLevelService from '../../services/Synergetic/Lookup/SynLuQualificationLevelService';

type iLuQualificationLevelSelector = {
  values?: iAutoCompleteSingle[] | string[];
  onSelect?: (LuQualificationLevel: iAutoCompleteSingle | iAutoCompleteSingle[] | null) => void;
  allowClear?: boolean;
  showIndicator?: boolean;
  showCode?: boolean;
  isMulti?: boolean;
  className?: string;
  limitCodes?: string[];
  isDisabled?: boolean;
};

const getLabel = (LuQualificationLevel: iSynLuQualificationLevel, showCode = true) => {
  return `${LuQualificationLevel.Code} - ${LuQualificationLevel.Description}`.trim();
}
export const translateLuQualificationLevelToOption = (LuQualificationLevel: iSynLuQualificationLevel, showCode = true) => {
  return {value: LuQualificationLevel.Code, data: LuQualificationLevel, label: getLabel(LuQualificationLevel, showCode)}
}

const SynLuQualificationLevelSelector = ({isDisabled, values, onSelect, limitCodes = [], allowClear, className, showCode = true, showIndicator = true, isMulti = false}: iLuQualificationLevelSelector) => {
  const [optionsMap, setOptionsMap] = useState<{[key: string]: iAutoCompleteSingle}>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    const whereObj = {
      ...(limitCodes?.length > 0 ? {Code: limitCodes} : {}),
      ActiveFlag: true,
    }
    SynLuQualificationLevelService.getAll({
        ...(Object.keys(whereObj).length > 0 ? {where: JSON.stringify(whereObj)} : {}),
        sort: 'SortOrder:ASC',
      })
      .then(resp => {
        if (isCancelled === true) { return }
        setOptionsMap(resp
          .filter(LuQualificationLevel => `${LuQualificationLevel.Code || ''}`.trim() !== '')
          .reduce((map, LuQualificationLevel) => {
          return {
            ...map,
            [LuQualificationLevel.Code]: translateLuQualificationLevelToOption(LuQualificationLevel, showCode),
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

export default SynLuQualificationLevelSelector;
