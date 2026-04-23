import {iAutoCompleteSingle} from '../common/AutoComplete';
import {useEffect, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import iSynLuLanguage from '../../types/Synergetic/Lookup/iSynLuLanguage';
import SelectBox from '../common/SelectBox';
import Toaster from '../../services/Toaster';
import SynLuLanguageService from '../../services/Synergetic/Lookup/SynLuLanguageService';

type iLuLanguageSelector = {
  values?: iAutoCompleteSingle[] | string[];
  onSelect?: (LuLanguage: iAutoCompleteSingle | iAutoCompleteSingle[] | null) => void;
  allowClear?: boolean;
  showIndicator?: boolean;
  isMulti?: boolean;
  className?: string;
  limitCodes?: string[];
  isDisabled?: boolean;
};

const getLabel = (luLanguage: iSynLuLanguage) => {
  return `${luLanguage.Code} - ${luLanguage.Description}`;
}
export const translateLuLanguageToOption = (LuLanguage: iSynLuLanguage) => {
  return {value: LuLanguage.Code, data: LuLanguage, label: getLabel(LuLanguage)}
}

const SynLuLanguageSelector = ({isDisabled, values, onSelect, limitCodes = [], allowClear, className, showIndicator = true, isMulti = false}: iLuLanguageSelector) => {
  const [optionsMap, setOptionsMap] = useState<{[key: string]: iAutoCompleteSingle}>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    const whereObj = {
      ...(limitCodes?.length > 0 ? {Code: limitCodes} : {}),
    }
    SynLuLanguageService.getAll({
        ...(Object.keys(whereObj).length > 0 ? {where: JSON.stringify(whereObj)} : {})
      })
      .then(resp => {
        if (isCancelled === true) { return }
        setOptionsMap(resp
          .filter(LuLanguage => `${LuLanguage.Code || ''}`.trim() !== '')
          .reduce((map, LuLanguage) => {
          return {
            ...map,
            [LuLanguage.Code]: translateLuLanguageToOption(LuLanguage),
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

export default SynLuLanguageSelector;
