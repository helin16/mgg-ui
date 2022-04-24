import * as _ from 'lodash';
import moment from 'moment';
import SelectBox from '../common/SelectBox';

type iFileYearSelector = {
  min?: number;
  max?: number;
  value?: number | null;
  onSelect?: (year: number | null) => void;
  allowClear?: boolean;
  showIndicator?: boolean;
  className?: string;
};

const FileYearSelector = ({min, max, value, onSelect, allowClear, className, showIndicator = true}: iFileYearSelector) => {
  const minYear = Number(min || moment().subtract(20, 'year').format('YYYY'));
  const maxYear = Number(max || moment().add(20, 'year').format('YYYY'));
  const options = _.range(minYear, maxYear, 1).map(year => ({value: year, label: `${year}`}));

  const getSelectedOption = () => {
    if (value === undefined) {
      return null;
    }
    return {label: value, value}
  }

  return (
    <SelectBox
      // @ts-ignore
      options={options}
      className={className}
      onChange={(option) => onSelect && onSelect(option === null ? null : option.value)}
      value={getSelectedOption()}
      isClearable={allowClear}
      showDropdownIndicator={showIndicator}
    />
  )
};

export default FileYearSelector;
