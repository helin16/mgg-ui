import {iAutoCompleteSingle} from '../common/AutoComplete';
import {useEffect, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import iSynLuForm from '../../types/Synergetic/Lookup/iSynLuForm';
import SelectBox from '../common/SelectBox';
import Toaster from '../../services/Toaster';
import SynLuFormService from '../../services/Synergetic/Lookup/SynLuFormService';

type iSynFormSelector = {
  values?: iAutoCompleteSingle[] | string[];
  onSelect?: (LuForm: iAutoCompleteSingle | iAutoCompleteSingle[] | null) => void;
  allowClear?: boolean;
  showIndicator?: boolean;
  isMulti?: boolean;
  classname?: string;
  limitCodes?: string[];
};

const getLabel = (LuForm: iSynLuForm) => {
  return `${LuForm.Code} - ${LuForm.StaffName}`;
}
export const translateLuFormToOption = (LuForm: iSynLuForm) => {
  return {value: LuForm.Code, data: LuForm, label: getLabel(LuForm)}
}

const LuFormSelector = ({values, onSelect, limitCodes = [], allowClear, classname, showIndicator = true, isMulti = false}: iSynFormSelector) => {
  const [optionsMap, setOptionsMap] = useState<{[key: string]: iAutoCompleteSingle}>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    // @ts-ignore
    SynLuFormService.getAll({
        where: JSON.stringify({
          ActiveFlag: true,
          ...(limitCodes?.length > 0 ? {Code: limitCodes} : {}),
        }),
        sort: 'HomeRoom:ASC',
      })
      .then(resp => {
        if (isCancelled === true) { return }
        setOptionsMap(resp.reduce((map, LuForm) => {
          return {
            ...map,
            [LuForm.Code]: translateLuFormToOption(LuForm),
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
  }, [limitCodes]);

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
      if(typeof value === 'string' || typeof value === 'number') {
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
        return opt1.data.LuFormSort > opt2.data.LuFormSort ? 1 : -1;
      })
  }

  return (
    <SelectBox
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

export default LuFormSelector;
