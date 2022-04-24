import {iAutoCompleteSingle} from '../../../../components/common/AutoComplete';
import * as _ from 'lodash';
import SelectBox from '../../../../components/common/SelectBox';

type iReportStyleSelector = {
  value?: string;
  className?: string;
  allowClear?: boolean;
  showIndicator?: boolean;
  onSelect?: (style: string | null) => void;
}
const styles = [
  'normal', 'JUNIOR_GRH', 'SENIOR_SF', 'JUNIOR_NOGRH',
];

const ReportStyleSelector = ({ value, className, allowClear, onSelect, showIndicator = true }: iReportStyleSelector) => {

  const getOptions = (): iAutoCompleteSingle[] => {
    return _.uniq(styles).map(style => ({
      value: style,
      label: style,
    }))
  }

  const getSelectedOption = () => {
    if (value === undefined) {
      return null;
    }
    return {label: value, value}
  }

  return (
    <SelectBox
      className={className}
      // @ts-ignore
      options={getOptions()}
      onChange={(option) => onSelect && onSelect(option === null ? null : option.value)}
      value={getSelectedOption()}
      isClearable={allowClear}
      showDropdownIndicator={showIndicator}
    />
  )
};

export default ReportStyleSelector;
