import {iAutoCompleteSingle} from '../common/AutoComplete';
import SelectBox from '../common/SelectBox';

type iFlagSelector = {
  value?: iAutoCompleteSingle | boolean | null;
  onSelect?: (value: iAutoCompleteSingle | null) => void;
  showIndicator?: boolean;
  showIndicatorSeparator?: boolean;
  classname?: string;
  showAll?: boolean;
};

const FlagSelector = ({value, classname, showIndicator, showAll = true, showIndicatorSeparator = true, onSelect}: iFlagSelector) => {
  const getOption = (option?: string | number | boolean | null) => {
    return {
      label: option === true ? 'Yes' : (option === false ? 'No' : 'All'),
      value: option,
    };
  }
  const getOptions = () => {
    return (showAll === true ? ['', true, false] : [true, false]).map(option => {
      return getOption(option);
    })
  }

  const getSelectedValues = () => {
    // @ts-ignore
    const actualValue = (typeof value === 'object' && value !== null && 'value' in value) ? value.value : value;
    if (actualValue === null) {
      return null;
    }
    return getOption(actualValue);
  }

  return (
    <SelectBox
      className={classname}
      options={getOptions()}
      onChange={onSelect}
      value={getSelectedValues()}
      showDropdownIndicator={showIndicator}
      showIndicatorSeparator={showIndicatorSeparator}
    />
  )
}

export default FlagSelector;
