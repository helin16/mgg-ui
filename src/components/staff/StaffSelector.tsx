import {iAutoCompleteSingle} from '../common/AutoComplete';
import {useEffect, useState} from 'react';
import {Spinner} from 'react-bootstrap';
import SelectBox from '../common/SelectBox';
import Toaster from '../../services/Toaster';
import SynVStaffService from '../../services/Synergetic/SynVStaffService';
import iVStaff from '../../types/Synergetic/iVStaff';

type iStaffSelector = {
  values?: iAutoCompleteSingle[] | string[];
  onSelect?: (staff: iAutoCompleteSingle | iAutoCompleteSingle[] | null) => void;
  allowClear?: boolean;
  showIndicator?: boolean;
  isMulti?: boolean;
  className?: string;
};

const getLabel = (staff: iVStaff) => {
  return `[${staff.StaffID}] ${staff.StaffLegalFullName}`;
}
export const translateVStaffToOption = (staff: iVStaff) => {
  return {value: staff.StaffID, data: staff, label: getLabel(staff)}
}

const VStaffSelector = ({values, onSelect, allowClear, className, showIndicator = true, isMulti = false}: iStaffSelector) => {
  const [optionsMap, setOptionsMap] = useState<{[key: string]: iAutoCompleteSingle}>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    SynVStaffService.getStaffList({
        where: JSON.stringify({
          ActiveFlag: true,
        }),
        sort: 'StaffID:ASC',
      })
      .then(resp => {
        if (isCancelled === true) { return }
        setOptionsMap(resp
          .filter(staff => `${staff.StaffID || ''}`.trim() !== '')
          .reduce((map, staff) => {
          return {
            ...map,
            [staff.StaffID]: translateVStaffToOption(staff),
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

  if (isLoading) {
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

export default VStaffSelector;
