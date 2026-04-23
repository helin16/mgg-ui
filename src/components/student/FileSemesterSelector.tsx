import SelectBox from '../common/SelectBox';

type iFileSemesterSelector = {
  value?: number;
  onSelect?: (semester: number | null) => void;
  allowClear?: boolean;
  showIndicator?: boolean;
  showIndicatorSeparator?: boolean;
  isDisabled?: boolean;
  className?: string;
  semesters?: number[];
};

const FileSemesterSelector = ({isDisabled, value, onSelect, allowClear, className, showIndicator = true, showIndicatorSeparator = true, semesters = [2, 4]}: iFileSemesterSelector) => {
  const options = semesters.map(semester => ({value: semester, label: semester}));

  const getSelectedOption = () => {
    if (value === undefined) {
      return null;
    }
    return {label: value, value}
  }
  return (
    <SelectBox
      isDisabled={isDisabled}
      options={options}
      className={className}
      onChange={(option) => onSelect && onSelect(option === null ? null : option.value)}
      value={getSelectedOption()}
      isClearable={allowClear}
      showDropdownIndicator={showIndicator}
      showIndicatorSeparator={showIndicatorSeparator}
    />
  )
};

export default FileSemesterSelector;
