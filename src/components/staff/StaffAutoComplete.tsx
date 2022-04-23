import AutoComplete, {iAutoCompleteSingle} from '../common/AutoComplete';
import SynVStaffService from '../../services/Synergetic/SynVStaffService';
import {OP_LIKE, OP_OR} from '../../helper/ServiceHelper';
import iVStaff from '../../types/Synergetic/iVStaff';

type iStaffAutoComplete = {
  id?: string;
  onSelect?: (option: iAutoCompleteSingle | null) => void;
}
const StaffAutoComplete = ({id, onSelect}: iStaffAutoComplete) => {

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

  const renderOptionItem = (options: iVStaff[]) => {
    return options.map(option => {
      return {
        label: `[${option.StaffID}] ${option.StaffGiven1} ${option.StaffSurname}`,
        data: option,
        value: option.StaffID,
      }
    });
  }

  return (
    <AutoComplete
      onSelected={onSelect}
      placeholder={'Search staff ...'}
      handleSearchFn={handleSearchFn}
      renderOptionItemFn={renderOptionItem}
    />
  )
}

export default StaffAutoComplete;
