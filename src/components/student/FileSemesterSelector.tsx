import Select from 'react-select';

type iFileSemesterSelector = {
  value?: number;
  onSelect?: (semester: number | null) => void;
  allowClear?: boolean;
  showIndicator?: boolean;
};

const FileSemesterSelector = ({value, onSelect, allowClear, showIndicator = true}: iFileSemesterSelector) => {
  const options = [2, 4].map(semester => ({value: semester, label: semester}));

  const getSelectedOption = () => {
    if (value === undefined) {
      return null;
    }
    return {label: value, value}
  }
  return (
    <Select
      options={options}
      onChange={(option) => onSelect && onSelect(option === null ? null : option.value)}
      value={getSelectedOption()}
      isClearable={allowClear}
      components={showIndicator === true ? undefined : { DropdownIndicator:() => null, IndicatorSeparator:() => null }}
    />
  )
};

export default FileSemesterSelector;
