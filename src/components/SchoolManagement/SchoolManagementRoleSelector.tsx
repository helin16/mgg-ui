import SelectBox from '../common/SelectBox';
import {
  SMT_SCHOOL_ROL_CODE_HEAD_OF_ELC,
  SMT_SCHOOL_ROL_CODE_HEAD_OF_JUNIOR_SCHOOL,
  SMT_SCHOOL_ROL_CODE_HEAD_OF_SENIOR_SCHOOL, SMT_SCHOOL_ROL_CODE_HEAD_OF_YEAR
} from '../../types/Synergetic/iSchoolManagementTeam';
import {iAutoCompleteSingle} from '../common/AutoComplete';

type iSchoolManagementRoleSelector = {
  isDisabled?: boolean;
  isMulti?: boolean;
  values?: string[];
  onSelect?: (campus: iAutoCompleteSingle | null | iAutoCompleteSingle[]) => void;
  allowClear?: boolean;
  showIndicator?: boolean;
  className?: string;
};

export const schoolManagementRoleMap: {[key: string]: string} = {
  [SMT_SCHOOL_ROL_CODE_HEAD_OF_ELC]: 'Head of ELC',
  [SMT_SCHOOL_ROL_CODE_HEAD_OF_JUNIOR_SCHOOL]: 'Head of Junior School',
  [SMT_SCHOOL_ROL_CODE_HEAD_OF_SENIOR_SCHOOL]: 'Head of Senior School',
  [SMT_SCHOOL_ROL_CODE_HEAD_OF_YEAR]: 'Head of Year',
}

const SchoolManagementRoleSelector = ({isDisabled, isMulti, values, className, onSelect, allowClear, showIndicator}: iSchoolManagementRoleSelector) => {
  const options = Object.keys(schoolManagementRoleMap).map(roleCode => ({value: roleCode, label: `${roleCode} - ${roleCode in schoolManagementRoleMap ? schoolManagementRoleMap[roleCode] : ''}`}));

  const getSelectedValues = () => {
    if (!values) {
      return null;
    }
    if (values?.length <= 0) {
      return [];
    }

    return values.map(value => {
      if(typeof value === 'string') {
        return (!(value in schoolManagementRoleMap) ? value : {value, label: `${value} - ${value in schoolManagementRoleMap ? schoolManagementRoleMap[value] : ''}`})
      }
      return value;
    })
  }

  return (
    <SelectBox
      isDisabled={isDisabled}
      isMulti={isMulti}
      options={options}
      className={className}
      onChange={onSelect}
      value={getSelectedValues()}
      isClearable={allowClear}
      showDropdownIndicator={showIndicator}
    />
  )
}

export default SchoolManagementRoleSelector;
