import { iAutoCompleteSingle } from "../common/AutoComplete";
import SelectBox from "../common/SelectBox";

type iFlagSelector = {
  value?: iAutoCompleteSingle | boolean | null;
  onSelect?: (value: iAutoCompleteSingle | null) => void;
  showIndicator?: boolean;
  showIndicatorSeparator?: boolean;
  classname?: string;
  showAll?: boolean;
  isDisabled?: boolean;
  YesLabel?: string;
  NoLabel?: string;
  AllLabel?: string;
};

const FlagSelector = ({
  isDisabled,
  value,
  YesLabel,
  NoLabel,
  AllLabel,
  classname,
  showIndicator,
  showAll = true,
  showIndicatorSeparator = true,
  onSelect
}: iFlagSelector) => {
  const getOptions = () => {
    return [
      ...(showAll === true ? [{ value: "", label: AllLabel || "All" }] : []),
      { value: true, label: YesLabel || "Yes" },
      { value: false, label: NoLabel || "No" }
    ];
  };

  const getOption = (option?: string | number | boolean | null) => {
    const matched = getOptions().filter(opt => opt.value === option);
    if (matched.length > 0) {
      return matched[0];
    }
    return {
      value: option,
      label: `${option || ""}`
    };
  };

  const getSelectedValues = () => {
    // @ts-ignore
    const actualValue =
      typeof value === "object" && value !== null && "value" in value
        ? value.value
        : value;
    if (actualValue === null) {
      return null;
    }
    return getOption(actualValue);
  };

  return (
    <SelectBox
      className={classname}
      isDisabled={isDisabled}
      options={getOptions()}
      onChange={onSelect}
      value={getSelectedValues()}
      showDropdownIndicator={showIndicator}
      showIndicatorSeparator={showIndicatorSeparator}
    />
  );
};

export default FlagSelector;
