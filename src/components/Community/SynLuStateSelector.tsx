import {iAutoCompleteSingle} from '../common/AutoComplete';
import {useEffect, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import iSynLuState from '../../types/Synergetic/Lookup/iSynLuState';
import SelectBox from '../common/SelectBox';
import Toaster from '../../services/Toaster';
import SynLuStateService from '../../services/Synergetic/Lookup/SynLuStateService';

type iLuStateSelector = {
  values?: iAutoCompleteSingle[] | string[];
  onSelect?: (LuState: iAutoCompleteSingle | iAutoCompleteSingle[] | null) => void;
  allowClear?: boolean;
  showIndicator?: boolean;
  isMulti?: boolean;
  classname?: string;
  limitCodes?: string[];
  isDisabled?: boolean;
};

const getLabel = (LuState: iSynLuState) => {
  return `${LuState.Code} - ${LuState.Description}`;
}
export const translateLuStateToOption = (LuState: iSynLuState) => {
  return {value: LuState.Code, data: LuState, label: getLabel(LuState)}
}

const SynLuStateSelector = ({isDisabled, values, onSelect, limitCodes = [], allowClear, classname, showIndicator = true, isMulti = false}: iLuStateSelector) => {
  const [optionsMap, setOptionsMap] = useState<{[key: string]: iAutoCompleteSingle}>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    const whereObj = limitCodes?.length > 0 ? {Code: limitCodes} : {};
    SynLuStateService.getAll({
        ...(Object.keys(whereObj).length > 0 ? {where: JSON.stringify(whereObj)} : {}),
        sort: 'Code:ASC',
      })
      .then(resp => {
        if (isCancelled === true) { return }
        setOptionsMap(resp
          .filter(luState => `${luState.Code || ''}`.trim() !== '')
          .reduce((map, luState) => {
          return {
            ...map,
            [luState.Code]: translateLuStateToOption(luState),
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
      className={classname}
      options={getOptions()}
      isMulti={isMulti}
      onChange={onSelect}
      value={getSelectedValues()}
      isClearable={allowClear}
      showDropdownIndicator={showIndicator}
    />
  )
};

export default SynLuStateSelector;
