import * as _ from 'lodash';
import moment from 'moment';
import SelectBox from '../common/SelectBox';

type iFileYearSelector = {
  min?: number;
  max?: number;
  value?: number | null;
  values?: number[] | null;
  onSelect?: (year: number | null) => void;
  onSelects?: (years: number[]  | null) => void;
  allowClear?: boolean;
  showIndicator?: boolean;
  showIndicatorSeparator?: boolean;
  isDisabled?: boolean;
  isMulti?: boolean;
  className?: string;
  renderOptions?: (options: number[]) => number[];
};

const FileYearSelector = ({values, isDisabled, min, max, value, onSelect, allowClear, className, showIndicator = true, showIndicatorSeparator = true, isMulti, renderOptions, onSelects}: iFileYearSelector) => {
  const minYear = Number(min || moment().subtract(20, 'year').year());
  const maxYear = Number(max || moment().year());
  const options = _.range(minYear, maxYear + 1, 1).map(year => ({value: year, label: `${year}`})).sort((y1, y2) => y1 > y2 ? 1 : -1);

  const getSelectedOption = () => {
    if (isMulti !== true) {
      if (value === undefined) {
        return null;
      }
      return {label: value, value}
    }
    return ( values || []).sort().map(value => ({label: value, value}))
  }

  const handleSelect = (option: any | null) => {
    if (isMulti !== true) {
      onSelect && onSelect(option.value);
      return;
    }

    if (!onSelects) {
      return;
    }
    onSelects(Array.isArray(option) ? option.map(opt => opt.value) : [option.value])
  }

  return (
    <SelectBox
      // @ts-ignore
      options={renderOptions ? renderOptions(options) : options}
      isMulti={isMulti}
      isDisabled={isDisabled}
      className={className}
      onChange={handleSelect}
      value={getSelectedOption()}
      isClearable={allowClear}
      showDropdownIndicator={showIndicator}
      showIndicatorSeparator={showIndicatorSeparator}
    />
  )
};

export default FileYearSelector;
