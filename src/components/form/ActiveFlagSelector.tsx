import {iAutoCompleteSingle} from '../common/AutoComplete';
import SelectBox from '../common/SelectBox';

type iActiveFlagSelector = {
  value?: iAutoCompleteSingle | boolean | null;
  onSelect?: (value: iAutoCompleteSingle | null) => void;
  showIndicator?: boolean;
  classname?: string;
};

const ActiveFlagSelector = ({value, classname, showIndicator, onSelect}: iActiveFlagSelector) => {
  const getOption = (option?: string | number | boolean | null) => {
    return {
      label: option === true ? 'Active Only' : (option === false ? 'Inactive Only' : 'All'),
      value: option,
    };
  }
  const getOptions = () => {
    return ['', true, false].map(option => {
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
    />
  )
}

export default ActiveFlagSelector;
