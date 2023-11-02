import AutoComplete, {iAutoCompleteSingle} from '../common/AutoComplete';
import SynVStaffService from '../../services/Synergetic/SynVStaffService';
import {OP_LIKE, OP_OR} from '../../helper/ServiceHelper';
import iVStaff from '../../types/Synergetic/iVStaff';
import {useEffect, useState} from 'react';
import Toaster from '../../services/Toaster';
import {Spinner} from 'react-bootstrap';

type iStaffAutoComplete = {
  onSelect?: (option: iAutoCompleteSingle | null) => void;
  value?: { ID: number } | null;
  allowClear?: boolean;
  isDisabled?: boolean;
}
const StaffAutoComplete = ({onSelect, value, allowClear, isDisabled}: iStaffAutoComplete) => {
  const [isLoading, setIsLoading] = useState(false);
  const [preSelectedValue, setPreSelectedValue] = useState<iVStaff | null>(null);

  useEffect(() => {
    const staffID = `${value?.ID || ''}`.trim();
    if (staffID === '') {
      setPreSelectedValue(null);
      return;
    }
    let isCanceled = false;
    setIsLoading(true);
    SynVStaffService.getStaffList({
        where: JSON.stringify({StaffID: value?.ID}),
      })
      .then(resp => {
        if (isCanceled) return;
        setPreSelectedValue(resp.length > 0 ? resp[0] : null)
      })
      .catch(err => {
        if (isCanceled) return;
        Toaster.showApiError(err);
      })
      .finally(() => {
        if (isCanceled) return;
        setIsLoading(false);
      })
  }, [value?.ID])

  const handleSearchFn = (searchText: string) => {
    return SynVStaffService.getStaffList({
      where: JSON.stringify({
        ActiveFlag: 1,
        LeavingDate: null,
        [OP_OR]: [
          {StaffGiven1: { [OP_LIKE]: `%${searchText}%` }},
          {StaffSurname: { [OP_LIKE]: `%${searchText}%` }},
          {StaffLegalFullName: { [OP_LIKE]: `%${searchText}%` }},
          {StaffID: { [OP_LIKE]: `%${searchText}%` }},
        ]
      })
    })
  }

  const convertStaffToOption = (staff: iVStaff) => {
    return {
      label: `[${staff.StaffID}] ${staff.StaffGiven1} ${staff.StaffSurname}`,
      data: staff,
      value: staff.StaffID,
    }
  }

  const renderOptionItem = (options: iVStaff[]) => {
    return options.map(option => convertStaffToOption(option));
  }

  if (isLoading) {
    return <Spinner animation={'border'} />
  }

  return (
    <AutoComplete
      isDisabled={isDisabled}
      isMulti={false}
      // @ts-ignore
      onSelected={onSelect}
      allowClear={allowClear}
      value={preSelectedValue ? convertStaffToOption(preSelectedValue) : undefined}
      placeholder={'Search staff ...'}
      handleSearchFn={handleSearchFn}
      renderOptionItemFn={renderOptionItem}
    />
  )
}

export default StaffAutoComplete;
