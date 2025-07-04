import SelectBox from '../common/SelectBox';

type iFileSemesterSelector = {
  value?: number;
  onSelect?: (semester: number | null) => void;
  allowClear?: boolean;
  showIndicator?: boolean;
  className?: string;
};

const FileSemesterSelector = ({value, onSelect, allowClear, className, showIndicator = true}: iFileSemesterSelector) => {
  const options = [2, 4].map(semester => ({value: semester, label: semester}));

  const getSelectedOption = () => {
    if (value === undefined) {
      return null;
    }
    return {label: value, value}
  }
  return (
    <SelectBox
      options={options}
      className={className}
      onChange={(option) => onSelect && onSelect(option === null ? null : option.value)}
      value={getSelectedOption()}
      isClearable={allowClear}
      showDropdownIndicator={showIndicator}
    />
  )
};

export default FileSemesterSelector;
