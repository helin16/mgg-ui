import {iAutoCompleteSingle} from '../common/AutoComplete';
import {useEffect, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import iSynLuDepartment from '../../types/Synergetic/Lookup/iSynLuDepartment';
import SelectBox from '../common/SelectBox';
import Toaster from '../../services/Toaster';
import SynLuDepartmentService from '../../services/Synergetic/Lookup/SynLuDepartmentService';

type iSynFormSelector = {
  values?: iAutoCompleteSingle[] | string[];
  onSelect?: (LuDepartment: iAutoCompleteSingle | iAutoCompleteSingle[] | null) => void;
  allowClear?: boolean;
  showIndicator?: boolean;
  isMulti?: boolean;
  classname?: string;
  limitCodes?: string[];
};

const getLabel = (luDepartment: iSynLuDepartment) => {
  return `${luDepartment.Code} - ${luDepartment.Description}`;
}
export const translateLuDepartmentToOption = (luDepartment: iSynLuDepartment) => {
  return {value: luDepartment.Code, data: luDepartment, label: getLabel(luDepartment)}
}

const LuDepartmentSelector = ({values, onSelect, limitCodes = [], allowClear, classname, showIndicator = true, isMulti = false}: iSynFormSelector) => {
  const [optionsMap, setOptionsMap] = useState<{[key: string]: iAutoCompleteSingle}>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    SynLuDepartmentService.getAll({
        where: JSON.stringify({
          ActiveFlag: true,
          ...(limitCodes?.length > 0 ? {Code: limitCodes} : {}),
        }),
        sort: 'Code:ASC',
      })
      .then(resp => {
        if (isCancelled === true) { return }
        setOptionsMap(resp
          .filter(luDepartment => `${luDepartment.Code || ''}`.trim() !== '')
          .reduce((map, luDepartment) => {
          return {
            ...map,
            [luDepartment.Code]: translateLuDepartmentToOption(luDepartment),
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

export default LuDepartmentSelector;
