import {iAutoCompleteSingle} from '../common/AutoComplete';
import {useEffect, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import iSynLuImmunisationFormStatus from '../../types/Synergetic/Lookup/iSynLuImmunisationFormStatus';
import SelectBox from '../common/SelectBox';
import Toaster from '../../services/Toaster';
import SynLuImmunisationFormStatusService from '../../services/Synergetic/Lookup/SynLuImmunisationFormStatusService';

type iLuImmunisationFormStatusSelector = {
  values?: iAutoCompleteSingle[] | string[];
  onSelect?: (LuImmunisationFormStatus: iAutoCompleteSingle | iAutoCompleteSingle[] | null) => void;
  allowClear?: boolean;
  showIndicator?: boolean;
  isMulti?: boolean;
  className?: string;
  limitCodes?: string[];
  isDisabled?: boolean;
};

const getLabel = (LuImmunisationFormStatus: iSynLuImmunisationFormStatus) => {
  return `${LuImmunisationFormStatus.Code} - ${LuImmunisationFormStatus.Description}`;
}
export const translateLuImmunisationFormStatusToOption = (LuImmunisationFormStatus: iSynLuImmunisationFormStatus) => {
  return {value: LuImmunisationFormStatus.Code, data: LuImmunisationFormStatus, label: getLabel(LuImmunisationFormStatus)}
}

const SynLuImmunisationFormStatusSelector = ({isDisabled, values, onSelect, limitCodes = [], allowClear, className, showIndicator = true, isMulti = false}: iLuImmunisationFormStatusSelector) => {
  const [optionsMap, setOptionsMap] = useState<{[key: string]: iAutoCompleteSingle}>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    const whereObj = {
      ...(limitCodes?.length > 0 ? {Code: limitCodes} : {}),
    }
    SynLuImmunisationFormStatusService.getAll({
        ...(Object.keys(whereObj).length > 0 ? {where: JSON.stringify(whereObj)} : {}),
        sort: 'Code:ASC',
      })
      .then(resp => {
        if (isCancelled === true) { return }
        setOptionsMap(resp
          .filter(LuImmunisationFormStatus => `${LuImmunisationFormStatus.Code || ''}`.trim() !== '')
          .reduce((map, LuImmunisationFormStatus) => {
          return {
            ...map,
            [LuImmunisationFormStatus.Code]: translateLuImmunisationFormStatusToOption(LuImmunisationFormStatus),
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

export default SynLuImmunisationFormStatusSelector;
