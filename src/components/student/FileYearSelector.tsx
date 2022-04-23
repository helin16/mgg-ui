import * as _ from 'lodash';
import moment from 'moment';
import Select from 'react-select';

type iFileYearSelector = {
  min?: number;
  max?: number;
  value?: number | null;
  onSelect?: (year: number | null) => void;
  allowClear?: boolean;
  showIndicator?: boolean;
};

const FileYearSelector = ({min, max, value, onSelect, allowClear, showIndicator = true}: iFileYearSelector) => {
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
    <Select
      // @ts-ignore
      options={options}
      onChange={(option) => onSelect && onSelect(option === null ? null : option.value)}
      value={getSelectedOption()}
      isClearable={allowClear}
      components={showIndicator === true ? undefined : { DropdownIndicator:() => null, IndicatorSeparator:() => null }}
    />
  )
};

export default FileYearSelector;
