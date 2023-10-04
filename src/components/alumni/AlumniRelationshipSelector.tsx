import SelectBox from '../common/SelectBox';
import {iAutoCompleteSingle} from '../common/AutoComplete';

type iAlumniRelationshipSelector = {
  values?: iAutoCompleteSingle[] | string[];
  onSelect?: (LuForm: iAutoCompleteSingle | iAutoCompleteSingle[] | null) => void;
  allowClear?: boolean;
  showIndicator?: boolean;
  isMulti?: boolean;
  classname?: string;
}

const relationShips = [
  'Current Student',
  'Current Parent',
  'Past Student',
  'Past Parent',
  'Current Staff',
  'Past Staff',
  'Past Committee Member',
  'Friend Of the School',
];
const AlumniRelationshipSelector = ({classname, isMulti, showIndicator, onSelect, values, allowClear = false}: iAlumniRelationshipSelector) => {
  const getSelectedValues = () => {
    if (!values) {
      return null;
    }
    if (values?.length <= 0) {
      return [];
    }
    return values.map(value => {
      if(typeof value === 'string' || typeof value === 'number') {
        return ({value, label: value})
      }
      return value;
    })
  }

  const getOptions = () => {
    return relationShips
      .sort((opt1, opt2) => {
        if (!opt1 || !opt2) {
          return 1;
        }
        return opt1 > opt2 ? 1 : -1;
      })
      .map(value => {
        return ({value, label: value})
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

export default AlumniRelationshipSelector;
