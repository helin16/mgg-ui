import Select from 'react-select';
import {iAutoCompleteSingle} from '../../../../components/common/AutoComplete';
import * as _ from 'lodash';

type iReportStyleSelector = {
  value?: string;
  allowClear?: boolean;
  showIndicator?: boolean;
  onSelect?: (style: string | null) => void;
}
const styles = [
  'normal', 'JUNIOR_GRH', 'SENIOR_SF', 'JUNIOR_NOGRH',
];
const ReportStyleSelector = ({ value, allowClear, onSelect, showIndicator = true }: iReportStyleSelector) => {

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
    <Select
      // @ts-ignore
      options={getOptions()}
      onChange={(option) => onSelect && onSelect(option === null ? null : option.value)}
      value={getSelectedOption()}
      isClearable={allowClear}
      components={showIndicator === true ? undefined : { DropdownIndicator:() => null, IndicatorSeparator:() => null }}
    />
  )
};

export default ReportStyleSelector;
